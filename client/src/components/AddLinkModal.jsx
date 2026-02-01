import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaTimes, FaLink, FaTag, FaLayerGroup, FaDollarSign, FaHeading, FaTags, FaImage } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../constants/categories';
import GlassDropdown from './GlassDropdown';

const AddLinkModal = ({ isOpen, onClose, onLinkAdded, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        category: 'Other',
        subCategory: '',
        tags: '',
        pricing: 'Free',
        isPublic: true,
        image: '',
        stack: ''
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                tags: initialData.tags ? initialData.tags.join(', ') : ''
            });
        } else {
            // Reset if no initial data (Create Mode)
            setFormData({ title: '', url: '', category: 'Other', subCategory: '', tags: '', pricing: 'Free', isPublic: true, image: '', stack: '' });
        }
        setError(null);
    }, [initialData, isOpen]);

    const { title, url, category, tags, pricing, isPublic, image, stack } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user modifies input
        if (error) setError(null);
    };

    // Handler for GlassDropdown
    const onDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onTogglePublic = () => setFormData({ ...formData, isPublic: !isPublic });

    const onSubmit = async e => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(t => t);

            let res;
            if (initialData) {
                // EDIT MODE
                res = await api.put(`/links/${initialData._id}`, { ...formData, tags: tagsArray });
            } else {
                // CREATE MODE
                res = await api.post('/links', { ...formData, tags: tagsArray });
            }

            onLinkAdded(res.data);
            handleClose();
        } catch (err) {
            console.error(err);
            if (err.response?.data?.existingLink) {
                setError(`This URL is already saved as "${err.response.data.existingLink.title}"`);
            } else {
                setError(err.response?.data?.msg || 'Error saving link');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!initialData) {
            setFormData({ title: '', url: '', category: 'Other', subCategory: '', tags: '', pricing: 'Free', isPublic: true, image: '', stack: '' });
        }
        setError(null);
        onClose();
    };

    // Shared Input Style
    const inputStyle = "w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm";
    const labelStyle = "block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1";

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white/5 backdrop-blur-xl border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl shadow-blue-900/20 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-transparent sticky top-0 z-50 backdrop-blur-md">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-5 bg-blue-600 rounded-full" /> {initialData ? 'Edit Resource' : 'Add Resource'}
                            </h2>
                            <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                                <FaTimes size={16} />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelStyle}>Title</label>
                                        <div className="relative">
                                            <FaHeading className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-sm" />
                                            <input type="text" name="title" value={title} onChange={onChange} required placeholder="e.g. Figma" className={inputStyle} />
                                        </div>
                                    </div>

                                    <div className="relative z-40">
                                        <label className={labelStyle}>Category</label>
                                        <GlassDropdown
                                            options={CATEGORIES}
                                            value={category}
                                            onChange={(val) => onDropdownChange('category', val)}
                                            icon={FaLayerGroup}
                                        />
                                    </div>

                                    <div className="relative z-30">
                                        <label className={labelStyle}>Pricing</label>
                                        <GlassDropdown
                                            options={['Free', 'Paid', 'Freemium']}
                                            value={pricing}
                                            onChange={(val) => onDropdownChange('pricing', val)}
                                            icon={FaDollarSign}
                                        />
                                    </div>

                                    {/* Stack Field */}
                                    <div>
                                        <label className={labelStyle}>Stack / Collection <span className="text-gray-600 lowercase font-normal">(optional)</span></label>
                                        <div className="relative">
                                            <FaLayerGroup className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-sm" />
                                            <input type="text" name="stack" value={stack} onChange={onChange} placeholder="e.g. Frontend Kit" className={inputStyle} />
                                        </div>
                                    </div>

                                    {/* Description Field */}
                                    <div>
                                        <label className={labelStyle}>Description <span className="text-gray-600 lowercase font-normal">(optional)</span></label>
                                        <div className="relative">
                                            <textarea
                                                name="description"
                                                value={formData.description || ''}
                                                onChange={onChange}
                                                placeholder="Brief description..."
                                                className={`${inputStyle} min-h-[80px] resize-none`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelStyle}>URL</label>
                                        <div className="relative">
                                            <FaLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-sm" />
                                            <input type="url" name="url" value={url} onChange={onChange} required placeholder="https://..." className={inputStyle} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelStyle}>Logo Image URL <span className="text-gray-600 lowercase font-normal">(optional)</span></label>
                                        <div className="relative">
                                            <FaImage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-sm" />
                                            <input type="url" name="image" value={image} onChange={onChange} placeholder="https://example.com/logo.png" className={inputStyle} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelStyle}>Tags <span className="text-gray-600 lowercase font-normal">(comma separated)</span></label>
                                        <div className="relative">
                                            <FaTags className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-sm" />
                                            <input type="text" name="tags" value={tags} onChange={onChange} placeholder="ui, dark mode, tool" className={inputStyle} />
                                        </div>
                                    </div>

                                    {/* Public/Private Toggle */}
                                    <div>
                                        <label className={labelStyle}>Visibility</label>
                                        <div className="flex items-center justify-between p-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl h-[42px]">
                                            <div>
                                                <p className="text-white font-medium text-sm">{isPublic ? 'Public' : 'Private'}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={onTogglePublic}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublic ? 'bg-blue-600' : 'bg-gray-600'}`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Save to Vault')}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddLinkModal;