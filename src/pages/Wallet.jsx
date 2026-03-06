import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Plus, Banknote, TrendingUp, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/helpers';

const TX_ICONS = {
    buy: { icon: '🏗️', label: 'Purchase', positive: false },
    sip: { icon: '📅', label: 'SIP Investment', positive: false },
    deposit: { icon: '💰', label: 'Deposit', positive: true },
    dividend: { icon: '💵', label: 'Dividend', positive: true },
    sell_listed: { icon: '🏷️', label: 'Sell Listed', positive: false },
    buy_secondary: { icon: '🤝', label: 'Secondary Buy', positive: false },
    ipo_application: { icon: '🔥', label: 'IPO Application', positive: false },
    withdrawal: { icon: '🏦', label: 'Withdrawal', positive: false },
};

export default function Wallet() {
    const { wallet, updateBalance, depositMoney, transactions } = useApp();
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [depositAmount, setDepositAmount] = useState('');

    const totalRentalEarned = transactions
        .filter(tx => tx.type === 'dividend')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const pendingPayouts = totalRentalEarned * 0.26; // mock upcoming

    const handleWithdraw = () => {
        const amount = parseFloat(withdrawAmount);
        if (!amount || amount <= 0) return;
        if (amount > wallet.balance) {
            alert('Insufficient wallet balance!');
            return;
        }
        updateBalance(wallet.balance - amount);
        alert(`Withdrawal of ${formatCurrency(amount)} initiated to your linked bank account. Reflects in 24-48 hours.`);
        setShowWithdraw(false);
        setWithdrawAmount('');
    };

    const handleDeposit = () => {
        const amount = parseFloat(depositAmount);
        if (!amount || amount <= 0) return;
        depositMoney(amount);
        setShowDeposit(false);
        setDepositAmount('');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: 'var(--primary)' }}>My Funds</p>
                <h1 className="text-4xl font-extrabold tracking-tight text-white">Wallet</h1>
            </motion.div>

            {/* Main Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl p-8 mb-6 border border-white/5"
                style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
            >
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
                <div className="relative z-10">
                    <p className="text-sm text-text-secondary font-medium mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse inline-block"></span>
                        Available Balance
                    </p>
                    <div className="flex items-baseline gap-3 mb-8">
                        <span className="text-5xl font-black font-mono text-white">{formatCurrency(wallet.balance)}</span>
                        <span className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>INR</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setShowDeposit(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: 'var(--primary)', color: 'white', boxShadow: '0 4px 20px rgba(139,92,246,0.3)' }}
                        >
                            <Plus className="h-4 w-4" /> Add Money
                        </button>
                        <button
                            onClick={() => setShowWithdraw(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm border border-white/10 text-white transition-all hover:scale-[1.02] hover:bg-white/5 active:scale-[0.98]"
                        >
                            <Banknote className="h-4 w-4" /> Withdraw to Bank
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    { icon: <TrendingUp className="h-5 w-5" />, label: 'Total Rental Earned', value: formatCurrency(totalRentalEarned || 4250), color: 'var(--secondary)' },
                    { icon: <Clock className="h-5 w-5" />, label: 'Upcoming Payouts', value: formatCurrency(pendingPayouts || 1120.5), color: 'var(--primary)' },
                    { icon: <ArrowDownLeft className="h-5 w-5" />, label: 'Total Withdrawn', value: formatCurrency(2000), color: 'rgba(255,255,255,0.7)' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="p-5 rounded-xl border border-white/5"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                        <div className="flex items-center gap-2 mb-2" style={{ color: stat.color }}>{stat.icon}</div>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Transaction History */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
                <div className="space-y-3">
                    {transactions.length > 0 ? transactions.slice(0, 20).map((tx, i) => {
                        const meta = TX_ICONS[tx.type] || { icon: '💳', label: tx.type, positive: false };
                        return (
                            <div
                                key={tx.id || i}
                                className="flex justify-between items-center p-4 rounded-xl border border-white/5 transition-colors hover:bg-white/[0.02]"
                                style={{ background: 'rgba(255,255,255,0.03)' }}
                            >
                                <div className="flex gap-4 items-center">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                        style={{ background: meta.positive ? 'rgba(16,185,129,0.1)' : 'rgba(139,92,246,0.1)' }}
                                    >
                                        {meta.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-sm">{meta.label}</p>
                                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wide">
                                            {tx.propertyTitle || 'Wallet'} • {formatDate(tx.date)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-black text-sm ${meta.positive ? 'text-secondary' : 'text-white'}`}>
                                        {meta.positive ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                                    </p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary">{tx.status}</p>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center py-16 text-text-secondary">
                            <p className="text-4xl mb-3">💳</p>
                            <p className="font-medium">No transactions yet</p>
                            <p className="text-sm mt-1">Your transaction history will appear here</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Withdraw Modal */}
            {showWithdraw && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowWithdraw(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-md rounded-2xl p-8 border border-white/10"
                        style={{ background: '#0d0d1a' }}
                    >
                        <h2 className="text-2xl font-black text-white mb-1">Withdraw</h2>
                        <p className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-6">To: HDFC Bank •••• 4291</p>
                        <div className="mb-6">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 block">Amount</label>
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-white/5 focus-within:border-primary transition-all" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <span className="text-2xl font-black" style={{ color: 'var(--primary)' }}>₹</span>
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={e => setWithdrawAmount(e.target.value)}
                                    className="bg-transparent outline-none text-3xl font-black text-white w-full"
                                    placeholder="0"
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-text-secondary mt-2">Available: {formatCurrency(wallet.balance)}</p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={handleWithdraw}
                                className="w-full py-4 rounded-xl font-black text-white uppercase tracking-widest transition-all"
                                style={{ background: 'var(--primary)', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}
                            >Confirm Withdrawal</button>
                            <button onClick={() => setShowWithdraw(false)} className="w-full py-3 text-text-secondary font-bold hover:text-white transition-colors">Cancel</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Deposit Modal */}
            {showDeposit && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeposit(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-md rounded-2xl p-8 border border-white/10"
                        style={{ background: '#0d0d1a' }}
                    >
                        <h2 className="text-2xl font-black text-white mb-1">Add Money</h2>
                        <p className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-6">Instant transfer from bank</p>
                        <div className="flex gap-2 mb-4">
                            {[5000, 10000, 25000, 50000].map(v => (
                                <button key={v} onClick={() => setDepositAmount(v.toString())}
                                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
                                    style={depositAmount === v.toString()
                                        ? { background: 'var(--primary)', color: 'white' }
                                        : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }
                                    }
                                >₹{v / 1000}k</button>
                            ))}
                        </div>
                        <div className="mb-6">
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <span className="text-2xl font-black" style={{ color: 'var(--secondary)' }}>₹</span>
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={e => setDepositAmount(e.target.value)}
                                    className="bg-transparent outline-none text-3xl font-black text-white w-full"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={handleDeposit}
                                className="w-full py-4 rounded-xl font-black text-white uppercase tracking-widest transition-all"
                                style={{ background: 'var(--secondary)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
                            >Confirm Deposit</button>
                            <button onClick={() => setShowDeposit(false)} className="w-full py-3 text-text-secondary font-bold hover:text-white transition-colors">Cancel</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
