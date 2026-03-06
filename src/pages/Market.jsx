import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpDown, TrendingUp, TrendingDown, Filter, ShoppingCart, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROPERTIES } from '../data/properties';
import { formatCurrency } from '../utils/helpers';

export default function Market() {
    const { listedShares, buyListing, user, showToast } = useApp();
    const [sortBy, setSortBy] = useState('newest');
    const [filterType, setFilterType] = useState('All');

    const ALL_TYPES = ['All', 'Residential', 'Commercial', 'Industrial', 'Hospitality', 'Vacation'];

    const enrichedListings = (listedShares || []).map(listing => {
        const property = PROPERTIES.find(p => p.id === listing.propertyId);
        return { ...listing, property };
    }).filter(l => l.property);

    const filteredListings = enrichedListings.filter(l =>
        filterType === 'All' || l.property.type === filterType
    );

    const sortedListings = [...filteredListings].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.listedAt) - new Date(a.listedAt);
        if (sortBy === 'price_asc') return a.pricePerShare - b.pricePerShare;
        if (sortBy === 'price_desc') return b.pricePerShare - a.pricePerShare;
        return 0;
    });

    const handleBuy = (listing) => {
        if (!user) {
            showToast('Please sign in to buy shares', 'warning');
            return;
        }
        if (listing.sellerId === user.id) {
            showToast('You cannot buy your own listing', 'error');
            return;
        }
        buyListing(listing.id);
    };

    return (
        <div className="min-h-screen bg-background pt-20 pb-24 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-4 py-1.5 rounded-full mb-3">
                        <ArrowUpDown className="h-4 w-4 text-secondary" />
                        <span className="text-sm text-secondary font-medium">Secondary Market</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Buy & Sell Shares
                    </h1>
                    <p className="text-text-secondary mt-1">Trade fractional ownership shares listed by other investors</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                        {ALL_TYPES.map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filterType === type
                                        ? 'bg-primary/20 border-primary text-primary'
                                        : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <div className="ml-auto">
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="bg-surface border border-white/10 text-sm text-text-secondary rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-surface border border-white/5 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-white">{enrichedListings.length}</p>
                        <p className="text-xs text-text-secondary">Active Listings</p>
                    </div>
                    <div className="bg-surface border border-white/5 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-secondary">
                            {enrichedListings.length > 0
                                ? formatCurrency(enrichedListings.reduce((s, l) => s + l.pricePerShare, 0) / enrichedListings.length)
                                : '—'}
                        </p>
                        <p className="text-xs text-text-secondary">Avg. Share Price</p>
                    </div>
                    <div className="bg-surface border border-white/5 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-primary">
                            {new Set(enrichedListings.map(l => l.propertyId)).size}
                        </p>
                        <p className="text-xs text-text-secondary">Properties Listed</p>
                    </div>
                </div>

                {/* Listings */}
                {sortedListings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Tag className="h-12 w-12 text-text-secondary mx-auto mb-4 opacity-30" />
                        <p className="text-text-secondary text-lg mb-2">No listings yet</p>
                        <p className="text-text-secondary text-sm mb-6">
                            {filterType !== 'All' ? 'Try a different filter, or ' : ''}
                            Be the first to list your shares!
                        </p>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-accent transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sortedListings.map((listing, i) => {
                            const originalPrice = listing.property.price;
                            const priceChange = ((listing.pricePerShare - originalPrice) / originalPrice * 100).toFixed(1);
                            const isAbove = parseFloat(priceChange) >= 0;

                            return (
                                <motion.div
                                    key={listing.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-surface border border-white/5 hover:border-primary/30 rounded-2xl p-5 transition-all"
                                >
                                    <div className="flex gap-4">
                                        <img
                                            src={listing.property.image}
                                            alt={listing.property.title}
                                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white truncate">{listing.property.title}</h3>
                                            <p className="text-xs text-text-secondary">{listing.property.location}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{listing.property.type}</span>
                                                <span className="text-xs text-secondary">{listing.property.apy}% APY</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
                                        <div>
                                            <p className="text-xs text-text-secondary">Shares</p>
                                            <p className="font-mono font-bold text-white">{listing.shares.toFixed(4)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary">Price/Share</p>
                                            <p className="font-mono font-bold text-white">{formatCurrency(listing.pricePerShare)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary">vs Market</p>
                                            <p className={`font-bold flex items-center gap-1 text-sm ${isAbove ? 'text-red-400' : 'text-secondary'}`}>
                                                {isAbove ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                {Math.abs(parseFloat(priceChange))}%
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-text-secondary">Total Cost</p>
                                            <p className="font-bold text-primary">{formatCurrency(listing.shares * listing.pricePerShare)}</p>
                                        </div>
                                        <button
                                            onClick={() => handleBuy(listing)}
                                            disabled={listing.sellerId === user?.id}
                                            className="flex items-center gap-2 bg-primary hover:bg-accent text-white font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            {listing.sellerId === user?.id ? 'Your Listing' : 'Buy Now'}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
