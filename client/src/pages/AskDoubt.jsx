import { uploadImage, askWithImage, getFrame, getPdfPages } from '../services/mediaApi';
import { FaSpinner, FaCheckCircle, FaTimes } from 'react-icons/fa';
import useDoubtStore from '../store/useDoubtStore';
import useAuthStore from '../store/useAuthStore';
import { useState, useEffect } from 'react';
import socketService from '../services/socketService';
import { motion } from 'framer-motion';
import AskBar from '../components/AskBar';
import InteractiveImage from '../components/InteractiveImage';
import PdfPageViewer from '../components/PdfPageViewer';
import AnswerCard from '../components/AnswerCard';
import Generating from '../components/loadings/Generating';

const AskDoubt = () => {
    const { user, fetchUser } = useAuthStore();
    const { addDoubt, error, setError, askingQuestion } = useDoubtStore();
    const [currentAnswer, setCurrentAnswer] = useState(null);

    // Image Upload State
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFrame, setUploadedFrame] = useState(null);
    const [pdfFrames, setPdfFrames] = useState(null); // For multi-page PDFs
    const [fileType, setFileType] = useState(null); // 'image' or 'pdf'
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (uploadedFrame) {
            // Selective extraction: start empty
            setDisplayedText('');
        }
    }, [uploadedFrame]);

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [user, fetchUser]);

    useEffect(() => {
        if (user?._id) {
            socketService.connect(user._id);
            socketService.on('doubt:new', (newDoubt) => {
                addDoubt(newDoubt);
                if (uploadedFrame && !currentAnswer) {
                    setCurrentAnswer(newDoubt);
                }
            });
            return () => {
                socketService.off('doubt:new');
            };
        }
    }, [user, addDoubt, uploadedFrame, currentAnswer]);

    const handleAnswerReceived = (answer) => {
        setCurrentAnswer(answer);
        setUploadedFrame(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFileSelect = async (fileOrItem) => {
        setUploading(true);
        setUploadProgress(0);
        setError(null);
        setCurrentAnswer(null);
        setShowImagePreview(true);
        setDisplayedText('');

        try {
            const isFile = fileOrItem instanceof File;

            if (isFile) {
                const file = fileOrItem;
                let response;
                const isPdf = file.type === 'application/pdf';
                setFileType(isPdf ? 'pdf' : 'image');

                if (isPdf) {
                    const { uploadPdf } = await import('../services/mediaApi');
                    response = await uploadPdf(file, null, (percent) => {
                        setUploadProgress(percent);
                    });

                    if (response.success) {
                        console.log('✅ PDF uploaded:', response.data);
                        setPdfFrames(response.data.frames || [response.data]);
                        setUploadedFrame(null);
                        setDisplayedText('');
                    }
                } else {
                    response = await uploadImage(file, null, (percent) => {
                        setUploadProgress(percent);
                    });

                    if (response.success) {
                        console.log('✅ Upload successful:', response.data);
                        setUploadedFrame(response.data);
                        setPdfFrames(null);
                        setDisplayedText('');
                    }
                }

                if (!response.success) {
                    setError('Failed to upload file.');
                    setShowImagePreview(false);
                }
            } else {
                // History Item
                const item = fileOrItem;
                console.log('📂 Selected history item:', item);

                if (item.status === 'failed') {
                    console.error('❌ Selected item processing failed');
                    setError('File processing failed and cannot be displayed.');
                    setShowImagePreview(false);
                    return;
                }

                const isPdf = item.mimeType?.includes('pdf') || item.frameType === 'pdf_page' || item.sourceType === 'pdf_page';
                setFileType(isPdf ? 'pdf' : 'image');

                if (isPdf) {
                    const pagesResponse = await getPdfPages(item._id);
                    if (pagesResponse.success && pagesResponse.data && pagesResponse.data.length > 0) {
                        setPdfFrames(pagesResponse.data);
                        setUploadedFrame(null);
                        setDisplayedText('');
                    } else {
                        console.error('❌ PDF pages not available');
                        setError('PDF pages are not yet available or failed to process.');
                        setShowImagePreview(false);
                    }
                } else {
                    const frameResponse = await getFrame(item._id);
                    if (frameResponse.success) {
                        setUploadedFrame(frameResponse.data);
                        setPdfFrames(null);
                        setDisplayedText('');
                    } else {
                        throw new Error('Failed to fetch image details');
                    }
                }
            }
        } catch (err) {
            console.error('File selection error:', err);
            setError('Failed to process file.');
            setShowImagePreview(false);
        } finally {
            setUploading(false);
        }
    };

    const handleClearImage = () => {
        setUploadedFrame(null);
        setPdfFrames(null);
        setShowImagePreview(false);
        setError(null);
        setDisplayedText('');
    };

    return (
        <div className="container p-4 md:p-8 mx-auto max-w-5xl">
            <header className="mb-8">
                <h1 className="text-3xl text-light-text font-bold dark:text-white mb-2">Ask a Doubt</h1>
                <p className="text-gray-400">Get instant, AI-powered explanations for your questions.</p>
            </header>

            {showImagePreview && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-dark-card rounded-2xl p-6 border border-gray-700"
                >
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-white">
                            {fileType === 'pdf' ? 'Attached PDF' : 'Attached Image'}
                        </h3>
                        <button
                            onClick={handleClearImage}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {uploading ? (
                        <div className="text-center p-8">
                            <div className="w-16 h-16 border-4 border-accent-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-accent-teal font-medium">Uploading... {uploadProgress}%</p>
                        </div>
                    ) : fileType === 'pdf' && pdfFrames ? (
                        <PdfPageViewer
                            pdfFrames={pdfFrames}
                            onCropSelect={(extractedText) => {
                                console.log('📄 PDF crop selection:', extractedText);
                                setDisplayedText(extractedText);
                            }}
                        />
                    ) : uploadedFrame ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative rounded-lg overflow-hidden bg-black/20 border border-gray-700 min-h-[300px] flex items-center justify-center">
                                <InteractiveImage
                                    imageUrl={uploadedFrame.previewUrl}
                                    ocrRaw={uploadedFrame.ocrRaw}
                                    onCropSelect={(cropData) => {
                                        console.log('🎯 Crop selection callback:', cropData);
                                        if (cropData && cropData.extractedText && cropData.extractedText.trim().length > 0) {
                                            console.log('✅ Setting displayed text to:', cropData.extractedText);
                                            setDisplayedText(cropData.extractedText);
                                        } else if (cropData === null) {
                                            console.log('🔄 Selection cleared');
                                            // setDisplayedText(uploadedFrame.ocrText); // Don't restore full text
                                            setDisplayedText('');
                                        }
                                    }}
                                />
                            </div>

                            <div className="bg-black/20 rounded-lg p-4 border border-gray-700 h-full max-h-[500px] overflow-y-auto">
                                <h4 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Extracted Text</h4>
                                {displayedText || (uploadedFrame && uploadedFrame.ocrText) ? (
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <p className="whitespace-pre-wrap text-gray-300">
                                            {displayedText || uploadedFrame.ocrText}
                                        </p>
                                        {!displayedText && (
                                            <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-700 pt-2">
                                                (Full text shown. Select an area to focus.)
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-gray-500 italic">
                                        <p>Select an area on the image to extract text</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center p-8">No content loaded</div>
                    )}
                </motion.div>
            )}

            <div className="mb-8">
                <AskBar
                    onAnswerReceived={handleAnswerReceived}
                    onFileSelect={handleFileSelect}
                    contextText={displayedText || (fileType === 'image' && uploadedFrame ? uploadedFrame.ocrText : '')}
                />
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400"
                >
                    {error}
                </motion.div>
            )}

            {/* Show Generating animation while waiting for response */}
            {askingQuestion && !currentAnswer && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 bg-white dark:bg-dark-panel rounded-2xl shadow-xl border border-gray-200 dark:border-dark-border overflow-hidden theme-transition p-8"
                >
                    <Generating />
                </motion.div>
            )}

            {currentAnswer && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <AnswerCard doubt={currentAnswer} />
                </motion.div>
            )}

            {!currentAnswer && !showImagePreview && !askingQuestion && (
                <div className="text-center py-20 opacity-50">
                    <div className="text-6xl mb-4">💡</div>
                    <h3 className="text-xl font-semibold text-light-text dark:text-white theme-transition">Ready to learn?</h3>
                    <p className="text-light-text-secondary dark:text-gray-400 theme-transition">Type your question above to get started.</p>
                </div>
            )}
        </div>
    );
};

export default AskDoubt;