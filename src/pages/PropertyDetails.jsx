import { useParams, Link } from 'react-router-dom';
import { PROPERTIES } from '../data/properties';
import { ArrowLeft, MapPin, TrendingUp, DollarSign, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PropertyDetails() {
    const { id } = useParams();
    const property = PROPERTIES.find(p => p.id === id);

    if (!property) return <div className="p-20 text-center">Property not found</div>;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Image */}
            <div className="relative h-[60vh] w-full">
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <Link to="/marketplace" className="absolute top-8 left-8 bg-black/50 p-2 rounded-full hover:bg-black/70 text-white backdrop-blur">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface rounded-2xl p-8 border border-slate-700 shadow-2xl"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {property.type}
                                </span>
                                <span className="flex items-center text-text-secondary text-sm">
                                    <MapPin className="h-4 w-4 mr-1" /> {property.location}
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold">{property.title}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-text-secondary uppercase">Current Price</p>
                            <p className="text-4xl font-mono font-bold text-primary">${property.price.toFixed(2)}</p>
                            <p className={`text-sm font-bold ${property.change >= 0 ? 'text-secondary' : 'text-red-500'}`}>
                                {property.change >= 0 ? '+' : ''}{property.change}% (24h)
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-900/50 p-4 rounded-xl">
                            <p className="text-text-secondary text-xs">Annual Yield (APY)</p>
                            <p className="text-xl font-bold text-secondary">{property.apy}%</p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl">
                            <p className="text-text-secondary text-xs">Total Asset Value</p>
                            <p className="text-xl font-bold">{property.totalValue}</p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl">
                            <p className="text-text-secondary text-xs">Occupancy Rate</p>
                            <p className="text-xl font-bold">98.5%</p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl">
                            <p className="text-text-secondary text-xs">Investors</p>
                            <p className="text-xl font-bold">1,240</p>
                        </div>
                    </div>

                    {/* Main Action */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-grow space-y-6">
                            <h3 className="text-xl font-bold">About this Property</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Experience the pinnacle of {property.type.toLowerCase()} real estate.
                                {property.title} represents a unique opportunity to invest in a high-growth area
                                with stable rental yields. Managed by top-tier property managers, this asset
                                is optimized for maximum returns.
                            </p>

                            <h3 className="text-xl font-bold mt-8">Financial Highlights</h3>
                            <ul className="space-y-3">
                                {[
                                    "Monthly Dividend Payouts",
                                    "Appreciation Potential: High",
                                    "Management Fee: 1% (Industry Lowest)",
                                    "Legal Structure: LLC Ownership"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-text-secondary">
                                        <ShieldCheck className="h-5 w-5 text-secondary mr-2" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="md:w-1/3 bg-slate-900 p-6 rounded-xl border border-slate-700 h-fit">
                            <h3 className="text-xl font-bold mb-4">Buy Shares</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Available Balance</span>
                                    <span className="font-mono">$12,450.80</span>
                                </div>
                                <div>
                                    <label className="block text-xs text-text-secondary mb-1">Amount</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full bg-surface border border-slate-600 rounded-lg pl-9 pr-4 py-3 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => alert(`Order placed for ${property.title}!`)}
                                    className="w-full bg-primary hover:bg-accent text-slate-900 font-bold py-3 rounded-lg transition-colors shadow-lg shadow-primary/20"
                                >
                                    Confirm Investment
                                </button>
                                <p className="text-xs text-center text-text-secondary">
                                    Transaction fees may apply. Capital at risk.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
