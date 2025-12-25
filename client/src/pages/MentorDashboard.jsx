import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaUserGraduate, FaClock } from 'react-icons/fa';
import { getMentorDashboard } from '../services/mentorApi';
import socketService from '../services/socketService';

const MentorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [stats, setStats] = useState({ pending: 0, resolvedYour: 0, rating: 0 });
    const [priorityDoubts, setPriorityDoubts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!user) return;
            try {
                const data = await getMentorDashboard(user._id);
                setStats(data.stats);
                setPriorityDoubts(data.priorityDoubts);

                // Socket Connection
                const socket = socketService.connect(user._id);
                if (socket && user.role === 'mentor') {
                    socket.emit('join_mentor', user._id);

                    socket.on('new_doubt_alert', (newDoubt) => {
                        setPriorityDoubts(prev => [newDoubt, ...prev]);
                        // Optional: Play sound or show toast
                    });
                }
            } catch (error) {
                console.error("Failed to load mentor dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();

        return () => {
            socketService.disconnect();
        };
    }, [user]);

    if (loading) return <div className="p-10 text-center text-white">Loading Mentor Dashboard...</div>;

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-dark-border flex items-center gap-4">
            <div className={`p-3 rounded-full ${color} text-white`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mentor Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.name}</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                    icon={FaExclamationCircle}
                    label="Pending Reviews"
                    value={stats.pending}
                    color="bg-red-500"
                />
                <StatCard
                    icon={FaCheckCircle}
                    label="Resolved by You"
                    value={stats.resolvedYour}
                    color="bg-green-500"
                />
                <StatCard
                    icon={FaUserGraduate}
                    label="Mentor Rating"
                    value={stats.rating ? stats.rating.toFixed(1) : "N/A"}
                    color="bg-blue-500"
                />
            </div>

            {/* Priority Doubts Section */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-dark-border overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Priority Doubts</h2>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-dark-border">
                    {priorityDoubts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No priority doubts found. Good job!</div>
                    ) : (
                        priorityDoubts.map((doubt) => (
                            <motion.div
                                key={doubt._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors cursor-pointer group"
                                onClick={() => navigate(`/mentor/doubt/${doubt._id}`)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${doubt.status === 'escalated_to_mentor'
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                            }`}>
                                            {doubt.status === 'escalated_to_mentor' ? 'Escalated' : 'Low Confidence'}
                                        </span>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-accent-blue transition-colors">
                                            {doubt.questionText || "Image Question"}
                                        </h3>
                                    </div>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <FaClock /> {new Date(doubt.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-3">
                                        {doubt.confidence && (
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                AI Confidence: <span className={doubt.confidence < 70 ? 'text-red-500 font-bold' : 'text-green-500'}>
                                                    {Math.round(doubt.confidence * 100)}%
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                    <button className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
                                        View & Resolve
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MentorDashboard;
