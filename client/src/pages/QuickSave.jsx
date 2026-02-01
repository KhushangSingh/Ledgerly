import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaBookmark, FaExternalLinkAlt } from 'react-icons/fa';
import api from '../utils/api';
import { CATEGORIES } from '../constants/categories';

// Extract clean website name from URL
const extractSiteName = (url) => {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        const domainName = hostname.split('.')[0]; // e.g., "udemy" from "udemy.com"
        return domainName.charAt(0).toUpperCase() + domainName.slice(1);
    } catch (e) {
        return '';
    }
};

// Convert kebab-case or snake_case to Title Case
const toTitleCase = (str) => {
    return str
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();
};

// Format title as "SiteName - PageName" from URL
const formatTitleFromUrl = (url) => {
    try {
        const urlObj = new URL(url);
        const siteName = extractSiteName(url);

        const pathSegments = urlObj.pathname
            .split('/')
            .filter(seg => seg && !['user', 'users', 'profile', 'page', 'pages', 'view', 'watch', 'channel'].includes(seg.toLowerCase()));

        if (pathSegments.length === 0) {
            return siteName;
        }

        let pageName = pathSegments[0];
        if (pageName.length <= 2 && pathSegments.length > 1) {
            pageName = pathSegments[1];
        }

        pageName = toTitleCase(pageName);
        return `${siteName} - ${pageName}`;
    } catch (e) {
        return '';
    }
};

// Clean up page title
const cleanTitle = (title, url) => {
    return formatTitleFromUrl(url);
};

// Get favicon URL safely - skip localhost
const getFaviconUrl = (url) => {
    try {
        const hostname = new URL(url).hostname;
        // Skip localhost URLs - they won't have favicons
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return '';
        }
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
        return '';
    }
};

const QuickSave = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        url: '',
        category: 'Other',
        tags: '',
        pricing: 'Free',
        isPublic: true
    });
    const [faviconUrl, setFaviconUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle, saving, success, error
    const [error, setError] = useState(null);

    // Get URL and title from query params
    useEffect(() => {
        const url = decodeURIComponent(searchParams.get('url') || '');
        const rawTitle = decodeURIComponent(searchParams.get('title') || '');

        // Clean the title using the same logic as the extension
        const cleanedTitle = url ? cleanTitle(rawTitle, url) : rawTitle;

        setFormData(prev => ({
            ...prev,
            url: url,
            title: cleanedTitle
        }));

        // Set favicon URL
        if (url) {
            setFaviconUrl(getFaviconUrl(url));
        }
    }, [searchParams]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            // Store the quick save URL to redirect back after login
            const currentUrl = window.location.href;
            localStorage.setItem('quickSaveRedirect', currentUrl);
            navigate('/auth?mode=login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('saving');
        setError(null);

        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(t => t);

            // Get favicon
            let favicon = '';
            try {
                const urlObj = new URL(formData.url);
                favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
            } catch (e) { }

            await api.post('/links', {
                ...formData,
                tags: tagsArray,
                image: favicon
            });

            setStatus('success');

            // Auto close after success
            setTimeout(() => {
                window.close();
            }, 1500);
        } catch (err) {
            console.error('Save error:', err);
            if (err.response?.data?.existingLink) {
                setError(`Already saved as "${err.response.data.existingLink.title}"`);
            } else {
                setError(err.response?.data?.msg || 'Failed to save link');
            }
            setStatus('error');
        }
    };

    const handleClose = () => {
        window.close();
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Background - Tech Style for Premium Feel (Chrome Popups cannot be transparent) */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[150px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-500/15 blur-[120px]" />
                <div className="absolute top-[60%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-700/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Success State */}
                {status === 'success' ? (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <FaCheck className="text-green-400" size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Saved!</h2>
                        <p className="text-gray-400 text-sm">Link added to your vault</p>
                        <p className="text-gray-500 text-xs mt-4">This window will close automatically...</p>
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600/20 rounded-lg">
                                    <FaBookmark className="text-blue-500" size={16} />
                                </div>
                                <h2 className="text-lg font-bold text-white">Quick Save</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-white transition-colors p-2"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* URL Preview */}
                        <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                {faviconUrl && (
                                    <img
                                        src={faviconUrl}
                                        alt=""
                                        className="w-10 h-10 rounded-lg bg-white/10 p-1 object-contain"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm truncate">{formData.title || 'Untitled'}</p>
                                    <a
                                        href={formData.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 text-xs truncate flex items-center gap-1 hover:underline"
                                    >
                                        {formData.url?.slice(0, 40)}...
                                        <FaExternalLinkAlt size={8} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat} className="bg-[#111]">
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Pricing</label>
                                    <select
                                        name="pricing"
                                        value={formData.pricing}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="Free" className="bg-[#111]">Free</option>
                                        <option value="Freemium" className="bg-[#111]">Freemium</option>
                                        <option value="Paid" className="bg-[#111]">Paid</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Tags <span className="text-gray-600">(comma separated)</span></label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="e.g., tool, design, free"
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                                />
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-400">Share with community</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPublic}
                                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === 'saving'}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'saving' ? 'Saving...' : 'Save to Vault'}
                            </button>
                        </form>

                        {/* Footer hint */}
                        <div className="px-6 pb-4">
                            <p className="text-center text-xs text-gray-600">
                                You can edit details later in your vault
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default QuickSave;
