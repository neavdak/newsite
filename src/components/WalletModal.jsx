import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CreditCard, Building2, Smartphone, ArrowRight } from 'lucide-react'; // Added icons
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const PAYMENT_METHODS = [
    {
        id: 'upi',
        name: 'UPI / GPay / PhonePe',
        icon: <Smartphone className="h-6 w-6 text-primary" />,
        description: 'Instant transfer via UPI Apps'
    },
    {
        id: 'netbanking',
        name: 'Net Banking',
        icon: <Building2 className="h-6 w-6 text-secondary" />,
        description: 'All major Indian banks supported'
    },
    {
        id: 'card',
        name: 'Credit / Debit Card',
        icon: <CreditCard className="h-6 w-6 text-accent" />,
        description: 'Visa, Mastercard, RuPay'
    }
];

export default function WalletModal({ isOpen, onClose }) {
    const { wallet, depositMoney, showToast } = useApp();
    const [amount, setAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState('amount'); // amount, method, processing

    const handleProceed = () => {
        if (!amount || parseFloat(amount) < 100) {
            showToast('Minimum deposit is ₹100', 'error');
            return;
        }
        setStep('method');
    };

    const handleDeposit = (method) => {
        setProcessing(true);
        setTimeout(() => {
            depositMoney(parseFloat(amount));
            showToast(`₹${amount} added via ${method.name}`, 'success');
            setProcessing(false);
            setStep('amount');
            setAmount('');
            onClose();
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" // Higher z-index
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-[70] p-4"> {/* Higher z-index */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-surface border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/20 p-2 rounded-lg">
                                        <Wallet className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">PropickX Wallet</h3>
                                        <p className="text-sm text-text-secondary">
                                            Balance: <span className="text-white font-mono">{formatCurrency(wallet.balance)}</span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-text-secondary hover:text-white transition-colors"
                                    disabled={processing}
                                    aria-label="Close"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {step === 'amount' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-2">Enter Amount to Add</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-text-secondary">₹</span>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="5000"
                                                    className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-xl font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                {[5000, 10000, 25000].map(val => (
                                                    <button
                                                        key={val}
                                                        onClick={() => setAmount(val.toString())}
                                                        className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors"
                                                    >
                                                        +₹{val / 1000}k
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleProceed}
                                            className="w-full py-3 bg-primary text-slate-900 rounded-xl font-bold hover:bg-accent transition-all flex items-center justify-center gap-2"
                                        >
                                            Proceed to Pay <ArrowRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}

                                {step === 'method' && (
                                    <div className="space-y-4">
                                        <p className="text-sm text-text-secondary mb-2">Select Payment Method for <span className="text-white font-bold">₹{amount}</span></p>
                                        {PAYMENT_METHODS.map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => handleDeposit(method)}
                                                disabled={processing}
                                                className="w-full flex items-center gap-4 p-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 hover:border-primary/50 rounded-xl transition-all group disabled:opacity-50"
                                            >
                                                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                                                    {method.icon}
                                                </div>
                                                <div className="flex-grow text-left">
                                                    <p className="font-semibold group-hover:text-primary transition-colors">
                                                        {method.name}
                                                    </p>
                                                    <p className="text-xs text-text-secondary">{method.description}</p>
                                                </div>
                                                {processing && (
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                                                )}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setStep('amount')}
                                            className="w-full py-2 text-text-secondary hover:text-white text-sm"
                                        >
                                            Back
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
