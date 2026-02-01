import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaChrome, FaBookmark, FaGripHorizontal, FaCopy, FaCheck,
    FaFileImport, FaDownload, FaUpload, FaInfoCircle, FaPuzzlePiece,
    FaFirefoxBrowser, FaSafari, FaEdge, FaGlobe, FaKeyboard, FaShareAlt, FaImage, FaTimes
} from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

// Tool Data Configuration
const TOOLS = [
    {
        id: 'extension',
        title: 'Chrome Extension',
        desc: 'One-click save from any page',
        icon: FaChrome,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/20'
    },
    {
        id: 'bookmarklet',
        title: 'Quick Save Bookmarklet',
        desc: 'Works on any browser',
        icon: FaBookmark,
        color: 'text-blue-400',
        bg: 'bg-blue-500/20'
    },
    {
        id: 'import-export',
        title: 'Import & Export',
        desc: 'Migrate data or backup',
        icon: FaFileImport,
        color: 'text-orange-400',
        bg: 'bg-orange-500/20'
    },
    {
        id: 'shortcuts',
        title: 'Keyboard Shortcuts',
        desc: 'Navigate like a pro',
        icon: FaKeyboard,
        color: 'text-purple-400',
        bg: 'bg-purple-500/20'
    },
    {
        id: 'share-cards',
        title: 'Share Cards',
        desc: 'Create beautiful social images',
        icon: FaShareAlt,
        color: 'text-pink-400',
        bg: 'bg-pink-500/20'
    }
];

