import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaQuestionCircle, FaHistory, FaUser, FaSignOutAlt, FaTrophy, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import img from '../../public/logo.png';

/**
 * Mobile Menu Component
 * Slide-in drawer menu for mobile navigation
 */
const MobileMenu = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const menuItems = [
        { icon: <FaHome />, label: 'Dashboard', path: '/dashboard' },
        { icon: <FaQuestionCircle />, label: 'Ask Doubt', path: '/ask' },
        { icon: <FaHistory />, label: 'My Doubts', path: '/doubts' },
        { icon: <FaTrophy />, label: 'Leaderboard', path: '/leaderboard' },
        { icon: <FaUser />, label: 'Profile', path: '/profile' },
        { icon: <FaCog />, label: 'Settings', path: '/settings' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 bottom-0 w-80 bg-light-panel dark:bg-dark-panel z-50 md:hidden overflow-y-auto theme-transition"
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-light-text dark:text-white theme-transition">
                                    <img src={img} alt="EduSense Logo" className="h-10" />
                                </h2>
                                <p className="text-light-text-secondary dark:text-gray-400 text-sm mt-1 theme-transition">AI-Powered Learning</p>
                            </div>

                            {/* Menu Items */}
                            <nav className="space-y-2">
                                {menuItems.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleNavigation(item.path)}
                                        className="w-full flex items-center gap-4 px-4 py-3 text-light-text dark:text-white hover:bg-light-card dark:hover:bg-dark-card hover:text-accent-teal rounded-lg transition-all group theme-transition"
                                    >
                                        <span className="text-xl group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </span>
                                        <span className="font-medium">{item.label}</span>
                                    </motion.button>
                                ))}

                                {/* Logout */}
                                <motion.button
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: menuItems.length * 0.1 }}
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all group mt-4 theme-transition"
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform">
                                        <FaSignOutAlt />
                                    </span>
                                    <span className="font-medium">Logout</span>
                                </motion.button>
                            </nav>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
