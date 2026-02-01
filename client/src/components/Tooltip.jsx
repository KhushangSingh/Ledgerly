import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ text, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positions = {
        top: { bottom: '100%', left: '50%', x: '-50%', mb: '10px' },
        bottom: { top: '100%', left: '50%', x: '-50%', mt: '10px' },
        left: { right: '100%', top: '50%', y: '-50%', mr: '10px' },
        right: { left: '100%', top: '50%', y: '-50%', ml: '10px' }
    };

    const currentPos = positions[position] || positions.top;

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, ...currentPos }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            ...currentPos,
                            zIndex: 50
                        }}
                        className="whitespace-nowrap px-3 py-1.5 bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10 text-white text-xs font-medium rounded-lg shadow-xl pointer-events-none"
                    >
                        {text}
                        {/* Tiny Arrow */}
                        {position === 'top' && <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1a1a2e]/90" />}
                        {position === 'bottom' && <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-[#1a1a2e]/90" />}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tooltip;
