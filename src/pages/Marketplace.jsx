import { useState, useMemo } from 'react';
import { PROPERTIES } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import { Search, Filter, X } from 'lucide-react';
import FilterModal from '../components/FilterModal';

export default function Marketplace() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        priceRange: [0, 100000],
        apyRange: [0, 15],
        types: [],
        sortBy: 'price-asc'
    });
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'Hospitality', 'Vacation'];

    // Apply all filters and search
    const filteredAndSortedProperties = useMemo(() => {
        let result = [...PROPERTIES];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.location.toLowerCase().includes(query) ||
                p.type.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (activeCategory !== 'All') {
            result = result.filter(p => p.type === activeCategory);
        }

        // Advanced filters
        result = result.filter(p => {
            const priceMatch = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
            const apyMatch = p.apy >= filters.apyRange[0] && p.apy <= filters.apyRange[1];
            const typeMatch = filters.types.length === 0 || filters.types.includes(p.type);
            return priceMatch && apyMatch && typeMatch;
        });

        // Sorting
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'apy-asc':
                    return a.apy - b.apy;
                case 'apy-desc':
                    return b.apy - a.apy;
                case 'change-asc':
                    return a.change - b.change;
                case 'change-desc':
                    return b.change - a.change;
                default:
                    return 0;
            }
        });

        return result;
    }, [searchQuery, activeCategory, filters]);

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const hasActiveFilters = filters.types.length > 0 ||
        filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000 ||
        filters.apyRange[0] !== 0 || filters.apyRange[1] !== 15;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Marketplace
                    </h1>
                    <p className="text-text-secondary mt-1">
                        {filteredAndSortedProperties.length} {filteredAndSortedProperties.length === 1 ? 'property' : 'properties'} available for investment
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 bg-surface border border-slate-700 rounded-lg pl-9 pr-10 py-2 focus:border-primary outline-none transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setFilterModalOpen(true)}
                        className={`relative p-2 bg-surface rounded-lg border transition-colors ${hasActiveFilters
                            ? 'border-primary text-primary'
                            : 'border-slate-700 hover:text-primary'
                            }`}
                    >
                        <Filter className="h-5 w-5" />
                        {hasActiveFilters && (
                            <span className="absolute -top-1 -right-1 bg-primary text-slate-900 text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                !
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex mb-8 overflow-x-auto pb-2 gap-2 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${activeCategory === cat
                            ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
                            : 'bg-surface text-text-secondary hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Results */}
            {filteredAndSortedProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="bg-surface border border-slate-700 rounded-2xl p-12 max-w-md mx-auto">
                        <Search className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No properties found</h3>
                        <p className="text-text-secondary mb-6">
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setActiveCategory('All');
                                setFilters({
                                    priceRange: [0, 100000],
                                    apyRange: [0, 15],
                                    types: [],
                                    sortBy: 'price-asc'
                                });
                            }}
                            className="bg-primary hover:bg-accent text-slate-900 font-bold px-6 py-2 rounded-lg transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Modal */}
            <FilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                filters={filters}
                onApplyFilters={handleApplyFilters}
            />
        </div>
    );
}
