import { useState, useEffect, useRef } from 'react';

const KNOWLEDGE_BASE = {
    "how to invest": "To invest on PropickX: 1. Browse properties in the Marketplace. 2. Select a property and click 'Buy Shares'. 3. Enter your amount (min ₹500). 4. Confirm with your wallet balance. You'll start earning rental income immediately!",
    "fractional ownership": "Fractional ownership allows you to own a percentage of a high-value property. Instead of buying the whole building, you buy shares. You get legal ownership via an SPV and earn proportional rent and appreciation.",
    "rental income": "Rental income is distributed monthly based on your equity stake. For example, if you own 0.1% of a property earning ₹1,00,000 rent, you get ₹100 directly in your wallet every month.",
    "withdraw": "You can withdraw funds from your Wallet page (/wallet). Click 'Withdraw to Bank' and enter the amount. Funds are typically transferred to your linked bank account within 24-48 hours.",
    "is it safe": "Yes! All properties are backed by physical assets. Legal ownership is managed through an SPV, and your investment is documented with a digital certificate and unique barcode.",
    "what is sip": "A Systematic Investment Plan (SIP) lets you invest a fixed amount every month automatically. This helps you build a large real estate portfolio over time without a large upfront cost.",
    "ipo": "IPO (Initial Property Offering) lets you apply for shares in brand-new properties before they open to the secondary market. Look for properties with a 'IPO Live' badge in the Marketplace.",
    "certificate": "Once you own shares in a property, you can generate an Ownership Certificate from the Property Details page. It includes your equity stake, a unique certificate number, and a barcode for verification.",
    "minimum investment": "The minimum investment on PropickX is ₹500. You can start building a diversified real estate portfolio with as little as ₹500 per property.",
    "dashboard": "Your Dashboard shows your portfolio value, monthly dividends, properties owned, and recent transactions. Sign in to access it.",
};

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hi! I'm your PropickX AI Advisor. How can I help you build your real estate portfolio today? 🏠" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = (text) => {
        const userMsg = text || input;
        if (!userMsg.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const query = userMsg.toLowerCase();
            let response = "I'm still learning about that! Try asking me about investments, SIPs, rental income, IPOs, or how fractional ownership works.";

            for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
                if (query.includes(key)) {
                    response = value;
                    break;
                }
            }

            setMessages(prev => [...prev, { role: 'ai', text: response }]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-[1000] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-lg"
                style={{
                    background: isOpen ? 'white' : 'var(--primary)',
                    color: isOpen ? 'black' : 'white',
                    boxShadow: isOpen ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 40px rgba(139,92,246,0.5)',
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
                title="PropickX AI Advisor"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-28 right-8 w-[90vw] sm:w-[380px] flex flex-col overflow-hidden z-[999] rounded-2xl border border-white/10"
                    style={{
                        height: '520px',
                        maxHeight: '70vh',
                        background: '#0f0f1a',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                        animation: 'slideInUp 0.3s ease-out'
                    }}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex items-center gap-3" style={{ background: 'rgba(139,92,246,0.1)' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'var(--primary)' }}>
                            🤖
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">PropickX AI Advisor</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--secondary)' }}></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className="max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed"
                                    style={msg.role === 'user' ? {
                                        background: 'var(--primary)',
                                        color: 'white',
                                        borderBottomRightRadius: '4px'
                                    } : {
                                        background: 'rgba(255,255,255,0.07)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderBottomLeftRadius: '4px'
                                    }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div className="flex gap-1">
                                        {[0, 1, 2].map(i => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 rounded-full animate-bounce"
                                                style={{ background: 'var(--primary)', animationDelay: `${i * 0.15}s` }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Tags */}
                    <div className="px-4 py-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                        {["How to invest?", "What is SIP?", "Is it safe?", "Rental Income", "IPO"].map(tag => (
                            <button
                                key={tag}
                                onClick={() => handleSend(tag)}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold transition-all hover:scale-105 active:scale-95"
                                style={{
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'rgba(255,255,255,0.6)'
                                }}
                                onMouseEnter={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'white'; }}
                                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = 'rgba(255,255,255,0.6)'; }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 pt-2">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend('')}
                                placeholder="Ask me anything..."
                                className="w-full rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none transition-all"
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                            <button
                                onClick={() => handleSend('')}
                                className="absolute right-2 top-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-90"
                                style={{ background: 'var(--primary)' }}
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-[9px] text-center mt-2 opacity-40 font-bold uppercase tracking-widest text-white">Powered by PropickX AI</p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}
