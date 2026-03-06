import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROPERTIES } from '../data/properties';
import { Link, Navigate } from 'react-router-dom';

export default function Advisor() {
    const { user } = useApp();

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: `Hello ${user?.name ? user.name.split(' ')[0] : 'investor'}! I'm your AI Real Estate Advisor. Tell me about your investment goals, risk tolerance, or budget, and I'll recommend the best properties for you.`
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI processing
        setTimeout(() => {
            const aiResponse = generateAIResponse(input);
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 2000);
    };

    const generateAIResponse = (query) => {
        const lowerQuery = query.toLowerCase();
        let text = "";
        let recommendations = [];

        // Analysis Keywords (English & Hinglish)
        const isBudget = lowerQuery.match(/(budget|cheap|affordable|low cost|less money|start|small|sasta|kam paise|kam price)/);
        const isGrowth = lowerQuery.match(/(growth|appreciate|value|future|long term|badhega|growth milega)/);
        const isYield = lowerQuery.match(/(yield|apy|return|profit|monthly|income|generate|rent|munafa|fayda)/);
        const isSafe = lowerQuery.match(/(safe|stable|risk|secure|guaranteed|surakshit)/);
        const isCommercial = lowerQuery.match(/(commercial|office|shop|retail|dukan|godown)/);
        const isVacation = lowerQuery.match(/(vacation|hotel|resort|tourism|goa|holiday|ghumne)/);
        const isGreeting = lowerQuery.match(/(hi|hello|hey|namaste|kaiso|kaise|start|help)/);

        if (isGreeting) {
            text = "Namaste! 🙏 I can help you find the best property for your budget. Are you looking for high rental income (Rent) or long-term growth?";
            recommendations = [];
        } else if (isVacation) {
            text = "For tourism-focused investments, hospitality assets in places like Goa are performing extremely well. Check this out:";
            recommendations = PROPERTIES.filter(p => p.type === 'Hospitality' || p.type === 'Vacation').slice(0, 2);
        } else if (isCommercial) {
            text = "Commercial real estate (Offices/Shops) in business hubs like Gurgaon offers excellent stability. Here is a prime pick:";
            recommendations = PROPERTIES.filter(p => p.type === 'Commercial' || p.type === 'Industrial').slice(0, 2);
        } else if (isBudget) {
            text = "Starting small is a smart move. Here are some high-potential fractional ownership opportunities under ₹10,000/share:";
            recommendations = PROPERTIES.sort((a, b) => a.price - b.price).slice(0, 2);
        } else if (isYield) {
            text = "If monthly income (Rent) is your priority, these assets are currently generating the highest annual yields (APY):";
            recommendations = PROPERTIES.sort((a, b) => b.apy - a.apy).slice(0, 2);
        } else if (isSafe) {
            text = "For capital preservation, I recommend established residential and industrial assets with lower volatility:";
            recommendations = PROPERTIES.filter(p => p.type === 'Residential' || p.type === 'Industrial').slice(0, 2);
        } else if (isGrowth) {
            text = "For maximum capital appreciation, emerging markets and tech hubs are the way to go. These properties have high growth forecasts:";
            recommendations = PROPERTIES.filter(p => p.change > 2.0).slice(0, 2);
        } else {
            // Smarter Fallback
            text = "I can help you find high-yield properties, budget-friendly options, or commercial assets. What is your primary goal?";
            // Don't show random recommendations to keep the chat clean
            recommendations = [];
        }

        // Fallback if filter returned nothing but user asked for specific intent
        if (recommendations.length === 0 && !text.includes("primary goal") && !text.includes("Namaste")) {
            text = "I looked for specific matches but couldn't find exact ones. However, these are our top-performing assets right now:";
            recommendations = [PROPERTIES[0], PROPERTIES[4]];
        }

        return {
            id: Date.now() + 1,
            sender: 'bot',
            text,
            recommendations
        };
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-surface rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-bold">BrickX AI Advisor</h1>
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Online
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-accent/20' : 'bg-primary/20'
                                    }`}>
                                    {msg.sender === 'user' ? (
                                        <User className={`h-4 w-4 ${msg.sender === 'user' ? 'text-accent' : 'text-primary'}`} />
                                    ) : (
                                        <Bot className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-2xl ${msg.sender === 'user'
                                        ? 'bg-accent/10 border border-accent/20 rounded-tr-none text-white'
                                        : 'bg-slate-800 border border-slate-700 rounded-tl-none text-text-secondary'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                    </div>

                                    {/* Recommendations */}
                                    {msg.recommendations && (
                                        <div className="space-y-3">
                                            {msg.recommendations.map(property => (
                                                <Link to={`/property/${property.id}`} key={property.id} className="block group">
                                                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex gap-4 hover:border-primary transition-colors">
                                                        <img
                                                            src={property.image}
                                                            alt={property.title}
                                                            className="w-20 h-20 rounded-lg object-cover"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold truncate group-hover:text-primary transition-colors">{property.title}</h4>
                                                            <p className="text-xs text-text-secondary mb-2">{property.location}</p>
                                                            <div className="flex items-center gap-4 text-xs">
                                                                <span className="text-secondary font-bold">{property.apy}% APY</span>
                                                                <span className="text-text-primary font-mono">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(property.price)}/share</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-center px-2 text-text-secondary group-hover:text-primary">
                                                            <TrendingUp className="h-5 w-5" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 border-t border-slate-700 bg-surface">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for advice..."
                            className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="bg-primary hover:bg-accent text-slate-900 rounded-xl px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
