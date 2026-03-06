import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpDown, TrendingUp, TrendingDown, ShoppingCart, Tag, TrendingDown as SellIcon, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROPERTIES } from '../data/properties';
import { formatCurrency } from '../utils/helpers';

const ALL_TYPES = ['All', 'Residential', 'Commercial', 'Industrial', 'Hospitality', 'Vacation'];

// ─── Buy Tab ──────────────────────────────────────────────────────────────────
function BuyTab() {
    const { listedShares, buyListing, user, showToast } = useApp();
    const [sortBy, setSortBy] = useState('newest');
    const [filterType, setFilterType] = useState('All');

    const enriched = (listedShares || [])
        .map(l => ({ ...l, property: PROPERTIES.find(p => p.id === l.propertyId) }))
        .filter(l => l.property);

    const filtered = enriched.filter(l => filterType === 'All' || l.property.type === filterType);
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.listedAt) - new Date(a.listedAt);
        if (sortBy === 'price_asc') return a.pricePerShare - b.pricePerShare;
        if (sortBy === 'price_desc') return b.pricePerShare - a.pricePerShare;
        return 0;
    });

    const handleBuy = (listing) => {
        if (!user) { showToast('Please sign in to buy shares', 'warning'); return; }
        if (listing.sellerId === user.id) { showToast('You cannot buy your own listing', 'error'); return; }
        buyListing(listing.id);
    };

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {ALL_TYPES.map(type => (
                        <button key={type} onClick={() => setFilterType(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filterType === type ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'}`}>
                            {type}
                        </button>
                    ))}
                </div>
                <div className="ml-auto">
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className="bg-surface border border-white/10 text-xs text-text-secondary rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary">
                        <option value="newest">Newest First</option>
                        <option value="price_asc">Price: Low → High</option>
                        <option value="price_desc">Price: High → Low</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                    { label: 'Active Listings', val: enriched.length, color: 'text-white' },
                    { label: 'Avg Share Price', val: enriched.length ? formatCurrency(enriched.reduce((s, l) => s + l.pricePerShare, 0) / enriched.length) : '—', color: 'text-secondary' },
                    { label: 'Properties Listed', val: new Set(enriched.map(l => l.propertyId)).size, color: 'text-primary' },
                ].map(s => (
                    <div key={s.label} className="bg-surface border border-white/5 rounded-xl p-3 text-center">
                        <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                        <p className="text-[10px] text-text-secondary mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {sorted.length === 0 ? (
                <div className="text-center py-16">
                    <Tag className="h-10 w-10 text-text-secondary mx-auto mb-3 opacity-30" />
                    <p className="text-text-secondary mb-1">No listings yet</p>
                    <p className="text-text-secondary text-sm">Switch to the Sell tab to list your shares!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sorted.map((listing, i) => {
                        const pct = ((listing.pricePerShare - listing.property.price) / listing.property.price * 100).toFixed(1);
                        const above = parseFloat(pct) >= 0;
                        return (
                            <motion.div key={listing.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-surface border border-white/5 hover:border-primary/30 rounded-2xl p-4 transition-all">
                                <div className="flex gap-3 mb-3">
                                    <img src={listing.property.image} alt={listing.property.title}
                                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm truncate">{listing.property.title}</h3>
                                        <p className="text-xs text-text-secondary">{listing.property.location}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{listing.property.type}</span>
                                            <span className="text-xs text-secondary">{listing.property.apy}% APY</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                                    <div className="bg-slate-900/50 rounded-lg p-2">
                                        <p className="text-[10px] text-text-secondary">Shares</p>
                                        <p className="font-mono font-bold text-xs text-white">{listing.shares.toFixed(4)}</p>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-2">
                                        <p className="text-[10px] text-text-secondary">Price/Share</p>
                                        <p className="font-mono font-bold text-xs text-white">{formatCurrency(listing.pricePerShare)}</p>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-2">
                                        <p className="text-[10px] text-text-secondary">vs Market</p>
                                        <p className={`font-bold text-xs flex items-center justify-center gap-0.5 ${above ? 'text-red-400' : 'text-secondary'}`}>
                                            {above ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            {Math.abs(pct)}%
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-text-secondary">Total Cost</p>
                                        <p className="font-bold text-primary text-sm">{formatCurrency(listing.shares * listing.pricePerShare)}</p>
                                    </div>
                                    <button onClick={() => handleBuy(listing)} disabled={listing.sellerId === user?.id}
                                        className="flex items-center gap-1.5 bg-primary hover:bg-accent text-white font-bold px-3 py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs">
                                        <ShoppingCart className="h-3.5 w-3.5" />
                                        {listing.sellerId === user?.id ? 'Your Listing' : 'Buy Now'}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Sell Tab ─────────────────────────────────────────────────────────────────
function SellTab() {
    const { portfolio, sellShares, user, showToast } = useApp();
    const [selected, setSelected] = useState(null);  // propertyId
    const [shares, setShares] = useState('');
    const [price, setPrice] = useState('');
    const [listing, setListing] = useState(false);

    const myHoldings = portfolio.map(h => {
        const property = PROPERTIES.find(p => p.id === h.propertyId);
        return property ? { ...h, property } : null;
    }).filter(Boolean);

    const holding = myHoldings.find(h => h.propertyId === selected);

    const handleList = (e) => {
        e.preventDefault();
        if (!user) { showToast('Please sign in first', 'warning'); return; }
        const s = parseFloat(shares);
        const p = parseFloat(price);
        if (!s || s <= 0) { showToast('Enter valid number of shares', 'error'); return; }
        if (!holding || s > holding.shares) { showToast('Not enough shares', 'error'); return; }
        if (!p || p <= 0) { showToast('Enter a valid price', 'error'); return; }

        setListing(true);
        setTimeout(() => {
            sellShares(selected, s, p);
            setSelected(null); setShares(''); setPrice('');
            setListing(false);
        }, 1000);
    };

    if (!user) {
        return (
            <div className="text-center py-16">
                <SellIcon className="h-10 w-10 text-text-secondary mx-auto mb-3 opacity-30" />
                <p className="text-text-secondary mb-4">Sign in to list your shares for sale</p>
                <Link to="/login" className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-accent transition-colors text-sm">Sign In</Link>
            </div>
        );
    }

    if (myHoldings.length === 0) {
        return (
            <div className="text-center py-16">
                <SellIcon className="h-10 w-10 text-text-secondary mx-auto mb-3 opacity-30" />
                <p className="text-text-secondary mb-2">You don't own any shares yet</p>
                <Link to="/marketplace" className="text-primary hover:underline text-sm">Browse Properties →</Link>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <p className="text-text-secondary text-sm">Select a property from your portfolio and set a price to list shares on the secondary market.</p>

            {/* Property selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myHoldings.map(h => (
                    <button key={h.propertyId} onClick={() => { setSelected(h.propertyId); setShares(''); setPrice(''); }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${selected === h.propertyId ? 'border-primary bg-primary/10' : 'border-white/10 bg-surface hover:border-white/20'}`}>
                        <img src={h.property.image} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" alt={h.property.title} />
                        <div className="min-w-0">
                            <p className="font-bold text-white text-sm truncate">{h.property.title}</p>
                            <p className="text-xs text-text-secondary">{h.shares.toFixed(4)} shares owned</p>
                            <p className="text-xs text-secondary">{formatCurrency(h.invested)} invested</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Listing form */}
            {selected && holding && (
                <motion.form onSubmit={handleList} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 border border-white/10 rounded-2xl p-5 space-y-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" /> List Shares — {holding.property.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Shares to Sell *</label>
                            <input type="number" step="0.0001" max={holding.shares} value={shares} onChange={e => setShares(e.target.value)}
                                placeholder={`max ${holding.shares.toFixed(4)}`}
                                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white font-mono focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Price per Share (₹) *</label>
                            <input type="number" step="1" value={price} onChange={e => setPrice(e.target.value)}
                                placeholder={`market: ${formatCurrency(holding.property?.price || 0)}`}
                                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white font-mono focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                    </div>

                    {shares && price && (
                        <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
                            <p className="text-xs text-text-secondary">Estimated Sale Value</p>
                            <p className="text-primary font-bold text-lg">{formatCurrency(parseFloat(shares || 0) * parseFloat(price || 0))}</p>
                        </div>
                    )}

                    <button type="submit" disabled={listing}
                        className="w-full py-3 bg-secondary hover:bg-green-400 text-slate-900 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                        {listing ? 'Listing…' : <><Tag className="h-4 w-4" /> List for Sale</>}
                    </button>
                </motion.form>
            )}
        </div>
    );
}

// ─── Main Market Page ─────────────────────────────────────────────────────────
export default function Market() {
    const [tab, setTab] = useState('buy');

    return (
        <div className="min-h-screen bg-background pt-20 pb-24 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-4 py-1.5 rounded-full mb-3">
                        <ArrowUpDown className="h-4 w-4 text-secondary" />
                        <span className="text-sm text-secondary font-medium">Secondary Market</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Buy &amp; Sell Shares
                    </h1>
                    <p className="text-text-secondary mt-1 text-sm">Trade fractional ownership shares with other investors</p>
                </div>

                {/* Tab switcher */}
                <div className="flex bg-surface border border-white/10 rounded-xl p-1 mb-6 max-w-xs">
                    <button onClick={() => setTab('buy')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tab === 'buy' ? 'bg-primary text-slate-900 shadow' : 'text-text-secondary hover:text-white'}`}>
                        <ShoppingCart className="h-4 w-4" /> Buy
                    </button>
                    <button onClick={() => setTab('sell')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tab === 'sell' ? 'bg-secondary text-slate-900 shadow' : 'text-text-secondary hover:text-white'}`}>
                        <Tag className="h-4 w-4" /> Sell
                    </button>
                </div>

                <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    {tab === 'buy' ? <BuyTab /> : <SellTab />}
                </motion.div>
            </div>
        </div>
    );
}
