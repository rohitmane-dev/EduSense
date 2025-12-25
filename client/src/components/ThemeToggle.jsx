import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import useThemeStore from '../store/useThemeStore';

/**
 * ThemeToggle Component
 * Animated toggle switch for dark/light mode
 */
const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();
    const isDark = theme === 'dark';

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative w-14 h-7 bg-gray-700 dark:bg-gray-700 bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            {/* Sliding circle with icon */}
            <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                animate={{
                    x: isDark ? 0 : 24,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                }}
            >
                {isDark ? (
                    <FaMoon className="text-xs text-gray-800" />
                ) : (
                    <FaSun className="text-xs text-yellow-500" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
