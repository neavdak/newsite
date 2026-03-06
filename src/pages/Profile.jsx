import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Shield, Bell, LogOut, Camera, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';

export default function Profile() {
    const { user, logout, showToast } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: ''
    });

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleSave = (e) => {
        e.preventDefault();
        setIsEditing(false);
        showToast('Profile updated successfully', 'success');
    };

    return (
        <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface rounded-2xl border border-slate-700 overflow-hidden shadow-xl"
                >
                    {/* Header Background */}
                    <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 relative">
                        <div className="absolute -bottom-16 left-8 flex items-end">
                            <div className="relative group">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-32 w-32 rounded-full border-4 border-surface shadow-xl object-cover"
                                />
                                <button className="absolute bottom-2 right-2 p-2 bg-slate-800 rounded-full border border-slate-600 hover:bg-slate-700 transition-colors">
                                    <Camera className="h-4 w-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-8 pb-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-3xl font-bold">{user.name}</h1>
                                <p className="text-text-secondary">Member since {new Date(user.joinedDate).toLocaleDateString()}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Settings */}
                            <div className="lg:col-span-2 space-y-6">
                                <section className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                                    <h2 className="text-xl font-bold mb-6 flex items-center">
                                        <User className="h-5 w-5 mr-2 text-primary" />
                                        Personal Information
                                    </h2>
                                    <form onSubmit={handleSave} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditing}
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    disabled
                                                    value={formData.email}
                                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 opacity-50 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            {isEditing ? (
                                                <div className="flex space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsEditing(false)}
                                                        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 bg-primary text-slate-900 rounded-lg font-bold text-sm hover:bg-accent flex items-center"
                                                    >
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Save Changes
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium text-sm hover:bg-slate-600"
                                                >
                                                    Edit Profile
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </section>

                                <section className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                                    <h2 className="text-xl font-bold mb-6 flex items-center">
                                        <Shield className="h-5 w-5 mr-2 text-secondary" />
                                        Security
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
                                            <input
                                                type="password"
                                                placeholder="Enter new password"
                                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 outline-none"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button className="text-primary text-sm hover:underline">
                                                Update Password
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Sidebar Settings */}
                            <div className="space-y-6">
                                <section className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <User className="w-24 h-24" />
                                    </div>
                                    <h2 className="text-xl font-bold mb-2 flex items-center text-white">
                                        Refer & Earn
                                    </h2>
                                    <p className="text-sm text-text-secondary mb-4">
                                        Invite friends to BrickX and you'll both get <span className="text-primary font-bold">₹500</span> when they make their first investment.
                                    </p>
                                    <div className="bg-slate-900/80 rounded-lg p-3 flex items-center justify-between mb-4 border border-slate-700">
                                        <code className="text-primary font-mono font-bold">BRICKX-{user.name.split(' ')[0].toUpperCase()}2024</code>
                                        <button
                                            onClick={() => showToast('Referral code copied!', 'success')}
                                            className="text-xs text-text-secondary hover:text-white"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <button className="w-full py-2 bg-primary text-slate-900 rounded-lg font-bold text-sm hover:bg-accent transition-colors shadow-lg shadow-primary/20">
                                        Invite Friends
                                    </button>
                                </section>

                                <section className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                                    <h2 className="text-xl font-bold mb-6 flex items-center">
                                        <Bell className="h-5 w-5 mr-2 text-accent" />
                                        Notifications
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            'Investment Updates',
                                            'Dividend Payments',
                                            'New Properties',
                                            'Marketing Emails'
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span className="text-sm text-text-secondary">{item}</span>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                                    <input
                                                        type="checkbox"
                                                        name={`toggle-${i}`}
                                                        id={`toggle-${i}`}
                                                        defaultChecked={i < 2}
                                                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-primary right-5"
                                                    />
                                                    <label
                                                        htmlFor={`toggle-${i}`}
                                                        className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-700 cursor-pointer checked:bg-primary/20"
                                                    ></label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
                                    <h3 className="font-bold text-primary mb-2">Need Verification?</h3>
                                    <p className="text-sm text-text-secondary mb-4">Complete your KYC verification to increase your investment limits.</p>
                                    <button className="w-full py-2 bg-primary/20 text-primary rounded-lg font-bold text-sm hover:bg-primary/30 transition-colors">
                                        Start Verification
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
