// Mutable transient state (never triggers React re-renders — read in rAF loops)
export const CYCLE = 60; // seconds: ~30s day, ~30s night, looping forever
export const DAY_T = 0;      // sun directly overhead
export const NIGHT_T = 0.50; // moon directly overhead

export const world = {
    t: 0,         // 0..1 position in the day/night cycle
    night: 0,     // 0 = day, 1 = deep night
    floatTime: 0, // accumulated time for floating animation

    // Manual theme override
    manualNight: false,  // true = user locked to night
    targetT: null,       // when set, lerp toward this t value
    lerping: false,      // currently animating toward targetT

    mouse: { x: 0, y: 0 },
    scroll: 0,    // 0..1 page scroll progress
};
