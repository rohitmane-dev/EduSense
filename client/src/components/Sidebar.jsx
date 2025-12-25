import { motion } from 'framer-motion';
import { FaHome, FaQuestionCircle, FaHistory, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Sidebar Component
 * Desktop-only vertical navigation sidebar
 */
import useAuthStore from '../store/useAuthStore';
import { FaFire, FaTrophy } from 'react-icons/fa';

// ...

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const menuItems = [
        { icon: <FaHome />, label: 'Dashboard', path: '/dashboard' },
        { icon: <FaQuestionCircle />, label: 'Ask Doubt', path: '/ask' },
        { icon: <FaHistory />, label: 'History', path: '/doubts' },
        { icon: <FaTrophy />, label: 'Leaderboard', path: '/leaderboard' },
        { icon: <FaUser />, label: 'Profile', path: '/profile' },
        { icon: <FaCog />, label: 'Settings', path: '/settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden md:flex max-h-[90vh] flex-col w-64 bg-light-panel dark:bg-dark-panel border-r border-light-border dark:border-dark-border min-h-screen sticky top-16 theme-transition"
        >
            {/* User Stats */}
            <div className="px-4 pt-6 pb-2">
                <div className="bg-light-card dark:bg-dark-card p-4 rounded-xl border border-light-border dark:border-dark-border shadow-lg theme-transition">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-light-border dark:border-dark-border/50">
                        <div className="flex items-center gap-2 text-orange-500">
                            <FaFire className="text-lg animate-pulse" />
                            <span className="font-bold text-sm">{user?.streak || 0} Day Streak</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-500">
                        <FaTrophy className="text-lg" />
                        <span className="font-bold text-sm">{user?.points || 0} XP</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 flex flex-col space-y-2">
                {menuItems.map((item, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all group theme-transition ${isActive(item.path)
                            ? 'bg-accent-teal text-dark-bg font-semibold'
                            : 'text-light-text dark:text-white hover:bg-light-card dark:hover:bg-dark-card hover:text-accent-teal'
                            }`}
                    >
                        <span
                            className={`text-xl transition-transform group-hover:scale-110 ${isActive(item.path) ? 'text-dark-bg' : ''
                                }`}
                        >
                            {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                    </motion.button>
                ))}

                {/* Logout Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: menuItems.length * 0.05 }}
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all group text-red-400 hover:bg-red-500/10 hover:text-red-300 mt-auto theme-transition"
                >
                    <span className="text-xl transition-transform group-hover:scale-110">
                        <FaSignOutAlt />
                    </span>
                    <span className="font-medium">Logout</span>
                </motion.button>
            </nav>

            <div className="p-4 border-t border-light-border dark:border-dark-border bg-light-panel dark:bg-dark-panel theme-transition">
                <div className="text-xs text-light-text-secondary dark:text-gray-500 text-center">
                    <p className="font-semibold text-light-text-secondary dark:text-gray-400">EduSense AI</p>
                    <p className="mt-1 text-[10px] opacity-70">Powered by Groq: Llama 3</p>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
