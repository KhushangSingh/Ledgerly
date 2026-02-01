import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const GlassDropdown = ({ options, value, onChange, placeholder = "Select...", icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option); // option is likely the value string
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* TRIGGER BUTTON */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 bg-[#0a0a0a] border ${isOpen ? 'border-blue-500/50 ring-1 ring-blue-500/50' : 'border-white/10'} rounded-xl text-white transition-all duration-200 group hover:border-white/20`}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="text-gray-500 group-hover:text-blue-400 transition-colors text-sm" />}
                    <span className={value ? 'text-gray-200' : 'text-gray-500'}>
                        {value || placeholder}
                    </span>
                </div>
                <FaChevronDown className={`text-gray-500 text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN MENU */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]"
                    >
                        <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/50 scrollbar-track-transparent p-1.5">
                            {options.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all text-left ${value === option
                                        ? 'bg-blue-600/20 text-blue-400 font-medium'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <span>{option}</span>
                                    {value === option && <FaCheck className="text-blue-500 text-xs" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GlassDropdown;
