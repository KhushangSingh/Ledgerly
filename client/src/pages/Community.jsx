import React, { useState, useEffect } from 'react';
import { FaSearch, FaLayerGroup, FaUsers, FaFire, FaSort } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { CATEGORIES } from '../constants/categories';
import LinkCard from '../components/LinkCard';
import LinkCardSkeleton, { LinkGridSkeleton } from '../components/LinkCardSkeleton';
import GlassDropdown from '../components/GlassDropdown';
import ShareCardModal from '../components/ShareCardModal';

const Community = () => {
    const [links, setLinks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [loading, setLoading] = useState(true);
    const [shareModal, setShareModal] = useState({ isOpen: false, link: null });

    // Fetch community links from backend
    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await api.get('/links/community');
                setLinks(res.data);
            } catch (err) {
                console.error('Error fetching community links:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, []);

    // Filter out official (developer-added) links
    const communityLinks = links.filter(link => !link.isOfficial);

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



    const filteredLinks = communityLinks.filter(link => {
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

    // Get Top Picks from Community Links only (Sorted by Popularity)
    const topPicks = [...communityLinks].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

    return (
        <div className="pt-24 min-h-screen px-6 md:px-12 max-w-7xl mx-auto pb-20 font-sans text-gray-200">

            {/* --- PREMIUM TECH BACKGROUND --- */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
                <div className="absolute top-[-20%] right-[10%] w-[550px] h-[550px] rounded-full bg-blue-600/20 blur-[150px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[-10%] left-[-15%] w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[120px]" />
                <div className="absolute top-[30%] left-[50%] w-[350px] h-[350px] rounded-full bg-blue-700/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            {/* --- HEADER --- */}
            <div className="mb-12 relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-transparent"></div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                        <FaUsers className="text-blue-500" size={20} />
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                        Community
                    </h1>
                </div>
                <p className="text-xl text-gray-400 max-w-2xl font-light">
                    Discover resources shared by the <span className="text-blue-500 font-semibold">Ledgerly community</span>.
                </p>

                {/* Quick Stats */}
                <div className="flex gap-6 mt-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg">
                        <FaLayerGroup className="text-blue-500" size={14} />
                        <span className="text-sm text-gray-400">Resources: <span className="text-white font-bold">{communityLinks.length}</span></span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg">
                        <FaUsers className="text-blue-500" size={14} />
                        <span className="text-sm text-gray-400">Contributors: <span className="text-white font-bold">{new Set(communityLinks.map(l => l.user?._id)).size}</span></span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* --- LEFT COLUMN: Main Feed (2/3 width) --- */}
                <div className="lg:w-2/3">

                    {/* --- SEARCH DOCK --- */}
                    {/* --- SEARCH DOCK --- */}
                    <div className="sticky top-20 z-30 mb-8">
                        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
                            <div className="relative flex-grow group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search community resources..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-transparent focus:border-white/10 text-white placeholder-gray-500 focus:outline-none rounded-xl transition-all"
                                />
                            </div>

                            <div className="hidden md:block w-[1px] bg-white/10 my-2"></div>

                            <div className="min-w-[140px]">
                                <GlassDropdown
                                    options={['Newest', 'Oldest', 'A-Z', 'Popular']}
                                    value={sortBy}
                                    onChange={setSortBy}
                                    placeholder="Sort By"
                                    icon={FaSort}
                                />
                            </div>

                            <div className="min-w-[150px]">
                                <GlassDropdown
                                    options={['All', ...CATEGORIES]}
                                    value={filterCategory}
                                    onChange={setFilterCategory}
                                    placeholder="Category"
                                    icon={FaLayerGroup}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- CARDS GRID --- */}
                    {loading ? (
                        <LinkGridSkeleton count={6} columns={2} />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                variant="default"
                                                onToggleStar={handleToggleStar}
                                                onShare={(link) => setShareModal({ isOpen: true, link })}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {filteredLinks.length === 0 && (
                                <div className="text-center py-24 border border-white/5 rounded-2xl bg-[#0a0a0a] border-dashed">
                                    <div className="inline-flex p-4 rounded-full bg-[#111] text-gray-600 mb-4">
                                        <FaUsers size={24} />
                                    </div>
                                    <p className="text-gray-500">No community resources found. Be the first to share!</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* --- RIGHT COLUMN: Sidebar (1/3 width) --- */}
                <div className="lg:w-1/3">
                    <div className="sticky top-24 space-y-6">
                        {/* Featured / Top Picks Panel */}
                        <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-6 text-purple-400">
                                <FaFire />
                                <h3 className="text-lg font-bold text-white">Community Top Picks</h3>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <LinkCardSkeleton key={i} variant="compact" />
                                    ))
                                ) : (
                                    topPicks.map(link => (
                                        <LinkCard key={link._id} link={link} variant="compact" />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-gradient-to-br from-blue-900/20 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-white mb-2">Share your finds!</h3>
                                <p className="text-sm text-gray-400 mb-4">Contribute to the community by making your best links public.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ShareCardModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ isOpen: false, link: null })}
                link={shareModal.link}
            />
        </div>
    );
};

export default Community;
