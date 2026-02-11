// src/presentation/context/ToastContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type };

        setToasts(prev => [...prev, toast]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ toast, onDismiss }) => {
    const getTypeStyles = (type) => {
        const base = "px-4 py-3 rounded-lg shadow-lg flex items-center justify-between max-w-sm";
        switch(type) {
            case 'success': return `${base} bg-green-100 text-green-800 border border-green-200`;
            case 'error': return `${base} bg-red-100 text-red-800 border border-red-200`;
            case 'warning': return `${base} bg-yellow-100 text-yellow-800 border border-yellow-200`;
            case 'info': return `${base} bg-blue-100 text-blue-800 border border-blue-200`;
            default: return `${base} bg-gray-100 text-gray-800 border border-gray-200`;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={getTypeStyles(toast.type)}
        >
            <span className="flex-1">{toast.message}</span>
            <button
                onClick={() => onDismiss(toast.id)}
                className="ml-2 text-lg hover:bg-black hover:bg-opacity-10 rounded-full p-1"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};
