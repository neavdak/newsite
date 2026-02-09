import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PropertyCard({ property }) {
    const isPositive = property.change >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="bg-surface rounded-xl overflow-hidden shadow-lg border border-slate-700/50 hover:border-primary/50 group"
        >
            <div className="relative h-48 overflow-hidden">
                <Link to={`/property/${property.id}`}>
                    <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>
                <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-white">
                    {property.type}
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div>
                    <h3 className="text-lg font-bold text-text-primary truncate">{property.title}</h3>
                    <div className="flex items-center text-text-secondary text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.location}
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-text-secondary uppercase">Share Price</p>
                        <p className="text-xl font-bold font-mono text-text-primary">
                            ${property.price.toFixed(2)}
                        </p>
                    </div>
                    <div className={`flex items-center text-sm font-bold ${isPositive ? 'text-secondary' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {Math.abs(property.change)}%
                    </div>
                </div>

                <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg text-sm">
                    <div>
                        <span className="text-text-secondary text-xs block">APY</span>
                        <span className="font-semibold text-primary">{property.apy}%</span>
                    </div>
                    <div>
                        <span className="text-text-secondary text-xs block">Market Cap</span>
                        <span className="font-semibold text-text-primary">{property.totalValue}</span>
                    </div>
                </div>

                <Link
                    to={`/property/${property.id}`}
                    className="block w-full text-center bg-primary hover:bg-accent text-slate-900 font-bold py-2 rounded-lg transition-colors"
                >
                    Buy Shares
                </Link>
            </div>
        </motion.div>
    );
}
