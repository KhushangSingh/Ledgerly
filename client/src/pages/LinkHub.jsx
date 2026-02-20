import React, { useState, useEffect } from 'react';
import ViewToggle from '../components/ViewToggle';
import LinkList from '../components/LinkList';
import { FaSearch, FaExternalLinkAlt, FaCopy, FaCheck, FaLink, FaLayerGroup, FaBolt, FaCompass, FaSort } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { CATEGORIES } from '../constants/categories';
import GlassDropdown from '../components/GlassDropdown';
import LinkCard from '../components/LinkCard';
import ShareCardModal from '../components/ShareCardModal';
import { LinkGridSkeleton } from '../components/LinkCardSkeleton';

const LinkHub = () => {
    const [links, setLinks] = useState([]);
    const [view, setView] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [copiedId, setCopiedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareModal, setShareModal] = useState({ isOpen: false, link: null });

    // Fetch links from backend
    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await api.get('/links');
                setLinks(res.data);
            } catch (err) {
                console.error('Error fetching links:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, []);

    const handleCopy = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleLinkClick = async (id) => {
        try {
            await api.post(`/links/${id}/click`);
        } catch (err) {
            console.error('Error tracking click:', err);
        }
    };

    // Toggle Star functionality
    const handleToggleStar = async (id, currentStatus) => {
        try {
            await api.put(`/links/${id}/star`);
            setLinks(prev => prev.map(link =>
                link._id === id ? { ...link, isStarred: !currentStatus } : link
            ));
        } catch (err) {
            console.error('Error toggling star:', err);
        }
    };





    // Filter for OFFICIAL links only
    const officialLinks = links.filter(link => link.isOfficial);

    const filteredLinks = officialLinks.filter(link => {
        const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || link.category === filterCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'Newest': return new Date(b.createdAt) - new Date(a.createdAt);
            case 'Oldest': return new Date(a.createdAt) - new Date(b.createdAt);
            case 'A-Z': return a.title.localeCompare(b.title);
            case 'Popular': return b.clicks - a.clicks;
            default: return 0;
        }
    });

    return (
        <div className="pt-24 min-h-screen px-6 md:px-12 max-w-7xl mx-auto pb-20 font-sans text-gray-200">

            {/* --- PREMIUM TECH BACKGROUND --- */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[150px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[120px]" />
                <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-blue-700/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            {/* --- HEADER --- */}
            <div className="mb-12 relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-transparent"></div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                        <FaCompass className="text-blue-500" size={20} />
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                        Link Hub
                    </h1>
                </div>
                <p className="text-xl text-gray-400 max-w-2xl font-light">
                    Discover and explore <span className="text-blue-500 font-semibold">official curated resources</span> directly from the source.
                </p>
            </div>

            <div className="sticky top-20 z-30 mb-8">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 items-center justify-between">
                    <div className="relative flex-grow group w-full md:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-medium text-gray-500 group-focus-within:text-blue-400 group-focus-within:border-blue-500/30 transition-colors">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                        <input
                            type="text"
                            placeholder="Search official resources..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-transparent focus:border-white/10 text-white placeholder-gray-500 focus:outline-none rounded-xl transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <div className="hidden md:block w-[1px] bg-white/10 h-8 mx-2"></div>

                        <div className="min-w-[140px] flex-grow md:flex-grow-0">
                            <GlassDropdown
                                options={['Newest', 'Oldest', 'A-Z', 'Popular']}
                                value={sortBy}
                                onChange={setSortBy}
                                placeholder="Sort By"
                                icon={FaSort}
                            />
                        </div>

                        <div className="min-w-[150px] flex-grow md:flex-grow-0">
                            <GlassDropdown
                                options={['All', ...CATEGORIES]}
                                value={filterCategory}
                                onChange={setFilterCategory}
                                placeholder="Category"
                                icon={FaLayerGroup}
                            />
                        </div>

                        <ViewToggle view={view} setView={setView} />
                    </div>
                </div>
            </div>

            {/* --- CONTENT --- */}

            {/* Loading State */}
            {
                loading && (
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="w-1.5 h-6 bg-white/10 rounded-full animate-pulse" />
                            <div className="h-7 bg-white/5 rounded w-48 animate-pulse"></div>
                        </div>
                        <LinkGridSkeleton count={6} columns={3} />
                    </div>
                )
            }

            {/* Official Collection Grid/List */}
            {
                !loading && (
                    <div className="mb-16">
                        {filteredLinks.length > 0 ? (
                            view === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <AnimatePresence>
                                        {filteredLinks.map((link, index) => (
                                            <motion.div
                                                key={link._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <LinkCard
                                                    link={link}
                                                    showOfficial={false}
                                                    onToggleStar={handleToggleStar}
                                                    onShare={(link) => setShareModal({ isOpen: true, link })}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <LinkList
                                    links={filteredLinks}
                                    onToggleStar={handleToggleStar}
                                    onShare={(link) => setShareModal({ isOpen: true, link })}
                                    showOfficial={false}
                                />
                            )
                        ) : (
                            <div className="text-center py-24 border border-white/5 rounded-2xl bg-[#0a0a0a] border-dashed">
                                <div className="inline-flex p-4 rounded-full bg-[#111] text-gray-600 mb-4">
                                    <FaLayerGroup size={24} />
                                </div>
                                <p className="text-gray-500">No official links found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Share Card Modal */}
            <ShareCardModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ isOpen: false, link: null })}
                link={shareModal.link}
            />
        </div >
    );
};

export default LinkHub;