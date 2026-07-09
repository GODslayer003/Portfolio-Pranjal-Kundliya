import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "../three/world";

import { Html } from "@react-three/drei";
import {
    SiReact, SiJavascript, SiHtml5, SiCss, SiNodedotjs, SiMongodb,
    SiExpress, SiThreedotjs, SiGreensock, SiTailwindcss, SiSocketdotio,
    SiGit, SiRedux, SiFigma,
} from "react-icons/si";

const SKILLS = [
    { Icon: SiReact, color: "#61dafb" },
    { Icon: SiJavascript, color: "#f7df1e" },
    { Icon: SiHtml5, color: "#e34f26" },
    { Icon: SiCss, color: "#1572b6" },
    { Icon: SiNodedotjs, color: "#68a063" },
    { Icon: SiMongodb, color: "#4db33d" },
    { Icon: SiExpress, color: "#bcbcbc" },
    { Icon: SiThreedotjs, color: "#c9c9c9" },
    { Icon: SiGreensock, color: "#8ac640" },
    { Icon: SiTailwindcss, color: "#38bdf8" },
    { Icon: SiSocketdotio, color: "#d3d3d3" },
    { Icon: SiGit, color: "#f05032" },
    { Icon: SiRedux, color: "#764abc" },
    { Icon: SiFigma, color: "#a258ff" },
];

const POOL = 14;
const BOTTOM_Y = -5;
const TOP_Y = 8;
const POP_DURATION = 0.45;
const RESPAWN_DELAY = 2.5;

/* per-bubble mutable state */
function createBubble(id, skill) {
    return {
        id,
        x: (Math.random() - 0.5) * 1.8,
        y: BOTTOM_Y,
        z: (Math.random() - 0.5) * 2.0,
        r: 0.08 + Math.random() * 0.06,
        speed: 0.05 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
        time: 0,
        skill: skill,
        zigDir: Math.random() < 0.5 ? -1 : 1,
        state: "idle",
        popProgress: 0,
        hiddenTimer: 0,
    };
}

