import { create } from "zustand";

export const useScrollMemory = create(() => ({
    positions: {},
}));

export function getScrollPos(key) {
    return useScrollMemory.getState().positions[key] ?? 0;
}

export function setScrollPos(key, value) {
    useScrollMemory.setState((s) => ({
        positions: { ...s.positions, [key]: value },
    }));
}
