import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaFolderOpen, FaLock, FaUsers, FaLayerGroup, FaFire, FaArrowRight } from 'react-icons/fa';
import api from '../utils/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ stacks: [], trending: [] });
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [myLinksRes, trendingRes] = await Promise.all([
                    api.get('/links/my-links'),
                    api.get('/links/trending')
                ]);

                // Process Stacks from myLinks
                const links = myLinksRes.data;
                const stackCounts = {};
                links.forEach(link => {
                    if (link.stack) {
                        stackCounts[link.stack] = (stackCounts[link.stack] || 0) + 1;
                    }
                });
                const stacks = Object.entries(stackCounts).map(([name, count]) => ({ name, count }));

                setStats({ stacks, trending: trendingRes.data });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="pt-24 min-h-screen px-6 md:px-12 max-w-7xl mx-auto pb-20">
            <div className="mt-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 text-blue-400 text-sm mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    System Online
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-400 mb-2">Hello,</h1>
                <h2 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-gray-500 bg-clip-text text-transparent tracking-tight">
                    {user?.username || 'User'}
                </h2>

                <p className="mt-8 text-xl text-gray-400 max-w-2xl leading-relaxed border-l-2 border-blue-500/30 pl-6">
                    Welcome back to your digital command center.
                </p>

                {/* --- STACKS SECTION --- */}
                {stats.stacks.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <FaLayerGroup className="text-blue-500" /> Your Stacks
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {stats.stacks.map(stack => (
                                <Link to="/vault" key={stack.name} className="group p-5 bg-[#111] border border-white/10 hover:border-blue-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <FaFolderOpen className="text-gray-500 group-hover:text-yellow-500 mb-3 transition-colors text-2xl" />
                                    <h3 className="font-bold text-gray-200 truncate">{stack.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{stack.count} items</p>
                                </Link>
                            ))}
                            {/* Create New Stack Placeholder */}
                            <Link to="/vault" className="group p-5 bg-[#0a0a0a] border border-white/5 border-dashed hover:border-white/20 rounded-2xl transition-all flex flex-col justify-center items-center text-gray-600 hover:text-gray-400">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-white/10">
                                    <span className="text-xl font-light">+</span>
                                </div>
                                <span className="text-xs font-medium">New Stack</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* --- COMMUNITY PULSE --- */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <FaFire className="text-orange-500" /> Community Pulse
                        </h2>
                        <Link to="/community" className="text-sm text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                            View All <FaArrowRight size={10} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.trending.map((link, idx) => (
                            <div key={link._id} className="relative group bg-[#0a0a0a] border border-white/10 hover:border-orange-500/30 rounded-2xl p-5 transition-all hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.15)] flex flex-col">
                                {/* Rank Badge */}
                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 shadow-xl group-hover:text-orange-500 group-hover:border-orange-500/30 transition-colors">
                                    #{idx + 1}
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-[#111] rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform">
                                        {link.image ? (
                                            <img src={link.image} alt={link.title} className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100" />
                                        ) : (
                                            <span className="text-lg font-bold text-orange-500">{link.title[0]}</span>
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-gray-200 truncate group-hover:text-orange-400 transition-colors">{link.title}</h3>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            by <span className="text-gray-300">{link.user?.username || 'User'}</span>
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 truncate mb-4 bg-[#111] p-2 rounded-lg border border-white/5 font-mono">{link.url.replace(/^https?:\/\//, '')}</p>

                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-white/10 px-2 py-1 rounded">{link.category}</span>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1">
                                        Visit <FaExternalLinkAlt size={10} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- QUICK NAVIGATION (Original Grid) --- */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-80 hover:opacity-100 transition-opacity">
                    <Link to="/hub" className="group bg-[#111] border border-white/10 hover:bg-blue-900/10 hover:border-blue-500/30 p-4 rounded-xl transition-all">
                        <div className="text-blue-500 mb-2"><FaExternalLinkAlt size={20} /></div>
                        <h3 className="font-bold text-white text-sm">Hub</h3>
                    </Link>
                    <Link to="/categories" className="group bg-[#111] border border-white/10 hover:bg-gray-800/50 hover:border-gray-500/30 p-4 rounded-xl transition-all">
                        <div className="text-gray-400 group-hover:text-white mb-2"><FaFolderOpen size={20} /></div>
                        <h3 className="font-bold text-white text-sm">Categories</h3>
                    </Link>
                    <Link to="/vault" className="group bg-[#111] border border-white/10 hover:bg-purple-900/10 hover:border-purple-500/30 p-4 rounded-xl transition-all">
                        <div className="text-purple-500 mb-2"><FaLock size={20} /></div>
                        <h3 className="font-bold text-white text-sm">Vault</h3>
                    </Link>
                    <Link to="/community" className="group bg-[#111] border border-white/10 hover:bg-orange-900/10 hover:border-orange-500/30 p-4 rounded-xl transition-all">
                        <div className="text-orange-500 mb-2"><FaUsers size={20} /></div>
                        <h3 className="font-bold text-white text-sm">Community</h3>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;