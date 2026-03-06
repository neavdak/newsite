import { motion } from 'framer-motion';
import { ChevronDown, CheckCircle, TrendingUp, Shield, DollarSign, Users, BarChart3, FileText } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQ_DATA } from '../data/mockData';

export default function Learn() {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const steps = [
        {
            icon: <Users className="h-8 w-8" />,
            title: 'Create Account & Connect Wallet',
            description: 'Sign up and connect your preferred crypto wallet. We support MetaMask, WalletConnect, Coinbase Wallet, and more.'
        },
        {
            icon: <BarChart3 className="h-8 w-8" />,
            title: 'Browse Properties',
            description: 'Explore our curated marketplace of verified real estate properties. Filter by location, type, APY, and price range.'
        },
        {
            icon: <DollarSign className="h-8 w-8" />,
            title: 'Invest & Own',
            description: 'Purchase fractional shares starting from $50. Your ownership is recorded securely and transparently.'
        },
        {
            icon: <TrendingUp className="h-8 w-8" />,
            title: 'Earn Dividends',
            description: 'Receive monthly rental income proportional to your ownership. Watch your investment grow over time.'
        }
    ];

    const benefits = [
        {
            icon: <DollarSign className="h-6 w-6 text-primary" />,
            title: 'Low Entry Barrier',
            description: 'Start investing in premium real estate with as little as $50, making it accessible to everyone.'
        },
        {
            icon: <TrendingUp className="h-6 w-6 text-secondary" />,
            title: 'Passive Income',
            description: 'Earn monthly dividends from rental income without the hassle of property management.'
        },
        {
            icon: <Shield className="h-6 w-6 text-accent" />,
            title: 'Diversification',
            description: 'Spread your investment across multiple properties and locations to reduce risk.'
        },
        {
            icon: <BarChart3 className="h-6 w-6 text-primary" />,
            title: 'Liquidity',
            description: 'Buy and sell shares anytime on our marketplace, unlike traditional real estate.'
        },
        {
            icon: <FileText className="h-6 w-6 text-secondary" />,
            title: 'Transparency',
            description: 'All transactions and ownership records are transparent and verifiable.'
        },
        {
            icon: <CheckCircle className="h-6 w-6 text-accent" />,
            title: 'Professional Management',
            description: 'Properties are managed by experienced professionals, ensuring optimal performance.'
        }
    ];

    return (
        <div className="bg-background text-text-primary">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background opacity-80" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
                    >
                        Learn About{' '}
                        <span className="block text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            Fractional Real Estate
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-text-secondary max-w-3xl mx-auto"
                    >
                        Discover how BrickX makes premium real estate investment accessible to everyone through fractional ownership.
                    </motion.p>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-surface/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-text-secondary text-lg">Get started in 4 simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-primary/30 transition-colors h-full">
                                    <div className="bg-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-primary">
                                        {step.icon}
                                    </div>
                                    <div className="absolute top-4 right-4 text-5xl font-bold text-slate-800">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-text-secondary">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose BrickX?</h2>
                        <p className="text-text-secondary text-lg">The advantages of fractional real estate investing</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-surface p-6 rounded-xl border border-slate-700 hover:border-primary/30 transition-colors"
                            >
                                <div className="bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                                <p className="text-text-secondary text-sm">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-surface/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-text-secondary text-lg">Everything you need to know about BrickX</p>
                    </div>

                    <div className="space-y-4">
                        {FAQ_DATA.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-surface border border-slate-700 rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/50 transition-colors"
                                >
                                    <span className="font-semibold text-lg pr-8">{faq.question}</span>
                                    <ChevronDown
                                        className={`h-5 w-5 text-primary flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {openFaq === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-6 pb-6"
                                    >
                                        <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-2xl p-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Investing?</h2>
                        <p className="text-text-secondary text-lg mb-8">
                            Join thousands of investors building wealth through fractional real estate.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/marketplace"
                                className="bg-primary hover:bg-accent text-slate-900 font-bold py-4 px-8 rounded-full transition-colors inline-block"
                            >
                                Browse Properties
                            </Link>
                            <Link
                                to="/dashboard"
                                className="bg-surface hover:bg-slate-700 text-text-primary font-semibold py-4 px-8 rounded-full border border-slate-700 transition-colors inline-block"
                            >
                                View Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
