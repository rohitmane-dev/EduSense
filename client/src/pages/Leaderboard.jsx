import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaFire, FaUserCircle } from 'react-icons/fa';
import api from '../config/api';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/api/users/leaderboard');
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <FaTrophy className="text-yellow-400 text-3xl" />;
            case 1: return <FaMedal className="text-gray-300 text-2xl" />;
            case 2: return <FaMedal className="text-orange-400 text-2xl" />;
            default: return <span className="text-xl font-bold text-gray-500 dark:text-gray-500">#{index + 1}</span>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-light-text dark:text-white flex items-center gap-3 theme-transition">
                    <FaTrophy className="text-yellow-500" /> Global Leaderboard
                </h1>
                <p className="text-light-text-secondary dark:text-gray-400 mt-2 theme-transition">Top students mastering concepts with AI</p>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-dark-panel rounded-2xl shadow-xl border border-gray-200 dark:border-dark-border overflow-hidden theme-transition">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border theme-transition">
                                <tr>
                                    <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider theme-transition">Rank</th>
                                    <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider theme-transition">Student</th>
                                    <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider theme-transition">Streak</th>
                                    <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider theme-transition">XP Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                                {users.map((user, index) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="hover:bg-gray-50 dark:hover:bg-dark-card transition-colors theme-transition"
                                    >
                                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center w-8">
                                                {getRankIcon(index)}
                                            </div>
                                        </td>
                                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {user.picture ? (
                                                    <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-dark-border theme-transition" />
                                                ) : (
                                                    <FaUserCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white theme-transition">{user.name}</p>
                                                    {user.badges && user.badges.length > 0 && (
                                                        <span className="text-xs text-accent-teal bg-teal-900/30 px-2 py-0.5 rounded-full border border-teal-900/50">
                                                            {user.badges[0]}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-orange-500 font-bold">
                                                <FaFire /> {user.streak} Days
                                            </div>
                                        </td>
                                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">
                                            <span className="font-bold text-accent-teal text-lg">{user.points.toLocaleString()} XP</span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
