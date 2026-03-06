import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
};

const colors = {
    success: 'bg-secondary/20 border-secondary text-secondary',
    error: 'bg-red-500/20 border-red-500 text-red-500',
    info: 'bg-primary/20 border-primary text-primary',
    warning: 'bg-accent/20 border-accent text-accent'
};

export default function Toast() {
    const { toasts, removeToast } = useApp();

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const Icon = icons[toast.type] || Info;
                    const colorClass = colors[toast.type] || colors.info;

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 50, scale: 0.3 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.5 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg min-w-[300px] max-w-md ${colorClass}`}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <p className="flex-grow text-sm font-medium">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 hover:opacity-70 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
