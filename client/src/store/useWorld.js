import { create } from "zustand";

export const useWorld = create((set) => ({
    ready: false,
    setReady: () => set({ ready: true }),
}));
