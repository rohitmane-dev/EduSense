import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useDoubtStore from '../store/useDoubtStore';
import { FaRobot, FaBookmark, FaRegBookmark, FaChevronDown, FaChevronUp, FaStar, FaLightbulb, FaLayerGroup, FaCheckCircle, FaBookOpen, FaSpinner, FaTrash, FaCopy, FaProjectDiagram, FaDownload, FaCode, FaFlask, FaVolumeUp, FaStop } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';
import { toggleBookmark, rateDoubt, generateStudyMaterial, deleteDoubt, generateDiagram } from '../services/askApi';
import TypewriterText from './TypewriterText';

// Initialize Mermaid with error suppression
mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    logLevel: 'fatal', // Only log fatal errors, suppress syntax warnings
    suppressErrors: true, // Don't show error messages in UI
});

const MermaidDiagram = ({ code, onTagClick, isGenerating }) => {
    const [svg, setSvg] = useState('');
    const [error, setError] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!code) {
                setSvg('');
                setError(false);
                return;
            }

            // Suppress console errors during rendering
            const originalConsoleError = console.error;
            console.error = (...args) => {
                // Only suppress Mermaid-specific errors
                if (args[0]?.toString().includes('mermaid') || args[0]?.toString().includes('Syntax error')) {
                    return; // Silently ignore
                }
                originalConsoleError(...args);
            };

            try {
                setError(false);
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, code);
                setSvg(svg);
            } catch (err) {
                // Don't log to console - just set error state
                setError(true);
                setSvg('');
            } finally {
                // Restore console.error
                console.error = originalConsoleError;
            }
        };
        renderDiagram();
    }, [code]);

    const handleExport = async () => {
        if (containerRef.current) {
            try {
                const canvas = await html2canvas(containerRef.current, { backgroundColor: '#111827' });
                const link = document.createElement('a');
                link.download = 'diagram.png';
                link.href = canvas.toDataURL();
                link.click();
            } catch (err) {
                console.error('Export failed', err);
            }
        }
    };

    const diagramTypes = ['flowchart', 'sequence', 'class', 'mindmap', 'state'];

    if (!svg && !isGenerating && !error) return null;

    return (
        <div className="relative group">
            {isGenerating ? (
                <div className="flex justify-center items-center p-8 bg-dark-bg rounded-lg">
                    <FaSpinner className="animate-spin text-accent-teal text-3xl" />
                    <span className="ml-3 text-gray-400">Generating diagram...</span>
                </div>
            ) : error ? (
                <div className="flex flex-col justify-center items-center p-8 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-red-500 text-4xl mb-3">⚠️</div>
                    <p className="text-red-700 font-medium mb-2">Unable to render diagram</p>
                    <p className="text-red-600 text-sm mb-4">The diagram syntax needs correction</p>
                    <button
                        onClick={() => onTagClick('flowchart')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Try Regenerating
                    </button>
                </div>
            ) : (
                <>
                    <div ref={containerRef} className="mermaid-container flex justify-center p-4 bg-dark-bg rounded-lg overflow-hidden" dangerouslySetInnerHTML={{ __html: svg }} />
                    <button
                        onClick={handleExport}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 bg-gray-700 text-white rounded shadow-sm text-xs flex items-center gap-1 hover:bg-gray-600 transition-all"
                        title="Export as PNG"
                    >
                        <FaDownload /> PNG
                    </button>
                </>
            )}
            {/* Diagram type selector */}
            <div className="flex gap-2 mt-3 justify-center flex-wrap">
                <p className="w-full text-center text-xs text-gray-500 mb-1">Generate different diagram types:</p>
                {diagramTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => onTagClick(type)}
                        disabled={isGenerating}
                        className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-xs hover:bg-accent-teal hover:text-dark-bg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
};

const CodeBlock = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative rounded-lg overflow-hidden my-4 border border-gray-700">
            <div className="flex justify-between items-center bg-gray-800 px-4 py-2 text-xs text-gray-400">
                <span className="uppercase">{language || 'code'}</span>
                <button onClick={handleCopy} className="flex items-center gap-1 hover:text-white">
                    <FaCopy /> {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>
            <SyntaxHighlighter language={language || 'javascript'} style={vscDarkPlus} customStyle={{ margin: 0, padding: '1rem' }}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

const AnswerCard = ({ doubt }) => {
    const [showContext, setShowContext] = useState(false);
    const [rating, setRating] = useState(doubt?.rating || 0);
    const [isBookmarked, setIsBookmarked] = useState(doubt?.isBookmarked || false);
    const [notes, setNotes] = useState(null);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [activeTab, setActiveTab] = useState('answer');
    const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
    const [currentMermaidCode, setCurrentMermaidCode] = useState(doubt?.mermaidCode || '');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isNewAnswer, setIsNewAnswer] = useState(true); // Track if this is a fresh answer
    const speechRef = useRef(null);
    const { updateDoubt, removeDoubt } = useDoubtStore();

    // Update local mermaid code when doubt changes
    useEffect(() => {
        setCurrentMermaidCode(doubt?.mermaidCode || '');
    }, [doubt?.mermaidCode]);

    // Track when doubt changes OR tab changes to enable typewriter effect
    useEffect(() => {
        setIsNewAnswer(true);
        const totalLength = (doubt?.explanation?.length || 0) +
            (doubt?.steps?.join('').length || 0) +
            (doubt?.finalAnswer?.length || 0);
        const timer = setTimeout(() => {
            setIsNewAnswer(false);
        }, totalLength * 20 + 3000);

        return () => clearTimeout(timer);
    }, [doubt?._id, doubt?.doubtId, activeTab]);

    // Cleanup speech on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const textToRead = [
            doubt.explanation,
            ...(doubt.steps || []),
            doubt.finalAnswer
        ].filter(Boolean).join('. ');

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.onend = () => setIsSpeaking(false);
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    const handleGenerateNotes = async () => {
        setLoadingNotes(true);
        try {
            const response = await generateStudyMaterial(doubt.meta?.topic || doubt.questionText, 'notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Error generating notes:', error);
        } finally {
            setLoadingNotes(false);
        }
    };

    const handleBookmark = async () => {
        try {
            const response = await toggleBookmark(doubt.doubtId || doubt._id);
            if (response.success) {
                setIsBookmarked(response.data.isBookmarked);
                updateDoubt(doubt.doubtId || doubt._id, { isBookmarked: response.data.isBookmarked });
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    const handleRate = async (newRating) => {
        try {
            const response = await rateDoubt(doubt.doubtId || doubt._id, newRating);
            if (response.success) {
                setRating(newRating);
                updateDoubt(doubt.doubtId || doubt._id, { rating: newRating });
            }
        } catch (error) {
            console.error('Error rating doubt:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this doubt permanently?')) {
            try {
                await deleteDoubt(doubt.doubtId || doubt._id);
                removeDoubt(doubt.doubtId || doubt._id);
            } catch (error) {
                console.error('Error deleting doubt:', error);
            }
        }
    };

    const handleDiagramTagClick = async (type) => {
        setIsGeneratingDiagram(true);
        try {
            const response = await generateDiagram(doubt.doubtId || doubt._id, type);
            if (response.success) {
                const newCode = response.data.mermaidCode;
                setCurrentMermaidCode(newCode);
                updateDoubt(doubt.doubtId || doubt._id, { mermaidCode: newCode });
            }
        } catch (err) {
            console.error('Diagram generation failed:', err);
        } finally {
            setIsGeneratingDiagram(false);
        }
    };

    const confidencePercentage = Math.round((doubt.confidence || 0) * 100);

    const formatNotes = (text) => {
        if (!text) return '';
        return text
            .split('\n')
            .map((line, i) => {
                if (line.startsWith('# ')) {
                    return `<h2 key="${i}" class="text-xl font-bold text-indigo-900 mt-4 mb-2">${line.substring(2)}</h2>`;
                } else if (line.startsWith('## ')) {
                    return `<h3 key="${i}" class="text-lg font-semibold text-indigo-800 mt-3 mb-1">${line.substring(3)}</h3>`;
                } else if (line.startsWith('- ')) {
                    return `<li key="${i}" class="ml-4 text-gray-800">${line.substring(2)}</li>`;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                    return `<p key="${i}" class="font-bold text-gray-900 mt-2">${line.slice(2, -2)}</p>`;
                } else {
                    return `<p key="${i}" class="text-gray-800">${line}</p>`;
                }
            })
            .join('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-panel rounded-2xl shadow-xl border border-gray-200 dark:border-dark-border overflow-hidden theme-transition"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-accent-teal to-accent-teal/80 p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-full shadow-sm">
                            <FaRobot className="text-accent-teal text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-dark-bg">AI Explanation</h3>
                            <p className="text-dark-bg/70 text-xs font-medium">Powered by Groq: Llama 3</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {doubt.meta && (
                            <div className="hidden md:flex gap-2 mr-2">
                                {doubt.meta.subject && (
                                    <span className="px-2 py-1 bg-white/20 rounded text-xs text-dark-bg font-medium">
                                        {doubt.meta.subject}
                                    </span>
                                )}
                                {doubt.meta.difficulty && (
                                    <span className="px-2 py-1 bg-white/20 rounded text-xs text-dark-bg font-medium uppercase">
                                        {doubt.meta.difficulty}
                                    </span>
                                )}
                            </div>
                        )}
                        <button onClick={handleSpeak} className="p-2 hover:bg-white/20 rounded-lg transition-colors" title={isSpeaking ? "Stop Reading" : "Read Aloud"}>
                            {isSpeaking ? <FaStop className="text-dark-bg text-xl" /> : <FaVolumeUp className="text-dark-bg text-xl" />}
                        </button>
                        <button onClick={handleBookmark} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            {isBookmarked ? <FaBookmark className="text-dark-bg text-xl" /> : <FaRegBookmark className="text-dark-bg text-xl" />}
                        </button>
                        <button onClick={handleDelete} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-red-800">
                            <FaTrash className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-card theme-transition">
                <div className="flex">
                    <button
                        className={`px-4 py-2 flex items-center gap-2 theme-transition ${activeTab === 'answer' ? 'border-b-2 border-accent-teal text-accent-teal' : 'text-gray-600 dark:text-gray-400'}`}
                        onClick={() => setActiveTab('answer')}
                    >
                        <FaLightbulb /> Answer
                    </button>
                    {doubt.code && doubt.code.snippet && doubt.code.snippet.trim() && (
                        <button
                            className={`px-4 py-2 flex items-center gap-2 theme-transition ${activeTab === 'code' ? 'border-b-2 border-accent-teal text-accent-teal' : 'text-gray-600 dark:text-gray-400'}`}
                            onClick={() => setActiveTab('code')}
                        >
                            <FaCode /> Code
                        </button>
                    )}
                    {doubt.reactions && (
                        <button
                            className={`px-4 py-2 flex items-center gap-2 theme-transition ${activeTab === 'reactions' ? 'border-b-2 border-accent-teal text-accent-teal' : 'text-gray-600 dark:text-gray-400'}`}
                            onClick={() => setActiveTab('reactions')}
                        >
                            <FaFlask /> Reactions
                        </button>
                    )}
                    {doubt.mermaidCode && (
                        <button
                            className={`px-4 py-2 flex items-center gap-2 theme-transition ${activeTab === 'diagram' ? 'border-b-2 border-accent-teal text-accent-teal' : 'text-gray-600 dark:text-gray-400'}`}
                            onClick={() => setActiveTab('diagram')}
                        >
                            <FaProjectDiagram /> Diagram
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
                {activeTab === 'answer' && (
                    <>
                        {/* 1. Conversational Explanation */}
                        {doubt.explanation && (
                            <div className="prose max-w-none">
                                <div className="flex items-center gap-2 mb-2 text-accent-teal font-semibold">
                                    <FaLightbulb />
                                    <h4>Overview</h4>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed theme-transition">
                                    {isNewAnswer ? (
                                        <TypewriterText
                                            text={doubt.explanation}
                                            speed={20}
                                            onComplete={() => setIsNewAnswer(false)}
                                        />
                                    ) : (
                                        doubt.explanation
                                    )}
                                </p>
                            </div>
                        )}

                        {/* 2. Step‑by‑Step */}
                        {doubt.steps && doubt.steps.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-accent-teal font-semibold">
                                    <FaLayerGroup />
                                    <h4>Step‑by‑Step Breakdown</h4>
                                </div>
                                <div className="space-y-4">
                                    {doubt.steps.map((step, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex gap-4"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-dark-card rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-sm theme-transition">
                                                {idx + 1}
                                            </div>
                                            <div className="bg-gray-50 dark:bg-dark-card p-4 rounded-lg border border-gray-100 dark:border-dark-border flex-1 hover:border-accent-teal/30 transition-colors theme-transition">
                                                <p className="text-gray-800 dark:text-gray-200 leading-relaxed theme-transition">
                                                    {isNewAnswer ? (
                                                        <TypewriterText
                                                            text={step}
                                                            speed={20}
                                                            startDelay={idx * 300}
                                                        />
                                                    ) : (
                                                        step
                                                    )}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Final Answer */}
                        {doubt.finalAnswer && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-900/50 theme-transition"
                            >
                                <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400 font-bold theme-transition">
                                    <FaCheckCircle />
                                    <h4>Final Answer</h4>
                                </div>
                                <p className="text-gray-900 dark:text-gray-100 font-medium text-lg leading-relaxed theme-transition">
                                    {isNewAnswer ? (
                                        <TypewriterText
                                            text={doubt.finalAnswer}
                                            speed={20}
                                            startDelay={1500}
                                        />
                                    ) : (
                                        doubt.finalAnswer
                                    )}
                                </p>
                            </motion.div>
                        )}

                        {/* 4. Follow‑Up Questions */}
                        {doubt.followUpQuestions && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                {doubt.followUpQuestions.easy && (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/50 theme-transition">
                                        <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase theme-transition">Easy Follow‑up</span>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 theme-transition">
                                            {isNewAnswer ? (
                                                <TypewriterText
                                                    text={doubt.followUpQuestions.easy}
                                                    speed={15}
                                                    startDelay={2000}
                                                />
                                            ) : (
                                                doubt.followUpQuestions.easy
                                            )}
                                        </p>
                                    </div>
                                )}
                                {doubt.followUpQuestions.medium && (
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/50 theme-transition">
                                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase theme-transition">Medium Follow‑up</span>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 theme-transition">
                                            {isNewAnswer ? (
                                                <TypewriterText
                                                    text={doubt.followUpQuestions.medium}
                                                    speed={15}
                                                    startDelay={2200}
                                                />
                                            ) : (
                                                doubt.followUpQuestions.medium
                                            )}
                                        </p>
                                    </div>
                                )}
                                {doubt.followUpQuestions.challenge && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50 theme-transition">
                                        <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase theme-transition">Challenge</span>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 theme-transition">
                                            {isNewAnswer ? (
                                                <TypewriterText
                                                    text={doubt.followUpQuestions.challenge}
                                                    speed={15}
                                                    startDelay={2400}
                                                />
                                            ) : (
                                                doubt.followUpQuestions.challenge
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'code' && doubt.code && (
                    <CodeBlock language={doubt.code.language} code={doubt.code.snippet} />
                )}

                {activeTab === 'reactions' && doubt.reactions && (
                    <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: doubt.reactions }} />
                    </div>
                )}

                {activeTab === 'diagram' && currentMermaidCode && (
                    <MermaidDiagram
                        code={currentMermaidCode}
                        onTagClick={handleDiagramTagClick}
                        isGenerating={isGeneratingDiagram}
                    />
                )}
            </div>

            {/* AI Mini‑Lessons (Notes) */}
            <div className="pt-4 border-t border-gray-100 px-6 pb-6">
                {!notes ? (
                    <button
                        onClick={handleGenerateNotes}
                        disabled={loadingNotes}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        {loadingNotes ? <FaSpinner className="animate-spin" /> : <FaBookOpen />}
                        Generate Revision Notes
                    </button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-indigo-50 p-4 rounded-lg border border-indigo-100"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-indigo-800 flex items-center gap-2">
                                <FaBookOpen /> Revision Notes
                            </h4>
                            <button onClick={() => setNotes(null)} className="text-xs text-indigo-500 hover:text-indigo-700">
                                Close
                            </button>
                        </div>
                        <div
                            className="prose prose-sm max-w-none text-gray-800"
                            dangerouslySetInnerHTML={{ __html: formatNotes(notes) }}
                        />
                    </motion.div>
                )}
            </div>

            {/* Footer: Confidence & Rating */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 pt-0">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confidence</span>
                    <div className="flex items-center gap-2 flex-1">
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${confidencePercentage}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={`h-full ${confidencePercentage > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            />
                        </div>
                        <span className="text-xs font-bold text-gray-600">{confidencePercentage}%</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleRate(star)}
                            className="text-xl transition-all hover:scale-110 active:scale-95 focus:outline-none"
                        >
                            <FaStar className={star <= rating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Context Sources (Collapsible) */}
            {doubt.retrievedContext && doubt.retrievedContext.length > 0 && (
                <div className="px-6 pb-6">
                    <button
                        onClick={() => setShowContext(!showContext)}
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-accent-teal transition-colors"
                    >
                        {showContext ? <FaChevronUp /> : <FaChevronDown />}
                        <span>View Context Sources ({doubt.retrievedContext.length})</span>
                    </button>
                    <AnimatePresence>
                        {showContext && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-3 space-y-2 overflow-hidden"
                            >
                                {doubt.retrievedContext.map((context, idx) => (
                                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                                        <p className="text-gray-600 mb-1 line-clamp-2">{context.text}</p>
                                        <div className="flex gap-2 text-gray-400">
                                            {context.source && <span>Source: {context.source}</span>}
                                            {context.score && <span>Relevance: {Math.round(context.score * 100)}%</span>}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default AnswerCard;
