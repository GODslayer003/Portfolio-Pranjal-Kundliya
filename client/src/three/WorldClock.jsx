import { useFrame, useThree } from "@react-three/fiber";
import { world, DAY_T } from "./world";
import { samplePalette } from "../utils/palette";
import { smoothstep } from "../utils/color";

const LERP_SPEED = 2.5;

export default function WorldClock() {
    const scene = useThree((s) => s.scene);
    useFrame((_, delta) => {
        world.floatTime += delta;

        // Lerp toward target on manual toggle, otherwise stay put
        if (world.lerping && world.targetT !== null) {
            const diff = world.targetT - world.t;
            const step = diff * Math.min(1, delta * LERP_SPEED);
            world.t += step;
            if (Math.abs(diff) < 0.0005) {
                world.t = world.targetT;
                world.targetT = null;
                world.lerping = false;
            }
        }

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
