import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import WorldClock from "./WorldClock";
import SkyDome from "./Sky";
import Celestials from "./Celestials";
import Stars from "./Stars";
import Clouds from "./Clouds";
import Fireflies from "./Fireflies";
import Rig from "./Rig";
import PostFX from "./PostFX";

export default function Experience() {
    return (
        <div className="fixed inset-0 -z-10" aria-hidden="true">
            <Canvas
                camera={{ position: [0, 0.6, 7], fov: 45 }}
                dpr={[1, 1.8]}
                gl={{ antialias: true, powerPreference: "high-performance" }}
            >
                <fog attach="fog" args={["#eadfca", 10, 34]} />
                <Suspense fallback={null}>
                    <WorldClock />
                    <SkyDome />
                    <Celestials />
                    <Stars />
                    <Clouds />
                    <Fireflies />
                    <Rig />
                    <PostFX />
                </Suspense>
            </Canvas>
        </div>
    );
}
