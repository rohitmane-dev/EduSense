import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFire, FaTrophy, FaMedal, FaChartPie, FaArrowRight, FaBookOpen, FaBrain, FaQuestionCircle } from 'react-icons/fa';
import DoubtItem from '../components/DoubtItem';
import Loader from '../components/Loader';
import useAuthStore from '../store/useAuthStore';
import useDoubtStore from '../store/useDoubtStore';
import { getMyDoubts } from '../services/askApi';

const Dashboard = () => {
    const { user, fetchUser } = useAuthStore();
    const { doubts, loadMyDoubts, setLoading, loading } = useDoubtStore();

    useEffect(() => {
        if (!user) fetchUser();
    }, [user, fetchUser]);

    useEffect(() => {
        const loadDoubts = async () => {
            setLoading(true);
            try {
                const response = await getMyDoubts({ limit: 5 }); // Fetch only recent 5
                if (response.success) {
                    loadMyDoubts(response.data);
                }
            } catch (error) {
                console.error('Error loading doubts:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDoubts();
    }, [loadMyDoubts, setLoading]);

    // Calculate Analytics
    const totalDoubts = user?.stats?.totalDoubts || doubts.length || 0;
    const subjects = doubts.reduce((acc, curr) => {
        const subject = curr.subject || 'General';
        acc[subject] = (acc[subject] || 0) + 1;
        return acc;
    }, {});
    const topSubject = Object.keys(subjects).sort((a, b) => subjects[b] - subjects[a])[0] || 'N/A';

    return (
        <div className="container p-4 md:p-8 mx-auto max-w-6xl">
            {/* Welcome Header */}
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-light-text dark:text-white theme-transition mb-2">
                        Dashboard
                    </h1>
                    <p className="text-light-text-secondary dark:text-gray-400 theme-transition">Track your learning progress and stats.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm text-light-text-secondary dark:text-gray-500 theme-transition">Last active: {new Date().toLocaleDateString()}</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-light-panel dark:bg-dark-panel p-6 rounded-xl border border-light-border dark:border-dark-border shadow-sm theme-transition">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg">
                            <FaFire className="text-xl" />
                        </div>
                        <div>
                            <p className="text-light-text-secondary dark:text-gray-400 text-sm">Current Streak</p>
                            <h3 className="text-2xl font-bold text-light-text dark:text-white theme-transition">{user?.streak || 0} Days</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-light-panel dark:bg-dark-panel p-6 rounded-xl border border-light-border dark:border-dark-border shadow-sm theme-transition">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-lg">
                            <FaTrophy className="text-xl" />
                        </div>
                        <div>
                            <p className="text-light-text-secondary dark:text-gray-400 text-sm">Total XP</p>
                            <h3 className="text-2xl font-bold text-light-text dark:text-white theme-transition">{user?.points || 0} XP</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-light-panel dark:bg-dark-panel p-6 rounded-xl border border-light-border dark:border-dark-border shadow-sm theme-transition">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                            <FaBookOpen className="text-xl" />
                        </div>
                        <div>
                            <p className="text-light-text-secondary dark:text-gray-400 text-sm">Questions Asked</p>
                            <h3 className="text-2xl font-bold text-light-text dark:text-white theme-transition">{totalDoubts}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-light-panel dark:bg-dark-panel p-6 rounded-xl border border-light-border dark:border-dark-border shadow-sm theme-transition">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
                            <FaBrain className="text-xl" />
                        </div>
                        <div>
                            <p className="text-light-text-secondary dark:text-gray-400 text-sm">Top Subject</p>
                            <h3 className="text-2xl font-bold text-light-text dark:text-white theme-transition truncate max-w-[120px]">{topSubject}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Ask Doubt CTA */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="bg-gradient-to-r from-accent-teal to-blue-600 rounded-2xl p-8 shadow-lg relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-4">Stuck on a concept?</h2>
                            <p className="text-blue-100 mb-6 max-w-lg">
                                Get instant, AI-powered explanations with diagrams and step-by-step solutions.
                            </p>
                            <Link
                                to="/ask"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-md"
                            >
                                Ask a Doubt <FaArrowRight />
                            </Link>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 group-hover:scale-110 transition-transform">
                            <FaQuestionCircle className="text-[200px] text-white" />
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-light-text dark:text-white theme-transition">Recent Activity</h2>
                            <Link to="/doubts" className="text-accent-teal hover:underline text-sm">View All</Link>
                        </div>
                        {loading ? (
                            <Loader text="Loading activity..." />
                        ) : doubts.length === 0 ? (
                            <div className="bg-light-panel dark:bg-dark-panel rounded-xl p-8 text-center border border-light-border dark:border-dark-border theme-transition">
                                <p className="text-light-text-secondary dark:text-gray-400">No recent activity. Start asking questions!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {doubts.map((doubt) => (
                                    <DoubtItem key={doubt._id || doubt.doubtId} doubt={doubt} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    {/* Subject Distribution (Simple List) */}
                    <div className="bg-light-panel dark:bg-dark-panel rounded-xl p-6 border border-light-border dark:border-dark-border theme-transition">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-light-text dark:text-white flex items-center gap-2 theme-transition">
                                <FaChartPie className="text-light-text-secondary dark:text-gray-400" /> Subject Breakdown
                            </h3>
                            {Object.keys(subjects).length > 5 && (
                                <Link to="/doubts" className="text-accent-teal hover:underline text-xs">
                                    View All
                                </Link>
                            )}
                        </div>
                        <div className="space-y-3">
                            {Object.entries(subjects).slice(0, 5).map(([subject, count], index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-light-text dark:text-gray-300">{subject}</span>
                                        <span className="text-light-text-secondary dark:text-gray-500">{count}</span>
                                    </div>
                                    <div className="h-2 bg-light-card dark:bg-dark-bg rounded-full overflow-hidden theme-transition">
                                        <div
                                            className="h-full bg-accent-teal opacity-80"
                                            style={{ width: `${(count / totalDoubts) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {Object.keys(subjects).length === 0 && (
                                <p className="text-light-text-secondary dark:text-gray-500 text-sm italic">No data yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Badges Widget */}
                    <div className="bg-light-panel dark:bg-dark-panel rounded-xl p-6 border border-light-border dark:border-dark-border theme-transition">
                        <h3 className="font-bold text-light-text dark:text-white mb-4 flex items-center gap-2 theme-transition">
                            <FaMedal className="text-light-text-secondary dark:text-gray-400" /> Recent Badges
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {user?.badges && user.badges.length > 0 ? (
                                user.badges.slice(0, 5).map((badge, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-purple-900/30 text-purple-400 border border-purple-900/50 rounded-full text-xs font-medium">
                                        {badge}
                                    </span>
                                ))
                            ) : (
                                <p className="text-light-text-secondary dark:text-gray-500 text-sm italic">No badges earned yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;