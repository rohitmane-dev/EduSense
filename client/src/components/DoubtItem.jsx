import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaBookmark, FaStar, FaClock, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { deleteDoubt } from '../services/askApi';
import useDoubtStore from '../store/useDoubtStore';

/**
 * DoubtItem Component
 * Collapsible doubt item for history list
 */
const DoubtItem = ({ doubt, onClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { removeDoubt } = useDoubtStore();

    const handleClick = () => {
        setIsExpanded(!isExpanded);
        if (onClick) onClick(doubt);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            await deleteDoubt(doubt.doubtId || doubt._id);
            removeDoubt(doubt.doubtId || doubt._id);
        } catch (error) {
            console.error('Error deleting doubt:', error);
        }
    };

    const getTimeAgo = (date) => {
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true });
        } catch {
            return 'Recently';
        }
    };

    const confidencePercentage = Math.round((doubt.confidence || 0) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-panel rounded-xl shadow-md border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-lg transition-all theme-transition"
        >
            {/* Header - Always Visible */}
            <div className="flex items-start">
                <button
                    onClick={handleClick}
                    className="flex-1 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-card transition-colors flex items-start justify-between gap-4 theme-transition"
                >
                    <div className="flex-1 min-w-0">
                        {/* Question */}
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 theme-transition">
                            {doubt.questionText}
                        </h4>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                                <FaClock />
                                {getTimeAgo(doubt.createdAt)}
                            </span>

                            {doubt.subject && (
                                <span className="px-2 py-1 bg-accent-teal/10 text-accent-teal rounded-full font-medium">
                                    {doubt.subject}
                                </span>
                            )}

                            {doubt.confidence && (
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">{confidencePercentage}%</span> confidence
                                </span>
                            )}

                            {doubt.rating > 0 && (
                                <span className="flex items-center gap-1">
                                    <FaStar className="text-yellow-400" />
                                    {doubt.rating}/5
                                </span>
                            )}

                            {doubt.isBookmarked && (
                                <span className="flex items-center gap-1 text-accent-teal">
                                    <FaBookmark />
                                    Saved
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="flex-shrink-0 text-gray-400 dark:text-gray-400 mt-1">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                </button>

                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    className="p-4 text-gray-300 dark:text-gray-300 hover:text-red-500 transition-colors border-l border-gray-100 dark:border-dark-border theme-transition"
                    title="Delete Doubt"
                >
                    <FaTrash />
                </button>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-dark-border overflow-hidden theme-transition"
                    >
                        <div className="p-4 space-y-4 bg-gray-50 dark:bg-dark-card theme-transition">
                            {/* Steps */}
                            {doubt.answerSteps && doubt.answerSteps.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 theme-transition">Steps:</h5>
                                    <div className="space-y-2">
                                        {doubt.answerSteps.map((step, index) => (
                                            <div
                                                key={index}
                                                className="text-sm text-gray-700 dark:text-gray-400 pl-4 border-l-2 border-gray-300 dark:border-gray-600 theme-transition"
                                            >
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Final Answer */}
                            {doubt.finalAnswer && (
                                <div>
                                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 theme-transition">Answer:</h5>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-dark-panel p-3 rounded-lg border-l-4 border-accent-teal theme-transition">
                                        {doubt.finalAnswer}
                                    </p>
                                </div>
                            )}

                            {/* Confidence Bar */}
                            {doubt.confidence && (
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 theme-transition">Confidence</span>
                                        <span className="text-xs font-bold text-accent-teal">
                                            {confidencePercentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-dark-bg rounded-full h-1.5 theme-transition">
                                        <div
                                            className="h-full bg-accent-teal rounded-full transition-all"
                                            style={{ width: `${confidencePercentage}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DoubtItem;
