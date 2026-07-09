import { lerpHex } from "./color";

// Cinematic keyframes: warm cream day → golden hour → dusk → night → dawn → day
const KEYS = [
    { t: 0.00, top: "#cfe4f2", bot: "#f7ecd9", bg: "#f6efe3", ink: "#2a2118", card: "#efe5d3", accent: "#b07d4f", fog: "#eadfca", sun: 1.15, amb: 0.55, stars: 0.0 },
    { t: 0.34, top: "#a9b8dd", bot: "#f4cf9e", bg: "#f1e4cf", ink: "#2a2118", card: "#e9dcc4", accent: "#c07a3e", fog: "#e3cfae", sun: 0.90, amb: 0.45, stars: 0.0 },
    { t: 0.44, top: "#3d3a63", bot: "#d97a50", bg: "#241f33", ink: "#efe8da", card: "#2e2942", accent: "#e8a05c", fog: "#4a3f56", sun: 0.40, amb: 0.30, stars: 0.35 },
    { t: 0.52, top: "#060a1c", bot: "#131a34", bg: "#0a0d1c", ink: "#e9e4d8", card: "#12162b", accent: "#8ea6ff", fog: "#0d1226", sun: 0.12, amb: 0.18, stars: 1.0 },
    { t: 0.86, top: "#060a1c", bot: "#131a34", bg: "#0a0d1c", ink: "#e9e4d8", card: "#12162b", accent: "#8ea6ff", fog: "#0d1226", sun: 0.12, amb: 0.18, stars: 1.0 },
    { t: 0.94, top: "#2e3766", bot: "#f2a65c", bg: "#221f30", ink: "#efe8da", card: "#2b2740", accent: "#f2a65c", fog: "#40395a", sun: 0.45, amb: 0.30, stars: 0.35 },
];

export function samplePalette(t) {
    const wrap = [...KEYS, { ...KEYS[0], t: 1.0 }];
    let i = 0;
    while (i < wrap.length - 2 && t > wrap[i + 1].t) i++;
    const a = wrap[i], b = wrap[i + 1];
    const k = (t - a.t) / (b.t - a.t || 1);
    const mix = (p) => lerpHex(a[p], b[p], k);
    const num = (p) => a[p] + (b[p] - a[p]) * k;
    return {
        top: mix("top"), bot: mix("bot"), bg: mix("bg"), ink: mix("ink"),
        card: mix("card"), accent: mix("accent"), fog: mix("fog"),
        sun: num("sun"), amb: num("amb"), stars: num("stars"),
    };
}
