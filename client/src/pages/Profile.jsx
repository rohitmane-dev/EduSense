import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaChartBar, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';

// Placeholder for updateProfile until implemented
const updateProfile = async (formData) => {
    console.log('Update profile:', formData);
    return { success: true, message: 'Profile updated (mock)' };
};

const Profile = () => {
    const { user, fetchUser, logout } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [user, fetchUser]);

    const handleUpdate = async (formData) => {
        setMessage(null);
        try {
            const response = await updateProfile(formData);
            if (response.success) {
                // Assuming fetchUser updates the store with new data
                fetchUser();
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setIsEditing(false);
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to update profile.' });
            }
        } catch (error) {
            console.error('Update error:', error);
            setMessage({ type: 'error', text: 'An unexpected error occurred during update.' });
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    return (
        <div className="container p-4 md:p-8 mx-auto max-w-6xl">
            <header className="mb-8 flex justify-between items-center border-b border-gray-200 dark:border-dark-border pb-4 theme-transition">
                <h1 className="text-3xl font-bold text-light-text dark:text-white theme-transition">My Profile</h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <FaSignOutAlt /> Logout
                </button>
            </header>

            {message && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`mb-6 p-4 rounded-lg flex justify-between items-center ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/50' : 'bg-red-500/10 text-red-400 border border-red-500/50'
                        }`}
                >
                    <span>{message.text}</span>
                    <button onClick={() => setMessage(null)} className="text-lg"><FaTimes /></button>
                </motion.div>
            )}

            <div className="bg-white dark:bg-dark-panel p-4 md:p-8 rounded-2xl border border-gray-200 dark:border-dark-border shadow-lg theme-transition">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="w-16 h-16 bg-accent-teal rounded-full flex items-center justify-center text-3xl text-dark-bg font-bold">
                        {user?.username ? user.username[0].toUpperCase() : <FaUser />}
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white theme-transition">{user?.username || 'Guest User'}</h2>
                        <p className="text-gray-600 dark:text-gray-400 break-all theme-transition">{user?.email}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 theme-transition">
                        <FaUser className="text-accent-teal" /> Account Details
                    </h3>

                    {/* Placeholder for Edit Form */}
                    {isEditing ? (
                        <div className="p-4 bg-gray-100 dark:bg-black/20 rounded-lg theme-transition">
                            {/* In a real app, this would be a separate component */}
                            <p className="text-gray-700 dark:text-gray-300 italic theme-transition">Profile editing form goes here...</p>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleUpdate({})} // Placeholder call
                                className="mt-4 ml-3 px-4 py-2 bg-accent-teal text-dark-bg rounded-lg hover:bg-teal-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 theme-transition">
                            <p><strong>Role:</strong> {user?.role || 'Student'}</p>
                            <p><strong>Joined:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                            {user?.role === 'mentor' ? (
                                <>
                                    <p><strong>Status:</strong> {user?.isAvailable ? 'Available' : 'Busy'}</p>
                                    <p><strong>Expertise:</strong> {user?.expertise?.join(', ') || 'N/A'}</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>Total XP:</strong> {user?.points || 0}</p>
                                    <p><strong>Current Streak:</strong> {user?.streak || 0} days</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-8 px-6 py-3 bg-accent-teal text-dark-bg font-semibold rounded-xl hover:bg-teal-600 transition-colors"
                >
                    {isEditing ? 'View Profile' : 'Edit Profile'}
                </button>
            </div>

            {/* Placeholder for Stats/Activity */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mt-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 theme-transition">
                    <FaChartBar className="text-accent-teal" /> Learning Summary
                </h3>
                <div className="bg-white dark:bg-dark-panel p-6 rounded-2xl border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 theme-transition">
                    <p>Details about recent activity and subject statistics...</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;