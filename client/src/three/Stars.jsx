import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "./world";

export default function Stars({ count = 1400 }) {
    const mat = useRef();
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 45 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(1 - Math.random() * 1.2); // bias to upper dome
            arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            arr[i * 3 + 1] = Math.abs(r * Math.cos(phi)) - 4;
            arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
        return arr;
    }, [count]);

    const ref = useRef();
    useFrame(({ clock }) => {
        mat.current.opacity = world.night * 0.9;
        mat.current.size = 0.12 + Math.sin(clock.elapsedTime * 2) * 0.02; // twinkle
        ref.current.rotation.y = clock.elapsedTime * 0.004 + world.mouse.x * 0.03;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial ref={mat} color="#ffffff" size={0.12} transparent opacity={0}
                sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
}
