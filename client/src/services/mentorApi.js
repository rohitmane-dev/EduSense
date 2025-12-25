import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getMentorDashboard = async (userId) => {
    try {
        const response = await api.get(`/mentor/dashboard?userId=${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message;
    }
};

export const getMentorDoubts = async (status, subject) => {
    try {
        const response = await api.get('/mentor/doubts', { params: { status, subject } });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message;
    }
};

export const getDoubtDetail = async (doubtId) => {
    try {
        const response = await api.get(`/mentor/doubt/${doubtId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message;
    }
};

export const resolveDoubt = async (doubtId, data) => {
    try {
        const response = await api.post(`/mentor/doubt/${doubtId}/resolve`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message;
    }
};

export const escalateDoubt = async (doubtId, reason) => {
    try {
        const response = await api.post(`/mentor/doubt/${doubtId}/escalate`, { reason });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.message;
    }
};
