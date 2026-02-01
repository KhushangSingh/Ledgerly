import React from 'react';
import { motion } from 'framer-motion';

const LinkCardSkeleton = ({ variant = 'default' }) => {
    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl animate-pulse">
                <div className="w-10 h-10 bg-white/5 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a0a] border border-blue-500/10 rounded-xl p-5 animate-pulse">
            <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 bg-white/5 rounded-xl"></div>
                <div className="flex-1 space-y-2 pt-1">
                    <div className="h-5 bg-white/5 rounded w-3/4"></div>
                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
            </div>
            <div className="space-y-2 mt-4">
                <div className="h-3 bg-white/5 rounded w-full"></div>
                <div className="h-3 bg-white/5 rounded w-2/3"></div>
            </div>
            <div className="flex gap-2 mt-4">
                <div className="h-6 bg-white/5 rounded-full w-16"></div>
                <div className="h-6 bg-white/5 rounded-full w-20"></div>
            </div>
        </div>
    );
};

// Grid skeleton for multiple cards
export const LinkGridSkeleton = ({ count = 6, columns = 3 }) => {
    const colClass = columns === 2 
        ? 'grid-cols-1 md:grid-cols-2' 
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    
    return (
        <div className={`grid ${colClass} gap-6`}>
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <LinkCardSkeleton />
                </motion.div>
            ))}
        </div>
    );
};

export default LinkCardSkeleton;
