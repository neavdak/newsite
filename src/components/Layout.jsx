import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import AIAssistant from './AIAssistant';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans text-text-primary selection:bg-primary/30 pb-16 md:pb-0">
            <Navbar />
            <main className="flex-grow pt-16">
                {children}
            </main>
            <Footer />
            <BottomNav />
            <AIAssistant />
        </div>
    );
}
