import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaExternalLinkAlt, FaCopy, FaCheckCircle, FaStar, FaRegStar,
  FaGlobe, FaLock, FaTrash, FaEdit, FaShareAlt, FaBolt, FaThumbtack, FaArchive
} from 'react-icons/fa';
import api from '../utils/api';

const LinkRow = ({ link, onToggleStar, onTogglePublic, onDelete, onEdit, onShare, onPin, onArchive }) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    handleLinkClick(); // Track click on copy
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`group flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 p-3 bg-[#0a0a0a] border border-white/5 hover:border-blue-500/30 rounded-xl hover:bg-[#0f172a] transition-all mb-2`}
    >
      {/* Icon & Main Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0 w-full md:w-auto">
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
          {link.image && !imgError ? (
            <img
              src={link.image}
              alt={link.title}
              className="w-5 h-5 object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-lg font-bold text-blue-500">
              {link.title?.[0] || '?'}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-gray-200 truncate text-sm">{link.title}</h3>
            <span className="hidden sm:inline text-gray-600">•</span>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              onClick={handleLinkClick}
              className="text-xs text-blue-400 hover:text-blue-300 truncate opacity-80 max-w-[150px] md:max-w-[200px]"
            >
              {link.url.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </div>

          {link.description && (
            <p className="text-xs text-gray-500 truncate max-w-[400px]">
              {link.description}
            </p>
          )}
        </div>
      </div>

      {/* Category & Tags - Hidden on small mobile */}
      <div className="hidden sm:flex items-center gap-2 max-w-[300px] flex-wrap">
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 border border-white/5 whitespace-nowrap">
          {link.category}
        </span>
        {link.tags?.slice(0, 2).map((tag, idx) => (
          <span key={idx} className="text-[10px] text-gray-400 bg-white/10 px-1.5 py-0.5 rounded border border-white/5">
            #{tag}
          </span>
        ))}
      </div>

      {/* Stats & Desktop Public Indicator */}
      <div className="hidden md:flex items-center gap-4 text-xs text-gray-400 ml-auto mr-4">
        {onTogglePublic && (
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePublic(link._id, link.isPublic); }}
            className={`transition-colors hover:text-white flex items-center gap-1 ${link.isPublic ? 'text-green-500' : 'text-gray-500'}`}
            title={link.isPublic ? "Public Link" : "Private Link"}
          >
            {link.isPublic ? <FaGlobe size={12} /> : <FaLock size={12} />}
            <span className='hidden lg:inline'>{link.isPublic ? 'Public' : 'Private'}</span>
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 self-end md:self-center w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">

        {/* Mobile only stats/public */}
        <div className="flex md:hidden items-center gap-3 text-gray-500 mr-auto">
          {onTogglePublic && (
            <button onClick={(e) => { e.stopPropagation(); onTogglePublic(link._id, link.isPublic); }}>
              {link.isPublic ? <FaGlobe size={12} className="text-green-500" /> : <FaLock size={12} />}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar(link._id, link.isStarred); }}
              className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${link.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}`}
            >
              {link.isStarred ? <FaStar size={14} /> : <FaRegStar size={14} />}
            </button>
          )}

          <button onClick={handleCopy} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Copy">
            {copied ? <FaCheckCircle className="text-green-500" size={14} /> : <FaCopy size={14} />}
          </button>

          {onShare && (
            <button onClick={() => onShare(link)} className="p-2 text-gray-400 hover:text-purple-400 hover:bg-white/10 rounded-lg transition-colors" title="Share">
              <FaShareAlt size={14} />
            </button>
          )}

          {onDelete && (
            <button onClick={() => onDelete(link._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors" title="Delete">
              <FaTrash size={14} />
            </button>
          )}

          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            onClick={handleLinkClick}
            className="ml-1 p-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-colors"
          >
            <FaExternalLinkAlt size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const LinkList = ({ links, ...props }) => {
  return (
    <div className="flex flex-col">
      <AnimatePresence>
        {links.map((link, index) => (
          <LinkRow key={link._id} link={link} {...props} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LinkList;
