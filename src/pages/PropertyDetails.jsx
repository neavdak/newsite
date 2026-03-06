import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PROPERTIES } from '../data/properties';
import { ArrowLeft, MapPin, ShieldCheck, Heart, TrendingUp, Clock, Award, Tag, ShoppingCart, Plus, IndianRupee, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import ConfirmModal from '../components/ConfirmModal';
import BuyingInterface from '../components/BuyingInterface';

// Countdown Timer component for IPO
function CountdownTimer({ deadline }) {
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        const calc = () => {
            const diff = new Date(deadline) - new Date();
            if (diff <= 0) return setTimeLeft({ expired: true });
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        calc();
        const interval = setInterval(calc, 1000);
        return () => clearInterval(interval);
    }, [deadline]);

    if (timeLeft.expired) return <p className="text-red-400 font-bold">IPO Closed</p>;

    return (
        <div className="flex gap-2">
            {[['D', timeLeft.days], ['H', timeLeft.hours], ['M', timeLeft.minutes], ['S', timeLeft.seconds]].map(([label, val]) => (
                <div key={label} className="bg-background rounded-lg p-2 text-center min-w-[44px]">
                    <p className="text-xl font-black font-mono text-primary">{String(val ?? '--').padStart(2, '0')}</p>
                    <p className="text-[9px] text-text-secondary uppercase">{label}</p>
                </div>
            ))}
        </div>
    );
}

