import { create } from 'zustand';

const useDoubtStore = create((set) => ({
    doubts: [],
    loading: false,
    error: null,

    setDoubts: (doubts) => set({ doubts }),
    addDoubt: (doubt) => set((state) => ({ doubts: [doubt, ...state.doubts] })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));

export default useDoubtStore;
