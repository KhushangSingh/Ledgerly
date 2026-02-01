import React, { useState, useEffect } from 'react';
import ViewToggle from '../components/ViewToggle';
import LinkList from '../components/LinkList';
import { FaSearch, FaFolder, FaFolderOpen, FaPlus, FaLink } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import LinkCard from '../components/LinkCard';
import AddLinkModal from '../components/AddLinkModal';
import ConfirmModal from '../components/ConfirmModal';
import ShareCardModal from '../components/ShareCardModal';

const Collections = () => {
    const [links, setLinks] = useState([]);
    const [view, setView] = useState('grid');
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, link: null });
    const [shareModal, setShareModal] = useState({ isOpen: false, link: null });

    // Fetch user's links and extract collections
    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await api.get('/links/my-links');
                setLinks(res.data);
                
                // Extract unique collections from links
                const stackNames = [...new Set(res.data
                    .filter(link => link.stack && link.stack.trim() !== '')
                    .map(link => link.stack.trim())
                )];
                setCollections(stackNames.sort());
            } catch (err) {
                console.error('Error fetching links:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, []);

    // Get links for selected collection
    const getCollectionLinks = (collectionName) => {
        return links.filter(link => link.stack === collectionName);
    };

    // Filter collections by search
    const filteredCollections = collections.filter(col => 
        col.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get uncategorized links (no stack)
    const uncategorizedLinks = links.filter(link => !link.stack || link.stack.trim() === '');

    const handleLinkAdded = (newLink) => {
        if (editingLink) {
            setLinks(links.map(link => link._id === newLink._id ? newLink : link));
        } else {
            setLinks([newLink, ...links]);
        }
        
        // Update collections if new stack added
        if (newLink.stack && !collections.includes(newLink.stack)) {
            setCollections([...collections, newLink.stack].sort());
        }
        
        setIsModalOpen(false);
        setEditingLink(null);
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

    const handleTogglePublic = async (linkId, currentStatus) => {
        try {
            const res = await api.put(`/links/${linkId}`, { isPublic: !currentStatus });
            setLinks(links.map(link => link._id === linkId ? res.data : link));
        } catch (err) {
            console.error('Error toggling visibility:', err);
        }
    };

    const openEditModal = (link) => {
        setEditingLink(link);
        setIsModalOpen(true);
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
                        <FaFolder className="text-blue-500" size={20} />
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                        Collections
                    </h1>
                </div>
                <p className="text-xl text-gray-400 max-w-2xl font-light">
                    Organize your links into <span className="text-blue-500 font-semibold">custom collections</span>.
                </p>

                {/* Quick Stats */}
                <div className="flex gap-6 mt-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg">
                        <FaFolder className="text-blue-500" size={14} />
                        <span className="text-sm text-gray-400">Collections: <span className="text-white font-bold">{collections.length}</span></span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg">
                        <FaLink className="text-green-500" size={14} />
                        <span className="text-sm text-gray-400">Total Links: <span className="text-white font-bold">{links.length}</span></span>
                    </div>
                </div>
            </div>

            {/* --- SEARCH DOCK --- */}
            <div className="sticky top-20 z-30 mb-8">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 items-center justify-between">
                    <div className="relative flex-grow group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search collections..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-transparent focus:border-white/10 text-white placeholder-gray-500 focus:outline-none rounded-xl transition-all"
                        />
                    </div>

                    <button
                        onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 whitespace-nowrap justify-center"
                    >
                        <FaPlus size={12} /> <span className="hidden md:inline">Add Link</span>
                    </button>

                    {/* View Toggle */}
                    <div className="ml-auto mt-2 md:mt-0">
                        <ViewToggle view={view} setView={setView} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Collections Horizontal Selector */}
                    <div className="mb-8">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">
                            Your Collections ({collections.length})
                        </h2>
                        
                        {filteredCollections.length === 0 && !searchTerm ? (
                            <div className="text-center py-10 px-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <FaFolder className="mx-auto text-4xl text-gray-600 mb-3" />
                                <p className="text-gray-400 font-medium">No collections yet</p>
                                <p className="text-gray-600 text-sm mt-1">
                                    Add a "Stack / Collection" when saving links to create collections
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {/* All Links option */}
                                <button
                                    onClick={() => setSelectedCollection(null)}
                                    className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                                        selectedCollection === null
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                    }`}
                                >
                                    <FaLink size={12} />
                                    All Links
                                    <span className="text-xs opacity-70">({links.length})</span>
                                </button>
                                
                                {filteredCollections.map(col => (
                                    <button
                                        key={col}
                                        onClick={() => setSelectedCollection(col)}
                                        className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                                            selectedCollection === col
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                        }`}
                                    >
                                        <FaFolder size={12} />
                                        {col}
                                        <span className="text-xs opacity-70">({getCollectionLinks(col).length})</span>
                                    </button>
                                ))}
                                
                                {/* Uncategorized */}
                                {uncategorizedLinks.length > 0 && (
                                    <button
                                        onClick={() => setSelectedCollection('__uncategorized__')}
                                        className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                                            selectedCollection === '__uncategorized__'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                        }`}
                                    >
                                        <FaFolder size={12} />
                                        Uncategorized
                                        <span className="text-xs opacity-70">({uncategorizedLinks.length})</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Links Grid - Full Width */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                {selectedCollection === null ? (
                                    <>
                                        <FaLink className="text-blue-400" />
                                        All Links
                                    </>
                                ) : selectedCollection === '__uncategorized__' ? (
                                    <>
                                        <FaFolder className="text-gray-400" />
                                        Uncategorized
                                    </>
                                ) : (
                                    <>
                                        <FaFolderOpen className="text-blue-400" />
                                        {selectedCollection}
                                    </>
                                )}
                            </h2>
                            <span className="text-sm text-gray-500">
                                {selectedCollection === null 
                                    ? links.length 
                                    : selectedCollection === '__uncategorized__'
                                        ? uncategorizedLinks.length
                                        : getCollectionLinks(selectedCollection).length
                                } links
                            </span>
                        </div>

                        {view === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {(selectedCollection === null 
                                        ? links 
                                        : selectedCollection === '__uncategorized__'
                                            ? uncategorizedLinks
                                            : getCollectionLinks(selectedCollection)
                                    ).map((link, index) => (
                                        <motion.div
                                            key={link._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="h-full"
                                        >
                                            <LinkCard
                                                link={link}
                                                onEdit={() => openEditModal(link)}
                                                onDelete={() => handleDelete(link._id)}
                                                onToggleStar={() => handleToggleStar(link._id, link.isStarred)}
                                                onTogglePublic={() => handleTogglePublic(link._id, link.isPublic)}
                                                onShare={() => setShareModal({ isOpen: true, link })}
                                                isOwner={true}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <LinkList
                                links={selectedCollection === null 
                                    ? links 
                                    : selectedCollection === '__uncategorized__'
                                        ? uncategorizedLinks
                                        : getCollectionLinks(selectedCollection)
                                }
                                onEdit={openEditModal}
                                onDelete={(id) => handleDelete(id)}
                                onToggleStar={(id, isStarred) => handleToggleStar(id, isStarred)}
                                onTogglePublic={(id, isPublic) => handleTogglePublic(id, isPublic)}
                                onShare={(link) => setShareModal({ isOpen: true, link })}
                                isOwner={true}
                            />
                        )}

                        {/* Empty state for selected collection */}
                        {selectedCollection && getCollectionLinks(selectedCollection).length === 0 && selectedCollection !== '__uncategorized__' && (
                            <div className="text-center py-16">
                                <FaFolder className="mx-auto text-5xl text-gray-700 mb-4" />
                                <p className="text-gray-400 font-medium">No links in this collection</p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-4 text-blue-400 hover:text-blue-300 font-medium"
                                >
                                    Add your first link →
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Modals */}
            <AddLinkModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingLink(null);
                }}
                onLinkAdded={handleLinkAdded}
                initialData={editingLink}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, link: null })}
                onConfirm={confirmDelete}
                title="Delete Link"
                message={`Are you sure you want to delete "${deleteModal.link?.title}"? This action cannot be undone.`}
            />

            <ShareCardModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ isOpen: false, link: null })}
                link={shareModal.link}
            />
        </div>
    );
};

export default Collections;
