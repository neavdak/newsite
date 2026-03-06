import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Vacation'];
const SORT_OPTIONS = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'apy-desc', label: 'APY: High to Low' },
    { value: 'apy-asc', label: 'APY: Low to High' },
    { value: 'change-desc', label: 'Top Gainers' },
    { value: 'change-asc', label: 'Top Losers' }
];

export default function FilterModal({ isOpen, onClose, filters, onApplyFilters }) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleApply = () => {
        onApplyFilters(localFilters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters = {
            priceRange: [0, 500],
            apyRange: [0, 15],
            types: [],
            sortBy: 'price-asc'
        };
        setLocalFilters(resetFilters);
        onApplyFilters(resetFilters);
    };

    const toggleType = (type) => {
        setLocalFilters(prev => ({
            ...prev,
            types: prev.types.includes(type)
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type]
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-surface border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-surface z-10">
                                <div className="flex items-center gap-3">
                                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                                    <h3 className="text-xl font-bold">Filters & Sort</h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-text-secondary hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-semibold mb-3">
                                        Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                                    </label>
                                    <div className="flex gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="500"
                                            value={localFilters.priceRange[0]}
                                            onChange={(e) => setLocalFilters(prev => ({
                                                ...prev,
                                                priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                                            }))}
                                            className="flex-1"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="500"
                                            value={localFilters.priceRange[1]}
                                            onChange={(e) => setLocalFilters(prev => ({
                                                ...prev,
                                                priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                                            }))}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                {/* APY Range */}
                                <div>
                                    <label className="block text-sm font-semibold mb-3">
                                        APY Range: {localFilters.apyRange[0]}% - {localFilters.apyRange[1]}%
                                    </label>
                                    <div className="flex gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="15"
                                            step="0.5"
                                            value={localFilters.apyRange[0]}
                                            onChange={(e) => setLocalFilters(prev => ({
                                                ...prev,
                                                apyRange: [parseFloat(e.target.value), prev.apyRange[1]]
                                            }))}
                                            className="flex-1"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="15"
                                            step="0.5"
                                            value={localFilters.apyRange[1]}
                                            onChange={(e) => setLocalFilters(prev => ({
                                                ...prev,
                                                apyRange: [prev.apyRange[0], parseFloat(e.target.value)]
                                            }))}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                {/* Property Types */}
                                <div>
                                    <label className="block text-sm font-semibold mb-3">Property Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {PROPERTY_TYPES.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => toggleType(type)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${localFilters.types.includes(type)
                                                    ? 'bg-primary text-slate-900'
                                                    : 'bg-slate-800 text-text-secondary hover:bg-slate-700'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-semibold mb-3">Sort By</label>
                                    <select
                                        value={localFilters.sortBy}
                                        onChange={(e) => setLocalFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 focus:border-primary outline-none"
                                    >
                                        {SORT_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-3 p-6 border-t border-slate-700 sticky bottom-0 bg-surface">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="flex-1 bg-primary hover:bg-accent text-slate-900 font-bold py-2.5 rounded-lg transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