export default function PropertyDetails() {
    const { id } = useParams();
    const property = PROPERTIES.find(p => p.id === id);
    const {
        wallet, addToPortfolio, addTransaction, showToast,
        toggleWatchlist, isInWatchlist, portfolio, updateBalance,
        user, sellShares, ipoApplications, applyForIPO
    } = useApp();

    const [investAmount, setInvestAmount] = useState('');
    const [sellSharesQty, setSellSharesQty] = useState('');
    const [sellPricePerShare, setSellPricePerShare] = useState('');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmSellModal, setConfirmSellModal] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [actionTab, setActionTab] = useState('buy'); // buy | ipo | sell
    const [quickBuyOpen, setQuickBuyOpen] = useState(false);

    const holding = portfolio.find(p => p.propertyId === property?.id);
    const isOwned = !!holding;
    const isFavorited = isInWatchlist(property?.id);
    const hasAppliedIPO = ipoApplications.some(a => a.propertyId === property?.id);

    if (!property) return <div className="p-20 text-center text-text-secondary">Property not found</div>;

    const shares = investAmount ? parseFloat(investAmount) / property.price : 0;
    const monthlyRental = investAmount ? (parseFloat(investAmount) * (property.apy / 100)) / 12 : 0;

    const handleInvest = () => {
        if (!user) { showToast('Please sign in first', 'warning'); return; }
        const amount = parseFloat(investAmount);
        if (!amount || amount < 500) { showToast('Minimum investment is ₹500', 'error'); return; }
        if (amount > wallet.balance) { showToast('Insufficient wallet balance', 'error'); return; }
        setConfirmModalOpen(true);
    };

    const confirmPurchase = () => {
        const amount = parseFloat(investAmount);
        const sharesPurchased = amount / property.price;
        addToPortfolio(property.id, sharesPurchased, property.price);
        addTransaction({
            id: `tx-${Date.now()}`,
            propertyId: property.id,
            propertyTitle: property.title,
            type: 'buy',
            amount,
            shares: sharesPurchased,
            price: property.price,
            date: new Date().toISOString(),
            status: 'completed'
        });
        updateBalance(wallet.balance - amount);
        showToast(`Successfully purchased ${sharesPurchased.toFixed(4)} shares!`, 'success');
        setInvestAmount('');
        setConfirmModalOpen(false);
    };

    const handleSell = () => {
        if (!user) { showToast('Please sign in first', 'warning'); return; }
        if (!holding) { showToast('You do not own shares in this property', 'error'); return; }
        const qty = parseFloat(sellSharesQty);
        const price = parseFloat(sellPricePerShare);
        if (!qty || qty <= 0) { showToast('Enter a valid share quantity', 'error'); return; }
        if (!price || price <= 0) { showToast('Enter a valid price per share', 'error'); return; }
        if (qty > holding.shares) { showToast(`You only own ${holding.shares.toFixed(4)} shares`, 'error'); return; }
        setConfirmSellModal(true);
    };

    const confirmSell = () => {
        sellShares(property.id, parseFloat(sellSharesQty), parseFloat(sellPricePerShare));
        setSellSharesQty('');
        setSellPricePerShare('');
        setConfirmSellModal(false);
    };

    const handleIPOApply = () => {
        if (!user) { showToast('Please sign in first', 'warning'); return; }
        const amount = parseFloat(investAmount);
        if (!amount || amount < 500) { showToast('Minimum IPO application is ₹500', 'error'); return; }
        applyForIPO(property.id, amount);
        setInvestAmount('');
    };

    const handleToggleWatchlist = () => {
        toggleWatchlist(property.id);
        showToast(isFavorited ? 'Removed from watchlist' : 'Added to watchlist', 'info');
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'financials', label: 'Financials' },
        { id: 'documents', label: 'Documents' },
    ];

    const actionTabs = [
        { id: 'buy', label: property.status === 'IPO' ? 'IPO Apply' : 'Buy', icon: <ShoppingCart className="h-4 w-4" />, show: property.status !== 'Sold Out' },
        { id: 'sell', label: 'Sell', icon: <Tag className="h-4 w-4" />, show: isOwned },
        { id: 'certificate', label: 'Certificate', icon: <Award className="h-4 w-4" />, show: isOwned },
    ].filter(t => t.show);

    const availabilityPercent = Math.round(((property.totalShares - property.availableShares) / property.totalShares) * 100);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Image */}
            <div className="relative h-[55vh] w-full">
                <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <Link to="/marketplace" className="absolute top-8 left-8 bg-black/50 p-2 rounded-full hover:bg-black/70 text-white backdrop-blur">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <button onClick={handleToggleWatchlist} className="absolute top-8 right-8 bg-black/50 p-2 rounded-full hover:bg-black/70 text-white backdrop-blur">
                    <Heart className={`h-6 w-6 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                {/* Status badge on image */}
                <div className="absolute bottom-4 left-8">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${property.status === 'IPO' ? 'bg-amber-400 text-black' :
                        property.status === 'Sold Out' ? 'bg-red-500 text-white' :
                            'bg-secondary text-black'
                        }`}>
                        {property.status === 'IPO' ? '🔥 IPO Live' : property.status === 'Sold Out' ? 'Sold Out' : '✅ Live'}
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">{property.type}</span>
                                <span className="flex items-center text-text-secondary text-sm">
                                    <MapPin className="h-4 w-4 mr-1" />{property.location}
                                </span>
                                {isOwned && (
                                    <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-bold">YOU OWN THIS</span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{property.title}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-text-secondary uppercase">Share Price</p>
                            <p className="text-4xl font-mono font-bold text-primary">{formatCurrency(property.price)}</p>
                            <p className={`text-sm font-bold ${property.change >= 0 ? 'text-secondary' : 'text-red-500'}`}>
                                {property.change >= 0 ? '+' : ''}{property.change}% (24h)
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-background/60 p-4 rounded-xl border border-white/5">
                            <p className="text-text-secondary text-xs mb-1">Annual Yield (APY)</p>
                            <p className="text-xl font-bold text-secondary">{property.apy}%</p>
                        </div>
                        <div className="bg-background/60 p-4 rounded-xl border border-white/5">
                            <p className="text-text-secondary text-xs mb-1">Total Asset Value</p>
                            <p className="text-xl font-bold text-white">{property.totalValue}</p>
                        </div>
                        <div className="bg-background/60 p-4 rounded-xl border border-white/5">
                            <p className="text-text-secondary text-xs mb-1">Occupancy Rate</p>
                            <p className="text-xl font-bold text-white">{property.occupancy}%</p>
                        </div>
                        <div className="bg-background/60 p-4 rounded-xl border border-white/5">
                            <p className="text-text-secondary text-xs mb-1">Total Investors</p>
                            <p className="text-xl font-bold text-white">{property.investors.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Share fill meter */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs text-text-secondary mb-1">
                            <span>{availabilityPercent}% Shares Allocated</span>
                            <span>{property.availableShares.toLocaleString()} / {property.totalShares.toLocaleString()} available</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${availabilityPercent}%` }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                className={`h-full rounded-full ${availabilityPercent > 90 ? 'bg-red-500' : availabilityPercent > 70 ? 'bg-amber-400' : 'bg-secondary'}`}
                            />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-white/5 mb-6">
                        <nav className="-mb-px flex space-x-6">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-text-secondary hover:text-white'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <h3 className="text-xl font-bold mb-3">About this Property</h3>
                                        <p className="text-text-secondary leading-relaxed mb-6">{property.description}</p>
                                        <h3 className="text-xl font-bold mb-3">Amenities</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {property.amenities?.map((a, i) => (
                                                <div key={i} className="flex items-center gap-2 text-text-secondary text-sm">
                                                    <ShieldCheck className="h-4 w-4 text-secondary flex-shrink-0" />
                                                    {a}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'financials' && (
                                    <motion.div key="financials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <h3 className="text-xl font-bold mb-4">Financial Highlights</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            {[
                                                { label: 'Annual Yield', value: `${property.apy}%`, color: 'text-secondary' },
                                                { label: 'Share Price', value: formatCurrency(property.price), color: 'text-primary' },
                                                { label: 'IPO Price', value: formatCurrency(property.ipoPrice), color: 'text-white' },
                                                { label: 'Total Shares', value: property.totalShares.toLocaleString(), color: 'text-white' },
                                                { label: 'Available', value: property.availableShares.toLocaleString(), color: 'text-white' },
                                                { label: 'Management Fee', value: '1% p.a.', color: 'text-white' },
                                            ].map((item, i) => (
                                                <div key={i} className="bg-background/60 p-4 rounded-xl border border-white/5">
                                                    <p className="text-xs text-text-secondary mb-1">{item.label}</p>
                                                    <p className={`font-bold ${item.color}`}>{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            {['Monthly Dividend Payouts', 'High Appreciation Potential', 'Management Fee: 1% (Industry Lowest)', 'Legal Structure: SPC Trust'].map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-text-secondary text-sm">
                                                    <TrendingUp className="h-4 w-4 text-secondary" />{item}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'documents' && (
                                    <motion.div key="documents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                                        <h3 className="text-xl font-bold mb-3">Property Documents</h3>
                                        {[
                                            { name: 'Offering Circular', size: '2.4 MB' },
                                            { name: 'Financial Audit 2024', size: '1.1 MB' },
                                            { name: 'Property Appraisal Report', size: '4.5 MB' },
                                            { name: 'Building Inspection', size: '3.2 MB' },
                                            { name: 'SPC Trust Agreement', size: '1.8 MB' },
                                        ].map((doc, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-background/60 rounded-xl border border-white/5 hover:border-primary/30 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-red-500/10 p-2 rounded-lg">
                                                        <span className="text-[10px] font-bold text-red-400">PDF</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm group-hover:text-primary transition-colors">{doc.name}</p>
                                                        <p className="text-xs text-text-secondary">{doc.size}</p>
                                                    </div>
                                                </div>
                                                <button className="text-xs font-medium text-primary hover:underline">Download</button>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right — Action Panel */}
                        <div>
                            <div className="bg-background rounded-2xl border border-white/10 overflow-hidden sticky top-24">
                                {/* Action Tabs */}
                                <div className="flex border-b border-white/10">
                                    {actionTabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActionTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-colors ${actionTab === tab.id
                                                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                                                : 'text-text-secondary hover:text-white'
                                                }`}
                                        >
                                            {tab.icon} {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-5">
                                    {/* BUY / IPO Panel */}
                                    {(actionTab === 'buy' || !actionTabs.find(t => t.id === actionTab)) && property.status !== 'Sold Out' && (
                                        <div className="space-y-4">
                                            {property.status === 'IPO' && (
                                                <div>
                                                    <p className="text-xs text-amber-400 font-medium uppercase tracking-wider mb-2">IPO Closes In</p>
                                                    <CountdownTimer deadline={property.ipoDeadline} />
                                                    <p className="text-xs text-text-secondary mt-2">IPO Price: <strong className="text-white">{formatCurrency(property.ipoPrice)}</strong>/share</p>
                                                    {hasAppliedIPO && (
                                                        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3 mt-2">
                                                            <p className="text-xs text-secondary font-medium">✅ You have applied for this IPO</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-secondary">Wallet Balance</span>
                                                <span className="font-mono font-bold text-white">{formatCurrency(wallet.balance)}</span>
                                            </div>

                                            <div>
                                                <label className="block text-xs text-text-secondary mb-1">Investment Amount (₹)</label>
                                                <div className="relative">
                                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                                                    <input
                                                        type="number"
                                                        placeholder="5000"
                                                        min="500"
                                                        value={investAmount}
                                                        onChange={e => setInvestAmount(e.target.value)}
                                                        className="w-full bg-surface border border-white/10 rounded-xl pl-9 pr-4 py-3 font-mono focus:border-primary outline-none text-white"
                                                    />
                                                </div>
                                                <div className="flex gap-1.5 mt-2">
                                                    {[5000, 10000, 25000].map(v => (
                                                        <button key={v} onClick={() => setInvestAmount(v.toString())}
                                                            className="flex-1 py-1 bg-white/5 hover:bg-primary/20 rounded-lg text-xs text-text-secondary hover:text-primary transition-colors border border-white/5">
                                                            +₹{v / 1000}k
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {investAmount && (
                                                <div className="bg-white/5 rounded-xl p-3 space-y-2 text-xs">
                                                    <div className="flex justify-between text-text-secondary">
                                                        <span>Est. Shares</span>
                                                        <span className="text-white font-mono">{shares.toFixed(4)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-text-secondary">
                                                        <span>Monthly Rental</span>
                                                        <span className="text-secondary font-mono font-bold">{formatCurrency(monthlyRental)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-text-secondary">
                                                        <span>Annual Yield</span>
                                                        <span className="text-secondary font-mono">{formatCurrency(parseFloat(investAmount) * property.apy / 100)}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={property.status === 'IPO' ? handleIPOApply : handleInvest}
                                                disabled={!investAmount || parseFloat(investAmount) < 500 || hasAppliedIPO}
                                                className="w-full py-3 bg-primary hover:bg-accent text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {property.status === 'IPO'
                                                    ? (hasAppliedIPO ? '✅ Applied' : '🔥 Apply for IPO')
                                                    : 'Buy Shares'}
                                            </button>
                                            {/* Quick Buy button — opens BuyingInterface keypad modal */}
                                            {property.status !== 'IPO' && property.status !== 'Sold Out' && (
                                                <button
                                                    onClick={() => setQuickBuyOpen(true)}
                                                    className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-primary/30 hover:bg-primary/10"
                                                    style={{ color: 'var(--primary)' }}
                                                >
                                                    <Zap className="h-3.5 w-3.5" /> Quick Buy (Keypad)
                                                </button>
                                            )}
                                            <p className="text-xs text-center text-text-secondary">Minimum investment ₹500. Capital at risk.</p>
                                        </div>
                                    )}

                                    {property.status === 'Sold Out' && actionTab === 'buy' && (
                                        <div className="text-center py-6">
                                            <p className="text-red-400 font-bold text-lg mb-2">Sold Out</p>
                                            <p className="text-text-secondary text-sm mb-4">All shares have been allocated. Check the secondary market.</p>
                                            <Link to="/market" className="flex items-center justify-center gap-2 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl py-2.5 font-medium hover:bg-secondary/20 transition-colors text-sm">
                                                View in Market
                                            </Link>
                                        </div>
                                    )}

                                    {/* SELL Panel */}
                                    {actionTab === 'sell' && isOwned && (
                                        <div className="space-y-4">
                                            <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-3">
                                                <p className="text-xs text-text-secondary">Your Holdings</p>
                                                <p className="text-lg font-bold text-white font-mono">{holding.shares.toFixed(4)} shares</p>
                                                <p className="text-xs text-text-secondary">Invested: {formatCurrency(holding.invested)}</p>
                                            </div>

                                            <div>
                                                <label className="block text-xs text-text-secondary mb-1">Shares to Sell</label>
                                                <input
                                                    type="number"
                                                    placeholder="0.0000"
                                                    max={holding.shares}
                                                    step="0.0001"
                                                    value={sellSharesQty}
                                                    onChange={e => setSellSharesQty(e.target.value)}
                                                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 font-mono focus:border-primary outline-none text-white"
                                                />
                                                <button className="text-xs text-primary mt-1 hover:underline" onClick={() => setSellSharesQty(holding.shares.toFixed(4))}>
                                                    Sell all ({holding.shares.toFixed(4)})
                                                </button>
                                            </div>

                                            <div>
                                                <label className="block text-xs text-text-secondary mb-1">Price per Share (₹)</label>
                                                <div className="relative">
                                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                                                    <input
                                                        type="number"
                                                        placeholder={property.price}
                                                        value={sellPricePerShare}
                                                        onChange={e => setSellPricePerShare(e.target.value)}
                                                        className="w-full bg-surface border border-white/10 rounded-xl pl-9 pr-4 py-3 font-mono focus:border-primary outline-none text-white"
                                                    />
                                                </div>
                                                <button className="text-xs text-text-secondary mt-1 hover:text-white" onClick={() => setSellPricePerShare(property.price.toString())}>
                                                    Use market price ({formatCurrency(property.price)})
                                                </button>
                                            </div>

                                            {sellSharesQty && sellPricePerShare && (
                                                <div className="bg-white/5 rounded-xl p-3 text-xs">
                                                    <div className="flex justify-between text-text-secondary">
                                                        <span>Total Proceeds</span>
                                                        <span className="text-secondary font-mono font-bold">{formatCurrency(parseFloat(sellSharesQty) * parseFloat(sellPricePerShare))}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={handleSell}
                                                disabled={!sellSharesQty || !sellPricePerShare}
                                                className="w-full py-3 bg-secondary hover:bg-emerald-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                List for Sale
                                            </button>
                                            <p className="text-xs text-center text-text-secondary">Shares listed on secondary market</p>
                                        </div>
                                    )}

                                    {/* CERTIFICATE Panel */}
                                    {actionTab === 'certificate' && isOwned && (
                                        <div className="text-center py-4 space-y-4">
                                            <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6">
                                                <Award className="h-12 w-12 text-primary mx-auto mb-3" />
                                                <p className="font-bold text-white mb-1">Ownership Certificate</p>
                                                <p className="text-text-secondary text-xs">You own <strong className="text-white">{holding.shares.toFixed(4)}</strong> shares in {property.title}</p>
                                            </div>
                                            <Link
                                                to={`/certificate/${property.id}`}
                                                className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-accent text-white font-bold rounded-xl transition-colors"
                                            >
                                                <Award className="h-4 w-4" /> View Certificate
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Confirm Buy Modal */}
            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={confirmPurchase}
                title="Confirm Purchase"
                message={`Invest ${formatCurrency(parseFloat(investAmount || 0))} in ${property.title}? You'll receive ~${shares.toFixed(4)} shares.`}
                confirmText="Confirm Purchase"
                type="success"
            />

            {/* Confirm Sell Modal */}
            <ConfirmModal
                isOpen={confirmSellModal}
                onClose={() => setConfirmSellModal(false)}
                onConfirm={confirmSell}
                title="List Shares for Sale"
                message={`List ${parseFloat(sellSharesQty || 0).toFixed(4)} shares at ${formatCurrency(parseFloat(sellPricePerShare || 0))} each on the secondary market?`}
                confirmText="List for Sale"
                type="warning"
            />

            {/* BuyingInterface Quick Buy Modal */}
            {quickBuyOpen && (
                <BuyingInterface
                    property={property}
                    onClose={() => setQuickBuyOpen(false)}
                />
            )}
        </div>
    );
}
