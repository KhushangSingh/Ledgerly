import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaKeyboard } from 'react-icons/fa';
import { SHORTCUTS } from '../hooks/useKeyboardShortcuts';

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const formatKey = (key) => {
        const keyMap = {
            'escape': 'Esc',
            '/': '/',
            '?': '?',
        };
        return keyMap[key.toLowerCase()] || key.toUpperCase();
    };

    const ShortcutItem = ({ shortcut }) => (
        <div className="flex items-center justify-between py-2">
            <span className="text-gray-300 text-sm">{shortcut.label}</span>
            <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                    <span key={i} className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded-md text-xs font-mono text-white min-w-[24px] text-center">
                            {formatKey(key)}
                        </kbd>
                        {i < shortcut.keys.length - 1 && (
                            <span className="text-gray-500 text-xs mx-0.5">then</span>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <FaKeyboard className="text-blue-400" size={18} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors p-2"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)] custom-scrollbar">
                        {/* Navigation */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                Navigation
                            </h3>
                            <div className="bg-white/5 rounded-xl p-4 divide-y divide-white/5">
                                {SHORTCUTS.navigation.map((shortcut, i) => (
                                    <ShortcutItem key={i} shortcut={shortcut} />
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                Actions
                            </h3>
                            <div className="bg-white/5 rounded-xl p-4 divide-y divide-white/5">
                                {SHORTCUTS.actions.map((shortcut, i) => (
                                    <ShortcutItem key={i} shortcut={shortcut} />
                                ))}
                            </div>
                        </div>

                        {/* Help */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                Help
                            </h3>
                            <div className="bg-white/5 rounded-xl p-4 divide-y divide-white/5">
                                {SHORTCUTS.help.map((shortcut, i) => (
                                    <ShortcutItem key={i} shortcut={shortcut} />
                                ))}
                            </div>
                        </div>

                        {/* Tip */}
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <p className="text-blue-300 text-sm">
                                <strong>Tip:</strong> Two-key shortcuts like <kbd className="px-1.5 py-0.5 bg-blue-500/20 rounded text-xs font-mono">G</kbd> then <kbd className="px-1.5 py-0.5 bg-blue-500/20 rounded text-xs font-mono">H</kbd> must be pressed in sequence within 500ms.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default KeyboardShortcutsModal;
