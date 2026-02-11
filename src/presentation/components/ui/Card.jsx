// src/presentation/components/ui/Card.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { cx } from '../../utils/cx';

export const Card = ({
                         children,
                         className = '',
                         hover = false,
                         animated = false,
                         ...props
                     }) => {
    const baseClasses = "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden";
    const hoverClasses = hover ? "hover:shadow-md transition-shadow duration-200" : "";

    const cardContent = (
        <div className={cx(baseClasses, hoverClasses, className)} {...props}>
            {children}
        </div>
    );

    if (animated) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {cardContent}
            </motion.div>
        );
    }

    return cardContent;
};

export const CardHeader = ({
                               children,
                               className = '',
                               divider = true
                           }) => (
    <div className={cx(
        "px-6 py-4",
        divider ? "border-b border-gray-200" : "",
        className
    )}>
        {children}
    </div>
);

export const CardContent = ({
                                children,
                                className = ''
                            }) => (
    <div className={cx("p-6", className)}>
        {children}
    </div>
);

export const CardFooter = ({
                               children,
                               className = ''
                           }) => (
    <div className={cx("px-6 py-4 bg-gray-50 border-t border-gray-200", className)}>
        {children}
    </div>
);
