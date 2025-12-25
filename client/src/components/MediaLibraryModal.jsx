import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaImage, FaFilePdf, FaTimes, FaSpinner, FaTrash } from 'react-icons/fa';
import { getUserUploads, deleteFrame } from '../services/mediaApi';

// You can keep this constant for image-only uploads if needed, 
// but the PDF page data already contains the full URL in sourceUrl.
const MEDIA_BASE_URL = 'https://api.yourproject.com/media/';

const MediaLibraryModal = ({ isOpen, onClose, onSelectFile, onUploadNew }) => {
    const [activeTab, setActiveTab] = useState('library'); // 'library' or 'upload'
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && activeTab === 'library') {
            fetchUploads();
        }
    }, [isOpen, activeTab]);

    const getFileExtension = (mimeType) => {
        if (mimeType?.includes('png')) return 'png';
        if (mimeType?.includes('jpeg') || mimeType?.includes('jpg')) return 'jpg';
        return '';
    };

    const fetchUploads = async () => {
        setLoading(true);
        try {
            const response = await getUserUploads();
            if (response.success) {
                // 🚀 FIX APPLIED: Check for sourceUrl if previewUrl is missing
                const uploadsWithPreviews = response.data.uploads.map(item => {
                    // Check if a usable URL already exists
                    if (item.previewUrl || item.sourceUrl) {
                        // Use previewUrl if available, otherwise use sourceUrl
                        item.previewUrl = item.previewUrl || item.sourceUrl;
                    }
                    // Fallback to construct for old non-PDF frames if needed, using the MEDIA_BASE_URL
                    else if (item._id && item.mimeType) {
                        const extension = getFileExtension(item.mimeType);
                        item.previewUrl = `${MEDIA_BASE_URL}frames/${item._id}.${extension}`;
                    }
                    return item;
                });
                setUploads(uploadsWithPreviews);
            }
        } catch (error) {
            console.error('Failed to fetch uploads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this upload?')) {
            try {
                await deleteFrame(id);
                setUploads(prev => prev.filter(item => item._id !== id));
            } catch (error) {
                console.error('Failed to delete upload:', error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-dark-card w-full max-w-3xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] theme-transition">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 theme-transition">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white theme-transition">Media Library</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors theme-transition">
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 theme-transition">
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'library'
                            ? 'bg-accent-teal/10 text-accent-teal border-b-2 border-accent-teal'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 theme-transition'
                            }`}
                    >
                        Your Library
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'upload'
                            ? 'bg-accent-teal/10 text-accent-teal border-b-2 border-accent-teal'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 theme-transition'
                            }`}
                    >
                        Upload New
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'library' ? (
                        loading ? (
                            <div className="flex justify-center items-center h-40">
                                <FaSpinner className="animate-spin text-accent-teal text-3xl" />
                            </div>
                        ) : uploads.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {uploads.map((item) => (
                                    <button
                                        key={item._id}
                                        onClick={() => onSelectFile(item)}
                                        className="group relative aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 hover:border-accent-teal transition-all theme-transition"
                                    >
                                        <div
                                            onClick={(e) => handleDelete(e, item._id)}
                                            className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                                            title="Delete"
                                        >
                                            <FaTrash size={12} />
                                        </div>

                                        {/* 🚀 Rendering the preview using the calculated/found item.previewUrl */}
                                        {item.previewUrl ? (
                                            <img
                                                src={item.previewUrl}
                                                alt="Upload Preview"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            // Fallback for files without a preview URL
                                            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white theme-transition">
                                                {item.mimeType?.includes('pdf') || item.sourceType === 'pdf_page' ? (
                                                    <FaFilePdf size={40} className="mb-2" />
                                                ) : (
                                                    <FaImage size={40} className="mb-2" />
                                                )}
                                                <span className="text-xs px-2 text-center truncate w-full">
                                                    {item.mimeType?.includes('pdf') || item.sourceType === 'pdf_page' ? 'PDF Document' : 'Processing...'}
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">Select</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-500 theme-transition">
                                <FaImage className="mx-auto text-4xl mb-4 opacity-50" />
                                <p>No uploads found</p>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-accent-teal/50 transition-colors theme-transition">
                            <div className="w-16 h-16 bg-accent-teal/10 rounded-full flex items-center justify-center mb-4 text-accent-teal">
                                <FaCloudUploadAlt size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 theme-transition">Upload from Device</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-xs theme-transition">
                                Support for Images (JPG, PNG) and Documents (PDF)
                            </p>
                            <button
                                onClick={onUploadNew}
                                className="px-6 py-2 bg-accent-teal text-white rounded-lg hover:bg-accent-teal-dark transition-colors font-medium"
                            >
                                Browse Files
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaLibraryModal;