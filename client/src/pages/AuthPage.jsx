import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaGithub, FaEnvelope, FaLock, FaUser, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import logo from "/logo.png";

const AuthPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const { login, register, isAuthenticated, error, clearErrors } = useAuth();

    const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. REDIRECT LOGIC
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/link-hub', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const newMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
        setMode(newMode);
        setFormData({ username: '', email: '', password: '' });
        if (error) clearErrors();
    }, [searchParams]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (error) clearErrors();
        try {
            if (mode === 'login') await login({ email: formData.email, password: formData.password });
            else await register({ username: formData.username, email: formData.email, password: formData.password });
        } catch (err) { }
        setIsSubmitting(false);
    };

    const toggleMode = () => {
        if (error) clearErrors();
        const newMode = mode === 'login' ? 'signup' : 'login';
        navigate(`/auth?mode=${newMode}`);
    };

    const inputClasses = "w-full pl-11 pr-4 py-4 bg-[#0a0a0a]/80 border border-white/5 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-[#0a0a0a] focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 shadow-inner";

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans text-gray-200 selection:bg-blue-500/30">

            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-6 z-50 py-2" // Added py-2 for easier clicking
            >
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group px-4 py-2 rounded-full hover:bg-white/5"
                >
                    <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Home</span>
                </button>
            </motion.div>

            <div className="relative z-10 w-full max-w-[1000px] flex flex-col md:flex-row items-center justify-center p-6 gap-16 lg:gap-32">

                {/* Branding Left */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hidden md:flex flex-col flex-1 max-w-sm space-y-8"
                >
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Ledgerly" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
                        <span className="text-2xl font-bold tracking-wide text-white">Ledgerly</span>
                    </div>

                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-white mb-6">
                            Your Links, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-700 whitespace-nowrap">Perfectly Organized</span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-blue-900/50 pl-6">
                            Save, organize, and access your favorite links from anywhere. Build your personal knowledge vault.
                        </p>
                    </div>
                </motion.div>

                {/* Form Right */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-[400px]"
                >
                    <div className="relative bg-[#111]/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {mode === 'login' ? 'Welcome Back' : 'Get Started'}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {mode === 'login' ? 'Access your dashboard' : 'Create your secure account'}
                            </p>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {mode === 'signup' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative group overflow-hidden">
                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors text-sm" />
                                        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={inputClasses} required={mode === 'signup'} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors text-sm" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" className={inputClasses} required />
                            </div>

                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors text-sm" />
                                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={inputClasses} required />
                            </div>

                            {mode === 'login' && (
                                <div className="flex justify-end">
                                    <Link to="/auth/forgot-password" className="text-xs text-gray-500 hover:text-blue-400 transition-colors">Forgot Password?</Link>
                                </div>
                            )}

                            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.2)] transition-all flex items-center justify-center gap-2 group">
                                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{mode === 'login' ? 'Sign In' : 'Create Account'} <FaArrowRight className="text-xs opacity-70 group-hover:translate-x-1 transition-transform" /></>}
                            </motion.button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="px-3 text-gray-600 bg-[#0c0c0c] border border-white/5 rounded-full backdrop-blur-xl">Or</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <a href={`${API_BASE}/api/auth/google`} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222] border border-white/5 rounded-xl text-gray-300 transition-all hover:border-white/10 group">
                                <FaGoogle className="text-sm group-hover:text-white transition-colors" /><span className="text-xs font-medium">Google</span>
                            </a>
                            <a href={`${API_BASE}/api/auth/github`} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222] border border-white/5 rounded-xl text-gray-300 transition-all hover:border-white/10 group">
                                <FaGithub className="text-sm group-hover:text-white transition-colors" /><span className="text-xs font-medium">GitHub</span>
                            </a>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                {mode === 'login' ? "New here?" : "Member already?"}
                                <button onClick={toggleMode} className="ml-2 text-blue-500 hover:text-blue-400 font-medium transition-colors">
                                    {mode === 'login' ? 'Create an account' : 'Login now'}
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPage;