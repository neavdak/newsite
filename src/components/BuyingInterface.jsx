import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function BuyingInterface({ onClose, property }) {
    const { wallet, updateBalance, addToPortfolio, addTransaction, showToast } = useApp();
    const [amount, setAmount] = useState('500');
    const [isSip, setIsSip] = useState(false);
    const [isPressed, setIsPressed] = useState(null);
    const platformFee = 20;

    const totalPropertyValuation = property?.totalValue
        ? parseFloat(property.totalValue.replace(/[^0-9.]/g, '')) * 10000000
        : 10000000;
    const investmentAmount = parseFloat(amount) || 0;
    const stakePercentage = totalPropertyValuation > 0 ? (investmentAmount / totalPropertyValuation) * 100 : 0;
    const totalRequired = investmentAmount + platformFee;
    const monthlyRental = investmentAmount * ((property?.apy || 12) / 100) / 12;

    const handleKeypad = (val) => {
        setIsPressed(val);
        setTimeout(() => setIsPressed(null), 120);

        setAmount(prev => {
            if (val === '⌫') {
                if (prev.length <= 1) return '0';
                return prev.slice(0, -1);
            }
            if (val === 'C') return '0';
            if (prev === '0') return val;
            if (prev.length >= 9) return prev;
            return prev + val;
        });
    };

    const addQuickAmount = (val) => {
        setAmount(prev => {
            const current = parseFloat(prev) || 0;
            return (current + val).toString();
        });
    };

    const handleConfirm = () => {
        if (investmentAmount < 500) {
            showToast('Minimum investment is ₹500', 'error');
            return;
        }
        if (wallet.balance < totalRequired) {
            showToast('Insufficient wallet balance', 'error');
            return;
        }

        const sharesQty = investmentAmount / (property?.price || 500);
        addToPortfolio(property.id, sharesQty, property?.price || 500);
        addTransaction({
            id: `tx-${Date.now()}`,
            propertyId: property.id,
            propertyTitle: property.title,
            type: isSip ? 'sip' : 'buy',
            amount: totalRequired,
            shares: sharesQty,
            price: property?.price || 500,
            date: new Date().toISOString(),
            status: 'completed'
        });
        updateBalance(wallet.balance - totalRequired);

        showToast(
            isSip
                ? `SIP of ₹${investmentAmount.toLocaleString()}/mo started for ${property.title}! 🎉`
                : `Invested ₹${investmentAmount.toLocaleString()} in ${property.title}! 🎉`,
            'success'
        );
        onClose();
    };

    const canInvest = wallet.balance >= totalRequired && investmentAmount >= 500;

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
                style={{
                    background: '#0d0d1a',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
                    animation: 'slideUpModal 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <div className="p-6 pb-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(139,92,246,0.15)' }}>🏢</div>
                            <div>
                                <h2 className="text-base font-bold text-white leading-tight">{property?.title}</h2>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                                    {isSip ? 'Monthly SIP' : 'One-time Investment'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-white transition-colors"
                            style={{ background: 'rgba(255,255,255,0.06)' }}
                        >✕</button>
                    </div>

                    {/* SIP / One-Time Toggle */}
                    <div className="flex gap-1.5 p-1 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <button
                            onClick={() => setIsSip(false)}
                            className="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            style={!isSip ? { background: 'rgba(255,255,255,0.1)', color: 'white' } : { color: 'rgba(255,255,255,0.4)' }}
                        >One-Time</button>
                        <button
                            onClick={() => setIsSip(true)}
                            className="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            style={isSip ? { background: 'var(--primary)', color: 'white', boxShadow: '0 0 20px rgba(139,92,246,0.4)' } : { color: 'rgba(255,255,255,0.4)' }}
                        >Monthly SIP</button>
                    </div>

                    {/* Amount Display */}
                    <div className="text-center mb-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">
                            {isSip ? 'Installment Amount' : 'Investment Amount'}
                        </p>
                        <div className="flex items-center justify-center gap-2 h-16">
                            <span className="text-3xl font-black" style={{ color: 'rgba(139,92,246,0.5)' }}>₹</span>
                            <span className="text-6xl font-black tracking-tight text-white">{parseFloat(amount).toLocaleString()}</span>
                            <div className="w-0.5 h-10 rounded animate-pulse ml-1" style={{ background: 'var(--primary)', opacity: 0.6 }}></div>
                        </div>
                        <div className="mt-2 flex flex-col items-center gap-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <span className="text-xs font-black" style={{ color: 'var(--primary)' }}>{stakePercentage.toFixed(5)}%</span>
                                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Equity Stake</span>
                            </div>
                            {investmentAmount > 0 && (
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                                    <span className="text-xs font-black text-secondary">~₹{monthlyRental.toFixed(0)}/mo</span>
                                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Rental Est.</span>
                                </div>
                            )}
                            {investmentAmount < 500 && investmentAmount > 0 && (
                                <p className="text-[10px] text-red-400 font-bold uppercase mt-1">Min. Investment ₹500</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Add Chips */}
                    <div className="flex justify-center gap-2 mb-5">
                        {[1000, 5000, 10000].map(val => (
                            <button
                                key={val}
                                onClick={() => addQuickAmount(val)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                            >
                                +₹{(val / 1000).toFixed(0)}k
                            </button>
                        ))}
                    </div>

                    {/* Numeric Keypad */}
                    <div className="grid grid-cols-3 gap-y-2 gap-x-4 mb-5 max-w-xs mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '⌫'].map(k => (
                            <button
                                key={k.toString()}
                                onClick={() => handleKeypad(k.toString())}
                                className="h-12 flex items-center justify-center font-black text-xl rounded-2xl transition-all relative"
                                style={isPressed === k.toString()
                                    ? { background: 'rgba(139,92,246,0.2)', color: 'var(--primary)', transform: 'scale(0.9)' }
                                    : { background: 'transparent', color: 'white' }
                                }
                                onMouseEnter={e => { if (isPressed !== k.toString()) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                onMouseLeave={e => { if (isPressed !== k.toString()) e.currentTarget.style.background = 'transparent'; }}
                            >
                                {k}
                            </button>
                        ))}
                    </div>

                    {/* Summary & Action */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-2">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary block">Wallet</span>
                                <span className="text-white font-black">₹{wallet.balance.toLocaleString()}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary block">Total Payable</span>
                                <span className="text-white font-black">₹{totalRequired.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={!canInvest}
                            className="w-full py-4 rounded-2xl text-base font-black uppercase tracking-widest transition-all"
                            style={canInvest
                                ? { background: 'var(--primary)', color: 'white', boxShadow: '0 0 30px rgba(139,92,246,0.35)' }
                                : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', cursor: 'not-allowed' }
                            }
                            onMouseEnter={e => { if (canInvest) e.currentTarget.style.boxShadow = '0 0 50px rgba(139,92,246,0.5)'; }}
                            onMouseLeave={e => { if (canInvest) e.currentTarget.style.boxShadow = '0 0 30px rgba(139,92,246,0.35)'; }}
                        >
                            {!canInvest && wallet.balance < totalRequired ? 'Insufficient Balance' : isSip ? 'Start Monthly SIP' : 'Invest Now'}
                        </button>
                        <p className="text-[9px] text-center text-text-secondary font-bold uppercase tracking-widest">
                            Platform fee ₹{platformFee} • Secure 128-bit Encrypted Transaction
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUpModal {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
