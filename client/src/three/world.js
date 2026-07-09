// Mutable transient state (never triggers React re-renders — read in rAF loops)
export const CYCLE = 60; // seconds: ~30s day, ~30s night, looping forever
export const world = {
    t: 0.05,      // 0..1 position in the day/night cycle
    night: 0,     // 0 = day, 1 = deep night
    mouse: { x: 0, y: 0 },
    scroll: 0,    // 0..1 page scroll progress
};
