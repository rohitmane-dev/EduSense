import { useState, useEffect } from 'react';
import { FaUserCheck, FaChartLine, FaTimes, FaCheck } from 'react-icons/fa';
import { getPendingMentors, approveMentor, getSystemAnalytics } from '../services/adminApi';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('approvals');
    const [pendingMentors, setPendingMentors] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'approvals') {
                const data = await getPendingMentors();
                setPendingMentors(data);
            } else if (activeTab === 'analytics') {
                const data = await getSystemAnalytics();
                setAnalytics(data);
            }
        } catch (error) {
            console.error("Failed to load admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, status) => {
        try {
            await approveMentor(id, status);
            setPendingMentors(prev => prev.filter(m => m._id !== id));
        } catch (error) {
            console.error("Failed to update mentor status", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-dark-border">
                <button
                    onClick={() => setActiveTab('approvals')}
                    className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'approvals'
                        ? 'text-accent-blue border-b-2 border-accent-blue'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    <FaUserCheck className="inline mr-2" /> Pending Approvals
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'analytics'
                        ? 'text-accent-blue border-b-2 border-accent-blue'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    <FaChartLine className="inline mr-2" /> System Analytics
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <>
                    {activeTab === 'approvals' && (
                        <div className="bg-white dark:bg-dark-card rounded-xl shadow border border-gray-200 dark:border-dark-border overflow-hidden">
                            {pendingMentors.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No pending mentor approvals.</div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-dark-bg text-gray-500 dark:text-gray-400">
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Expertise</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                                        {pendingMentors.map(mentor => (
                                            <tr key={mentor._id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50">
                                                <td className="p-4 font-medium text-gray-900 dark:text-white">{mentor.userId?.name}</td>
                                                <td className="p-4 text-gray-600 dark:text-gray-300">{mentor.userId?.email}</td>
                                                <td className="p-4 text-gray-600 dark:text-gray-300">
                                                    {mentor.expertise?.join(', ') || 'N/A'}
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleApproval(mentor._id, 'approved')}
                                                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                                    >
                                                        <FaCheck className="inline mr-1" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproval(mentor._id, 'rejected')}
                                                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                                    >
                                                        <FaTimes className="inline mr-1" /> Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {activeTab === 'analytics' && analytics && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow border border-gray-200 dark:border-dark-border">
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Doubts</h3>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{analytics.totalDoubts}</p>
                            </div>
                            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow border border-gray-200 dark:border-dark-border">
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Resolution Rate</h3>
                                <p className="text-3xl font-bold text-accent-teal mt-2">{analytics.resolutionRate.toFixed(1)}%</p>
                            </div>
                            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow border border-gray-200 dark:border-dark-border">
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Mentors</h3>
                                <p className="text-3xl font-bold text-blue-500 mt-2">{analytics.mentorCount}</p>
                            </div>
                            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow border border-gray-200 dark:border-dark-border md:col-span-3">
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Average AI Confidence</h3>
                                <div className="mt-4 w-full bg-gray-200 dark:bg-dark-bg rounded-full h-4">
                                    <div
                                        className="bg-purple-500 h-4 rounded-full"
                                        style={{ width: `${analytics.avgAiConfidence}%` }}
                                    ></div>
                                </div>
                                <p className="text-right mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {analytics.avgAiConfidence.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
