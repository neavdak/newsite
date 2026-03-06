import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Home, Building2, Hotel, IndianRupee, ChevronDown } from 'lucide-react';
import { PROPERTIES } from '../data/properties';
import { formatCurrency } from '../utils/helpers';

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Vacation'];
const HOLDING_PERIODS = [1, 3, 5, 10];

export default function RentalCalculator() {
    const [investAmount, setInvestAmount] = useState('50000');
    const [selectedPropertyId, setSelectedPropertyId] = useState('prop-1');
    const [holdingYears, setHoldingYears] = useState(5);

    const property = PROPERTIES.find(p => p.id === selectedPropertyId) || PROPERTIES[0];
    const amount = parseFloat(investAmount) || 0;
    const apy = property.apy;

    // Calculations
    const monthlyRent = (amount * (apy / 100)) / 12;
    const annualRent = amount * (apy / 100);
    const projections = HOLDING_PERIODS.map(years => {
        const totalRent = annualRent * years;
        const appreciation = amount * Math.pow(1 + 0.06, years); // 6% annual property appreciation
        return {
            years,
            totalRent,
            appreciatedValue: appreciation,
            totalReturn: totalRent + (appreciation - amount),
            roi: (((totalRent + appreciation - amount) / amount) * 100).toFixed(1)
        };
    });

    const selectedProjection = projections.find(p => p.years === holdingYears);
    const sharesOwned = amount / property.price;

    return (
        <div className="min-h-screen bg-background pt-20 pb-24 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-4">
                        <Calculator className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary font-medium">Rental Returns Calculator</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Calculate Your Rental Income
                    </h1>
                    <p className="text-text-secondary mt-2">See how much you can earn from fractional real estate ownership</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left — Inputs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-surface border border-white/5 rounded-2xl p-6 space-y-6"
                    >
                        <h2 className="text-lg font-bold text-white">Investment Parameters</h2>

                        {/* Investment Amount */}
                        <div>
                            <label className="block text-sm text-text-secondary mb-2">Investment Amount</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                                <input
                                    type="number"
                                    value={investAmount}
                                    onChange={e => setInvestAmount(e.target.value)}
                                    className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xl font-bold text-white focus:border-primary focus:outline-none transition-colors"
                                    min="5000"
                                    step="1000"
                                />
                            </div>
                            <div className="flex gap-2 mt-2">
                                {[25000, 50000, 100000, 500000].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setInvestAmount(v.toString())}
                                        className="px-3 py-1 bg-white/5 hover:bg-primary/20 border border-white/10 rounded-lg text-xs font-medium text-text-secondary hover:text-primary transition-colors"
                                    >
                                        ₹{v >= 100000 ? `${v / 100000}L` : `${v / 1000}k`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Property Selection */}
                        <div>
                            <label className="block text-sm text-text-secondary mb-2">Select Property</label>
                            <div className="relative">
                                <select
                                    value={selectedPropertyId}
                                    onChange={e => setSelectedPropertyId(e.target.value)}
                                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none appearance-none transition-colors pr-10"
                                >
                                    {PROPERTIES.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.title} — {p.apy}% APY ({p.type})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
                            </div>
                        </div>

                        {/* Property Info card */}
                        <div className="flex gap-4 bg-background rounded-xl p-4 border border-white/5">
                            <img src={property.image} alt={property.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div>
                                <p className="font-bold text-white text-sm">{property.title}</p>
                                <p className="text-xs text-text-secondary">{property.location}</p>
                                <div className="mt-1 flex items-center gap-3">
                                    <span className="text-secondary text-xs font-bold">{property.apy}% APY</span>
                                    <span className="text-xs text-text-secondary">{formatCurrency(property.price)}/share</span>
                                </div>
                            </div>
                        </div>

                        {/* Holding Period */}
                        <div>
                            <label className="block text-sm text-text-secondary mb-2">Holding Period: <strong className="text-white">{holdingYears} years</strong></label>
                            <div className="grid grid-cols-4 gap-2">
                                {HOLDING_PERIODS.map(y => (
                                    <button
                                        key={y}
                                        onClick={() => setHoldingYears(y)}
                                        className={`py-2 rounded-lg text-sm font-bold transition-all border ${holdingYears === y
                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                                            : 'bg-background border-white/10 text-text-secondary hover:border-primary/50'
                                            }`}
                                    >
                                        {y}yr
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Results */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        {/* Key Numbers */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-5">
                                <p className="text-xs text-primary/80 uppercase tracking-wider mb-1">Monthly Rental</p>
                                <p className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                    {formatCurrency(monthlyRent)}
                                </p>
                                <p className="text-xs text-text-secondary mt-1">Per month from rent</p>
                            </div>
                            <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 rounded-2xl p-5">
                                <p className="text-xs text-secondary/80 uppercase tracking-wider mb-1">Annual Income</p>
                                <p className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                    {formatCurrency(annualRent)}
                                </p>
                                <p className="text-xs text-text-secondary mt-1">Yearly rental yield</p>
                            </div>
                        </div>

                        {/* Projection for selected period */}
                        {selectedProjection && (
                            <div className="bg-surface border border-white/5 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="h-5 w-5 text-secondary" />
                                    <h3 className="font-bold text-white">{holdingYears}-Year Projection</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-text-secondary mb-1">Total Rental Income</p>
                                        <p className="text-lg font-bold text-secondary">{formatCurrency(selectedProjection.totalRent)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-secondary mb-1">Property Value</p>
                                        <p className="text-lg font-bold text-white">{formatCurrency(selectedProjection.appreciatedValue)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-secondary mb-1">Total Returns</p>
                                        <p className="text-lg font-bold text-primary">{formatCurrency(selectedProjection.totalReturn)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-secondary mb-1">Overall ROI</p>
                                        <p className="text-lg font-bold text-white">{selectedProjection.roi}%</p>
                                    </div>
                                </div>
                                <div className="border-t border-white/5 pt-4">
                                    <p className="text-xs text-text-secondary">
                                        Based on {apy}% annual yield + 6% property appreciation. Actual returns may vary.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* All Period Comparison */}
                        <div className="bg-surface border border-white/5 rounded-2xl p-5">
                            <h3 className="font-bold text-white mb-3 text-sm">All Period Comparison</h3>
                            <div className="space-y-2">
                                {projections.map(p => (
                                    <div
                                        key={p.years}
                                        className={`flex justify-between items-center p-3 rounded-lg transition-colors cursor-pointer ${holdingYears === p.years ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5'}`}
                                        onClick={() => setHoldingYears(p.years)}
                                    >
                                        <span className="text-sm text-text-secondary">{p.years} Year{p.years > 1 ? 's' : ''}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-secondary font-mono">{formatCurrency(p.totalRent)} rent</span>
                                            <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-medium">{p.roi}% ROI</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shares Info */}
                        <div className="bg-surface border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-text-secondary">Shares you'd own</p>
                                <p className="text-lg font-bold text-white font-mono">{sharesOwned.toFixed(4)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-text-secondary">Ownership %</p>
                                <p className="text-lg font-bold text-primary">
                                    {((sharesOwned / property.totalShares) * 100).toFixed(4)}%
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
