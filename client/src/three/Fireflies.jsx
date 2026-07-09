import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "./world";

export default function Fireflies({ count = 50 }) {
    const ref = useRef(), mat = useRef();
    const seeds = useMemo(
        () => Array.from({ length: count }, () => ({
            x: (Math.random() - 0.5) * 16, y: Math.random() * 3 - 1.5,
            z: (Math.random() - 0.5) * 8 - 2, p: Math.random() * Math.PI * 2,
        })), [count]);
    const positions = useMemo(() => new Float32Array(count * 3), [count]);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        const arr = ref.current.geometry.attributes.position.array;
        seeds.forEach((s, i) => {
            arr[i * 3] = s.x + Math.sin(t * 0.6 + s.p) * 0.6 + world.mouse.x * 0.5;
            arr[i * 3 + 1] = s.y + Math.sin(t * 0.9 + s.p * 2) * 0.4;
            arr[i * 3 + 2] = s.z + Math.cos(t * 0.5 + s.p) * 0.5;
        });
        ref.current.geometry.attributes.position.needsUpdate = true;
        mat.current.opacity = world.night * (0.6 + Math.sin(t * 3) * 0.25);
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial ref={mat} color="#ffd27a" size={0.14} transparent opacity={0}
                sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
}
