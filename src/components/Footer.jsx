import { Building2 } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-background border-t border-surface py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Building2 className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                BrickX
                            </span>
                        </div>
                        <p className="text-sm text-text-secondary">
                            Democratizing real estate investment through fractional ownership.
                            Invest in premium properties starting with just $50.
                        </p>
                    </div>

                    {['Platform', 'Company', 'Legal'].map((section) => (
                        <div key={section} className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                                {section}
                            </h3>
                            <ul className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <li key={i}>
                                        <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                            {section} Link {i}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-12 pt-8 border-t border-surface text-center text-sm text-text-secondary">
                    &copy; {new Date().getFullYear()} BrickX Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
