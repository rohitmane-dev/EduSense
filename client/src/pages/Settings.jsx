import { useState, useEffect } from 'react';
import { FaCog, FaMoon, FaBell, FaLock } from 'react-icons/fa';
import useThemeStore from '../store/useThemeStore';
import ChangePasswordModal from '../components/ChangePasswordModal';

const Settings = () => {
    const { theme, toggleTheme } = useThemeStore();
    const [notifications, setNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Load notification preferences from localStorage
    useEffect(() => {
        const savedNotifications = localStorage.getItem('notifications');
        const savedEmailNotifications = localStorage.getItem('emailNotifications');

        if (savedNotifications !== null) {
            setNotifications(JSON.parse(savedNotifications));
        }
        if (savedEmailNotifications !== null) {
            setEmailNotifications(JSON.parse(savedEmailNotifications));
        }
    }, []);

    // Handle theme toggle
    const handleThemeToggle = () => {
        toggleTheme();
    };

    // Handle notifications toggle
    const handleNotificationsToggle = () => {
        const newValue = !notifications;
        setNotifications(newValue);
        localStorage.setItem('notifications', JSON.stringify(newValue));

        // Show toast notification
        if (newValue) {
            console.log('Notifications enabled');
        } else {
            console.log('Notifications disabled');
        }
    };

    // Handle email notifications toggle
    const handleEmailNotificationsToggle = () => {
        const newValue = !emailNotifications;
        setEmailNotifications(newValue);
        localStorage.setItem('emailNotifications', JSON.stringify(newValue));

        // Show toast notification
        if (newValue) {
            console.log('Email notifications enabled');
        } else {
            console.log('Email notifications disabled');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-light-text dark:text-white flex items-center gap-3 theme-transition">
                    <FaCog className="text-gray-400 dark:text-gray-400" /> Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 theme-transition">
                    Manage your account preferences and settings
                </p>
            </header>

            <div className="space-y-6">
                {/* Appearance Section */}
                <div className="bg-white dark:bg-dark-panel rounded-xl shadow-sm border border-gray-200 dark:border-dark-border theme-transition">
                    <div className="p-6 border-b border-gray-200 dark:border-dark-border theme-transition">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white theme-transition">
                            Appearance
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 theme-transition">
                            Customize how EduSense looks
                        </p>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg theme-transition">
                                <FaMoon />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white theme-transition">
                                    Dark Mode
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 theme-transition">
                                    {theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={theme === 'dark'}
                                onChange={handleThemeToggle}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-dark-card peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border-gray-300 dark:border-gray-600 theme-transition"></div>
                        </label>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-white dark:bg-dark-panel rounded-xl shadow-sm border border-gray-200 dark:border-dark-border theme-transition">
                    <div className="p-6 border-b border-gray-200 dark:border-dark-border theme-transition">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white theme-transition">
                            Notifications
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 theme-transition">
                            Manage how you receive updates
                        </p>
                    </div>

                    {/* Push Notifications Toggle */}
                    <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-dark-border theme-transition">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg theme-transition">
                                <FaBell />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white theme-transition">
                                    Push Notifications
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 theme-transition">
                                    Receive in-app notifications
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={handleNotificationsToggle}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-dark-card peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600 border-gray-300 dark:border-gray-600 theme-transition"></div>
                        </label>
                    </div>

                    {/* Email Notifications Toggle */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg theme-transition">
                                <FaBell />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white theme-transition">
                                    Email Notifications
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 theme-transition">
                                    Receive updates via email
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={handleEmailNotificationsToggle}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-dark-card peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 border-gray-300 dark:border-gray-600 theme-transition"></div>
                        </label>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white dark:bg-dark-panel rounded-xl shadow-sm border border-gray-200 dark:border-dark-border theme-transition">
                    <div className="p-6 border-b border-gray-200 dark:border-dark-border theme-transition">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white theme-transition">
                            Security
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 theme-transition">
                            Keep your account secure
                        </p>
                    </div>

                    {/* Change Password */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg theme-transition">
                                <FaLock />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white theme-transition">
                                    Change Password
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 theme-transition">
                                    Update your account password
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

export default Settings;