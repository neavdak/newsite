import { motion } from 'framer-motion';
import { ArrowUpRight, DollarSign, Wallet, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { PROPERTIES } from '../data/properties';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function Dashboard() {
    const { wallet, portfolio, transactions, user } = useApp();

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="bg-surface border border-slate-700 rounded-2xl p-16 max-w-2xl mx-auto">
                    <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <Wallet className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Sign in to View Dashboard</h1>
                    <p className="text-text-secondary mb-8 text-lg">
                        Manage your portfolio, track investments, and view your transaction history.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/login"
                            className="bg-primary hover:bg-accent text-slate-900 font-bold px-8 py-3 rounded-lg transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-surface hover:bg-slate-800 text-white border border-slate-600 font-bold px-8 py-3 rounded-lg transition-colors"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate portfolio totals
    const portfolioProperties = portfolio.map(holding => {
        const property = PROPERTIES.find(p => p.id === holding.propertyId);
        return { ...holding, property };
    });

    const totalInvested = portfolio.reduce((sum, p) => sum + p.invested, 0);
    const totalCurrentValue = portfolio.reduce((sum, p) => sum + p.currentValue, 0);
    const totalGain = totalCurrentValue - totalInvested;
    const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

    // Calculate monthly dividends
    const monthlyDividends = portfolio.reduce((sum, holding) => {
        const property = PROPERTIES.find(p => p.id === holding.propertyId);
        if (property) {
            const annualDividend = holding.currentValue * (property.apy / 100);
            return sum + (annualDividend / 12);
        }
        return sum;
    }, 0);

    // Get recent transactions
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-text-secondary">
                    {wallet.connected
                        ? `Welcome back, ${user.name.split(' ')[0]}! Here's your portfolio overview.`
                        : 'Connect your wallet to view your portfolio.'}
                </p>
            </div>

            {wallet.connected ? (
                <>
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-text-secondary font-medium">Portfolio Value</h3>
                                <Wallet className="h-5 w-5 text-primary" />
                            </div>
                            <div className="text-3xl font-bold font-mono mb-2">{formatCurrency(totalCurrentValue)}</div>
                            <div className={`flex items-center text-sm ${totalGain >= 0 ? 'text-secondary' : 'text-red-500'}`}>
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                {formatCurrency(Math.abs(totalGain))} ({totalGainPercent.toFixed(2)}%)
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
                            <div className="text-3xl font-bold font-mono mb-2">{formatCurrency(monthlyDividends)}</div>
                            <p className="text-xs text-text-secondary">Next payout in 12 days</p>
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
                            <div className="text-3xl font-bold font-mono mb-2">{portfolioProperties.length}</div>
                            <p className="text-xs text-text-secondary">Across {new Set(portfolioProperties.map(p => p.property?.location.split(',')[1])).size} cities</p>
                        </motion.div>
                    </div>

                    {/* Portfolio Section */}
                    {portfolioProperties.length > 0 ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    Your Portfolio
                                    <span className="text-xs bg-surface border border-slate-700 px-2 py-1 rounded text-text-secondary font-normal">
                                        {portfolioProperties.length} {portfolioProperties.length === 1 ? 'Property' : 'Properties'}
                                    </span>
                                </h2>
                                <Link
                                    to="/marketplace"
                                    className="text-primary hover:text-accent text-sm font-semibold flex items-center gap-1"
                                >
                                    Browse More <ExternalLink className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {portfolioProperties.map((holding) => (
                                    <PropertyCard key={holding.propertyId} property={holding.property} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-surface border border-slate-700 rounded-2xl p-12 text-center">
                            <TrendingUp className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">No Investments Yet</h3>
                            <p className="text-text-secondary mb-6">
                                Start building your real estate portfolio today
                            </p>
                            <Link
                                to="/marketplace"
                                className="inline-block bg-primary hover:bg-accent text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors"
                            >
                                Explore Properties
                            </Link>
                        </div>
                    )}

                    {/* Transaction History */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
                        {recentTransactions.length > 0 ? (
                            <div className="bg-surface border border-slate-700 rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-900/50 border-b border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                                    Property
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                                    Shares
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-4 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                            {recentTransactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {formatDate(tx.date)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        {tx.propertyTitle}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.type === 'buy'
                                                            ? 'bg-primary/20 text-primary'
                                                            : 'bg-secondary/20 text-secondary'
                                                            }`}>
                                                            {tx.type === 'buy' ? 'Purchase' : 'Dividend'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono">
                                                        {tx.shares ? tx.shares.toFixed(4) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-bold">
                                                        {formatCurrency(tx.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-surface border border-slate-700 rounded-2xl p-8 text-center">
                                <Calendar className="h-12 w-12 text-text-secondary mx-auto mb-3" />
                                <p className="text-text-secondary">No transactions yet</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-surface border border-slate-700 rounded-2xl p-16 text-center">
                    <Wallet className="h-20 w-20 text-text-secondary mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-3">Connect Your Wallet</h3>
                    <p className="text-text-secondary mb-8 max-w-md mx-auto">
                        Connect your wallet to view your portfolio, track investments, and manage your real estate holdings.
                    </p>
                    <p className="text-sm text-text-secondary">
                        Click "Connect Wallet" in the navigation bar to get started
                    </p>
                </div>
            )}
        </div>
    );
}
