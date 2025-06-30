import React from 'react';

export function Card({ children, className = '' }) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
} 