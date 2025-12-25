import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPendingMentors = async () => {
    try {
        const response = await api.get('/admin/mentors/pending');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message;
    }
};

export const approveMentor = async (mentorId, status) => { // status: 'approved' | 'rejected'
    try {
        const response = await api.post(`/admin/mentors/${mentorId}/approve`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message;
    }
};

export const getSystemAnalytics = async () => {
    try {
        const response = await api.get('/admin/analytics');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message;
    }
};
