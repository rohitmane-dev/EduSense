import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoubtDetail, resolveDoubt, escalateDoubt } from '../services/mentorApi';
import { FaArrowLeft, FaCheck, FaExclamationTriangle, FaRobot, FaUser } from 'react-icons/fa';

const MentorDoubtDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doubt, setDoubt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responseMode, setResponseMode] = useState('verify'); // 'verify' or 'edit'
    const [responseText, setResponseText] = useState('');
    const [escalationReason, setEscalationReason] = useState('');
    const [showEscalateModal, setShowEscalateModal] = useState(false);

    useEffect(() => {
        const fetchDoubt = async () => {
            try {
                const data = await getDoubtDetail(id);
                setDoubt(data);
                setResponseText(data.answer); // Pre-fill with AI answer
            } catch (error) {
                console.error("Failed to load doubt", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoubt();
    }, [id]);

    const handleResolve = async () => {
        try {
            await resolveDoubt(id, {
                mentorId: "temp_mentor_id", // Should be from Auth Context
                answerText: responseText,
                action: responseMode === 'verify' ? 'verify_ai' : 'override'
            });
            navigate('/mentor/dashboard');
        } catch (error) {
            console.error("Failed to resolve", error);
        }
    };

    const handleEscalate = async () => {
        try {
            await escalateDoubt(id, escalationReason);
            navigate('/mentor/dashboard');
        } catch (error) {
            console.error("Failed to escalate", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!doubt) return <div>Doubt not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-900 dark:hover:text-white transition-colors">
                <FaArrowLeft /> Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Student Query Section */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-dark-border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <FaUser className="text-gray-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{doubt.userId?.name || 'Student'}</h3>
                                <p className="text-xs text-gray-500">Asked {new Date(doubt.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{doubt.questionText}</p>
                        {/* If Image exists, show it here (assuming frameId or direct link) */}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-300 font-semibold">
                            <FaRobot /> AI Suggestion
                            <span className="text-xs font-normal ml-auto bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">
                                {Math.round(doubt.confidence * 100)}% Confidence
                            </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-dark-panel p-4 rounded-lg">
                            {doubt.answer}
                        </p>
                    </div>
                </div>

                {/* Mentor Action Section */}
                <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-dark-border sticky top-6 self-start">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Resolve Doubt</h2>

                    <div className="flex bg-gray-100 dark:bg-dark-bg p-1 rounded-lg mb-6">
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${responseMode === 'verify' ? 'bg-white shadow dark:bg-dark-panel text-blue-600' : 'text-gray-500'}`}
                            onClick={() => { setResponseMode('verify'); setResponseText(doubt.answer); }}
                        >
                            Verify AI Answer
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${responseMode === 'edit' ? 'bg-white shadow dark:bg-dark-panel text-blue-600' : 'text-gray-500'}`}
                            onClick={() => setResponseMode('edit')}
                        >
                            Edit / Rewrite
                        </button>
                    </div>

                    <textarea
                        className="w-full h-40 p-4 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none mb-6 text-gray-800 dark:text-gray-200"
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        readOnly={responseMode === 'verify'}
                        placeholder="Type your explanation here..."
                    />

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleResolve}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
                        >
                            <FaCheck /> {responseMode === 'verify' ? 'Approve AI Answer' : 'Submit Correction'}
                        </button>

                        <button
                            onClick={() => setShowEscalateModal(true)}
                            className="w-full py-3 bg-white dark:bg-dark-panel border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-bg text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all"
                        >
                            Escalate to Senior Expert
                        </button>
                    </div>
                </div>
            </div>

            {/* Simple Escalate Modal */}
            {showEscalateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center cursor-pointer" onClick={() => setShowEscalateModal(false)}>
                    <div className="bg-white dark:bg-dark-card p-6 rounded-xl w-96 cursor-default" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Escalate Doubt</h3>
                        <textarea
                            className="w-full h-24 border p-2 rounded mb-4 dark:bg-dark-bg dark:text-white"
                            placeholder="Reason for escalation..."
                            value={escalationReason}
                            onChange={(e) => setEscalationReason(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setShowEscalateModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button onClick={handleEscalate} className="px-4 py-2 bg-red-600 text-white rounded">Escalate</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorDoubtDetail;
