import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { world } from "./world";

// Real sun & moon orbiting the scene; directional light follows the sun by day,
// a cool moonlight takes over at night. Bloom makes both glow.
export default function Celestials() {
    const sun = useRef(), moon = useRef(), sunLight = useRef(), moonLight = useRef(), amb = useRef();

    useFrame(() => {
        const th = world.t * Math.PI * 2;
        const x = Math.sin(th) * 16, y = Math.cos(th) * 12;
        sun.current.position.set(x, y, -20);
        moon.current.position.set(-x, -y, -20);
        sunLight.current.position.copy(sun.current.position);
        moonLight.current.position.copy(moon.current.position);

        const p = world.palette;
        if (!p) return;
        sunLight.current.intensity = p.sun * 2.2;
        moonLight.current.intensity = world.night * 0.6;
        amb.current.intensity = p.amb;
        // subtle mouse influence on light warmth
        sunLight.current.position.x += world.mouse.x * 2;
    });

    return (
        <group>
            <ambientLight ref={amb} intensity={0.5} />
            <directionalLight ref={sunLight} color="#ffdcb0" castShadow />
            <directionalLight ref={moonLight} color="#a9baff" />
            <mesh ref={sun}>
                <sphereGeometry args={[2.5, 48, 48]} />
                <meshBasicMaterial color="#ffd9a0" toneMapped={false} />
            </mesh>
            <mesh ref={moon}>
                <sphereGeometry args={[2.0, 48, 48]} />
                <meshBasicMaterial color="#dfe6ff" toneMapped={false} />
            </mesh>
        </group>
    );
}