const Tools = () => {
    const [activeTool, setActiveTool] = useState(null);
    const [copied, setCopied] = useState(false);

    // Import/Export States
    const [importStatus, setImportStatus] = useState({ type: '', message: '' });
    const [isImporting, setIsImporting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const fileInputRef = useRef(null);

    // Bookmarklet Code
    const baseUrl = window.location.origin;
    const bookmarkletCode = `javascript:void(window.open('${baseUrl}/quick-save?url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title),'_blank'))`;

    const handleCopyBookmarklet = () => {
        navigator.clipboard.writeText(bookmarkletCode);
        setCopied(true);
        toast.success('Bookmarklet code copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    // --- LOGIC FUNCTIONS (Reused) ---
    const parseBookmarkHtml = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        const bookmarks = [];
        links.forEach(link => {
            const url = link.getAttribute('href');
            const title = link.textContent.trim();
            if (url && url.startsWith('http')) bookmarks.push({ url, title });
        });
        return bookmarks;
    };

    const handleFileImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsImporting(true);
        setImportStatus({ type: '', message: '' });

        try {
            const text = await file.text();
            let bookmarks = [];
            let format = 'html';

            if (file.name.endsWith('.json')) {
                format = 'json';
                bookmarks = JSON.parse(text);
            } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
                bookmarks = parseBookmarkHtml(text);
            } else {
                throw new Error('Unsupported format');
            }

            if (bookmarks.length === 0) throw new Error('No bookmarks found');

            const response = await api.post('/links/import', { bookmarks, format });
            toast.success(`${response.data.count} links imported!`);
            setImportStatus({ type: 'success', message: 'Import successful' });
        } catch (err) {
            toast.error(err.message || 'Import failed');
            setImportStatus({ type: 'error', message: 'Import failed' });
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleExport = async (format) => {
        setIsExporting(true);
        try {
            const response = await api.get(`/links/export?format=${format}`, {
                responseType: format === 'json' ? 'json' : 'blob'
            });
            const blob = format === 'csv'
                ? new Blob([response.data], { type: 'text/csv' })
                : new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ledgerly-links.${format}`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error('Export failed');
        } finally {
            setIsExporting(false);
        }
    };

    // --- RENDER CONTENT FOR MODALS ---
    const renderModalContent = () => {
        switch (activeTool) {
            case 'extension':
                return (
                    <div className="space-y-8 animate-fadeIn relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl border border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                                <FaChrome className="text-yellow-400" size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">Browser Extension</h2>
                                <p className="text-gray-400">Save links instantly while you browse.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Features */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                    <FaCheck className="text-yellow-400" size={16} />
                                    Why use the extension?
                                </h3>
                                <ul className="space-y-4 text-gray-300">
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                                        <span><strong>One-click save</strong> directly from your browser toolbar</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                                        <span>Automatically captures <strong>title, URL, and metadata</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                                        <span>Instant <strong>duplicate check</strong> – never save the same link twice</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Installation */}
                            <div className="bg-gradient-to-b from-blue-600/10 to-blue-600/5 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden">
                                <h3 className="text-lg font-semibold text-white mb-6">Get it now</h3>

                                <div className="space-y-6">
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-white">Currently in Beta</span>
                                            <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            The extension is available for Chrome, Brave, Edge, and Arc browsers.
                                        </p>
                                    </div>

                                    <button
                                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
                                        onClick={() => window.open('https://chrome.google.com/webstore', '_blank')}
                                    >
                                        <FaChrome />
                                        Add to Chrome
                                        <FaDownload className="opacity-50 group-hover:translate-y-0.5 transition-transform text-sm ml-1" />
                                    </button>

                                    <div className="text-center">
                                        <p className="text-xs text-xs text-gray-500 mb-2">After installing:</p>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                                            <FaPuzzlePiece className="text-gray-400 text-xs" />
                                            <span className="text-xs text-gray-400">Click the puzzle icon & pin Ledgerly</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'bookmarklet':
                return (
                    <div className="space-y-8 animate-fadeIn relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-2xl border border-blue-400/20 shadow-[0_0_15px_rgba(96,165,250,0.2)]">
                                <FaBookmark className="text-blue-400" size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">Universal Bookmarklet</h2>
                                <p className="text-gray-400">For Safari, Firefox, and Mobile browsers.</p>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                            <h3 className="text-xl font-semibold text-white mb-2">Drag to Install</h3>
                            <p className="text-gray-400 text-sm mb-8">Drag the button below to your browser's favorites/bookmarks bar.</p>

                            <div className="flex justify-center mb-10">
                                <div
                                    draggable="true"
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/uri-list', bookmarkletCode);
                                        e.dataTransfer.setData('text/plain', bookmarkletCode);
                                    }}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-bold cursor-grab active:cursor-grabbing hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                >
                                    <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <FaGripHorizontal className="text-gray-400" />
                                    <span>Save to Ledgerly</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                                {[
                                    { icon: FaSafari, name: 'Safari' },
                                    { icon: FaFirefoxBrowser, name: 'Firefox' },
                                    { icon: FaEdge, name: 'Edge' },
                                    { icon: FaChrome, name: 'Mobile' }
                                ].map((b, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <b.icon className="text-gray-400" size={20} />
                                        <span className="text-xs text-gray-500">{b.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'share-cards':
                return (
                    <div className="space-y-8 animate-fadeIn relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-2xl border border-pink-400/20 shadow-[0_0_15px_rgba(244,114,182,0.2)]">
                                <FaShareAlt className="text-pink-400" size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">Social Cards & QR</h2>
                                <p className="text-gray-400">Beautiful ways to share your content.</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Visual Preview */}
                            <div className="space-y-6">
                                <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 p-6 relative overflow-hidden flex flex-col justify-end group shadow-2xl">
                                    {/* Abstract shapes representing a share card */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                    <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
                                    <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-purple-500/30 rounded-full blur-3xl" />

                                    {/* Mock Card */}
                                    <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                                        <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
                                            <FaShareAlt className="text-pink-400" />
                                        </div>
                                        <div className="h-4 w-3/4 bg-white/20 rounded mb-2" />
                                        <div className="h-3 w-1/2 bg-white/10 rounded" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {['Gradient', 'Dark Mode', 'Minimal'].map((style) => (
                                        <div key={style} className="h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{style}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                        <FaImage className="text-pink-400" /> GENERATE IMAGES
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                        Turn any link into a stunning social media image. Perfect for Twitter (X), LinkedIn, or Instagram stories.
                                    </p>
                                    <ul className="text-sm space-y-2 text-gray-300">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Auto-fetches Open Graph images</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Custom gradient backgrounds</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> One-click download</li>
                                    </ul>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                        <div className="w-4 h-4 grid grid-cols-2 gap-0.5 opacity-80">
                                            <div className="bg-white rounded-[1px]" />
                                            <div className="bg-white rounded-[1px]" />
                                            <div className="bg-white rounded-[1px]" />
                                            <div className="bg-white rounded-[1px]" />
                                        </div>
                                        QR CODES
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Generate high-res QR codes for any link. Just click the share icon and toggle to "QR Code" tab.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'import-export': // Keeping this one mostly functional but polished
                return (
                    <div className="space-y-8 animate-fadeIn relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-2xl border border-orange-400/20 shadow-[0_0_15px_rgba(251,146,60,0.2)]">
                                <FaFileImport className="text-orange-400" size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">Data Management</h2>
                                <p className="text-gray-400">Total control over your data.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <FaUpload className="text-blue-500" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Import</h3>
                                <p className="text-gray-400 text-sm mb-8">Bring your bookmarks from Chrome, Firefox, or other tools.</p>

                                <input type="file" ref={fileInputRef} accept=".html,.htm,.json" onChange={handleFileImport} className="hidden" />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isImporting}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    {isImporting ? 'Importing...' : 'Select File'}
                                </button>
                                <p className="text-xs text-center text-gray-600 mt-4">Supports .html and .json</p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <FaDownload className="text-emerald-500" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Export</h3>
                                <p className="text-gray-400 text-sm mb-8">Download a full backup of your entire library.</p>

                                <div className="flex gap-3">
                                    <button onClick={() => handleExport('json')} disabled={isExporting} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all">
                                        JSON
                                    </button>
                                    <button onClick={() => handleExport('csv')} disabled={isExporting} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all">
                                        CSV
                                    </button>
                                </div>
                                <p className="text-xs text-center text-gray-600 mt-4">JSON includes all metadata</p>
                            </div>
                        </div>
                    </div>
                );

            case 'shortcuts':
                // Keeping existing shortcut content but adding the fancy header
                return (
                    <div className="space-y-8 animate-fadeIn relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 rounded-2xl border border-purple-400/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                <FaKeyboard className="text-purple-400" size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">Keyboard Shortcuts</h2>
                                <p className="text-gray-400">Navigate at the speed of thought.</p>
                            </div>
                        </div>

                        {/* ... Reusing the previous grid layout for shortcuts ... */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h3 className="text-lg font-semibold text-blue-400 mb-4">Navigation (G + Key)</h3>
                                <div className="space-y-3">
                                    {[
                                        { k: 'H', l: 'Hub' }, { k: 'V', l: 'Vault' }, { k: 'C', l: 'Categories' },
                                        { k: 'S', l: 'Starred' }, { k: 'M', l: 'Community' }, { k: 'T', l: 'Tools' }
                                    ].map(i => (
                                        <div key={i.k} className="flex justify-between items-center text-sm group hover:bg-white/5 p-2 rounded-lg transition-colors cursor-default">
                                            <span className="text-gray-300">{i.l}</span>
                                            <div className="flex gap-1">
                                                <kbd className="bg-black/50 border border-white/10 px-2 py-1 rounded text-xs text-gray-400 font-mono">G</kbd>
                                                <span className="text-gray-600">+</span>
                                                <kbd className="bg-black/50 border border-white/10 px-2 py-1 rounded text-xs text-gray-400 font-mono group-hover:text-white transition-colors">{i.k}</kbd>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h3 className="text-lg font-semibold text-green-400 mb-4">Actions</h3>
                                <div className="space-y-3">
                                    {[
                                        { l: 'Add Link', k: 'N' },
                                        { l: 'Search', k: '/' },
                                        { l: 'Help', k: '?' },
                                        { l: 'Close', k: 'Esc' }
                                    ].map(i => (
                                        <div key={i.k} className="flex justify-between items-center text-sm group hover:bg-white/5 p-2 rounded-lg transition-colors cursor-default">
                                            <span className="text-gray-300">{i.l}</span>
                                            <kbd className="bg-black/50 border border-white/10 px-2 py-1 rounded text-xs text-gray-400 font-mono group-hover:text-white transition-colors">{i.k}</kbd>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    // ... existing return ...
    return (
        <div className="pt-24 min-h-screen px-6 md:px-12 max-w-7xl mx-auto pb-20 font-sans text-gray-200">
            {/* Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
                <div className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[150px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-blue-500/15 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-2xl">
                        <FaPuzzlePiece className="text-blue-400" size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">Tools & Integrations</h1>
                        <p className="text-gray-400 mt-1">Connect Ledgerly with your workflow</p>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.map((tool, index) => (
                    <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setActiveTool(tool.id)}
                        className="group bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] shadow-lg"
                    >
                        <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4 transition-colors group-hover:scale-110 duration-300`}>
                            <tool.icon className={tool.color} size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                        <p className="text-gray-400 text-sm">{tool.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Detail Modal - Sidebar Aware (lg:left-64) */}
            <AnimatePresence>
                {activeTool && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 lg:left-64 bg-[#020617] overflow-y-auto"
                    >
                        {/* Modal Background Effects */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                        </div>

                        {/* Close Button */}
                        <div className="absolute top-6 right-6 z-50">
                            <button
                                onClick={() => setActiveTool(null)}
                                className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full transition-all text-gray-400 hover:text-white"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Content Container */}
                        <div className="max-w-5xl mx-auto px-8 py-20 min-h-screen flex items-center">
                            <div className="w-full">
                                {renderModalContent()}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tools;
