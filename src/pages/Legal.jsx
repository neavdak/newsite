import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Legal() {
    const [activeTab, setActiveTab] = useState('terms');

    const tabs = [
        { id: 'terms', label: 'Terms of Service' },
        { id: 'privacy', label: 'Privacy Policy' }
    ];

    return (
        <div className="bg-background min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Legal Center</h1>
                    <p className="text-text-secondary">
                        Please review our terms and policies carefully.
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="bg-surface border border-slate-700 rounded-lg p-1 inline-flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-primary text-slate-900 shadow-lg'
                                        : 'text-text-secondary hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-surface border border-slate-700 rounded-2xl p-8 md:p-12 shadow-xl"
                >
                    {activeTab === 'terms' ? (
                        <div className="prose prose-invert max-w-none">
                            <h2>1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using the BrickX platform ("Service"), you accept and agree to be bound by the terms
                                and provision of this agreement.
                            </p>

                            <h2>2. Investment Risks</h2>
                            <p>
                                Real estate investment involves risks, including illiquidity and loss of capital.
                                Past performance is not indicative of future results.
                            </p>

                            <h2>3. Account Security</h2>
                            <p>
                                You are responsible for maintaining the confidentiality of your account and wallet credentials.
                                We are not liable for any loss due to unauthorized access to your wallet.
                            </p>

                            <h2>4. Fractional Ownership</h2>
                            <p>
                                Tokens represent fractional ownership rights in a specific property SPV (Special Purpose Vehicle).
                                These rights include receiving dividends and voting on key property decisions.
                            </p>
                        </div>
                    ) : (
                        <div className="prose prose-invert max-w-none">
                            <h2>1. Information We Collect</h2>
                            <p>
                                We collect information you provide directly to us, such as when you create an account,
                                connect your wallet, or communicate with us.
                            </p>

                            <h2>2. How We Use Information</h2>
                            <p>
                                We use the information we collect to provide, maintain, and improve our services,
                                process transactions, and send you technical notices and support messages.
                            </p>

                            <h2>3. Wallet Information</h2>
                            <p>
                                We do not store your private keys. We only track public blockchain activity associated
                                with your connected wallet address for the purpose of platform functionality.
                            </p>

                            <h2>4. Data Security</h2>
                            <p>
                                We implement reasonable security measures to protect your information. However, no security
                                system is impenetrable and we cannot guarantee the security of our systems.
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
