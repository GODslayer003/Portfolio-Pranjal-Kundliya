const hex = (h) => {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const lerpHex = (a, b, t) => {
    const [r1, g1, b1] = hex(a), [r2, g2, b2] = hex(b);
    const c = (x, y) => Math.round(x + (y - x) * t);
    return `#${((1 << 24) + (c(r1, r2) << 16) + (c(g1, g2) << 8) + c(b1, b2)).toString(16).slice(1)}`;
};
export const smoothstep = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
};
