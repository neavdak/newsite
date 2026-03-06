import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { calculateReturns, formatCurrency } from '../utils/helpers';

export default function InvestmentCalculator({ property }) {
    const [amount, setAmount] = useState(100);
    const [timeframe, setTimeframe] = useState(12); // months
    const [returns, setReturns] = useState(null);

    useEffect(() => {
        if (amount > 0) {
            const calc = calculateReturns(amount, property.apy, timeframe);
            setReturns(calc);
        }
    }, [amount, timeframe, property.apy]);

    const shares = amount / property.price;

    return (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Investment Calculator
            </h3>

            <div className="space-y-6">
                {/* Investment Amount */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Investment Amount</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                        <input
                            type="number"
                            min="50"
                            step="10"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            className="w-full bg-surface border border-slate-600 rounded-lg pl-9 pr-4 py-3 focus:border-primary outline-none font-mono"
                        />
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                        ≈ {shares.toFixed(4)} shares @ {formatCurrency(property.price)}/share
                    </p>
                </div>

                {/* Timeframe */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Investment Period: {timeframe} months
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="60"
                        value={timeframe}
                        onChange={(e) => setTimeframe(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-text-secondary mt-1">
                        <span>1 month</span>
                        <span>5 years</span>
                    </div>
                </div>

                {/* Results */}
                {returns && (
                    <div className="space-y-3 pt-4 border-t border-slate-700">
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary text-sm">Monthly Dividend</span>
                            <span className="font-bold text-secondary">{formatCurrency(returns.monthlyDividend)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary text-sm">Total Dividends ({timeframe}mo)</span>
                            <span className="font-bold">{formatCurrency(returns.totalDividends)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary text-sm">Projected Value</span>
                            <span className="font-bold">{formatCurrency(returns.totalReturn)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                            <span className="text-sm font-semibold">Total Profit</span>
                            <span className="font-bold text-lg text-primary">{formatCurrency(returns.profit)}</span>
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-text-secondary">
                            Calculations are estimates based on current APY of {property.apy}%. Actual returns may vary based on property performance and market conditions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
