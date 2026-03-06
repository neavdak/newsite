// Utility helper functions for BrickX

/**
 * Format number as currency
 * @param {number} amount - The amount to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, decimals = 0) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(amount);
};

/**
 * Format number with commas
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Truncate wallet address
 * @param {string} address - The wallet address
 * @param {number} startChars - Characters to show at start (default: 6)
 * @param {number} endChars - Characters to show at end (default: 4)
 * @returns {string} Truncated address
 */
export const truncateAddress = (address, startChars = 6, endChars = 4) => {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Format date to readable string
 * @param {Date|string} date - The date to format
 * @param {boolean} includeTime - Whether to include time (default: false)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, includeTime = false) => {
    const d = new Date(date);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    };
    return d.toLocaleDateString('en-US', options);
};

/**
 * Calculate percentage change
 * @param {number} oldValue - The old value
 * @param {number} newValue - The new value
 * @returns {number} Percentage change
 */
export const calculatePercentChange = (oldValue, newValue) => {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Generate random wallet address
 * @returns {string} Random wallet address
 */
export const generateWalletAddress = () => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
};

/**
 * Calculate investment returns
 * @param {number} principal - Initial investment amount
 * @param {number} apy - Annual percentage yield
 * @param {number} months - Number of months
 * @returns {object} Returns calculation
 */
export const calculateReturns = (principal, apy, months = 12) => {
    const monthlyRate = apy / 100 / 12;
    const totalReturn = principal * Math.pow(1 + monthlyRate, months);
    const profit = totalReturn - principal;
    const monthlyDividend = (principal * apy / 100) / 12;

    return {
        totalReturn: totalReturn,
        profit: profit,
        monthlyDividend: monthlyDividend,
        totalDividends: monthlyDividend * months
    };
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Generate random price history data
 * @param {number} basePrice - Base price
 * @param {number} days - Number of days
 * @param {number} volatility - Price volatility (0-1)
 * @returns {Array} Array of price data points
 */
export const generatePriceHistory = (basePrice, days, volatility = 0.02) => {
    const data = [];
    let currentPrice = basePrice;
    const now = new Date();

    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Random walk
        const change = (Math.random() - 0.5) * 2 * volatility;
        currentPrice = currentPrice * (1 + change);

        data.push({
            date: date.toISOString(),
            price: parseFloat(currentPrice.toFixed(2)),
            timestamp: date.getTime()
        });
    }

    return data;
};

/**
 * Get time range label
 * @param {string} range - Time range code (1D, 1W, 1M, etc.)
 * @returns {number} Number of days
 */
export const getTimeRangeDays = (range) => {
    const ranges = {
        '1D': 1,
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365,
        'ALL': 730
    };
    return ranges[range] || 30;
};
