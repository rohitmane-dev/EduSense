import { create } from 'zustand';

const useDoubtStore = create((set) => ({
    doubts: [],
    loading: false,
    error: null,
    askingQuestion: false,

    setDoubts: (doubts) => set({ doubts }),

    addDoubt: (doubt) => set((state) => ({
        doubts: [doubt, ...state.doubts]
    })),

    updateDoubt: (id, updates) => set((state) => ({
        doubts: state.doubts.map((d) =>
            (d.doubtId === id || d._id === id ? { ...d, ...updates } : d)
        )
    })),

    removeDoubt: (id) => set((state) => ({
        doubts: state.doubts.filter((d) => d.doubtId !== id && d._id !== id)
    })),

    setAskingQuestion: (askingQuestion) => set({ askingQuestion }),

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),
}));

export default useDoubtStore;