/* ---------- Manual raycast bubble handler ---------- */
function RayHandler({ poolRef, getBubble, onPop }) {
    const { raycaster, camera } = useThree();
    const handlerRef = useRef();

    useEffect(() => {
        const cb = (e) => {
            const target = e.target;
            const tag = target ? target.tagName : "";
            if (tag === "BUTTON" || tag === "A" || tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

            const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

            if (clientX === undefined || clientY === undefined) return;

            const mx = (clientX / window.innerWidth) * 2 - 1;
            const my = -(clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera({ x: mx, y: my }, camera);
            
            let hitBubble = null;
            let hitDist = Infinity;

            for (const m of poolRef.current) {
                if (!m.visible) continue;
                const dist = raycaster.ray.distanceToPoint(m.position);
                if (dist < 0.6 && dist < hitDist) { // generous hit radius
                    hitDist = dist;
                    hitBubble = m;
                }
            }

            if (hitBubble) {
                const bid = hitBubble.userData.bubbleId;
                if (bid !== undefined) {
                    const b = getBubble(bid);
                    if (b && b.state === "idle") {
                        b.state = "pop";
                        b.popProgress = 0;
                        if (onPop) onPop();
                    }
                }
            }
        };

        handlerRef.current = cb;
        document.addEventListener("pointerdown", cb);
        document.addEventListener("touchstart", cb, { passive: true });
        return () => {
            document.removeEventListener("pointerdown", cb);
            document.removeEventListener("touchstart", cb);
        };
    }, []);

    return null;
}

/* ---------- Field logic ---------- */
function BubbleField({ onPop }) {
    const poolRef = useRef([]);
    const bubblesRef = useRef([]);
    const spawnTimerRef = useRef(1.2);
    const idRef = useRef(0);
    const pairRef = useRef(0);
    const nightColor = useMemo(() => new THREE.Color("#5a6faa"), []);

    /* build mesh pool once */
    const pool = useMemo(() => {
        const arr = [];
        for (let i = 0; i < POOL; i++) {
            const geo = new THREE.SphereGeometry(1, 24, 24);
            const mat = new THREE.MeshPhysicalMaterial({
                transparent: true, opacity: 0.3, roughness: 0.1,
                metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.2,
                side: THREE.DoubleSide, depthWrite: false,
                emissive: new THREE.Color("#4466aa"),
                emissiveIntensity: 0,
            });
            const m = new THREE.Mesh(geo, mat);
            m.visible = false;
            m.userData.bubbleId = i;
            m.userData.skill = SKILLS[i % SKILLS.length];
            arr.push(m);
        }
        return arr;
    }, []);

    poolRef.current = pool;

    const getBubble = useCallback((id) => {
        return bubblesRef.current.find((b) => b.id === id);
    }, []);

    useFrame((_, dt) => {
        const n = world.night;

        /* spawn 2 at a time */
        spawnTimerRef.current -= dt;
        if (spawnTimerRef.current <= 0 && bubblesRef.current.length < POOL - 1) {
            spawnTimerRef.current = 1.0 + Math.random() * 1.0;
            const dir = pairRef.current % 2 === 0 ? -1 : 1;
            pairRef.current++;

            for (let i = 0; i < 2; i++) {
                if (bubblesRef.current.length >= POOL) break;
                const idx = bubblesRef.current.length;
                const b = createBubble(idRef.current++, SKILLS[idx % SKILLS.length]);
                b.x = dir * (0.3 + Math.random() * 0.5);
                b.zigDir = i === 0 ? -1 : 1;
                b.phase = Math.random() * Math.PI * 2;
                bubblesRef.current.push(b);
            }
        }

        /* update all */
        for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
            const b = bubblesRef.current[i];
            b.time += dt;

            if (b.state === "idle") {
                b.y += b.speed * dt;
                b.x += (b.zigDir * 0.001) + (Math.sin(b.time * 0.8 + b.phase) * 0.003);
                
                if (b.x > 1.0) b.zigDir = -1;
                if (b.x < -1.0) b.zigDir = 1;

                if (b.y > TOP_Y) {
                    b.state = "pop";
                    b.popProgress = 0;
                }
            }

            if (b.state === "pop") {
                b.popProgress += dt / POP_DURATION;
                if (b.popProgress >= 1) {
                    b.state = "hidden";
                    b.hiddenTimer = 0;
                }
            }

            if (b.state === "hidden") {
                b.hiddenTimer += dt;
                if (b.hiddenTimer > RESPAWN_DELAY + Math.random() * 1.0) {
                    b.state = "idle";
                    b.popProgress = 0;
                    b.y = BOTTOM_Y;
                    b.x = (Math.random() - 0.5) * 1.8;
                    b.speed = 0.05 + Math.random() * 0.04;
                    b.zigDir = Math.random() < 0.5 ? -1 : 1;
                    b.time = 0;
                }
            }
        }

        /* assign pool meshes */
        let idx = 0;
        for (const b of bubblesRef.current) {
            if (idx >= POOL) break;
            const m = pool[idx];
            const mesh = pool[idx++];
            mesh.visible = true;

            if (b.state === "idle") {
                mesh.position.set(b.x, b.y, b.z);
                const scale = b.r * 1.25; // Smaller size
                mesh.scale.setScalar(scale);
                const c = mesh.material.color;
                c.set(b.skill.color);
                c.lerp(nightColor, n * 0.5);
                mesh.material.opacity = 0.12 + n * 0.08;
                mesh.material.emissiveIntensity = n * 0.06;
                if (mesh.userData.htmlRef && mesh.userData.htmlRef.current) {
                    mesh.userData.htmlRef.current.style.opacity = '1';
                    mesh.userData.htmlRef.current.style.transform = `scale(${1})`;
                }
            } else if (b.state === "pop") {
                const p = Math.min(b.popProgress, 1);
                mesh.position.set(b.x, b.y, b.z);
                const s = b.r * 1.25 * (1 + p * 3); // Smaller size
                mesh.scale.setScalar(s);
                const c = mesh.material.color;
                c.set(b.skill.color);
                c.lerp(nightColor, n * 0.5);
                mesh.material.opacity = Math.max(0, (0.15 + n * 0.08) * (1 - p * 1.2));
                mesh.material.emissiveIntensity = n * 0.06;
                if (mesh.userData.htmlRef && mesh.userData.htmlRef.current) {
                    mesh.userData.htmlRef.current.style.opacity = `${1 - p}`;
                    mesh.userData.htmlRef.current.style.transform = `scale(${1 + p})`;
                }
            } else {
                mesh.visible = false;
            }
        }
        while (idx < POOL) pool[idx++].visible = false;
    });

    return (
        <group>
            {pool.map((m, i) => {
                const Icon = m.userData.skill.Icon;
                m.userData.htmlRef = m.userData.htmlRef || { current: null };
                return (
                    <primitive key={i} object={m}>
                        <Html center style={{ pointerEvents: 'none' }}>
                            <div ref={m.userData.htmlRef} style={{ color: m.userData.skill.color, fontSize: '28px', opacity: 1, filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))" }}>
                                <Icon />
                            </div>
                        </Html>
                    </primitive>
                );
            })}
            <RayHandler poolRef={poolRef} getBubble={getBubble} onPop={onPop} />
        </group>
    );
}

/* ---------- Root ---------- */
export default function FloatingBubbles() {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1, touchAction: "none" }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 55, near: 0.1, far: 20 }}
                gl={{ antialias: true, alpha: true }}
                dpr={Math.min(window.devicePixelRatio, 2)}
                flat
                style={{ width: "100%", height: "100%" }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[3, 6, 5]} intensity={0.8} />
                <BubbleField />
            </Canvas>
        </div>
    );
}
