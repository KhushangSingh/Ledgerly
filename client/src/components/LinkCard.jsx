import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaCopy, FaCheck, FaStar, FaRegStar, FaGlobe, FaLock, FaBolt, FaTrash, FaEdit, FaCheckCircle, FaShareAlt, FaThumbtack, FaArchive } from 'react-icons/fa';
import api from '../utils/api';
import Tooltip from './Tooltip';

const LinkCard = ({ link, onCopy, onToggleStar, onTogglePublic, onDelete, onEdit, onShare, onPin, onArchive, isVault = false, isOfficial = false }) => {
    const [copied, setCopied] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Reset image error state when link changes
    useEffect(() => {
        setImgError(false);
    }, [link._id, link.image]);

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(link.url);
        handleLinkClick(); // Track click on copy
        onCopy && onCopy(link.url, link._id); // Optional external handler
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLinkClick = async () => {
        try {
            await api.post(`/links/${link._id}/click`);
        } catch (err) {
            console.error('Error tracking click:', err);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`group relative bg-[#0a0a0a] hover:bg-[#0f172a] border border-blue-500/10 hover:border-blue-500/30 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/10 flex flex-col overflow-hidden ${isVault ? 'p-4' : 'p-5'}`}
        >
            {/* --- HOVER GLOW --- */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-30 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* --- TOP ROW: HEADER (Horizontal) --- */}
            <div className="relative z-10 flex items-start gap-4 mb-3">
                {/* ICON */}
                <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl border border-white/10 group-hover:border-white/20 transition-colors flex items-center justify-center">
                    {link.image && !imgError ? (
                        <img
                            src={link.image}
                            alt={link.title}
                            className="w-6 h-6 object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <span className="text-xl font-bold text-slate-200">{link.title?.[0] || '?'}</span>
                    )}
                </div>

                {/* TEXT CONTENT */}
                <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-slate-200 truncate group-hover:text-white transition-colors text-lg">
                            {link.title}
                        </h3>
                    </div>

                    <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-300 truncate block mt-0.5 font-medium"
                    >
                        {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                </div>

                {/* VAULT ACTIONS OVERLAY */}
                {isVault && (
                    <div className={`absolute -top-2 -right-2 flex gap-1  transition-opacity duration-200`}>
                        {onTogglePublic && (
                            <Tooltip text={link.isPublic ? 'Public' : 'Private'}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onTogglePublic(link._id, link.isPublic); }}
                                    className={`p-2 rounded-lg border transition-colors shadow-lg ${link.isPublic
                                        ? 'bg-green-900/20 text-green-400 border-green-500/20 hover:bg-green-900/30'
                                        : 'bg-slate-800/50 text-slate-500 border-slate-700/50 hover:bg-slate-700/50'}`}
                                >
                                    {link.isPublic ? <FaGlobe size={11} /> : <FaLock size={11} />}
                                </button>
                            </Tooltip>
                        )}
                        {onEdit && (
                            <Tooltip text="Edit">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(link); }}
                                    className="p-2 bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-slate-700/50 transition-colors shadow-lg"
                                >
                                    <FaEdit size={11} />
                                </button>
                            </Tooltip>
                        )}
                        {onDelete && (
                            <Tooltip text="Delete">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(link._id); }}
                                    className="p-2 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-lg border border-red-500/10 transition-colors shadow-lg"
                                >
                                    <FaTrash size={11} />
                                </button>
                            </Tooltip>
                        )}
                    </div>
                )}
            </div>

            {/* --- DESCRIPTION & TAGS --- */}
            <div className="relative z-10 mb-4 flex-grow">
                {link.description && (
                    <p className="text-xs text-slate-400 mb-2 line-clamp-2 min-h-[2.5em]">
                        {link.description}
                    </p>
                )}

                <div className="h-6 overflow-hidden">
                    {link.tags && link.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {link.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="text-[10px] font-medium px-2 py-1 bg-white/10 text-slate-300 border border-white/5 rounded-md">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    ) : (
                        !link.description && <span className="text-[10px] italic text-slate-500">No tags</span>
                    )}
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="relative z-10 mt-auto pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold text-slate-400 px-2 py-1 rounded bg-white/10 border border-white/5 uppercase tracking-wider">
                    {link.category}
                </span>

                <div className="flex items-center gap-2 flex-1 justify-end">
                    {/* STAR BUTTON (Moved global) */}
                    <Tooltip text={link.isStarred ? "Unstar" : "Star"}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onToggleStar) onToggleStar(link._id, link.isStarred);
                            }}
                            className={`p-2 rounded-lg border transition-colors ${link.isStarred
                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20'
                                : 'bg-white/5 text-slate-400 border-white/5 hover:text-yellow-400 hover:border-yellow-500/20'}`}
                        >
                            {link.isStarred ? <FaStar size={12} /> : <FaRegStar size={12} />}
                        </button>
                    </Tooltip>

                    {/* SHARE BUTTON */}
                    {onShare && (
                        <Tooltip text="Share as Card">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onShare(link);
                                }}
                                className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/10 text-slate-400 hover:text-purple-400 border border-white/5 hover:border-purple-500/20 transition-colors"
                            >
                                <FaShareAlt size={12} />
                            </button>
                        </Tooltip>
                    )}

                    <Tooltip text="Copy URL">
                        <button
                            onClick={handleCopy}
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold border border-white/5 transition-all group/btn flex items-center gap-2"
                        >
                            {copied ? <FaCheckCircle size={14} className="text-green-500" /> : <FaCopy size={14} className="group-hover/btn:scale-110 transition-transform" />}
                            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </Tooltip>
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleLinkClick}
                        className="px-4 py-2 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold shadow-lg shadow-white/5 transition-all hover:scale-[1.02] flex items-center gap-2"
                    >
                        OPEN <FaExternalLinkAlt size={10} />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default LinkCard;
