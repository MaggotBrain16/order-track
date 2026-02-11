// src/presentation/components/ui/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { cx } from '../../utils/cx';

export const Button = ({
                           children,
                           variant = 'primary',
                           size = 'md',
                           icon,
                           className = '',
                           isLoading = false,
                           disabled = false,
                           fullWidth = false,
                           animated = true,
                           ...props
                       }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 shadow-sm hover:shadow-md",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm hover:shadow-md",
        ghost: "hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-500",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500"
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base"
    };

    const widthClass = fullWidth ? "w-full" : "";

    const classes = cx(
        baseClasses,
        variants[variant],
        sizes[size],
        widthClass,
        className
    );

    const content = (
        <>
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {icon && !isLoading && <span className="mr-2">{icon}</span>}
            {children}
        </>
    );

    if (animated) {
        return (
            <motion.button
                whileHover={{ scale: !disabled && !isLoading ? 1.02 : 1 }}
                whileTap={{ scale: !disabled && !isLoading ? 0.98 : 1 }}
                className={classes}
                disabled={disabled || isLoading}
                {...props}
            >
                {content}
            </motion.button>
        );
    }

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {content}
        </button>
    );
};
