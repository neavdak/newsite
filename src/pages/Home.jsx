import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, ShieldCheck, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROPERTIES } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

const STATUS_FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'Live', label: 'Live' },
    { id: 'IPO', label: 'IPO' },
    { id: 'Sold Out', label: 'Sold Out' },
];

export default function Home() {
    const [filter, setFilter] = useState('all');

    const filteredProperties = useMemo(() => {
        if (filter === 'all') return PROPERTIES;
        return PROPERTIES.filter(p => p.status === filter);
    }, [filter]);

    return (
        <div className="bg-background text-text-primary">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background opacity-80" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
                    >
                        Real Estate Investing
                        <span className="block text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            Redefined.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-text-secondary max-w-2xl mx-auto mb-10"
                    >
                        Buy and sell fractional ownership in premium real estate properties instantly.
                        Start building your portfolio with as little as <span className="text-secondary font-bold">₹500</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex justify-center gap-4"
                    >
                        <Link
                            to="/marketplace"
                            className="bg-primary hover:bg-accent text-slate-900 font-bold py-4 px-8 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 flex items-center gap-2"
                        >
                            Start Investing <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            to="/learn"
                            className="bg-surface hover:bg-slate-700 text-text-primary font-semibold py-4 px-8 rounded-full border border-slate-700 transition-all hover:scale-105"
                        >
                            How it Works
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Stats / Features */}
            <section className="py-24 bg-surface/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Coins className="h-10 w-10 text-primary" />,
                                title: "Fractional Ownership",
                                desc: "Own a piece of multi-million dollar properties without the hassle of management."
                            },
                            {
                                icon: <TrendingUp className="h-10 w-10 text-secondary" />,
                                title: "Earn Dividends",
                                desc: "Receive monthly rental income directly to your wallet based on your share ownership."
                            },
                            {
                                icon: <ShieldCheck className="h-10 w-10 text-accent" />,
                                title: "Secure & Transparent",
                                desc: "All transactions are recorded securely. You have full control over your assets."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.2 }}
                                className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-primary/30 transition-colors"
                            >
                                <div className="bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Active Listings — from BrickStake */}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header + Filter Tabs */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                        <div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-xs font-black uppercase tracking-widest mb-2"
                                style={{ color: 'var(--primary)' }}
                            >
                                High-Yield Properties
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-extrabold text-white"
                            >
                                Active Listings
                            </motion.h2>
                            <p className="text-text-secondary mt-2">
                                {filteredProperties.length} propert{filteredProperties.length === 1 ? 'y' : 'ies'} open for investment
                            </p>
                        </div>

                        <div className="flex gap-1.5 p-1 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            {STATUS_FILTERS.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
                                    style={filter === f.id
                                        ? { background: 'var(--primary)', color: 'white' }
                                        : { color: 'rgba(255,255,255,0.5)' }
                                    }
                                    onMouseEnter={e => { if (filter !== f.id) e.currentTarget.style.color = 'white'; }}
                                    onMouseLeave={e => { if (filter !== f.id) e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Property Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((property, i) => (
                            <motion.div
                                key={property.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                            >
                                <PropertyCard property={property} />
                            </motion.div>
                        ))}
                        {filteredProperties.length === 0 && (
                            <div className="col-span-full text-center py-20 text-text-secondary">
                                <span className="text-4xl block mb-4">🏠</span>
                                <p>No properties found in this category.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            to="/marketplace"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-slate-900 font-bold py-3.5 px-8 rounded-full transition-all shadow-lg shadow-primary/20 hover:scale-105"
                        >
                            View All in Marketplace <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
