import { useState } from 'react';
import { PROPERTIES } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import { Search, Filter } from 'lucide-react';

export default function Marketplace() {
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'Hospitality', 'Vacation'];

    const filteredProperties = filter === 'All'
        ? PROPERTIES
        : PROPERTIES.filter(p => p.type === filter);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Marketplace
                    </h1>
                    <p className="text-text-secondary mt-1">Discover premium properties available for investment.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search properties..."
                            className="w-full md:w-64 bg-surface border border-slate-700 rounded-lg pl-9 pr-4 py-2 focus:border-primary outline-none transition-colors"
                        />
                    </div>
                    <button className="p-2 bg-surface rounded-lg border border-slate-700 hover:text-primary transition-colors">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex mb-8 overflow-x-auto pb-2 gap-2 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${filter === cat
                                ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
                                : 'bg-surface text-text-secondary hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
}
