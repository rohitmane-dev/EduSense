import { create } from 'zustand';
import api from '../config/api';

const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    fetchUser: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/auth/me');
            if (response.data.user) {
                set({ user: response.data.user, isAuthenticated: true, error: null });
            } else {
                set({ user: null, isAuthenticated: false });
            }
        } catch (error) {
            set({ user: null, isAuthenticated: false, error: null }); // Don't show error for 401s on load
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            // Implement login logic here or component handles API call and just sets user
            // For now assuming component calls API and updates store
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            console.error('Logout failed', error);
        }
    }
}));

export default useAuthStore;
