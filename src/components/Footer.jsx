import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                            Company
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/learn" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link to="/marketplace" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                    Marketplace
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                            Support
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/learn" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@brickx.com" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                    Contact Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                            Legal
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/legal" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/legal" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-surface text-center text-sm text-text-secondary">
                    &copy; {new Date().getFullYear()} BrickX Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
