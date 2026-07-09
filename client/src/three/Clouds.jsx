import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "./world";

function cloudTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, "rgba(255,255,255,0.85)");
    g.addColorStop(0.5, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
}

export default function Clouds({ count = 10 }) {
    const tex = useMemo(cloudTexture, []);
    const group = useRef();
    const seeds = useMemo(
        () => Array.from({ length: count }, () => ({
            x: (Math.random() - 0.5) * 40,
            y: 3 + Math.random() * 6,
            z: -12 - Math.random() * 14,
            s: 4 + Math.random() * 7,
            v: 0.15 + Math.random() * 0.3,
        })), [count]);

    useFrame((_, delta) => {
        const dayOpacity = (1 - world.night) * 0.75; // clouds dissolve into the night
        group.current.children.forEach((m, i) => {
            m.position.x += seeds[i].v * delta * (1 + world.mouse.x * 0.4); // wind
            if (m.position.x > 24) m.position.x = -24;
            m.material.opacity = dayOpacity;
        });
    });

    return (
        <group ref={group}>
            {seeds.map((s, i) => (
                <sprite key={i} position={[s.x, s.y, s.z]} scale={[s.s, s.s * 0.55, 1]}>
                    <spriteMaterial map={tex} transparent opacity={0.7} depthWrite={false} />
                </sprite>
            ))}
        </group>
    );
}
