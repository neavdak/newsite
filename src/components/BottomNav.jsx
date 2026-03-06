import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, PieChart, BookOpen, Menu, ShieldCheck, Bot, Calculator, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BottomNav() {
    const location = useLocation();
    const [moreOpen, setMoreOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: '/', icon: <Home className="h-6 w-6" /> },
        { name: 'Market', path: '/marketplace', icon: <ShoppingBag className="h-6 w-6" /> },
        { name: 'Portfolio', path: '/dashboard', icon: <PieChart className="h-6 w-6" /> },
        { name: 'Advisor', path: '/advisor', icon: <Bot className="h-6 w-6" /> },
    ];

    return (
        <>
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-lg border-t border-slate-800 pb-safe z-50">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className={`${isActive ? 'bg-primary/10 rounded-full p-1' : ''}`}
                                >
                                    {item.icon}
                                </motion.div>
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={() => setMoreOpen(!moreOpen)}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${moreOpen ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <motion.div whileTap={{ scale: 0.9 }}>
                            <Menu className="h-6 w-6" />
                        </motion.div>
                        <span className="text-[10px] font-medium">More</span>
                    </button>
                </div>
            </div>

            {/* More Menu Overlay */}
            <AnimatePresence>
                {moreOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMoreOpen(false)}
                            className="fixed inset-0 bg-black/60 z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl z-50 md:hidden pb-20 border-t border-slate-700"
                        >
                            <div className="p-4">
                                <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6" />
                                <div className="space-y-4">
                                    <Link
                                        to="/calculator"
                                        onClick={() => setMoreOpen(false)}
                                        className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                            <Calculator className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Rent Calculator</p>
                                            <p className="text-xs text-text-secondary">Estimate rental returns</p>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/market"
                                        onClick={() => setMoreOpen(false)}
                                        className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                                            <ArrowUpDown className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Secondary Market</p>
                                            <p className="text-xs text-text-secondary">Buy & sell shares</p>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/about"
                                        onClick={() => setMoreOpen(false)}
                                        className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                            <Menu className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold">About Us</p>
                                            <p className="text-xs text-text-secondary">Our mission and team</p>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/legal"
                                        onClick={() => setMoreOpen(false)}
                                        className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Legal</p>
                                            <p className="text-xs text-text-secondary">Terms and Privacy</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
