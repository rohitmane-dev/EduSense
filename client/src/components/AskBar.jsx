import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaMicrophone, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { askTextQuestion } from '../services/askApi';
import useDoubtStore from '../store/useDoubtStore';
import useAuthStore from '../store/useAuthStore';

import MediaLibraryModal from './MediaLibraryModal';

/**
 * AskBar Component
 * Input bar for asking questions with AI
 */
const AskBar = ({ onAnswerReceived, onFileSelect, contextText }) => {
    const [question, setQuestion] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { askingQuestion, setAskingQuestion, addDoubt, setError } = useDoubtStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const maxLength = 1000;
    const remainingChars = maxLength - question.length;

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuestion(prev => prev + (prev ? ' ' : '') + transcript);
            };

            recognition.start();
        } else {
            alert('Speech recognition is not supported in this browser.');
        }
    };

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleUploadNew = () => {
        fileInputRef.current.click();
        setIsModalOpen(false);
    };

    const handleSelectHistoryItem = (item) => {
        if (onFileSelect) {
            onFileSelect(item); // Pass the history item object
        }
        setIsModalOpen(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (onFileSelect) {
                onFileSelect(file);
            } else {
                navigate('/upload', { state: { file } });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!question.trim() || askingQuestion) return;

        if (question.length > maxLength) {
            setError('Question is too long (max 1000 characters)');
            return;
        }

        setAskingQuestion(true);
        setError(null);

        try {
            // The contextText already contains ONLY the selected text from the rectangle
            // We send it as the question directly (or prepend minimally)
            let fullQuestion = question;
            if (contextText && contextText.trim()) {
                // Option 1: Send ONLY the selected text + question
                fullQuestion = `${contextText}\n\nQuestion: ${question}`;
                console.log('📝 Asking with SELECTED text only:', fullQuestion);
            }

            const response = await askTextQuestion(fullQuestion);

            if (response.success) {
                // Add doubt to store
                addDoubt(response.data);

                // Callback to parent
                if (onAnswerReceived) {
                    onAnswerReceived(response.data);
                }

                // Clear input
                setQuestion('');
            }
        } catch (error) {
            console.error('Error asking question:', error);
            setError(error.response?.data?.message || 'Failed to get answer. Please try again.');
        } finally {
            setAskingQuestion(false);
        }
    };

    const handleKeyDown = (e) => {
        // Submit on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative bg-white dark:bg-dark-panel rounded-2xl shadow-lg border-2 border-gray-200 dark:border-dark-border focus-within:border-accent-teal transition-colors theme-transition">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask your academic doubt..."
                        disabled={askingQuestion}
                        className="w-full px-6 py-4 pr-32 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none rounded-2xl disabled:opacity-50 theme-transition"
                        rows={3}
                        maxLength={maxLength}
                    />

                    {/* Character Counter & Context Indicator */}
                    <div className="absolute bottom-2 left-6 flex items-center gap-3">
                        <span className="text-xs text-gray-400 dark:text-gray-500 theme-transition">
                            {remainingChars} characters remaining
                        </span>
                        {contextText && contextText.trim() && (
                            <span className="text-xs bg-accent-teal/20 text-accent-teal px-2 py-1 rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" />
                                </svg>
                                Image context
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="absolute bottom-10 md:bottom-4 right-4 flex items-center gap-2">
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*,application/pdf"
                            className="hidden"
                        />

                        {/* Image Upload Button */}
                        <button
                            type="button"
                            onClick={handleImageClick}
                            disabled={askingQuestion}
                            className="p-3 text-gray-500 dark:text-gray-400 hover:text-accent-teal hover:bg-gray-100 dark:hover:bg-dark-card rounded-full transition-colors theme-transition"
                            title="Upload Image/PDF"
                        >
                            <FaImage size={20} />
                        </button>

                        {/* Voice Input Button */}
                        <button
                            type="button"
                            onClick={startListening}
                            disabled={askingQuestion}
                            className={`
                                p-3 rounded-full transition-colors theme-transition
                                ${isListening
                                    ? 'text-red-500 bg-red-100 dark:bg-red-900/30 animate-pulse'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-accent-teal hover:bg-gray-100 dark:hover:bg-dark-card'
                                }
                            `}
                            title="Voice Input"
                        >
                            <FaMicrophone size={20} />
                        </button>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!question.trim() || askingQuestion}
                            className="p-3 bg-accent-teal text-dark-bg rounded-full hover:bg-accent-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-md"
                        >
                            {askingQuestion ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-5 h-5 border-2 border-dark-bg border-t-transparent rounded-full"
                                />
                            ) : (
                                <FaPaperPlane size={20} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Hint Text */}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center theme-transition">
                    Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-dark-card rounded text-xs theme-transition">Enter</kbd> to send •{' '}
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-dark-card rounded text-xs theme-transition">Shift + Enter</kbd> for new line
                </p>
            </form>

            <MediaLibraryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectFile={handleSelectHistoryItem}
                onUploadNew={handleUploadNew}
            />
        </motion.div>
    );
};

export default AskBar;
