import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Building2, Plus, Users, DollarSign,
    BarChart2, Settings, Save,
    CheckCircle, Upload, X, ImagePlus, Loader2, Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

// ─── Drag-and-Drop Photo Upload ───────────────────────────────────────────────
function PhotoUploader({ photos, setPhotos }) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef();

    const addFiles = (files) => {
        const images = Array.from(files).filter(f => f.type.startsWith('image/'));
        images.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => setPhotos(prev => [...prev, { url: e.target.result, name: file.name }]);
            reader.readAsDataURL(file);
        });
    };

    const onDrop = useCallback((e) => {
        e.preventDefault(); setDragging(false);
        addFiles(e.dataTransfer.files);
    }, []);

    const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);

    return (
        <div className="space-y-4">
            {/* Drop zone */}
            <div
                onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                onClick={() => inputRef.current.click()}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${dragging ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-slate-600 hover:border-primary/50 hover:bg-slate-900/50'}`}
            >
                <div className={`p-4 rounded-2xl mb-4 transition-all ${dragging ? 'bg-primary/20' : 'bg-slate-800'}`}>
                    <ImagePlus className={`h-8 w-8 ${dragging ? 'text-primary' : 'text-slate-400'}`} />
                </div>
                <p className="text-white font-semibold mb-1">{dragging ? 'Drop photos here!' : 'Drag & drop property photos'}</p>
                <p className="text-text-secondary text-sm">or <span className="text-primary underline">click to browse</span></p>
                <p className="text-xs text-slate-600 mt-2">PNG, JPG, WEBP supported</p>
                <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
            </div>

            {/* Preview grid */}
            {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photos.map((photo, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-slate-900">
                            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={e => { e.stopPropagation(); setPhotos(prev => prev.filter((_, idx) => idx !== i)); }}
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="absolute bottom-1 left-1 right-1 text-[10px] text-white bg-black/50 rounded px-1 truncate">{photo.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Add Property Form ────────────────────────────────────────────────────────
function AddPropertyForm({ onClose }) {
    const { showToast } = useApp();
    const [photos, setPhotos] = useState([]);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ title: '', location: '', type: 'Residential', price: '', apy: '', totalShares: '' });

    const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

    const handleSave = (e) => {
        e.preventDefault();
        if (photos.length === 0) { showToast('Add at least one photo', 'error'); return; }
        setSaving(true);
        setTimeout(() => {
            showToast(`Property "${form.title}" listed successfully!`, 'success');
            setSaving(false);
            onClose();
        }, 1500);
    };

    return (
        <form onSubmit={handleSave} className="space-y-5">
            <h3 className="text-lg font-bold flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Add New Property</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-text-secondary mb-1">Property Title *</label>
                    <input required value={form.title} onChange={set('title')} placeholder="e.g. Skyline Residences, Mumbai"
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Location *</label>
                    <input required value={form.location} onChange={set('location')} placeholder="City, State"
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Type</label>
                    <select value={form.type} onChange={set('type')}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary outline-none">
                        {['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Vacation'].map(t => <option key={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Share Price (₹) *</label>
                    <input required type="number" value={form.price} onChange={set('price')} placeholder="5000"
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Annual Yield (%) *</label>
                    <input required type="number" step="0.1" value={form.apy} onChange={set('apy')} placeholder="8.5"
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Total Shares *</label>
                    <input required type="number" value={form.totalShares} onChange={set('totalShares')} placeholder="10000"
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary outline-none" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">Property Photos *</label>
                <PhotoUploader photos={photos} setPhotos={setPhotos} />
            </div>

            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                    className="flex-1 py-2.5 border border-slate-600 text-text-secondary rounded-xl text-sm hover:text-white transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={saving}
                    className="flex-1 py-2.5 bg-primary text-slate-900 rounded-xl font-bold text-sm hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> List Property</>}
                </button>
            </div>
        </form>
    );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function Admin() {
    const { user } = useApp();
    if (!user || !user.isAdmin) return <Navigate to="/login" replace />;

    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAddForm, setShowAddForm] = useState(false);

    const stats = [
        { label: 'Total Properties', value: '24', icon: Building2, color: 'text-primary' },
        { label: 'Total Investors', value: '1,420', icon: Users, color: 'text-secondary' },
        { label: 'Total AUM', value: '₹105 Cr', icon: DollarSign, color: 'text-accent' },
        { label: 'Revenue (MTD)', value: '₹1.2 Cr', icon: BarChart2, color: 'text-green-400' },
    ];

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
        { id: 'properties', label: 'Properties', icon: Building2 },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-background pb-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                        <Settings className="h-7 w-7 text-primary" /> Admin Portal
                    </h1>
                    <span className="font-bold text-white bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-sm">
                        {user?.name || 'Admin'}
                    </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                className="bg-surface border border-slate-700 p-4 rounded-2xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-text-secondary text-xs font-medium">{stat.label}</p>
                                        <p className="text-xl font-bold font-mono mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-2.5 rounded-xl bg-slate-900 ${stat.color}`}><Icon className="h-5 w-5" /></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar tabs */}
                    <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible lg:col-span-1">
                        {tabs.map(item => (
                            <button key={item.id} onClick={() => { setActiveTab(item.id); setShowAddForm(false); }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm flex-shrink-0 ${activeTab === item.id ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20' : 'bg-surface text-text-secondary hover:bg-slate-800 hover:text-white'}`}>
                                <item.icon className="h-4 w-4 flex-shrink-0" />{item.label}
                            </button>
                        ))}
                    </div>

                    {/* Main panel */}
                    <div className="lg:col-span-3 bg-surface border border-slate-700 rounded-2xl p-5 sm:p-6 min-h-[400px]">
                        {activeTab === 'dashboard' && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                <Users className="h-4 w-4 text-text-secondary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white text-sm">New User Registration</p>
                                                <p className="text-xs text-text-secondary">User #204{i} verified their email</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-text-secondary flex-shrink-0">{i * 2} mins ago</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'properties' && (
                            <div>
                                {showAddForm ? (
                                    <AddPropertyForm onClose={() => setShowAddForm(false)} />
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-lg font-bold">Property Listings</h2>
                                            <button onClick={() => setShowAddForm(true)}
                                                className="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-accent transition-colors text-sm">
                                                <Plus className="h-4 w-4" /> Add Property
                                            </button>
                                        </div>
                                        <div className="border border-dashed border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                                            <Tag className="h-10 w-10 text-slate-600 mb-3" />
                                            <h3 className="text-base font-bold mb-2">No properties added yet</h3>
                                            <p className="text-text-secondary text-sm mb-5 max-w-xs">Click "Add Property" to upload photos and list a new property.</p>
                                            <button onClick={() => setShowAddForm(true)}
                                                className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/20 transition-colors">
                                                <Upload className="h-4 w-4" /> Upload Property
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div>
                                <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                                    <h2 className="text-lg font-bold">User Management</h2>
                                    <input type="text" placeholder="Search users…"
                                        className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary w-full sm:w-auto" />
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="text-text-secondary border-b border-slate-700">
                                                <th className="pb-3 pl-2">User</th>
                                                <th className="pb-3">Status</th>
                                                <th className="pb-3 hidden sm:table-cell">Invested</th>
                                                <th className="pb-3 text-right pr-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {[1, 2, 3].map(i => (
                                                <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                                                    <td className="py-3 pl-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0" />
                                                            <div>
                                                                <p className="font-bold text-sm">Investor {i}</p>
                                                                <p className="text-xs text-text-secondary">investor{i}@example.com</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">Active</span>
                                                    </td>
                                                    <td className="py-3 font-mono hidden sm:table-cell">₹3,50,000</td>
                                                    <td className="py-3 text-right pr-2">
                                                        <button className="text-text-secondary hover:text-white text-xs">Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-bold mb-4">Platform Settings</h2>
                                <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 space-y-5">
                                    {[
                                        { label: 'Maintenance Mode', desc: 'Disable platform access for all users', on: false },
                                        { label: 'Allow New Registrations', desc: 'Enable or disable new user signups', on: true },
                                    ].map(s => (
                                        <div key={s.label} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-sm">{s.label}</p>
                                                <p className="text-xs text-text-secondary">{s.desc}</p>
                                            </div>
                                            <div className={`w-11 h-6 rounded-full relative cursor-pointer ${s.on ? 'bg-primary' : 'bg-slate-700'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${s.on ? 'right-1' : 'left-1'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end">
                                    <button className="flex items-center gap-2 bg-primary text-slate-900 px-5 py-2 rounded-lg font-bold hover:bg-accent transition-colors text-sm">
                                        <Save className="h-4 w-4" /> Save Changes
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
