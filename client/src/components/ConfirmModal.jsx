import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger', // 'danger' | 'warning' | 'info'
    itemName = null
}) => {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            icon: 'bg-red-500/20 text-red-400',
            button: 'bg-red-600 hover:bg-red-500'
        },
        warning: {
            icon: 'bg-yellow-500/20 text-yellow-400',
            button: 'bg-yellow-600 hover:bg-yellow-500'
        },
        info: {
            icon: 'bg-blue-500/20 text-blue-400',
            button: 'bg-blue-600 hover:bg-blue-500'
        }
    };

    const styles = typeStyles[type] || typeStyles.danger;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-md"
                    />

                    {/* Modal - Glassmorphism */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                        className="relative bg-white/5 backdrop-blur-xl border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
                        >
                            <FaTimes size={18} />
                        </button>

                        {/* Content */}
                        <div className="p-6 pt-8 text-center">
                            {/* Icon */}
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${styles.icon} flex items-center justify-center`}>
                                <FaExclamationTriangle size={28} />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-white mb-2">
                                {title}
                            </h3>

                            {/* Message */}
                            <p className="text-gray-400 text-sm mb-2">
                                {message}
                            </p>

                            {/* Item Name (if provided) */}
                            {itemName && (
                                <p className="text-white font-medium text-sm bg-white/5 rounded-lg px-3 py-2 mb-4 truncate border border-white/10">
                                    "{itemName}"
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 p-6 pt-0">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all border border-white/10"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 px-4 py-3 ${styles.button} text-white rounded-xl font-medium transition-all`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
