import React, { useState, useEffect } from 'react';
import ViewToggle from '../components/ViewToggle';
import LinkList from '../components/LinkList';
import { FaSearch, FaPlus, FaLayerGroup, FaGlobe, FaLock, FaSort, FaArchive, FaGem } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import AddLinkModal from '../components/AddLinkModal';
import ConfirmModal from '../components/ConfirmModal';
import Tooltip from '../components/Tooltip';
import ShareCardModal from '../components/ShareCardModal';
import LinkCard from '../components/LinkCard';
import { LinkGridSkeleton } from '../components/LinkCardSkeleton';
import api from '../utils/api';
import { CATEGORIES } from '../constants/categories';
import GlassDropdown from '../components/GlassDropdown';

const Vault = () => {
    const [links, setLinks] = useState([]);
    const [view, setView] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null); // State for editing
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, link: null });
    const [shareModal, setShareModal] = useState({ isOpen: false, link: null });

    // New Features State
    const [sortBy, setSortBy] = useState('Newest'); // Newest, Oldest, A-Z, Popular
    const [randomLink, setRandomLink] = useState(null);


    // Fetch user's own links from backend
    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await api.get('/links/my-links');
                setLinks(res.data);
                if (res.data.length > 0) {
                    setRandomLink(res.data[Math.floor(Math.random() * res.data.length)]);
                }
            } catch (err) {
                console.error('Error fetching links:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, []);

    const filteredLinks = links
        .filter(link => {
            const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'All' || link.category === filterCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'Newest': return new Date(b.createdAt) - new Date(a.createdAt);
                case 'Oldest': return new Date(a.createdAt) - new Date(b.createdAt);
                case 'A-Z': return a.title.localeCompare(b.title);
                case 'Popular': return b.clicks - a.clicks;
                default: return 0;
            }
        });



    const handleLinkAdded = (newLink) => {
        setLinks([newLink, ...links]);
        setIsModalOpen(false);
    };

    const handleLinkUpdated = (updatedLink) => {
        setLinks(links.map(link => link._id === updatedLink._id ? updatedLink : link));
        setIsModalOpen(false);
        setEditingLink(null);
    };

    const handleTogglePublic = async (linkId, currentStatus) => {
        // Optimistic update
        const originalLinks = [...links];
        const newStatus = !currentStatus;

        setLinks(links.map(link => link._id === linkId ? { ...link, isPublic: newStatus } : link));

        try {
            await api.put(`/links/${linkId}`, { isPublic: newStatus });
        } catch (err) {
            console.error('Error toggling link visibility:', err);
            alert('Failed to update link visibility');
            setLinks(originalLinks); // Revert on error
        }
    };

    const handleDelete = async (linkId) => {
        const linkToDelete = links.find(link => link._id === linkId);
        setDeleteModal({ isOpen: true, link: linkToDelete });
    };

    const confirmDelete = async () => {
        if (!deleteModal.link) return;
        try {
            await api.delete(`/links/${deleteModal.link._id}`);
            setLinks(links.filter(link => link._id !== deleteModal.link._id));
        } catch (err) {
            console.error('Error deleting link:', err);
        }
    };

    const handleToggleStar = async (linkId, currentStatus) => {
        try {
            setLinks(links.map(link => link._id === linkId ? { ...link, isStarred: !currentStatus } : link));
            await api.put(`/links/${linkId}/star`);
        } catch (err) {
            console.error('Error toggling star:', err);
        }
    };

    const openEditModal = (link) => {
        setEditingLink(link);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLink(null);
    };

    return (
        <div className="pt-24 min-h-screen px-6 md:px-12 max-w-7xl mx-auto pb-20 font-sans text-gray-200">

            {/* --- PREMIUM TECH BACKGROUND --- */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
                <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[150px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[120px]" />
                <div className="absolute top-[50%] left-[30%] w-[300px] h-[300px] rounded-full bg-blue-700/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            {/* --- HEADER --- */}
            <div className="mb-12 relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-transparent"></div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                        <FaLock className="text-blue-500" size={20} />
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                        My Vault
                    </h1>
                </div>
                <p className="text-xl text-gray-400 max-w-2xl font-light">
                    Your personal collection of <span className="text-blue-500 font-semibold">saved resources</span>.
                </p>

                {/* Quick Stats & Actions */}
                <div className="flex flex-wrap gap-4 mt-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg">
                        <FaLayerGroup className="text-blue-500" size={14} />
                        <span className="text-sm text-gray-400">Total: <span className="text-white font-bold">{links.length}</span></span>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 bg-[#111] border border-white/10 rounded-lg">
                        <div className="flex items-center gap-1.5" title="Public Links">
                            <FaGlobe className="text-green-400" size={12} />
                            <span className="text-white font-bold text-sm">{links.filter(l => l.isPublic).length}</span>
                        </div>
                        <div className="w-[1px] h-4 bg-white/10"></div>
                        <div className="flex items-center gap-1.5" title="Private Links">
                            <FaLock className="text-slate-400" size={12} />
                            <span className="text-white font-bold text-sm">{links.filter(l => !l.isPublic).length}</span>
                        </div>
                    </div>

                    <Tooltip text={randomLink ? `Go to: ${randomLink.title}` : 'No links available'}>
                        <button
                            onClick={() => {
                                if (!randomLink) return;
                                window.open(randomLink.url, '_blank');
                                // Regenerate immediately for next click
                                const newRandom = links[Math.floor(Math.random() * links.length)];
                                setRandomLink(newRandom);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 hover:border-purple-500/40 rounded-lg text-purple-400 font-medium transition-all"
                        >
                            <FaGem size={14} /> Surprise Me
                        </button>
                    </Tooltip>
                </div>
            </div>





            {/* --- SEARCH DOCK & VIEW TOGGLE --- */}
            <div className="sticky top-20 z-30 mb-8">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 items-center justify-between">
                    <div className="relative flex-grow group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search your vault..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-transparent focus:border-white/10 text-white placeholder-gray-500 focus:outline-none rounded-xl transition-all"
                        />
                    </div>

                    <div className="hidden md:block w-[1px] bg-white/10 my-2"></div>

                    <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <div className="hidden md:block w-[1px] bg-white/10 h-8 mx-2"></div>

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

                    <button
                        onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 whitespace-nowrap justify-center"
                    >
                        <FaPlus size={12} /> <span className="hidden md:inline">Add</span>
                    </button>

                    {/* View Toggle */}
                    <div className="ml-auto mt-2 md:mt-0">
                        <ViewToggle view={view} setView={setView} />
                    </div>
                </div>
            </div>

            {/* --- CARDS GRID or LIST --- */}
            {loading ? (
                <LinkGridSkeleton count={6} columns={3} />
            ) : (
                <>
                    {view === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredLinks.map((link, index) => (
                                    <motion.div
                                        key={link._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="h-full"
                                    >
                                        <LinkCard
                                            link={link}
                                            onToggleStar={handleToggleStar}
                                            onTogglePublic={handleTogglePublic}
                                            onDelete={handleDelete}
                                            onEdit={openEditModal}
                                            onShare={(link) => setShareModal({ isOpen: true, link })}
                                            isVault={true}
                                            showClicks={true}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <LinkList
                            links={filteredLinks}
                            onToggleStar={handleToggleStar}
                            onTogglePublic={handleTogglePublic}
                            onDelete={handleDelete}
                            onEdit={openEditModal}
                            onShare={(link) => setShareModal({ isOpen: true, link })}
                            isVault={true}
                            showClicks={true}
                        />
                    )}

                    {filteredLinks.length === 0 && (
                        <div className="text-center py-24 border border-white/5 rounded-2xl bg-[#0a0a0a] border-dashed">
                            <div className="inline-flex p-4 rounded-full bg-[#111] text-gray-600 mb-4">
                                <FaLayerGroup size={24} />
                            </div>
                            <p className="text-gray-500">No links in your vault yet. Add your first link!</p>
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Link Modal */}
            <AddLinkModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onLinkAdded={editingLink ? handleLinkUpdated : handleLinkAdded}
                initialData={editingLink}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, link: null })}
                onConfirm={confirmDelete}
                title="Delete Link"
                message="Are you sure you want to delete this link? This action cannot be undone."
                itemName={deleteModal.link?.title}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            {/* Share Card Modal */}
            <ShareCardModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ isOpen: false, link: null })}
                link={shareModal.link}
            />
        </div>
    );
};

export default Vault;
