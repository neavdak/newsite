import { motion } from 'framer-motion';
import { ArrowUpRight, DollarSign, Wallet, TrendingUp } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { PROPERTIES } from '../data/properties';

export default function Dashboard() {
    // Mock User Data
    const portfolioProperties = PROPERTIES.slice(0, 3); // User owns first 3
    const totalBalance = 12450.80;
    const totalGain = 1250.40;
    const gainPercent = 11.2;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-text-secondary font-medium">Total Balance</h3>
                        <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-3xl font-bold font-mono">${totalBalance.toLocaleString()}</div>
                    <div className="flex items-center mt-2 text-sm text-secondary">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        +${totalGain.toLocaleString()} ({gainPercent}%)
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-surface p-6 rounded-2xl border border-slate-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-text-secondary font-medium">Monthly Dividends</h3>
                        <DollarSign className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-3xl font-bold font-mono">$342.50</div>
                    <p className="text-xs text-text-secondary mt-2">Next payout in 12 days</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-surface p-6 rounded-2xl border border-slate-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-text-secondary font-medium">Properties Owned</h3>
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-3xl font-bold font-mono">{portfolioProperties.length}</div>
                    <p className="text-xs text-text-secondary mt-2">Across 3 different cities</p>
                </motion.div>
            </div>

            {/* Section Divider */}
            <div className="border-t border-surface my-8" />

            {/* Portfolio Grid */}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    Your Portfolio <span className="text-xs bg-surface border border-slate-700 px-2 py-1 rounded text-text-secondary font-normal">Live Updates</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </div>
    );
}
