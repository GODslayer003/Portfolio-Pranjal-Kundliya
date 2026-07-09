import { useFrame, useThree } from "@react-three/fiber";
import { world, CYCLE } from "./world";
import { samplePalette } from "../utils/palette";
import { smoothstep } from "../utils/color";

// The heartbeat of the site: advances the eternal day/night loop,
// drives the Three.js atmosphere AND the DOM theme via CSS variables.
export default function WorldClock() {
    const scene = useThree((s) => s.scene);
    useFrame((_, delta) => {
        world.t = (world.t + Math.min(delta, 0.05) / CYCLE) % 1;
        world.night = Math.max(0, smoothstep(0.40, 0.52, world.t) - smoothstep(0.88, 1.0, world.t));

        const p = samplePalette(world.t);
        world.palette = p;
        if (scene.fog) scene.fog.color.set(p.fog);

        const root = document.documentElement.style;
        root.setProperty("--bg", p.bg);
        root.setProperty("--ink", p.ink);
        root.setProperty("--card", p.card);
        root.setProperty("--accent", p.accent);
        root.setProperty("--muted", `color-mix(in srgb, ${p.ink} 55%, transparent)`);
        root.setProperty("--hero-nightness", world.night);
    });
    return null;
}
