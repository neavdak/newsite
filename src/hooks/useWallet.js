import { generateWalletAddress } from '../utils/helpers';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for wallet management
 * @returns {object} Wallet state and methods
 */
export function useWallet() {
    const [wallet, setWallet] = useLocalStorage('brickx_wallet', {
        connected: false,
        address: null,
        balance: 12450.80,
        provider: null
    });

    const connect = (provider = 'MetaMask') => {
        const address = generateWalletAddress();
        setWallet({
            connected: true,
            address,
            balance: 12450.80 + Math.random() * 5000, // Random balance
            provider
        });
        return address;
    };

    const disconnect = () => {
        setWallet({
            connected: false,
            address: null,
            balance: 0,
            provider: null
        });
    };

    const updateBalance = (newBalance) => {
        setWallet(prev => ({
            ...prev,
            balance: newBalance
        }));
    };

    return {
        ...wallet,
        connect,
        disconnect,
        updateBalance
    };
}

export default useWallet;
