import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaChevronDown, FaCog, FaLink, FaLayerGroup, FaBox, FaUsers, FaStar, FaBars, FaTimes, FaPuzzlePiece, FaFolder } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/logo-png.png';
import ConfirmModal from './ConfirmModal';

const Sidebar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/', { replace: true });
        setShowLogoutConfirm(false);
    };

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon, label }) => (
        <Link to={to} className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
            ${isActive(to)
                ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/5'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
        `}>
            <span className={`text-lg ${isActive(to) ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-gray-500 group-hover:text-white transition-colors'}`}>
                {icon}
            </span>
            <span className="font-medium text-sm">{label}</span>
        </Link>
    );

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    // Hide Sidebar on Landing and Auth Pages
    if (location.pathname === '/' || location.pathname === '/auth') {
        return null;
    }

    return (
        <>
            {/* Mobile/Tablet Toggle Button */}
            {!isMobileOpen && (
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="fixed top-6 left-6 z-[60] lg:hidden w-10 h-10 bg-[#0a0a0a]/50 backdrop-blur-md border border-white/10 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
                >
                    <FaBars size={18} />
                </button>
            )}

            {/* Mobile/Tablet Backdrop (Click Outside to Close) */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 z-[49] bg-black/40 backdrop-blur-[2px] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <div className={`fixed top-0 left-0 h-screen w-64 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Glassy Background Container */}
                <div className="absolute inset-0 bg-[#0a0a0a]/50 backdrop-blur-2xl border-r border-white/5 shadow-[5px_0_30px_rgba(0,0,0,0.3)]" />

                {/* Ambient Light/Glow */}
                <div className="absolute top-0 left-0 w-full h-[300px] bg-blue-900/10 blur-[80px] pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-6 mb-4 flex justify-between items-center">
                        <Link to="/link-hub" className="flex items-center gap-2">
                            <img src={logo} alt="Ledgerly Logo" className="w-14 h-14 object-contain drop-shadow-[0_0_20px_rgba(37,99,235,0.7)]" />
                            <span className="text-3xl font-bold text-white tracking-tight">Ledgerly</span>
                        </Link>

                        {/* Close Button (Mobile/Tablet) */}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {/* Top group: Hub, Categories, Community, Tools (divider below Tools) */}
                        <NavItem to="/link-hub" icon={<FaLink />} label="Hub" />
                        <NavItem to="/categories" icon={<FaLayerGroup />} label="Categories" />
                        <NavItem to="/community" icon={<FaUsers />} label="Community" />
                        <NavItem to="/tools" icon={<FaPuzzlePiece />} label="Tools" />
                        <div className="pt-4 mt-4 border-t border-white/5" />

                        {/* Bottom group: Vault, Collections, Starred (closer to divider) */}
                        <div className="pt-0 mt-0">
                            <NavItem to="/vault" icon={<FaBox />} label="Vault" />
                            <NavItem to="/collections" icon={<FaFolder />} label="Collections" />
                            <NavItem to="/starred" icon={<FaStar />} label="Starred" />
                        </div>
                    </nav>

                    {/* User Profile Section */}
                    <div className="p-4 border-t border-white/5 bg-black/20">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg shadow-blue-900/20 text-white font-bold border border-white/10 overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        (user?.username || 'U')[0].toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <p className="text-sm font-bold text-white truncate">{user?.username || 'User'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                                </div>
                                <FaChevronDown className={`text-gray-500 text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-full left-0 w-full mb-3 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1.5"
                                    >
                                        <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                            <FaCog className="text-gray-500" /> Settings
                                        </Link>
                                        <button
                                            onClick={handleLogoutClick}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>


            <ConfirmModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={confirmLogout}
                title="Log Out"
                message="Are you sure you want to sign out of your account?"
                confirmText="Log Out"
                type="danger"
            />
        </>
    );
};

export default Sidebar;
