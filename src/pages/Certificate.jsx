import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { PROPERTIES } from '../data/properties';
import { formatCurrency } from '../utils/helpers';
import { generateCertificateId, formatSealCode } from '../utils/certCrypto';
import { Award, Download, ShieldCheck, Building2, Calendar, Hash, ArrowLeft, Printer, Lock, KeyRound } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Certificate() {
    const { propertyId } = useParams();
    const { user, portfolio } = useApp();

    const property = PROPERTIES.find(p => p.id === propertyId);
    const holding = portfolio.find(p => p.propertyId === propertyId);

    // Crypto state
    const [certData, setCertData] = useState(null);
    const [cryptoLoading, setCryptoLoading] = useState(true);

    useEffect(() => {
        if (!user?.id || !property) return;

        setCryptoLoading(true);
        const propCode = property.id.split('-')[1]?.toUpperCase() || 'PROP';

        generateCertificateId(user.id, propertyId, propCode)
            .then(data => {
                setCertData(data);
                setCryptoLoading(false);
            })
            .catch(() => {
                // Fallback: simple deterministic ID if crypto fails
                const fallback = `PROPX-${propCode}-${user.id.slice(-4).toUpperCase()}`;
                setCertData({ certId: fallback, sigHex: '----', publicKeyHex: '---' });
                setCryptoLoading(false);
            });
    }, [user?.id, propertyId, property]);

    if (!property || !holding) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-text-secondary text-lg">Certificate not found.</p>
                <Link to="/dashboard" className="text-primary hover:underline flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
            </div>
        );
    }

    const ownershipPercent = ((holding.shares / property.totalShares) * 100).toFixed(6);
    const issueDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    const handlePrint = () => window.print();

    const sealCode = certData ? formatSealCode(certData.sigHex) : '--------';

    return (
        <div className="min-h-screen bg-background pt-20 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Back + Print */}
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <Link to="/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors font-medium"
                    >
                        <Printer className="h-4 w-4" /> Print / Download
                    </button>
                </div>

                {/* Certificate */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-br from-[#0f1623] to-[#12082a] rounded-3xl p-1 shadow-2xl"
                >
                    {/* Gradient border */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/40 via-transparent to-secondary/30 pointer-events-none" />

                    <div className="relative bg-[#0a0f1e] rounded-[22px] p-8 md:p-12 overflow-hidden">
                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                            <span className="text-[180px] font-black text-white tracking-tighter">P</span>
                        </div>

                        {/* Corner decorations */}
                        <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
                        <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
                        <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
                        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />

                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="flex justify-center mb-4">
                                <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-2xl shadow-lg shadow-primary/30">
                                    <Building2 className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-1">PropickX Platform</p>
                            <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                Ownership Certificate
                            </h1>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
                                <Award className="h-4 w-4 text-primary" />
                                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" />
                            </div>
                        </div>

                        {/* Certifies Text */}
                        <p className="text-center text-text-secondary mb-8 text-sm">
                            This certifies that
                        </p>

                        {/* Investor Name */}
                        <div className="text-center mb-8 pb-4 border-b border-white/10">
                            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                {user?.name || 'Investor'}
                            </h2>
                            <p className="text-text-secondary text-sm mt-1">{user?.email}</p>
                        </div>

                        {/* Ownership Info */}
                        <p className="text-center text-text-secondary mb-8">
                            is the registered owner of
                        </p>

                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 mb-8 text-center">
                            <p className="text-5xl font-black text-primary mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                {holding.shares.toFixed(4)}
                            </p>
                            <p className="text-text-secondary text-sm mb-4">Fractional Shares</p>
                            <p className="text-white font-bold text-xl">{property.title}</p>
                            <p className="text-text-secondary text-sm">{property.location}</p>
                            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-text-secondary">Ownership %</p>
                                    <p className="font-bold text-secondary">{ownershipPercent}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-secondary">Invested Value</p>
                                    <p className="font-bold text-white">{formatCurrency(holding.invested)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-secondary">Annual Yield</p>
                                    <p className="font-bold text-secondary">{property.apy}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Details — with encrypted ID */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Hash className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-text-secondary">Certificate ID</p>
                                    {cryptoLoading ? (
                                        <div className="h-4 w-32 bg-white/10 rounded animate-pulse mt-1" />
                                    ) : (
                                        <p className="font-mono text-sm text-white tracking-wider">{certData?.certId}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-text-secondary">Issue Date</p>
                                    <p className="text-sm text-white">{issueDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Crypto integrity block */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-8 grid grid-cols-2 gap-3">
                            <div className="flex items-start gap-2">
                                <Lock className="h-3.5 w-3.5 text-secondary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider">AES-256-GCM Seal</p>
                                    {cryptoLoading ? (
                                        <div className="h-3 w-28 bg-white/10 rounded animate-pulse mt-1" />
                                    ) : (
                                        <p className="font-mono text-xs text-secondary">{sealCode}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <KeyRound className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider">RSA-2048 Key Fingerprint</p>
                                    {cryptoLoading ? (
                                        <div className="h-3 w-28 bg-white/10 rounded animate-pulse mt-1" />
                                    ) : (
                                        <p className="font-mono text-xs text-primary">{certData?.publicKeyHex}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Seal */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-secondary" />
                                <span className="text-xs text-secondary font-medium">Verified &amp; Secured by PropickX</span>
                            </div>
                            <div className="text-right">
                                <div className="w-24 border-t border-white/30 mb-1" />
                                <p className="text-xs text-text-secondary">Authorized Signature</p>
                                <p className="text-xs text-white font-medium">PropickX Registry</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Encryption Info Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 flex items-center justify-center gap-3 text-xs text-text-secondary print:hidden"
                >
                    <Lock className="h-3 w-3" />
                    <span>Certificate ID encrypted with <strong className="text-white">AES-256-GCM</strong> · Signed with <strong className="text-white">RSA-PSS 2048-bit</strong> · Unique per investor</span>
                </motion.div>
            </div>
        </div>
    );
}
