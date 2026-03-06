/**
 * certCrypto.js
 * 
 * Generates cryptographically secure, deterministic certificate IDs using:
 *  - AES-GCM (256-bit) for encrypting the certificate payload
 *  - RSA-PSS (2048-bit) for signing the certificate fingerprint
 * 
 * Guarantee:
 *  - Same user  + same property  → always returns the SAME cert ID (deterministic)
 *  - Different user OR different property → different cert ID
 *  - The RSA key pair is generated once per device and stored in localStorage
 */

const STORAGE_RSA_KEY = 'propickx_cert_rsa_keys';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a string to a Uint8Array */
function str2buf(str) {
    return new TextEncoder().encode(str);
}

/** Convert ArrayBuffer to hex string */
function buf2hex(buf) {
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/** Convert hex string back to Uint8Array */
function hex2buf(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
}

// ─── RSA Key Management ───────────────────────────────────────────────────────

/**
 * Generate a new RSA-PSS key pair (2048-bit, SHA-256) and persist it in
 * localStorage as JWK so it survives page reloads.
 */
async function generateAndStoreRSAKeys() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: 'RSA-PSS',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
            hash: 'SHA-256',
        },
        true,  // extractable
        ['sign', 'verify']
    );

    const [pubJwk, privJwk] = await Promise.all([
        crypto.subtle.exportKey('jwk', keyPair.publicKey),
        crypto.subtle.exportKey('jwk', keyPair.privateKey),
    ]);

    localStorage.setItem(STORAGE_RSA_KEY, JSON.stringify({ pub: pubJwk, priv: privJwk }));
    return keyPair;
}

/**
 * Load the RSA key pair from localStorage (or generate one if missing).
 */
async function loadOrCreateRSAKeys() {
    const stored = localStorage.getItem(STORAGE_RSA_KEY);
    if (stored) {
        try {
            const { pub, priv } = JSON.parse(stored);
            const [publicKey, privateKey] = await Promise.all([
                crypto.subtle.importKey('jwk', pub, { name: 'RSA-PSS', hash: 'SHA-256' }, false, ['verify']),
                crypto.subtle.importKey('jwk', priv, { name: 'RSA-PSS', hash: 'SHA-256' }, false, ['sign']),
            ]);
            return { publicKey, privateKey };
        } catch {
            // Corrupted — regenerate
        }
    }
    return generateAndStoreRSAKeys();
}

// ─── AES Key Derivation ───────────────────────────────────────────────────────

/**
 * Derive a deterministic 256-bit AES-GCM key from a "seed" string using
 * PBKDF2 (100,000 iterations, SHA-256).  The salt is fixed from the seed
 * itself so the same seed always produces the same key (deterministic).
 *
 * @param {string} seed  - e.g. "userId::propertyId"
 */
async function deriveAESKey(seed) {
    const seedBuf = str2buf(seed);

    // Import raw seed as PBKDF2 key material
    const keyMaterial = await crypto.subtle.importKey(
        'raw', seedBuf, 'PBKDF2', false, ['deriveKey']
    );

    // Salt = SHA-256 of the seed (deterministic, non-secret)
    const saltBuf = await crypto.subtle.digest('SHA-256', seedBuf);

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBuf,
            iterations: 100_000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

// ─── Certificate ID Generation ────────────────────────────────────────────────

/**
 * Generate (or retrieve from localStorage) the encrypted certificate ID.
 *
 * Algorithm:
 *  1. Seed  = `${userId}::${propertyId}`
 *  2. Derive deterministic AES-256-GCM key from seed via PBKDF2
 *  3. IV    = SHA-256(seed) first 12 bytes  (deterministic → same encrypted output)
 *  4. Plain = `PROPX-<propId>-<userId>-<timestamp-of-first-issue>`
 *  5. Cipher  = AES-GCM encrypt(plain, key, IV)
 *  6. CertId  = base-36 compressed encoding of first 20 hex bytes of cipher
 *             → formatted as XXXX-XXXX-XXXX-XXXX
 *  7. Sign    fingerprint = SHA-256(certId) via RSA-PSS private key
 *  8. SigHex  = first 16 bytes of signature (compact display)
 *
 * The result is stored in localStorage under `propickx_cert_<userId>_<propertyId>`
 * so subsequent loads return the exact same ID.
 *
 * @param {string} userId
 * @param {string} propertyId
 * @param {string} propertyCode  - short code for the property (e.g. "MUM01")
 * @returns {Promise<{ certId: string, sigHex: string, publicKeyHex: string }>}
 */
export async function generateCertificateId(userId, propertyId, propertyCode = 'PROP') {
    const storageKey = `propickx_cert_${userId}_${propertyId}`;

    // Return cached value if already generated for this user+property
    const cached = localStorage.getItem(storageKey);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch { /* fall through and regenerate */ }
    }

    // 1. Build seed
    const seed = `${userId}::${propertyId}`;

    // 2. Derive AES key
    const aesKey = await deriveAESKey(seed);

    // 3. Deterministic IV (first 12 bytes of SHA-256(seed))
    const seedDigest = await crypto.subtle.digest('SHA-256', str2buf(seed));
    const iv = new Uint8Array(seedDigest).slice(0, 12);

    // 4. Plaintext payload
    const issuedAt = Date.now();
    const plain = `PROPX|${propertyCode.toUpperCase()}|${userId}|${propertyId}|${issuedAt}`;

    // 5. Encrypt
    const cipherBuf = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        str2buf(plain)
    );
    const cipherHex = buf2hex(cipherBuf);

    // 6. Format as readable cert ID (alphanumeric, grouped)
    //    Take first 20 hex chars and convert to base-36 for shorter display
    const rawNum = BigInt('0x' + cipherHex.slice(0, 20));
    const b36 = rawNum.toString(36).toUpperCase().padStart(13, '0');
    const certId = `${b36.slice(0, 4)}-${b36.slice(4, 8)}-${b36.slice(8, 11)}-${b36.slice(11)}`;

    // 7. RSA-PSS sign the certId
    const { privateKey, publicKey } = await loadOrCreateRSAKeys();
    const sigBuf = await crypto.subtle.sign(
        { name: 'RSA-PSS', saltLength: 32 },
        privateKey,
        str2buf(certId)
    );
    const sigHex = buf2hex(sigBuf).slice(0, 32).toUpperCase(); // 16-byte compact sig

    // Export public key fingerprint (SHA-256 of SPKI)
    const spkiBuf = await crypto.subtle.exportKey('spki', publicKey);
    const fpBuf = await crypto.subtle.digest('SHA-256', spkiBuf);
    const publicKeyHex = buf2hex(fpBuf).slice(0, 16).toUpperCase(); // 8-byte fingerprint

    const result = { certId, sigHex, publicKeyHex };

    // Cache so the same user+property always returns the exact same data
    localStorage.setItem(storageKey, JSON.stringify(result));

    return result;
}

/**
 * Convenience: format the sigHex into a human-readable seal string.
 * e.g. "A1B2C3D4-E5F6A7B8"
 */
export function formatSealCode(sigHex) {
    const s = sigHex.slice(0, 16).toUpperCase();
    return `${s.slice(0, 8)}-${s.slice(8, 16)}`;
}
