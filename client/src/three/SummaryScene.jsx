import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "./world";

const CAM_Z = 12;
const CAM_Y = 0;
const FOV = 40;

function Particles() {
    const count = 300;
    const ref = useRef();

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 20;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
        }
        return arr;
    }, []);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        const pos = ref.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            pos[i * 3 + 1] += Math.sin(t * 0.2 + i) * 0.001;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                color="#b07d4f"
                size={0.04}
                transparent
                opacity={0.3}
                sizeAttenuation
            />
        </points>
    );
}

function BlueprintGrid() {
    const mat = useMemo(() => new THREE.MeshBasicMaterial({
        color: "#b07d4f",
        transparent: true,
        opacity: 0.04,
        wireframe: true,
    }), []);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 0]}>
            <planeGeometry args={[14, 10, 28, 20]} />
            <primitive object={mat} />
        </mesh>
    );
}

function Lighting() {
    return (
        <>
            <ambientLight intensity={0.35} />
            <pointLight position={[4, 5, 6]} intensity={20} color="#ffd9a0" />
            <pointLight position={[-3, 3, -5]} intensity={10} color="#8ab4f8" />
            <pointLight position={[0, -4, 4]} intensity={4} color="#e8b88a" />
        </>
    );
}

function ParallaxRig() {
    useFrame(({ camera }, dt) => {
        const d = Math.min(dt || 0.016, 0.05);
        const t = performance.now() / 1000;
        const ease = Math.min(1, d * 1.2);
        camera.position.x += (world.mouse.x * 0.3 - camera.position.x) * ease;
        camera.position.y += (world.mouse.y * -0.15 - camera.position.y) * ease;
        camera.position.x += Math.sin(t * 0.2) * 0.008 * d * 2;
        camera.position.y += Math.sin(t * 0.25 + 0.5) * 0.006 * d * 2;
        camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function SummaryScene() {
    return (
        <Canvas
            camera={{ position: [0, CAM_Y, CAM_Z], fov: FOV }}
            dpr={[1, 1.5]}
            style={{ overflow: "visible" }}
            gl={{
                antialias: true,
                powerPreference: "high-performance",
                alpha: true,
                outputColorSpace: THREE.SRGBColorSpace,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.0,
            }}
        >
            <Lighting />
            <BlueprintGrid />
            <Particles />
            <ParallaxRig />
        </Canvas>
    );
}
