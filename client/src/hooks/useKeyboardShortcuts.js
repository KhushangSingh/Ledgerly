import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Define all keyboard shortcuts
export const SHORTCUTS = {
    navigation: [
        { keys: ['g', 'h'], label: 'Go to Hub', action: 'nav:/link-hub' },
        { keys: ['g', 'v'], label: 'Go to Vault', action: 'nav:/vault' },
        { keys: ['g', 'c'], label: 'Go to Categories', action: 'nav:/categories' },
        { keys: ['g', 's'], label: 'Go to Starred', action: 'nav:/starred' },
        { keys: ['g', 'm'], label: 'Go to Community', action: 'nav:/community' },
        { keys: ['g', 't'], label: 'Go to Tools', action: 'nav:/tools' },
        { keys: ['g', 'e'], label: 'Go to Settings', action: 'nav:/settings' },
    ],
    actions: [
        { keys: ['n'], label: 'Add new link', action: 'action:new-link' },
        { keys: ['/'], label: 'Focus search', action: 'action:focus-search' },
        { keys: ['Escape'], label: 'Close modal / Clear', action: 'action:escape' },
    ],
    help: [
        { keys: ['?'], label: 'Show keyboard shortcuts', action: 'action:show-help' },
    ]
};

export const useKeyboardShortcuts = (callbacks = {}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [keySequence, setKeySequence] = useState([]);
    const [lastKeyTime, setLastKeyTime] = useState(0);

    const handleKeyDown = useCallback((e) => {
        // Don't trigger shortcuts when typing in inputs
        const target = e.target;
        const isInput = target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable;

        // Allow Escape even in inputs
        if (isInput && e.key !== 'Escape') {
            return;
        }

        const key = e.key.toLowerCase();

        // Specific fix for '?' (Shift + /) - we want to allow it despite modifier check
        // But we want to ignore the 'Shift' key event itself if it's just a modifier
        if (['shift', 'control', 'alt', 'meta'].includes(key)) {
            return;
        }

        // Force 'Shift + /' to be treated as '?'
        // This handles cases where browser reports '/' with shiftKey instead of '?'
        let effectiveKey = key;
        if (e.shiftKey && key === '/') {
            effectiveKey = '?';
        }

        const now = Date.now();

        // Reset sequence if too much time passed (500ms)
        let currentSequence = keySequence;
        if (now - lastKeyTime > 500) {
            currentSequence = [];
        }

        const newSequence = [...currentSequence, effectiveKey];
        setKeySequence(newSequence);
        setLastKeyTime(now);

        // Check for matching shortcuts
        const allShortcuts = [
            ...SHORTCUTS.navigation,
            ...SHORTCUTS.actions,
            ...SHORTCUTS.help
        ];

        for (const shortcut of allShortcuts) {
            const shortcutKeys = shortcut.keys.map(k => k.toLowerCase());

            // Check if sequence matches
            if (shortcutKeys.length === newSequence.length &&
                shortcutKeys.every((k, i) => k === newSequence[i])) {

                e.preventDefault();
                setKeySequence([]);

                // Handle navigation
                if (shortcut.action.startsWith('nav:')) {
                    const path = shortcut.action.replace('nav:', '');
                    navigate(path);
                    return;
                }

                // Handle actions
                if (shortcut.action.startsWith('action:')) {
                    const actionName = shortcut.action.replace('action:', '');
                    if (callbacks[actionName]) {
                        callbacks[actionName]();
                    }
                    return;
                }
            }

            // Check if current sequence could lead to a match
            if (shortcutKeys.length > newSequence.length &&
                shortcutKeys.slice(0, newSequence.length).every((k, i) => k === newSequence[i])) {
                // Partial match - keep the sequence
                return;
            }
        }

        // No match found, reset after single key timeout
        setTimeout(() => {
            setKeySequence(prev => prev.length === newSequence.length ? [] : prev);
        }, 500);

    }, [keySequence, lastKeyTime, navigate, callbacks]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Reset sequence on route change
    useEffect(() => {
        setKeySequence([]);
    }, [location.pathname]);

    return { keySequence };
};

export default useKeyboardShortcuts;
