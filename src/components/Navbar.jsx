import { Link, useLocation } from 'react-router-dom';
import { Building2, Menu, X, Wallet } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const links = [
        { name: 'Marketplace', path: '/marketplace' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Learn', path: '/learn' },
    ];

    return (
        <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-shadow">
                            <Building2 className="h-6 w-6 text-background" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            BrickX
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-text-secondary'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button className="flex items-center space-x-2 bg-surface hover:bg-slate-700 text-text-primary px-4 py-2 rounded-full border border-slate-700 transition-all hover:border-primary/50">
                            <Wallet className="h-4 w-4 text-primary" />
                            <span>Connect Wallet</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-text-secondary hover:text-primary transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-surface border-b border-slate-700 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-4">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-base font-medium text-text-secondary hover:text-primary"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-slate-700">
                                <button className="w-full flex items-center justify-center space-x-2 bg-primary text-background font-bold px-4 py-3 rounded-lg hover:bg-accent transition-colors">
                                    <Wallet className="h-5 w-5" />
                                    <span>Connect Wallet</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
