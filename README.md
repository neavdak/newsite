# PropickX — Fractional Real Estate Investment Platform

![PropickX Banner](https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070)

**🌐 Live Demo:** [https://neavdak.github.io/newsite](https://neavdak.github.io/newsite)

---

## 🏠 Overview

**PropickX** is a premium, mobile-first fractional real estate investment platform. Investors can buy fractions of high-yield properties, track portfolio performance, participate in IPO-style property launches, trade on a secondary market, and receive AI-driven investment advice — all secured with military-grade encryption.

---

## 🚀 Key Features

### 💼 Investment Core
- **Fractional Share Buying** — invest from ₹1 in any listed property
- **IPO-Style Listings** — apply for new property launches with countdown timers
- **Secondary Market** — buy & sell shares between investors in real time
- **Portfolio Dashboard** — track P&L, gains, invested value, and rental yield

### 🔐 Security & Certificates
- **AES-256-GCM Encrypted Certificate IDs** — ownership certificates use PBKDF2-derived keys so each certificate ID is unique per investor but deterministic (always the same for the same investor/property pair)
- **RSA-PSS 2048-bit Digital Signatures** — every certificate is cryptographically signed, with a compact AES seal code and RSA key fingerprint shown on-screen
- **Web Crypto API** — zero external crypto dependencies, runs entirely in the browser

### 🤖 AI & Advisory
- **AI Investment Advisor** — personalized property recommendations powered by a built-in assistant
- **Rental Calculator** — multi-year ROI projections with comparison charts

### 💳 Wallet & Transactions
- **Built-in Wallet** — deposit funds and invest instantly
- **Transaction History** — complete audit trail of all buys, sells, and deposits

### 📱 UX & Design
- **Dark glassmorphism UI** — deep navy + electric violet premium design
- **Framer Motion animations** — smooth micro-animations throughout
- **Mobile-First / PWA** — app-like experience on all devices
- **Bottom navigation** — Groww-style intuitive tab bar

### 🛠️ Admin
- **Admin Portal** — manage users, properties, and listings
- **Watchlist** — save and track favourite properties

---

## 🧪 Demo Credentials

| Field    | Value                     |
|----------|---------------------------|
| Email    | `demo@example.com`        |
| Password | any password (≥ 6 chars)  |

### Quick walkthrough
1. **Sign In** → Dashboard loads with your portfolio
2. **Marketplace** → Pick a property → Buy Shares
3. **Dashboard** → View certificate (unique encrypted ID generated on first open)
4. **Advisor tab** → Ask "What is the safest high-yield property?"
5. **Profile avatar** → Admin Portal

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Routing | React Router DOM v7 |
| Crypto | Web Crypto API (AES-256-GCM + RSA-PSS 2048) |
| State | React Context + localStorage |
| Deploy | GitHub Actions → GitHub Pages |

---

## 💻 Local Development

```bash
# 1. Clone
git clone https://github.com/neavdak/newsite.git
cd newsite

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚢 Deployment

This repo auto-deploys to **GitHub Pages** on every push to `main` via GitHub Actions.

To deploy manually:
```bash
npm run build      # outputs to /dist
# then push — the CI workflow handles the rest
```

---

## 📜 License

MIT © PropickX
