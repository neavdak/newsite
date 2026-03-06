import { motion } from 'framer-motion';
import { Building2, Users, Globe, Shield, Award, TrendingUp } from 'lucide-react';

export default function About() {
    const stats = [
        { label: 'Properties Funded', value: '150+', icon: <Building2 className="h-6 w-6" /> },
        { label: 'Active Investors', value: '50k+', icon: <Users className="h-6 w-6" /> },
        { label: 'Total Asset Value', value: '$250M+', icon: <TrendingUp className="h-6 w-6" /> },
        { label: 'Countries', value: '12', icon: <Globe className="h-6 w-6" /> },
    ];

    const team = [
        { name: 'Sarah Johnson', role: 'CEO & Co-Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
        { name: 'Michael Chen', role: 'CTO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
        { name: 'Emily Rodriguez', role: 'Head of Real Estate', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
        { name: 'David Kim', role: 'Head of Product', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
    ];

    return (
        <div className="bg-background text-text-primary">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
                    >
                        Democratizing <br />
                        <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            Real Estate Investing
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
                    >
                        BrickX is on a mission to make premium real estate accessible to everyone.
                        We believe that wealth creation through property ownership shouldn't be limited to the ultra-wealthy.
                    </motion.p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-surface/50 border-y border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-4 text-primary bg-primary/10 w-12 h-12 rounded-full items-center mx-auto">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                <div className="text-sm text-text-secondary uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                            <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                                Traditional real estate investing is broken. High down payments, complex paperwork,
                                and management headaches keep most people out of the market.
                            </p>
                            <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                                By tokenizing real estate assets, we break them down into affordable shares.
                                This allows anyone to build a diversified portfolio of high-quality properties
                                with as little as $50.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Transparent and secure transactions',
                                    'Professional property management',
                                    'Instant liquidity via marketplace',
                                    'Regular dividend payouts'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-text-primary">
                                        <Shield className="h-5 w-5 text-secondary mr-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                alt="Modern building"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-surface/90 backdrop-blur p-4 rounded-xl border border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <Award className="h-8 w-8 text-accent" />
                                        <div>
                                            <p className="font-bold">Award Winning Platform</p>
                                            <p className="text-xs text-text-secondary">Voted #1 Fractional Investing App 2025</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-surface/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Built by experts from real estate, finance, and technology sectors.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-surface rounded-xl overflow-hidden border border-slate-700 hover:border-primary/50 transition-all group"
                            >
                                <div className="h-64 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                    <p className="text-text-secondary text-sm">{member.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
