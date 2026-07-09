import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { world } from "./world";

// Mouse parallax + scroll-driven camera drift. Everything eased, nothing abrupt.
export default function Rig() {
    useEffect(() => {
        const onMove = (e) => {
            world.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            world.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            world.scroll = max > 0 ? window.scrollY / max : 0;
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    useFrame(({ camera }, dt) => {
        const ease = Math.min(1, dt * 2.2);
        camera.position.x += (world.mouse.x * 0.9 - camera.position.x) * ease;
        camera.position.y += (0.6 - world.mouse.y * 0.4 + world.scroll * 1.4 - camera.position.y) * ease;
        camera.position.z += (7 - world.scroll * 1.8 - camera.position.z) * ease;
        camera.lookAt(0, 0.4 + world.scroll * 1.2, -4);
    });
    return null;
}
