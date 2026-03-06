import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CreditCard, Building2, Smartphone, ArrowRight, User, FileText, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const PAYMENT_METHODS = [
    { id: 'upi', name: 'UPI / GPay / PhonePe', icon: <Smartphone className="h-6 w-6 text-primary" />, description: 'Instant transfer via UPI Apps' },
    { id: 'netbanking', name: 'Net Banking', icon: <Building2 className="h-6 w-6 text-secondary" />, description: 'All major Indian banks supported' },
    { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard className="h-6 w-6 text-accent" />, description: 'Visa, Mastercard, RuPay' },
];

export default function WalletModal({ isOpen, onClose }) {
    const { wallet, depositMoney, showToast, user } = useApp();
    const [amount, setAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    // steps: amount → kyc → method
    const [step, setStep] = useState('amount');

    // KYC fields
    const [pan, setPan] = useState('');
    const [dob, setDob] = useState('');
    const [bankAcc, setBankAcc] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [kycError, setKycError] = useState('');

    const handleProceed = () => {
        if (!amount || parseFloat(amount) < 100) { showToast('Minimum deposit is ₹100', 'error'); return; }
        setStep('kyc');
    };

    const handleKycSubmit = (e) => {
        e.preventDefault();
        setKycError('');
        const panRe = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        if (!panRe.test(pan.toUpperCase())) { setKycError('Enter a valid PAN (e.g. ABCDE1234F)'); return; }
        if (!dob) { setKycError('Date of birth is required'); return; }
        if (bankAcc.length < 9) { setKycError('Enter a valid bank account number'); return; }
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())) { setKycError('Enter a valid IFSC code (e.g. HDFC0001234)'); return; }
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
            setPan(''); setDob(''); setBankAcc(''); setIfsc('');
            onClose();
        }, 1500);
    };

    const handleClose = () => {
        if (!processing) { setStep('amount'); onClose(); }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={handleClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" />

                    <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-surface border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col">

                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900/50 flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/20 p-2 rounded-lg">
                                        <Wallet className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">PropickX Wallet</h3>
                                        <p className="text-xs text-text-secondary">Balance: <span className="text-white font-mono">{formatCurrency(wallet.balance)}</span></p>
                                    </div>
                                </div>
                                <button onClick={handleClose} disabled={processing} className="text-text-secondary hover:text-white transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Step indicator */}
                            <div className="flex items-center gap-0 px-5 pt-4 flex-shrink-0">
                                {['Amount', 'KYC', 'Payment'].map((label, i) => {
                                    const stepIdx = { amount: 0, kyc: 1, method: 2 }[step];
                                    const done = i < stepIdx;
                                    const active = i === stepIdx;
                                    return (
                                        <div key={label} className="flex items-center flex-1">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${done ? 'bg-secondary text-white' : active ? 'bg-primary text-slate-900' : 'bg-slate-800 text-text-secondary'}`}>
                                                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                                            </div>
                                            <span className={`text-xs ml-1 ${active ? 'text-white font-medium' : 'text-text-secondary'}`}>{label}</span>
                                            {i < 2 && <div className={`flex-1 h-px mx-2 ${done ? 'bg-secondary' : 'bg-slate-700'}`} />}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Body */}
                            <div className="p-5 overflow-y-auto flex-1">
                                {/* STEP 1: Amount */}
                                {step === 'amount' && (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-2">Enter Amount to Add</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-text-secondary">₹</span>
                                                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="5000"
                                                    className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-xl font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                    autoFocus />
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                {[5000, 10000, 25000].map(val => (
                                                    <button key={val} onClick={() => setAmount(val.toString())}
                                                        className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors">
                                                        +₹{val / 1000}k
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={handleProceed}
                                            className="w-full py-3 bg-primary text-slate-900 rounded-xl font-bold hover:bg-accent transition-all flex items-center justify-center gap-2">
                                            Next: KYC Verification <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                {/* STEP 2: KYC */}
                                {step === 'kyc' && (
                                    <form onSubmit={handleKycSubmit} className="space-y-4">
                                        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 mb-2">
                                            <User className="h-4 w-4 text-primary flex-shrink-0" />
                                            <p className="text-xs text-primary">KYC required as per RBI guidelines for deposits above ₹10,000</p>
                                        </div>

                                        {kycError && (
                                            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{kycError}</p>
                                        )}

                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1">PAN Number *</label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                <input value={pan} onChange={e => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F"
                                                    maxLength={10}
                                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm font-mono tracking-widest focus:ring-2 focus:ring-primary outline-none text-white placeholder-slate-600" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1">Date of Birth *</label>
                                            <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none text-white" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1">Bank Account Number *</label>
                                            <input value={bankAcc} onChange={e => setBankAcc(e.target.value)} placeholder="e.g. 123456789012"
                                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary outline-none text-white placeholder-slate-600" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1">IFSC Code *</label>
                                            <input value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} placeholder="HDFC0001234"
                                                maxLength={11}
                                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm font-mono tracking-widest focus:ring-2 focus:ring-primary outline-none text-white placeholder-slate-600" />
                                        </div>

                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setStep('amount')}
                                                className="flex-1 py-2.5 border border-slate-600 text-text-secondary rounded-xl text-sm hover:text-white transition-colors">
                                                Back
                                            </button>
                                            <button type="submit"
                                                className="flex-1 py-2.5 bg-primary text-slate-900 rounded-xl font-bold text-sm hover:bg-accent transition-all flex items-center justify-center gap-2">
                                                Verify KYC <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* STEP 3: Payment Method */}
                                {step === 'method' && (
                                    <div className="space-y-3">
                                        <p className="text-sm text-text-secondary mb-1">Select payment method for <span className="text-white font-bold">₹{amount}</span></p>
                                        {PAYMENT_METHODS.map(method => (
                                            <button key={method.id} onClick={() => handleDeposit(method)} disabled={processing}
                                                className="w-full flex items-center gap-4 p-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 hover:border-primary/50 rounded-xl transition-all group disabled:opacity-50">
                                                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors flex-shrink-0">{method.icon}</div>
                                                <div className="flex-grow text-left">
                                                    <p className="font-semibold group-hover:text-primary transition-colors text-sm">{method.name}</p>
                                                    <p className="text-xs text-text-secondary">{method.description}</p>
                                                </div>
                                                {processing && <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent flex-shrink-0" />}
                                            </button>
                                        ))}
                                        <button onClick={() => setStep('kyc')} className="w-full py-2 text-text-secondary hover:text-white text-sm">Back</button>
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
