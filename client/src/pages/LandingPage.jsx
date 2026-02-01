import React, { useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaArrowRight, FaPuzzlePiece, FaGlobe, FaDownload } from 'react-icons/fa';
import logo from "/logo.png";

const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    // Scroll progress for sticky tools section
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    // Determine opacity/visibility of each tool based on scroll progress
    // We have 3 tools, so we split the progress into 3 chunks:
    // 0.0 - 0.33: Tool 1
    // 0.33 - 0.66: Tool 2
    // 0.66 - 1.0: Tool 3

    // Instead of complex transforms, we'll map opacity to specific ranges for hard swaps or smooth fades
    const tool1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.28, 0.33], [0, 1, 1, 0]);
    const tool2Opacity = useTransform(scrollYProgress, [0.33, 0.38, 0.61, 0.66], [0, 1, 1, 0]);
    const tool3Opacity = useTransform(scrollYProgress, [0.66, 0.71, 0.95, 1], [0, 1, 1, 1]);

    // Scales for a slight "entering/leaving" effect
    const tool1Scale = useTransform(scrollYProgress, [0, 0.1, 0.33], [0.8, 1, 0.8]);
    const tool2Scale = useTransform(scrollYProgress, [0.33, 0.43, 0.66], [0.8, 1, 0.8]);
    const tool3Scale = useTransform(scrollYProgress, [0.66, 0.76, 1], [0.8, 1, 1]); // Stays at 1 at the end

    const tools = [
        {
            title: "Browser Extension",
            highlight: "Save instantly",
            desc: "Add links directly from your browser toolbar. No context switching required.",
            icon: <FaPuzzlePiece className="text-blue-400" />,
            label: "Chrome & Edge",
            opacity: tool1Opacity,
            scale: tool1Scale,
            visual: (
                <div className="relative w-full h-full flex items-center justify-center p-8">
                    {/* Browser Window Mockup */}
                    <div className="w-full max-w-sm bg-[#1e293b] rounded-lg shadow-2xl border border-white/10 overflow-hidden">
                        <div className="h-8 bg-[#0f172a] border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                            <div className="flex-1 mx-4 h-5 bg-[#1e293b] rounded text-[10px] text-gray-500 flex items-center px-2">ledgerly.app</div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="w-3/4 h-3 bg-white/10 rounded" />
                            <div className="w-1/2 h-3 bg-white/10 rounded" />
                            <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg flex items-center justify-between">
                                <span className="text-xs text-blue-200">Checking this out...</span>
                                <button className="px-3 py-1 bg-blue-600 text-[10px] text-white rounded">Save</button>
                            </div>
                        </div>
                    </div>
                    {/* Extension Popup Hint */}
                    <div className="absolute top-4 right-12 w-12 h-12 bg-[#1e293b] border border-blue-500/50 rounded-lg shadow-xl flex items-center justify-center animate-bounce">
                        <img src={logo} className="w-6 h-6 object-contain" />
                    </div>
                </div>
            )
        },
        {
            title: "Smart Bookmarklet",
            highlight: "One-click magic",
            desc: "Don't want an extension? Drag our bookmarklet to your toolbar for instant saving.",
            icon: <FaGlobe className="text-purple-400" />,
            label: "Works everywhere",
            opacity: tool2Opacity,
            scale: tool2Scale,
            visual: (
                <div className="relative w-full h-full flex items-center justify-center flex-col gap-4">
                    <div className="px-6 py-2 bg-[#020617] border border-white/20 rounded-full text-sm text-slate-300 shadow-lg cursor-grab active:cursor-grabbing hover:border-blue-500/50 hover:text-blue-400 transition-colors">
                        Looking for Inspiration
                    </div>
                    <div className="w-1 h-12 border-l-2 border-dashed border-white/20" />
                    <div className="w-full max-w-md h-12 bg-[#1e293b] rounded-b-lg border-x border-b border-white/10 flex items-center px-4 text-xs text-gray-500">
                        Bookmarks Bar
                        <div className="ml-auto flex gap-2">
                            <div className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-white text-[10px] font-bold border border-blue-500/30 cursor-pointer">
                                + Save to Ledgerly
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Import & Export",
            highlight: "Total freedom",
            desc: "Your data is yours. Import from other tools or export your library anytime.",
            icon: <FaDownload className="text-green-400" />,
            label: "JSON & CSV",
            opacity: tool3Opacity,
            scale: tool3Scale,
            visual: (
                <div className="relative w-full h-full flex items-center justify-center gap-8">
                    <div className="w-32 h-40 bg-[#020617] border border-white/10 rounded-xl shadow-lg p-4 flex flex-col items-center justify-center gap-3 relative">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                            <FaArrowRight className="text-green-400 rotate-90" size={12} />
                        </div>
                        <FaDownload className="text-slate-500" size={24} />
                        <div className="w-full h-1 bg-white/5 rounded-full mt-2">
                            <div className="w-3/4 h-full bg-green-500/50 rounded-full" />
                        </div>
                        <span className="text-[10px] text-gray-500">Importing...</span>
                    </div>
                </div>
            )
        }
    ];

    if (isAuthenticated) {
        return <Navigate to="/link-hub" replace />;
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-start text-slate-200 font-sans selection:bg-blue-500/30 bg-[#020617]">

            {/* Navbar */}
            <nav className="w-full px-8 md:px-16 lg:px-24 pt-6 flex justify-between items-center relative z-50">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                    <span className="text-2xl font-bold text-white tracking-tight">Ledgerly</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/auth?mode=login" className="text-sm font-bold text-white relative group py-1">
                        Log In
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/auth?mode=signup" className="px-6 py-2.5 bg-gradient-to-tr from-blue-500/40 to-blue-800/40 hover:from-blue-400 hover:to-blue-700 text-white rounded-2xl font-bold text-sm transition-all border border-white/20 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/40">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <div className="relative w-full flex flex-col items-center justify-start pt-32 md:pt-40 z-10 mb-32">
                {/* Hero Text */}
                <div className="text-center max-w-5xl relative z-30 px-6 mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-4xl md:text-7xl font-bold leading-tight tracking-tight text-white mb-6 drop-shadow-2xl">
                            Simplify your life, <br />
                            <span className="italic text-amber-500">Everything</span> at your fingertips.
                        </h1>
                    </motion.div>
                </div>

                {/* --- HORIZON WRAPPER --- */}
                <div className="relative w-full flex flex-col items-center">

                    {/* 1. The Semi-Circle (True Dome/Horizon) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] md:w-[120%] h-[800px] bg-[#020617] rounded-t-[100%] border-t border-blue-500/50 shadow-[0_-90px_160px_rgba(37,99,235,0.35)] z-20 pointer-events-none overflow-hidden">
                        {/* Inner Gradient to fade the top edge slightly */}
                        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* 1.5 The Bottom "Fog" Mask */}
                    <div className="absolute top-[700px] left-0 w-full h-64 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent z-25 pointer-events-none"></div>

                    {/* 2. Get Started Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="relative z-40 mt-32"
                    >
                        <Link to="/auth?mode=signup" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-base transition-all shadow-[0_0_40px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 hover:scale-105 active:scale-95 border border-blue-400/20">
                            Get Started <FaArrowRight size={12} />
                        </Link>
                    </motion.div>

                    {/* 3. Tubelight & Beam Section */}
                    <div className="mt-96 relative flex flex-col items-center w-full z-30">

                        {/* Tubelight */}
                        <div className="relative z-20 w-80 md:w-[36rem] h-[6px] bg-blue-400 shadow-[0_0_30px_4px_rgba(96,165,250,0.8)] rounded-full"></div>

                        {/* Beam */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] md:w-[90rem] h-[400px] z-0 pointer-events-none">
                            <div
                                className="w-full h-full bg-gradient-to-b from-blue-500/40 via-blue-600/5 to-transparent blur-3xl"
                                style={{
                                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                                    maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
                                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)'
                                }}
                            />
                        </div>

                        {/* Text below Tubelight */}
                        <h2 className="mt-48 text-5xl md:text-7xl font-bold tracking-tight leading-tight text-center relative z-10">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-blue-100 via-blue-300 to-blue-500 drop-shadow-[0_0_35px_rgba(59,130,246,0.6)]">
                                Keep your favorite
                            </span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-blue-600 to-slate-900 drop-shadow-[0_0_35px_rgba(37,99,235,0.6)]">
                                links within reach.
                            </span>
                        </h2>
                    </div>

                </div>
            </div>

            {/* --- FEATURE SECTION BACKGROUND EFFECTS --- */}
            <div className="absolute top-[1200px] left-0 w-full h-[2000px] z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                <div className="absolute top-[10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-900/20 rounded-full blur-[100px] opacity-50"></div>
                <div className="absolute top-[40%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-900/20 rounded-full blur-[100px] opacity-50"></div>
            </div>

            {/* Feature Sections Collection */}
            <div className="relative w-full z-20 mt-48">

                {/* Regular Features Container (With Padding) */}
                <div className="w-full max-w-7xl mx-auto px-6 space-y-64 mb-64">
                    {/* Feature 1: Safe & Secure */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row items-center gap-12 md:gap-24"
                    >
                        <div className="w-full md:w-[40%] shrink-0 text-left">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Your <span className="text-blue-500">favorites</span> deserve a safe space
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                Private, encrypted, and built for peace of mind. <br />
                                Your data stays yours, always secure.
                            </p>
                        </div>
                        <div className="w-full md:w-[60%]">
                            <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                                <div className="w-3/4 h-3/4 rounded-xl bg-[#020617] border border-white/5 flex flex-col p-4 shadow-lg transform group-hover:scale-105 transition-transform duration-500">
                                    <div className="flex gap-2 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                    </div>
                                    <div className="flex-1 bg-white/5 rounded-lg w-full animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 2: Save Forever */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24"
                    >
                        <div className="w-full md:w-[40%] shrink-0 text-left md:text-right">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Type it once, <br /> <span className="text-blue-500">save it forever</span>
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                No need to remember URLs ever again. <br />
                                One click to save, accessible for a lifetime.
                            </p>
                        </div>
                        <div className="w-full md:w-[60%]">
                            <div className="aspect-video rounded-2xl bg-gradient-to-bl from-[#0f172a] to-[#020617] border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                                <div className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.2)] group-hover:scale-110 transition-transform duration-500">
                                    <div className="w-12 h-12 rounded bg-blue-500 transform rotate-45" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 3: Unsorted No More */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row items-center gap-12 md:gap-24"
                    >
                        <div className="w-full md:w-[40%] shrink-0 text-left">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Unsorted <span className="text-blue-500">no more</span>
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed mb-8">
                                All website links categorized, so you spend less time searching and more time browsing.
                            </p>

                            {/* Categories Button */}
                            <Link to="/auth?mode=signup" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent hover:bg-white/5 text-white rounded-full font-semibold border border-blue-500/30 transition-all group">
                                Categories
                                <FaArrowRight size={14} className="text-blue-500 transform -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                            </Link>
                        </div>
                        <div className="w-full md:w-[60%]">
                            <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                                <div className="grid grid-cols-2 gap-4 w-2/3 transform group-hover:rotate-6 transition-transform duration-500">
                                    <div className="h-24 bg-[#020617] rounded-xl border border-white/5" />
                                    <div className="h-24 bg-[#020617] rounded-xl border border-white/5 bg-blue-900/10" />
                                    <div className="h-24 bg-[#020617] rounded-xl border border-white/5 bg-blue-900/10" />
                                    <div className="h-24 bg-[#020617] rounded-xl border border-white/5" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- STICKY TOOLS SCROLL SECTION --- */}
                {/* 
                    Concept:
                    1. Tall Container (400vh) allows for scrolling time.
                    2. Sticky Inner Div (100vh) freezes the content in place.
                    3. Children transition opacity/scale based on scroll position.
                */}
                <div ref={targetRef} className="relative h-[400vh] w-full">
                    <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-[#020617]/50 backdrop-blur-sm">

                        {/* Centered Content Wrapper */}
                        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-24">

                            {/* Content Side */}
                            <div className="w-full md:w-[40%] relative min-h-[300px] flex flex-col justify-center">
                                {tools.map((tool, index) => (
                                    <motion.div
                                        key={tool.title}
                                        className="absolute inset-x-0 top-1/2 -translate-y-1/2"
                                        style={{ opacity: tool.opacity, pointerEvents: index === tools.length - 1 ? 'auto' : 'none' }} // Simple pointer events mgmt
                                        initial={{ opacity: 0 }}
                                    >
                                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                            {tool.title} <br /> <span className="text-blue-500">{tool.highlight}</span>
                                        </h2>
                                        <p className="text-xl text-slate-400 leading-relaxed mb-6">
                                            {tool.desc}
                                        </p>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300">
                                            {tool.icon} {tool.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Visual Side */}
                            <div className="w-full md:w-[60%] relative h-[60vh] flex items-center justify-center">
                                <div className="relative w-full aspect-video rounded-2xl bg-[#020617] border border-white/10 shadow-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent" />

                                    {tools.map((tool, index) => (
                                        <motion.div
                                            key={tool.title}
                                            className="absolute inset-0 flex items-center justify-center"
                                            style={{ opacity: tool.opacity, scale: tool.scale }}
                                        >
                                            {tool.visual}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Pagination / Progress Dots (Optional Visual Hint) */}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                            {tools.map((_, i) => {
                                // Simple active state based on range is hard to calc perfectly in render loop without derived state, 
                                // avoiding for simplicity unless requested.
                                return <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            })}
                        </div>
                    </div>
                </div>

            </div>

            {/* --- AESTHETIC FOOTER --- */}
            <footer className="relative z-20 w-full overflow-hidden bg-[#020617]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* Glows */}
                <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-900/20 blur-[150px] rounded-full pointer-events-none -z-20"></div>

                <div className="w-full pt-20 pb-12">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
                            <div className="col-span-1 md:col-span-4 space-y-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                                        L
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                                        Ledgerly
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                    Your personal digital vault for the web. Capture, organize, and rediscover your favorite links with a beautiful, distraction-free interface designed for clarity and focus.
                                </p>
                            </div>
                            <div className="col-span-1 md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                                <div>
                                    <h4 className="font-bold text-white mb-6">Tools</h4>
                                    <ul className="space-y-4 text-sm text-slate-500">
                                        <li><Link to="/auth?mode=signup" className="hover:text-blue-400 transition-colors">Browser Extension</Link></li>
                                        <li><Link to="/auth?mode=signup" className="hover:text-blue-400 transition-colors">QR Code Generator</Link></li>
                                        <li><Link to="/auth?mode=signup" className="hover:text-blue-400 transition-colors">Bulk Import</Link></li>
                                        <li><Link to="/auth?mode=signup" className="hover:text-blue-400 transition-colors">Bookmarklet</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-6">Features</h4>
                                    <ul className="space-y-4 text-sm text-slate-500">
                                        <li><Link to="/auth?mode=signup" className="hover:text-blue-400 transition-colors">Link Hub</Link></li>
                                        <li><Link to="/auth?mode=signup" className="hover:text-blue-400 transition-colors">Categories</Link></li>
                                        <li><Link to="/auth?mode=signup" className="hover:text-blue-400 transition-colors">Community</Link></li>
                                        <li><Link to="/auth?mode=signup" className="hover:text-blue-400 transition-colors">Private Vault</Link></li>
                                        <li><Link to="/auth?mode=signup" className="hover:text-blue-400 transition-colors">Collections</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-6">Legal</h4>
                                    <ul className="space-y-4 text-sm text-slate-500">
                                        <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                                        <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                                        <li><a href="https://khushangsingh.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Contact</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                            <p>© 2026 Ledgerly Inc. All rights reserved.</p>
                            <div className="flex items-center gap-6 mt-4 md:mt-0">
                                <a href="http://khushangsingh.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2 group">
                                    Designed & Built by Khushang Singh
                                    <FaArrowRight size={10} className="-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;