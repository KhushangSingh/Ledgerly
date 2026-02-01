import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaBell, FaPalette, FaSave, FaPuzzlePiece, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        notifications: true,
        theme: 'dark'
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("New passwords don't match");
        }

        if (passwordData.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        const toastId = toast.loading('Updating password...');
        try {
            await api.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated successfully', { id: toastId });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || 'Failed to update password', { id: toastId });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Settings saved! (Simulation)');
    };

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            await api.delete('/auth/me');
            logout();
            navigate('/');
        } catch (err) {
            console.error('Failed to delete account', err);
            alert('Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[150px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-500/15 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            <div className="pt-24 px-6 md:px-12 max-w-3xl mx-auto pb-20">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Settings</h1>
                    <p className="text-gray-400">Manage your account preferences and profile.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Profile Section */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaUser className="text-blue-500" /> Profile Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled
                                        className="w-full px-4 py-3 bg-[#111]/50 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </section>

                        <hr className="border-white/5" />

                        {/* Password & Security Section */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaLock className="text-green-500" /> Password & Security
                            </h2>
                            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                                <h3 className="text-white font-medium mb-4">
                                    {user?.hasPassword ? 'Change Password' : 'Set a Password'}
                                </h3>
                                <div className="space-y-4">
                                    {user?.hasPassword && (
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
                                            />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-2 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handlePasswordUpdate}
                                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors text-sm"
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <hr className="border-white/5" />

                        {/* Preferences */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaPalette className="text-purple-500" /> Preferences
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#111] border border-white/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FaBell className="text-gray-400" />
                                        <span className="text-white">Email Notifications</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="notifications" checked={formData.notifications} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </section>



                        <div className="pt-4">
                            <button type="submit" className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                <FaSave /> Save Changes
                            </button>
                        </div>

                    </form>
                </div>

                {/* Danger Zone */}
                <div className="mt-12 bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900" />
                    <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                        <FaUser className="text-red-500" /> Danger Zone
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Permanently delete your account and all of your content. This action is not reversible, so please continue with caution.
                    </p>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                        Delete Account
                    </button>
                </div>

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
                        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-2">Delete Account?</h3>
                            <p className="text-gray-400 mb-8">
                                Are you absolutely sure? This action cannot be undone. All your links, categories, and data will be permanently deleted.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Forever'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
