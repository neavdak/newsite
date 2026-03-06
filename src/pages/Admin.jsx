import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2, Plus, Users, DollarSign,
    BarChart2, Settings, Upload, Save,
    CheckCircle, AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

export default function Admin() {
    const { user } = useApp();

    if (!user || !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats] = useState([
        { label: 'Total Properties', value: '24', icon: Building2, color: 'text-primary' },
        { label: 'Total Investors', value: '1,420', icon: Users, color: 'text-secondary' },
        { label: 'Total AUM', value: '₹105 Cr', icon: DollarSign, color: 'text-accent' },
        { label: 'Revenue (MTD)', value: '₹1.2 Cr', icon: BarChart2, color: 'text-green-400' },
    ]);

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-background pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Settings className="h-8 w-8 text-primary" />
                        Admin Portal
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">Logged in as</span>
                        <span className="font-bold text-white bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                            {user?.name || 'Admin'}
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-surface border border-slate-700 p-6 rounded-2xl shadow-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
                                        <p className="text-2xl font-bold font-mono mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-slate-900 ${stat.color}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
                            { id: 'properties', label: 'Manage Properties', icon: Building2 },
                            { id: 'users', label: 'User Management', icon: Users },
                            { id: 'settings', label: 'System Settings', icon: Settings },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === item.id
                                    ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
                                    : 'bg-surface text-text-secondary hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 bg-surface border border-slate-700 rounded-2xl p-6 min-h-[500px]">
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-text-secondary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">New User Registration</p>
                                                    <p className="text-xs text-text-secondary">User #2049 verified their email</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-text-secondary">2 mins ago</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'properties' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Property Listings</h2>
                                    <button className="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-accent transition-colors">
                                        <Plus className="h-5 w-5" />
                                        Add Property
                                    </button>
                                </div>
                                <div className="border border-dashed border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                                    <Upload className="h-12 w-12 text-slate-600 mb-4" />
                                    <h3 className="text-lg font-bold mb-2">Upload New Property</h3>
                                    <p className="text-text-secondary max-w-sm mb-6">
                                        Drag and drop property images and documents here, or click to browse.
                                    </p>
                                    <button className="text-primary hover:underline">
                                        Browse Files
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">User Management</h2>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-text-secondary text-sm border-b border-slate-700">
                                            <th className="pb-3 pl-2">User</th>
                                            <th className="pb-3">Status</th>
                                            <th className="pb-3">Invested</th>
                                            <th className="pb-3 text-right pr-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {[1, 2, 3].map(i => (
                                            <tr key={i} className="group hover:bg-slate-900/50 transition-colors">
                                                <td className="py-3 pl-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-700" />
                                                        <div>
                                                            <p className="font-bold text-sm">Investor {i}</p>
                                                            <p className="text-xs text-text-secondary">investor{i}@example.com</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="py-3 font-mono text-sm">₹3,50,000</td>
                                                <td className="py-3 text-right pr-2">
                                                    <button className="text-text-secondary hover:text-white">Edit</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold mb-4">Platform Settings</h2>
                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold">Maintenance Mode</p>
                                            <p className="text-xs text-text-secondary">Disable platform access for all users</p>
                                        </div>
                                        <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                                            <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold">Allow New Registrations</p>
                                            <p className="text-xs text-text-secondary">Enable or disable new user signups</p>
                                        </div>
                                        <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                                            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button className="flex items-center gap-2 bg-primary text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-accent transition-colors">
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
