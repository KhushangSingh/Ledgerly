import React, { useState, useEffect } from 'react';
import ViewToggle from '../components/ViewToggle';
import LinkList from '../components/LinkList';
import { FaChevronRight, FaFolder, FaShapes, FaArrowRight, FaTimes, FaSearch, FaBolt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

import LinkCard from '../components/LinkCard';
import { CATEGORIES } from '../constants/categories';
import ShareCardModal from '../components/ShareCardModal';
import Tooltip from '../components/Tooltip';

// Loading Skeleton Component
const LinkCardSkeleton = () => (
    <div className="bg-[#0a0a0a] border border-blue-500/10 rounded-xl p-5 animate-pulse">
        <div className="flex items-start gap-4 mb-3">
            <div className="w-12 h-12 bg-white/5 rounded-xl"></div>
            <div className="flex-1 space-y-2 pt-1">
                <div className="h-5 bg-white/5 rounded w-3/4"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
            </div>
        </div>
        <div className="space-y-2 mt-4">
            <div className="h-3 bg-white/5 rounded w-full"></div>
            <div className="h-3 bg-white/5 rounded w-2/3"></div>
        </div>
    </div>
);

const Categories = () => {
    const [links, setLinks] = useState([]);
    const [view, setView] = useState('grid');
    const [modalView, setModalView] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [modalCategory, setModalCategory] = useState(null);
    const [modalSearchTerm, setModalSearchTerm] = useState('');
    const [shareModal, setShareModal] = useState({ isOpen: false, link: null });

    // Fetch links from backend and filter to only official/seeded links
    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await api.get('/links/community');
                // Only show links that are officially seeded (e.g., isOfficial or seeded property)
                const officialLinks = res.data.filter(link => link.isOfficial || link.seeded);
                setLinks(officialLinks);
            } catch (err) {
                console.error('Error fetching links:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, []);

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

    // Random Link Handler for Categories
    const handleRandomLink = (category) => {
        const catLinks = links.filter(l => l.category === category);
        if (catLinks.length === 0) return;
        const randomLink = catLinks[Math.floor(Math.random() * catLinks.length)];
        window.open(randomLink.url, '_blank');
    };

    // Open Modal with Category
    const openCategoryModal = (category) => {
        setModalCategory(category);
        document.body.style.overflow = 'hidden';
    };

    // Close Modal
    const closeCategoryModal = () => {
        setModalCategory(null);
        setModalSearchTerm('');
        document.body.style.overflow = 'auto';
    };

    // Use fixed CATEGORIES constant for order
    const categoriesToRender = CATEGORIES;

    // Get links for current modal category
    const modalLinks = modalCategory ? links.filter(l => l.category === modalCategory) : [];

    // Filter modal links by search term
    const filteredModalLinks = modalLinks.filter(link =>
        link.title.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
        link.url.toLowerCase().includes(modalSearchTerm.toLowerCase())
    );

    return (
        <div className="pt-24 min-h-screen px-6 md:px-12 max-w-7xl mx-auto pb-20 font-sans text-gray-200 relative">

            {/* --- TECH BACKGROUND --- */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[150px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-500/15 blur-[120px]" />
                <div className="absolute top-[60%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-700/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            <div className="mb-24 relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-transparent"></div>
                <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
                    Categories
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl font-light">
                    Organized collections for your <span className="text-blue-500 font-semibold">digital workflow</span>.
                </p>
            </div>

            <div className="space-y-20">
                {loading ? (
                    // Loading Skeletons
                    <>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative">
                                <div className="py-4 mb-6 border-b border-white/10 flex items-center gap-4">
                                    <div className="w-5 h-5 bg-white/5 rounded animate-pulse"></div>
                                    <div className="h-8 bg-white/5 rounded w-48 animate-pulse"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {[1, 2, 3, 4, 5, 6].map((j) => (
                                        <LinkCardSkeleton key={j} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                ) : links.length === 0 ? (
                    // No Links Found - only when truly empty
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <FaSearch className="text-3xl text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Links Found</h3>
                        <p className="text-gray-500 max-w-md">
                            There are no community links available yet. Check back later or add your own!
                        </p>
                    </div>
                ) : (
                    // Render Categories
                    categoriesToRender.map((cat) => {
                        const catLinks = links.filter(l => l.category === cat);
                        if (catLinks.length === 0) return null;

                        const visibleLinks = catLinks.slice(0, 6);

                        return (
                            <motion.div
                                key={cat}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                                className="relative"
                            >
                                {/* Header */}
                                <div className="bg-transparent py-4 mb-6 border-b border-white/10 flex justify-between items-center group/header">
                                    <div className="flex items-center gap-4">
                                        <div className="text-blue-500 opacity-80">
                                            <FaShapes size={20} />
                                        </div>
                                        <h2 className="text-3xl font-bold text-white tracking-wide">{cat}</h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Tooltip text={`Inspire Me: Random ${cat} Link`}>
                                            <button
                                                onClick={() => handleRandomLink(cat)}
                                                className="p-2 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 hover:border-purple-500/40 rounded-lg text-purple-400 transition-all flex items-center justify-center"
                                            >
                                                <FaBolt size={14} />
                                            </button>
                                        </Tooltip>
                                        <ViewToggle view={view} setView={setView} />
                                        {catLinks.length > 6 && (
                                            <button
                                                onClick={() => openCategoryModal(cat)}
                                                className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                View All ({catLinks.length}) <FaArrowRight size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Grid/List Layout - Show only first 6 */}
                                {view === 'grid' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {visibleLinks.map((link, index) => (
                                            <motion.div
                                                key={link._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <LinkCard
                                                    link={link}
                                                    onToggleStar={handleToggleStar}
                                                    onShare={(link) => setShareModal({ isOpen: true, link })}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <LinkList
                                        links={visibleLinks}
                                        onToggleStar={handleToggleStar}
                                        onShare={(link) => setShareModal({ isOpen: true, link })}
                                    />
                                )}
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Full Screen Modal - Respects sidebar on desktop */}
            <AnimatePresence>
                {modalCategory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 lg:left-64 z-[60] bg-[#020202]/98 backdrop-blur-xl overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10">
                            <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-blue-500">
                                            <FaShapes size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white">{modalCategory}</h2>
                                            <p className="text-sm text-gray-500">{filteredModalLinks.length} of {modalLinks.length} resources</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeCategoryModal}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        <FaTimes size={20} />
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaSearch className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={`Search in ${modalCategory}...`}
                                        value={modalSearchTerm}
                                        onChange={e => setModalSearchTerm(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500/50 text-white placeholder-gray-500 focus:outline-none rounded-xl transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 overflow-y-auto h-[calc(100vh-180px)]">
                            <div className="flex justify-end mb-4">
                                <ViewToggle view={modalView} setView={setModalView} />
                            </div>
                            {filteredModalLinks.length > 0 ? (
                                modalView === 'grid' ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8"
                                    >
                                        {filteredModalLinks.map((link, index) => (
                                            <motion.div
                                                key={link._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                            >
                                                <LinkCard
                                                    link={link}
                                                    onToggleStar={handleToggleStar}
                                                    onShare={(link) => setShareModal({ isOpen: true, link })}
                                                />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <LinkList
                                        links={filteredModalLinks}
                                        onToggleStar={handleToggleStar}
                                        onShare={(link) => setShareModal({ isOpen: true, link })}
                                    />
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <FaSearch className="text-2xl text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                                    <p className="text-gray-500">Try a different search term</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ShareCardModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ isOpen: false, link: null })}
                link={shareModal.link}
            />
        </div>
    );
};

export default Categories;