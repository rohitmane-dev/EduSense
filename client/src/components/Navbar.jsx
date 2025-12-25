import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';
import img from '../../public/logo.png';


/**
 * Navbar Component
 * Top navigation bar with logo, mobile menu toggle, and profile
 */
const Navbar = () => {
    const { user } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="sticky top-0 z-50 bg-light-panel dark:bg-dark-bg border-b border-light-border dark:border-dark-border theme-transition shadow-sm"
            >
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-light-text dark:text-white hover:text-accent-teal transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>

                        {/* Logo */}
                        <Link to="/dashboard" className="flex hidden md:flex items-center">
                            <h1 className="text-2xl font-bold text-light-text dark:text-white theme-transition">
                                <img src={img} alt="EduSense Logo" className="h-10" />
                            </h1>
                        </Link>

                        {/* Right side: Theme Toggle + Profile */}
                        <div className="flex items-center gap-4">
                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Profile Avatar */}
                            <Link to="/profile">
                                <div className="flex items-center gap-4">
                                    {user?.picture ? (
                                        <img
                                            src={user.picture}
                                            alt={user.name}
                                            className="w-10 h-10 cursor-pointer rounded-full border-2 border-accent-teal hover:border-accent-orange transition-colors"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 cursor-pointer rounded-full bg-accent-teal flex items-center justify-center text-dark-bg font-bold hover:bg-accent-orange transition-colors">
                                            {user?.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
        </>
    );
};

export default Navbar;
