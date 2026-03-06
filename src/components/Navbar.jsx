import { Link, useLocation } from 'react-router-dom';
import {
    Building2, Wallet, Menu, X, ChevronRight,
    User, LogOut, ChevronDown, Settings, Plus, ExternalLink
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import WalletModal from './WalletModal';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [walletModalOpen, setWalletModalOpen] = useState(false);
    const [walletMenuOpen, setWalletMenuOpen] = useState(false);
    const location = useLocation();
    const { wallet, showToast, user, logout } = useApp();

    const links = [
        { name: 'Marketplace', path: '/marketplace' },
        { name: 'Advisor', path: '/advisor' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Learn', path: '/learn' },
        { name: 'About', path: '/about' },
    ];

    const handleLogout = () => {
        logout();
        setWalletMenuOpen(false);
        setIsOpen(false);
    };

    return (
        <nav className="fixed w-full z-40 bg-background/80 backdrop-blur-md border-b border-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-shadow">
                            <Building2 className="h-6 w-6 text-background" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            PropickX
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

                        {user ? (
                            <div className="flex items-center gap-4">
                                {/* Wallet Badge — click to go to Wallet page or top up via modal */}
                                <div className="flex items-center gap-1">
                                    <Link
                                        to="/wallet"
                                        className="flex items-center gap-2 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full transition-colors group"
                                        title="View Wallet"
                                    >
                                        <div className="bg-primary/20 p-1 rounded-full group-hover:bg-primary/30 text-primary">
                                            <Wallet className="h-4 w-4" />
                                        </div>
                                        <span className="font-mono font-bold text-sm">{formatCurrency(wallet.balance)}</span>
                                    </Link>
                                    <button
                                        onClick={() => setWalletModalOpen(true)}
                                        className="bg-primary text-slate-900 rounded-full p-1 hover:bg-accent transition-colors"
                                        title="Add funds"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                                        className="flex items-center space-x-2 bg-surface hover:bg-slate-700 text-text-primary px-2 py-1.5 rounded-full border border-slate-700 transition-all hover:border-primary/50"
                                    >
                                        <img src={user.avatar} alt="User" className="h-8 w-8 rounded-full border border-slate-600" />
                                        <ChevronDown className="h-4 w-4 text-text-secondary" />
                                    </button>

                                    <AnimatePresence>
                                        {walletMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-56 bg-surface border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
                                            >
                                                <div className="p-4 border-b border-slate-700">
                                                    <p className="font-bold text-white truncate">{user.name}</p>
                                                    <p className="text-xs text-text-secondary truncate">{user.email}</p>
                                                </div>

                                                <div className="py-1">
                                                    <Link
                                                        to="/dashboard"
                                                        onClick={() => setWalletMenuOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors text-sm"
                                                    >
                                                        <User className="h-4 w-4" />
                                                        <span>Dashboard</span>
                                                    </Link>
                                                    <Link
                                                        to="/profile"
                                                        onClick={() => setWalletMenuOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors text-sm"
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                        <span>Settings</span>
                                                    </Link>
                                                    {user.isAdmin && (
                                                        <Link
                                                            to="/admin"
                                                            onClick={() => setWalletMenuOpen(false)}
                                                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors text-sm text-accent"
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                            <span>Admin Portal</span>
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition-colors text-sm text-red-400"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        <span>Sign Out</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-2 bg-primary hover:bg-accent text-slate-900 font-bold px-4 py-2 rounded-full transition-all shadow-lg shadow-primary/20"
                            >
                                <User className="h-4 w-4" />
                                <span>Sign In</span>
                            </Link>
                        )}
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
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-xs text-text-secondary">Total Balance</p>
                                                    <p className="font-mono text-xl font-bold text-white">{formatCurrency(wallet.balance)}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setWalletModalOpen(true);
                                                        setIsOpen(false);
                                                    }}
                                                    className="bg-primary text-slate-900 p-2 rounded-lg hover:bg-accent transition-colors"
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setIsOpen(false)}
                                                    className="bg-slate-700/50 p-2 rounded-lg text-center text-sm hover:bg-slate-700 transition-colors"
                                                >
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setIsOpen(false)}
                                                    className="bg-slate-700/50 p-2 rounded-lg text-center text-sm hover:bg-slate-700 transition-colors"
                                                >
                                                    Profile
                                                </Link>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center space-x-2 bg-red-500/10 text-red-400 font-bold px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="w-full flex items-center justify-center space-x-2 bg-primary text-background font-bold px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <User className="h-5 w-5" />
                                        <span>Sign In</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Wallet Modal */}
            <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
        </nav>
    );
}
