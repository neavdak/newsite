import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Building2, Mail, Lock, ArrowRight, Loader2, Shield, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_EMAIL = 'admin@propickx.com';
const ADMIN_PASSWORD = 'admin123';

export default function Login() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || (isAdmin ? '/admin' : '/dashboard');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            if (isAdmin) {
                if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    login(email, password, true);
                    navigate('/admin', { replace: true });
                } else {
                    setError('Invalid admin credentials.');
                }
            } else {
                const success = login(email, password);
                if (success) navigate(from, { replace: true });
                else setError('Invalid email or password.');
            }
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-background">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center group mb-6">
                    <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg mr-2">
                        <Building2 className="h-6 w-6 text-background" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        PropickX
                    </span>
                </Link>

                {/* Mode Toggle */}
                <div className="flex bg-surface border border-slate-700 rounded-xl p-1 mb-6 mx-auto max-w-xs">
                    <button
                        onClick={() => { setIsAdmin(false); setError(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${!isAdmin ? 'bg-primary text-slate-900 shadow' : 'text-text-secondary hover:text-white'}`}
                    >
                        <User className="h-4 w-4" /> Investor
                    </button>
                    <button
                        onClick={() => { setIsAdmin(true); setError(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${isAdmin ? 'bg-accent text-slate-900 shadow' : 'text-text-secondary hover:text-white'}`}
                    >
                        <Shield className="h-4 w-4" /> Admin
                    </button>
                </div>

                <h2 className="text-center text-2xl font-extrabold text-white mb-1">
                    {isAdmin ? 'Admin Sign In' : 'Sign in to your account'}
                </h2>
                {!isAdmin && (
                    <p className="text-center text-sm text-text-secondary mb-2">
                        Or{' '}
                        <Link to="/signup" className="font-medium text-primary hover:text-accent transition-colors">
                            create a new account
                        </Link>
                    </p>
                )}
                {isAdmin && (
                    <p className="text-center text-xs text-text-secondary mb-2">
                        Use <span className="text-accent font-mono">{ADMIN_EMAIL}</span> / <span className="font-mono text-accent">{ADMIN_PASSWORD}</span>
                    </p>
                )}
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    key={isAdmin ? 'admin' : 'user'}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`py-8 px-6 shadow-2xl rounded-2xl border ${isAdmin ? 'bg-amber-950/20 border-accent/30' : 'bg-surface border-slate-700'}`}
                >
                    {isAdmin && (
                        <div className="flex items-center gap-2 mb-4 bg-accent/10 border border-accent/20 rounded-xl px-4 py-2">
                            <Shield className="h-4 w-4 text-accent flex-shrink-0" />
                            <p className="text-xs text-accent font-medium">Restricted access — Admin Portal only</p>
                        </div>
                    )}

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 mb-4"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <input
                                    type="email" required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder={isAdmin ? ADMIN_EMAIL : 'you@example.com'}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-600 rounded-lg bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <input
                                    type="password" required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-600 rounded-lg bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center gap-2 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isAdmin ? 'bg-accent hover:bg-yellow-400 text-slate-900' : 'bg-primary hover:bg-accent text-slate-900'}`}
                        >
                            {loading
                                ? <Loader2 className="h-5 w-5 animate-spin" />
                                : <>{isAdmin ? 'Access Admin Portal' : 'Sign In'} <ArrowRight className="h-4 w-4" /></>
                            }
                        </button>
                    </form>

                    {!isAdmin && (
                        <div className="mt-6 text-center">
                            <p className="text-xs text-text-secondary">Demo: any email + any password ≥ 6 chars</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
