import api from '../config/api';

/**
 * Ask API Client
 * Handles all doubt-related API calls
 */

/**
 * Ask a text-based question
 * @param {string} questionText - The question to ask
 * @param {Object} options - Additional options (subject, tags)
 * @returns {Promise<Object>} - Answer data
 */
export const askTextQuestion = async (questionText, options = {}) => {
    try {
        const response = await api.post('/ask/text', {
            questionText,
            ...options,
        });
        return response.data;
    } catch (error) {
        console.error('Error asking question:', error);
        throw error;
    }
};

/**
 * Get user's doubt history
 * @param {Object} params - Query parameters (limit, skip, subject, bookmarked)
 * @returns {Promise<Array>} - Array of doubts
 */
export const getMyDoubts = async (params = {}) => {
    try {
        const response = await api.get('/ask/my', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching doubts:', error);
        throw error;
    }
};

/**
 * Get a specific doubt by ID
 * @param {string} doubtId - Doubt ID
 * @returns {Promise<Object>} - Doubt data
 */
export const getDoubtById = async (doubtId) => {
    try {
        const response = await api.get(`/ask/${doubtId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching doubt:', error);
        throw error;
    }
};

/**
 * Toggle bookmark status
 * @param {string} doubtId - Doubt ID
 * @returns {Promise<Object>} - Updated bookmark status
 */
export const toggleBookmark = async (doubtId) => {
    try {
        const response = await api.post(`/ask/${doubtId}/bookmark`);
        return response.data;
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        throw error;
    }
};

/**
 * Rate a doubt answer
 * @param {string} doubtId - Doubt ID
 * @param {number} rating - Rating (1-5)
 * @param {string} feedback - Optional feedback
 * @returns {Promise<Object>} - Updated rating
 */
export const rateDoubt = async (doubtId, rating, feedback = '') => {
    try {
        const response = await api.post(`/ask/${doubtId}/rate`, {
            rating,
            feedback,
        });
        return response.data;
    } catch (error) {
        console.error('Error rating doubt:', error);
        throw error;
    }
};

/**
 * Get user statistics
 * @returns {Promise<Object>} - User stats
 */
export const getUserStats = async () => {
    try {
        const response = await api.get('/ask/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

/**
 * Generate study material
 * @param {string} topic - Topic to generate material for
 * @param {string} type - Type of material (notes, flashcards, etc.)
 * @returns {Promise<string>} - Generated content
 */
export const generateStudyMaterial = async (topic, type) => {
    try {
        const response = await api.post('/ask/study', { topic, type });
        return response.data;
    } catch (error) {
        console.error('Error generating study material:', error);
        throw error;
    }
};

/**
 * Delete a doubt
 * @param {string} doubtId - Doubt ID
 * @returns {Promise<Object>} - Success message
 */
export const deleteDoubt = async (doubtId) => {
    try {
        const response = await api.delete(`/ask/${doubtId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting doubt:', error);
        throw error;
    }
};

/**
 * Generate a diagram of a specific type for an existing doubt
 * @param {string} doubtId - ID of the doubt
 * @param {string} type - Diagram type (flowchart, sequence, class, mindmap, state)
 */
export const generateDiagram = async (doubtId, type) => {
    try {
        const response = await api.post(`/ask/${doubtId}/diagram`, { type });
        return response.data;
    } catch (error) {
        console.error('Error generating diagram:', error);
        throw error;
    }
};
