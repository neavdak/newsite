import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MOCK_PORTFOLIO, MOCK_TRANSACTIONS, MOCK_NOTIFICATIONS } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Wallet state
    const [wallet, setWallet] = useLocalStorage('brickx_wallet', {
        connected: true, // Always connected for internal wallet
        balance: 12450.80,
    });

    // Portfolio state
    const [portfolio, setPortfolio] = useLocalStorage('brickx_portfolio', MOCK_PORTFOLIO);

    // Transactions state
    const [transactions, setTransactions] = useLocalStorage('brickx_transactions', MOCK_TRANSACTIONS);

    // Watchlist state
    const [watchlist, setWatchlist] = useLocalStorage('brickx_watchlist', []);

    // Secondary market listings
    const [listedShares, setListedShares] = useLocalStorage('propickx_listings', []);

    // IPO applications
    const [ipoApplications, setIpoApplications] = useLocalStorage('propickx_ipo_apps', []);

    // Notifications state
    const [notifications, setNotifications] = useLocalStorage('brickx_notifications', MOCK_NOTIFICATIONS);

    // Toast state
    const [toasts, setToasts] = useState([]);

    // Auth state
    const [user, setUser] = useLocalStorage('brickx_user', null);

    // Auth methods
    const login = (email, password) => {
        if (!email || !password) return false;

        const mockUser = {
            id: 'u1',
            name: 'Demo User',
            email: email,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            joinedDate: new Date().toISOString(),
            isAdmin: true
        };

        setUser(mockUser);
        showToast(`Welcome back, ${mockUser.name}!`, 'success');
        return true;
    };

    const signup = (name, email, password) => {
        const newUser = {
            id: `u-${Date.now()}`,
            name,
            email,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`,
            joinedDate: new Date().toISOString()
        };

        setUser(newUser);
        showToast('Account created successfully!', 'success');
        return true;
    };

    const logout = () => {
        setUser(null);
        showToast('Logged out successfully', 'info');
    };

    // Wallet methods
    const depositMoney = (amount) => {
        setWallet(prev => ({
            ...prev,
            balance: prev.balance + amount
        }));

        addTransaction({
            id: `tx-${Date.now()}`,
            type: 'deposit',
            propertyTitle: 'Wallet Deposit',
            amount: amount,
            date: new Date().toISOString(),
            status: 'completed'
        });
    };

    const updateBalance = (newBalance) => {
        setWallet(prev => ({ ...prev, balance: newBalance }));
    };

    // Portfolio methods
    const addToPortfolio = (propertyId, shares, price) => {
        const existing = portfolio.find(p => p.propertyId === propertyId);

        if (existing) {
            const newShares = existing.shares + shares;
            const newInvested = existing.invested + (shares * price);
            const newAverageBuyPrice = newInvested / newShares;

            setPortfolio(prev => prev.map(p =>
                p.propertyId === propertyId
                    ? {
                        ...p,
                        shares: newShares,
                        averageBuyPrice: newAverageBuyPrice,
                        invested: newInvested,
                        currentValue: newShares * price
                    }
                    : p
            ));
        } else {
            setPortfolio(prev => [...prev, {
                propertyId,
                shares,
                averageBuyPrice: price,
                currentValue: shares * price,
                invested: shares * price,
                gain: 0,
                gainPercent: 0
            }]);
        }
    };

    // Transaction methods
    const addTransaction = (transaction) => {
        setTransactions(prev => [transaction, ...prev]);
    };

    // Sell shares — list on secondary market
    const sellShares = (propertyId, shares, pricePerShare) => {
        const holding = portfolio.find(p => p.propertyId === propertyId);
        if (!holding || holding.shares < shares) {
            showToast('Insufficient shares to sell', 'error');
            return false;
        }

        const listing = {
            id: `listing-${Date.now()}`,
            propertyId,
            shares,
            pricePerShare,
            sellerId: user?.id,
            sellerName: user?.name,
            listedAt: new Date().toISOString(),
        };

        setListedShares(prev => [listing, ...prev]);

        // Reduce portfolio shares
        setPortfolio(prev => prev.map(p =>
            p.propertyId === propertyId
                ? { ...p, shares: p.shares - shares, invested: p.invested - (shares * p.averageBuyPrice) }
                : p
        ).filter(p => p.shares > 0.0001));

        addTransaction({
            id: `tx-${Date.now()}`,
            propertyId,
            type: 'sell_listed',
            shares,
            pricePerShare,
            amount: shares * pricePerShare,
            date: new Date().toISOString(),
            status: 'listed'
        });

        showToast(`${shares.toFixed(4)} shares listed for sale!`, 'success');
        return true;
    };

    // Buy from secondary market
    const buyListing = (listingId) => {
        const listing = listedShares.find(l => l.id === listingId);
        if (!listing) return;

        const totalCost = listing.shares * listing.pricePerShare;
        if (wallet.balance < totalCost) {
            showToast('Insufficient wallet balance', 'error');
            return;
        }

        // Deduct balance
        setWallet(prev => ({ ...prev, balance: prev.balance - totalCost }));

        // Add to buyer's portfolio
        addToPortfolio(listing.propertyId, listing.shares, listing.pricePerShare);

        // Remove listing
        setListedShares(prev => prev.filter(l => l.id !== listingId));

        addTransaction({
            id: `tx-${Date.now()}`,
            propertyId: listing.propertyId,
            type: 'buy_secondary',
            shares: listing.shares,
            pricePerShare: listing.pricePerShare,
            amount: totalCost,
            date: new Date().toISOString(),
            status: 'completed'
        });

        showToast(`Purchased ${listing.shares.toFixed(4)} shares!`, 'success');
    };

    // Apply for IPO
    const applyForIPO = (propertyId, amount) => {
        if (wallet.balance < amount) {
            showToast('Insufficient wallet balance', 'error');
            return false;
        }

        const existing = ipoApplications.find(a => a.propertyId === propertyId);
        if (existing) {
            showToast('You have already applied for this IPO', 'warning');
            return false;
        }

        // Reserve funds (deduct from wallet)
        setWallet(prev => ({ ...prev, balance: prev.balance - amount }));

        setIpoApplications(prev => [...prev, {
            id: `ipo-${Date.now()}`,
            propertyId,
            amount,
            appliedAt: new Date().toISOString(),
            status: 'pending'
        }]);

        addTransaction({
            id: `tx-${Date.now()}`,
            propertyId,
            type: 'ipo_application',
            amount,
            date: new Date().toISOString(),
            status: 'pending'
        });

        showToast('IPO application submitted! Funds reserved.', 'success');
        return true;
    };

    // Watchlist methods
    const toggleWatchlist = (propertyId) => {
        setWatchlist(prev => {
            if (prev.includes(propertyId)) {
                return prev.filter(id => id !== propertyId);
            } else {
                return [...prev, propertyId];
            }
        });
    };

    const isInWatchlist = (propertyId) => {
        return watchlist.includes(propertyId);
    };

    // Notification methods
    const addNotification = (notification) => {
        const newNotif = {
            id: `notif-${Date.now()}`,
            date: new Date().toISOString(),
            read: false,
            ...notification
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markNotificationRead = (notificationId) => {
        setNotifications(prev => prev.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        ));
    };

    const markAllNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    // Toast methods
    const showToast = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        const toast = { id, message, type };
        setToasts(prev => [...prev, toast]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const value = {
        // Auth
        user,
        login,
        signup,
        logout,

        // Wallet
        wallet,
        depositMoney,
        updateBalance,

        // Portfolio
        portfolio,
        addToPortfolio,

        // Transactions
        transactions,
        addTransaction,

        // Watchlist
        watchlist,
        toggleWatchlist,
        isInWatchlist,

        // Secondary Market
        listedShares,
        sellShares,
        buyListing,

        // IPO
        ipoApplications,
        applyForIPO,

        // Notifications
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,

        // Toasts
        toasts,
        showToast,
        removeToast
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

export default AppContext;
