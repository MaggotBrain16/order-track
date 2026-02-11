// src/presentation/components/ui/Input.jsx
import React from 'react';
import { cx } from '../../utils/cx';

export const Input = ({
                          label,
                          error,
                          helperText,
                          className = 'h-12 p-2',
                          containerClassName = '',
                          ...props
                      }) => {
    const baseClasses = "block w-full rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

    const getStateClasses = () => {
        if (error) return "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
        return "border-gray-300 text-gray-900 placeholder-gray-500";
    };

    return (
        <div className={containerClassName}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <input
                className={cx(baseClasses, getStateClasses(), className)}
                {...props}
            />

            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

export const TextArea = ({
                             label,
                             error,
                             helperText,
                             className = '',
                             containerClassName = '',
                             ...props
                         }) => {
    const baseClasses = "block w-full rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

    const getStateClasses = () => {
        if (error) return "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
        return "border-gray-300 text-gray-900 placeholder-gray-500";
    };

    return (
        <div className={containerClassName}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <textarea
                className={cx(baseClasses, getStateClasses(), className)}
                {...props}
            />

            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

export const Select = ({
                           label,
                           error,
                           helperText,
                           children,
                           className = 'h-12 p-2',
                           containerClassName = '',
                           ...props
                       }) => {
    const baseClasses = "block w-full rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

    const getStateClasses = () => {
        if (error) return "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
        return "border-gray-300 text-gray-900 placeholder-gray-500";
    };

    return (
        <div className={containerClassName}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <select
                className={cx(baseClasses, getStateClasses(), className)}
                {...props}
            >
                {children}
            </select>

            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};
