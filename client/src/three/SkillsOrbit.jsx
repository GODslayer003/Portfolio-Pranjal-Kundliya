import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { SKILLS } from "../data/content";
import { world } from "./world";

/* ═══════════════════════════════════════════════════════════════════
   BALLOON MAN IN THE GARDEN — SKILL BALLOON & GLASS CAROUSEL SYSTEM
   ═══════════════════════════════════════════════════════════════════ */

/* ── Camera constants ──────────────────────────────────────────── */
const CAM_Z = 8.5;
const CAM_Y = 0.3;
const FOV = 45;

/* ── Man & hand anchor (world space) ───────────────────────────── */
const MAN_BASE_Y = -3.3;
const HAND = new THREE.Vector3(0.62, -1.35, 0.15);

/* ── Wardrobe (lerped live with the site's day/night cycle) ────── */
const DAY_OUTFIT = { shirt: "#f5f1e8", pants: "#1a1a1e", boots: "#101014" };
const NIGHT_OUTFIT = { shirt: "#16161a", pants: "#ece8df", boots: "#f2efe7" };
const SKIN = "#e8c39e";
const HAIR = "#2e2018";

/* ── Garden ────────────────────────────────────────────────────── */
const LAWN_RADIUS = 11;      // ← expanded: lawn reaches the bottom of the frame
const LAWN_Z_SHIFT = 1.3;    // ← pushed toward the camera so it meets the footer edge
const GARDEN_DEPTH = 0.85;   // ellipse squash on Z
const DECOR_RADIUS = 6.2;    // grass/flowers/bushes stay in the visible heart
const GRASS_COUNT = 220;
const DAY_GARDEN = { lawn: "#8fb573", grass: "#6e9c54", bush: "#5d8a4a" };
const NIGHT_GARDEN = { lawn: "#22343a", grass: "#1b2c31", bush: "#16262b" };

/* ── Glass carousel (skill chips) ──────────────────────────────── */
const CHIP_RX = 8.0;
const CHIP_RZ = 2.6;
const CHIP_Y = 0.75;
const CHIP_Z_CENTER = 0.4;
const CHIP_MIN_WIDTH = 150;
const CHIP_DAY = { glass: [30, 30, 36], text: [245, 242, 234] };
const CHIP_NIGHT = { glass: [246, 244, 238], text: [22, 22, 26] };

/* ── Balloon bunch layout ──────────────────────────────────────── */
const COL_SPACING = 1.5;
const BUNCH_Y = 1.55;
const ROW_Y = 0.6;
const ARC_DROP = 0.10;
const BASE_RADIUS = 0.55;
const BOB_AMP = 0.14;
const BOB_FREQ = 1.1;
const SWAY_AMP = 0.28;
const WIND_AMP = 0.22;
const MIN_VIEWPORT_WIDTH = 640;

/* ── Burst FX ──────────────────────────────────────────────────── */
const SHARDS = 28;
const SHARD_SIZE = 0.18;
const POP_DURATION = 0.26;
const SHARD_DURATION = 0.95;
const HIDDEN_DELAY = 0.5;
const RESPAWN_DURATION = 1.2;
const BASE_OPACITY = 0.90;

/* ── Easings & math helpers ────────────────────────────────────── */
const easeIn3 = (x) => x * x * x;
const easeOut3 = (x) => 1 - Math.pow(1 - x, 3);
const easeOutElastic = (x) =>
    x === 0 ? 0 : x === 1 ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (Math.PI * 2 / 3)) + 1;
const lerp = (a, b, t) => a + (b - a) * t;

/* ═══════════════════════════════════════════════════════════════════
   SINGLE BALLOON — tied to the man's hand
   ═══════════════════════════════════════════════════════════════════ */
function Balloon({ skill, idx, total }) {
    const group = useRef();
    const mesh = useRef();
    const mat = useRef();
    const shardsRef = useRef();
    const shardMat = useRef();
    const label = useRef();
    const labelWrap = useRef();

    const [hover, setHover] = useState(false);

    const col = Math.floor(idx / 2);
    const cols = Math.ceil(total / 2);
    const colOffset = col - (cols - 1) / 2;
    const rowSign = idx % 2 === 0 ? 1 : -1;
    const zDepth = ((idx % 3) - 1) * 0.45;

    const state = useRef({
        bobPhase: idx * 1.234,
        swayPhase: idx * 2.117,
        animPhase: "idle",
        animT: 0,
        yOffset: 0,
    });

    const velocities = useMemo(() => new Float32Array(SHARDS * 3), []);
    const shardPositions = useMemo(() => new Float32Array(SHARDS * 3), []);

    const stringLine = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(9), 3));
        const m = new THREE.LineBasicMaterial({ color: "#6b5a48", transparent: true, opacity: 0.7 });
        return new THREE.Line(g, m);
    }, []);

    const burst = (e) => {
        e.stopPropagation();
        const s = state.current;
        if (s.animPhase !== "idle") return;
        s.animPhase = "pop";
        s.animT = 0;
        for (let j = 0; j < SHARDS; j++) {
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(2 * Math.random() - 1);
            const pwr = 2.4 + Math.random() * 2.4;
            velocities[j * 3] = Math.sin(ph) * Math.cos(th) * pwr;
            velocities[j * 3 + 1] = Math.cos(ph) * pwr + 0.7;
            velocities[j * 3 + 2] = Math.sin(ph) * Math.sin(th) * pwr;
            shardPositions[j * 3] = shardPositions[j * 3 + 1] = shardPositions[j * 3 + 2] = 0;
        }
        shardsRef.current.geometry.attributes.position.needsUpdate = true;
        shardsRef.current.visible = true;
        setHover(false);
    };

    useFrame(({ clock, size }, dt) => {
        dt = Math.min(dt, 0.05);
        const s = state.current;
        const time = clock.elapsedTime;

        const mobileScale = Math.min(1, Math.max(0.6, size.width / MIN_VIEWPORT_WIDTH));
        const r = BASE_RADIUS * mobileScale;

        const restX = colOffset * COL_SPACING * mobileScale;
        const restY = BUNCH_Y + ROW_Y * rowSign - Math.abs(colOffset) * ARC_DROP;

        const wind = Math.sin(time * 0.35) * WIND_AMP;
        const sway = Math.sin(time * 0.45 + s.swayPhase) * SWAY_AMP;
        const bob = Math.sin(time * BOB_FREQ + s.bobPhase) * BOB_AMP;

        const x = restX + wind + sway + world.mouse.x * 0.15;
        const y = restY + bob + s.yOffset;
        group.current.position.set(x, y, zDepth);

        let fade = 1;
        let scale = (mesh.current.scale.x / r) || 1;

        switch (s.animPhase) {
            case "idle": {
                const target = hover ? 1.22 : 1;
                scale += (target - scale) * Math.min(1, dt * 9);
                fade = 1;
                break;
            }
            case "pop": {
                s.animT += dt;
                const k = Math.min(1, s.animT / POP_DURATION);
                scale = (1 + 0.45 * easeOut3(k)) * (1 - easeIn3(k));
                fade = 1 - k;
                if (k >= 1) { s.animPhase = "shards"; s.animT = 0; mesh.current.visible = false; }
                break;
            }
            case "shards": {
                s.animT += dt;
                const k = Math.min(1, s.animT / SHARD_DURATION);
                const arr = shardsRef.current.geometry.attributes.position.array;
                const drag = 1 - 2.5 * dt;
                for (let j = 0; j < SHARDS; j++) {
                    velocities[j * 3] *= drag;
                    velocities[j * 3 + 1] = velocities[j * 3 + 1] * drag - 0.28 * dt;
                    velocities[j * 3 + 2] *= drag;
                    arr[j * 3] += velocities[j * 3] * dt;
                    arr[j * 3 + 1] += velocities[j * 3 + 1] * dt;
                    arr[j * 3 + 2] += velocities[j * 3 + 2] * dt;
                }
                shardsRef.current.geometry.attributes.position.needsUpdate = true;
                shardMat.current.opacity = 1 - easeIn3(k);
                shardMat.current.size = SHARD_SIZE * (1 - k * 0.55);
                fade = 0;
                if (k >= 1) { s.animPhase = "hidden"; s.animT = 0; shardsRef.current.visible = false; }
                break;
            }
            case "hidden": {
                s.animT += dt;
                fade = 0;
                if (s.animT >= HIDDEN_DELAY) {
                    s.animPhase = "respawn"; s.animT = 0;
                    mesh.current.visible = true;
                    s.yOffset = -r * 2.2;
                }
                break;
            }
            case "respawn": {
                s.animT += dt;
                const k = Math.min(1, s.animT / RESPAWN_DURATION);
                scale = Math.max(0.001, easeOutElastic(k));
                fade = Math.min(1, k * 2.8);
                s.yOffset = -r * 2.2 * (1 - easeOut3(k));
                if (k >= 1) { s.animPhase = "idle"; s.yOffset = 0; }
                break;
            }
        }

        const sc = Math.max(0.001, scale * r);
        mesh.current.scale.set(sc, sc * 1.12, sc);
        mat.current.opacity = BASE_OPACITY * fade;
        mat.current.emissiveIntensity = (hover ? 1.5 : 0.48) * fade;
        if (label.current) label.current.style.opacity = fade.toFixed(3);
        if (labelWrap.current) labelWrap.current.style.transform = `scale(${mobileScale})`;

        const knotY = y - sc * 1.12 - 0.12;
        const pos = stringLine.geometry.attributes.position.array;
        pos[0] = HAND.x; pos[1] = HAND.y; pos[2] = HAND.z;
        pos[3] = (HAND.x + x) / 2 + Math.sin(time * 0.5 + s.swayPhase) * 0.12;
        pos[4] = (HAND.y + knotY) / 2 - 0.15;
        pos[5] = (HAND.z + zDepth) / 2;
        pos[6] = x; pos[7] = knotY; pos[8] = zDepth;
        stringLine.geometry.attributes.position.needsUpdate = true;
        stringLine.material.opacity = 0.7 * fade;
    });

    const { Icon } = skill;

    return (
        <>
            <primitive object={stringLine} />
            <group ref={group}>
                <mesh
                    ref={mesh}
                    onClick={burst}
                    onPointerOver={(e) => { e.stopPropagation(); if (state.current.animPhase === "idle") setHover(true); }}
                    onPointerOut={() => setHover(false)}
                >
                    <sphereGeometry args={[1, 36, 36]} />
                    <meshPhysicalMaterial
                        ref={mat}
                        color={skill.color}
                        emissive={skill.color}
                        emissiveIntensity={0.48}
                        roughness={0.10}
                        metalness={0.05}
                        clearcoat={1}
                        clearcoatRoughness={0.12}
                        iridescence={0.55}
                        iridescenceIOR={1.35}
                        transparent
                        opacity={BASE_OPACITY}
                        depthWrite={false}
                    />
                    <mesh position={[0, -1.05, 0]} rotation={[Math.PI, 0, 0]}>
                        <coneGeometry args={[0.14, 0.2, 8]} />
                        <meshStandardMaterial color={skill.color} roughness={0.4} />
                    </mesh>
                </mesh>

                <points ref={shardsRef} visible={false}>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" args={[shardPositions, 3]} />
                    </bufferGeometry>
                    <pointsMaterial
                        ref={shardMat}
                        color={skill.color}
                        size={SHARD_SIZE}
                        transparent
                        opacity={1}
                        sizeAttenuation
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </points>

                <Html center distanceFactor={8} style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
                    <div ref={labelWrap} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, transition: "opacity 0.18s", willChange: "transform, opacity" }}>
                        <div ref={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                            <Icon size={34} color="#1a1a1a" />
                            {hover && (
                                <span style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", background: "var(--ink)", color: "var(--bg)", padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", fontWeight: 500 }}>
                                    {skill.name}
                                </span>
                            )}
                        </div>
                    </div>
                </Html>
            </group>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   SKILLS CAROUSEL — one chip at a time, slides right → left
   ═══════════════════════════════════════════════════════════════════ */
function SkillsCarousel({ skills }) {
    const group = useRef();
    const el = useRef();
    const state = useRef({ idx: 0, phase: 0 });
    const [currentSkill, setCurrentSkill] = useState(skills[0]);

    const DURATION = 3.5;
    const TRANSITION = 0.7;

    useFrame(({ size }, dt) => {
        dt = Math.min(dt || 0.016, 0.05);
        const s = state.current;
        s.phase += dt;

        if (s.phase >= DURATION) {
            s.phase -= DURATION;
            s.idx = (s.idx + 1) % skills.length;
            setCurrentSkill(skills[s.idx]);
        }

        const progress = s.phase / DURATION;
        const mobileScale = Math.min(1, Math.max(0.6, size.width / MIN_VIEWPORT_WIDTH));
        const slideWidth = CHIP_RX * 2.4 * mobileScale;

        let x, opacity, chipScale;

        if (progress < TRANSITION / DURATION) {
            const p = progress / (TRANSITION / DURATION);
            const eased = 1 - Math.pow(1 - p, 3);
            x = slideWidth * (1 - eased);
            opacity = eased;
            chipScale = 0.35 + 0.65 * eased;
        } else if (progress > (DURATION - TRANSITION) / DURATION) {
            const p = (progress - (DURATION - TRANSITION) / DURATION) / (TRANSITION / DURATION);
            const eased = p * p * p;
            x = -slideWidth * eased;
            opacity = 1 - eased;
            chipScale = 1 - 0.65 * eased;
        } else {
            x = 0;
            opacity = 1;
            chipScale = 1;
        }

        group.current.position.set(x, MAN_BASE_Y + CHIP_Y, CHIP_Z_CENTER + CHIP_RZ);

        if (el.current) {
            const sc = chipScale * mobileScale;
            el.current.style.opacity = opacity.toFixed(3);
            el.current.style.transform = `scale(${sc.toFixed(3)})`;

            const n = world.night ?? 0;
            const g = CHIP_DAY.glass.map((c, i) => Math.round(lerp(c, CHIP_NIGHT.glass[i], n)));
            const t = CHIP_DAY.text.map((c, i) => Math.round(lerp(c, CHIP_NIGHT.text[i], n)));
            el.current.style.background = `rgba(${g[0]},${g[1]},${g[2]},0.34)`;
            el.current.style.borderColor = `rgba(${g[0]},${g[1]},${g[2]},0.5)`;
            el.current.style.color = `rgb(${t[0]},${t[1]},${t[2]})`;
        }
    });

    const { Icon } = currentSkill;

    return (
        <group ref={group}>
            <Html center distanceFactor={7} style={{ pointerEvents: "none" }} zIndexRange={[5, 0]}>
                <div
                    ref={el}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        minWidth: CHIP_MIN_WIDTH,
                        padding: "10px 16px",
                        boxSizing: "border-box",
                        borderRadius: 16,
                        border: "1px solid rgba(30,30,36,0.5)",
                        background: "rgba(30,30,36,0.34)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                        color: "rgb(245,242,234)",
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: "nowrap",
                        willChange: "transform, opacity",
                    }}
                >
                    <Icon size={18} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{currentSkill.name}</span>
                </div>
            </Html>
        </group>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   THE GARDEN — expanded lawn, instanced grass, flowers, bushes, stand
   ═══════════════════════════════════════════════════════════════════ */
function Garden() {
    const grassRef = useRef();

    const lawnMat = useMemo(() => new THREE.MeshStandardMaterial({ color: DAY_GARDEN.lawn, roughness: 0.95 }), []);
    const grassMat = useMemo(() => new THREE.MeshStandardMaterial({ color: DAY_GARDEN.grass, roughness: 0.9 }), []);
    const bushMat = useMemo(() => new THREE.MeshStandardMaterial({ color: DAY_GARDEN.bush, roughness: 0.9 }), []);
    const woodMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#7a5a3a", roughness: 0.8 }), []);

    const palette = useMemo(() => ({
        dayLawn: new THREE.Color(DAY_GARDEN.lawn), nightLawn: new THREE.Color(NIGHT_GARDEN.lawn),
        dayGrass: new THREE.Color(DAY_GARDEN.grass), nightGrass: new THREE.Color(NIGHT_GARDEN.grass),
        dayBush: new THREE.Color(DAY_GARDEN.bush), nightBush: new THREE.Color(NIGHT_GARDEN.bush),
    }), []);

    useEffect(() => {
        const dummy = new THREE.Object3D();
        for (let i = 0; i < GRASS_COUNT; i++) {
            const rad = Math.sqrt(Math.random()) * DECOR_RADIUS;
            const ang = Math.random() * Math.PI * 2;
            dummy.position.set(Math.cos(ang) * rad, 0.1, Math.sin(ang) * rad * GARDEN_DEPTH);
            dummy.rotation.set((Math.random() - 0.5) * 0.3, Math.random() * Math.PI, (Math.random() - 0.5) * 0.3);
            dummy.scale.set(1, 0.7 + Math.random() * 1.1, 1);
            dummy.updateMatrix();
            grassRef.current.setMatrixAt(i, dummy.matrix);
        }
        grassRef.current.instanceMatrix.needsUpdate = true;
    }, []);

    useFrame(() => {
        const n = world.night ?? 0;
        lawnMat.color.lerpColors(palette.dayLawn, palette.nightLawn, n);
        grassMat.color.lerpColors(palette.dayGrass, palette.nightGrass, n);
        bushMat.color.lerpColors(palette.dayBush, palette.nightBush, n);
    });

    const flowers = useMemo(() => {
        const colors = ["#e07a7a", "#e8b04b", "#c58ad4", "#7ab2e0", "#e0928f"];
        return Array.from({ length: 9 }, (_, i) => ({
            x: (Math.sin(i * 2.4) * 0.5 + (i / 9 - 0.5)) * DECOR_RADIUS * 1.4,
            z: Math.cos(i * 1.7) * DECOR_RADIUS * GARDEN_DEPTH * 0.7,
            c: colors[i % colors.length],
            h: 0.28 + (i % 3) * 0.08,
        }));
    }, []);

    return (
        <group position={[0, MAN_BASE_Y, 0]}>
            {/* ── Lawn: expanded + pulled toward the camera so the grass
                   plane runs past the bottom edge of the canvas ───── */}
            <mesh material={lawnMat} rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, LAWN_Z_SHIFT]} scale={[1, GARDEN_DEPTH, 1]}>
                <circleGeometry args={[LAWN_RADIUS, 48]} />
            </mesh>

            <instancedMesh ref={grassRef} args={[null, null, GRASS_COUNT]} material={grassMat}>
                <coneGeometry args={[0.035, 0.24, 4]} />
            </instancedMesh>

            {flowers.map((f, i) => (
                <group key={i} position={[f.x, 0, f.z]}>
                    <mesh material={grassMat} position={[0, f.h / 2, 0]}>
                        <cylinderGeometry args={[0.015, 0.02, f.h, 6]} />
                    </mesh>
                    <mesh position={[0, f.h + 0.05, 0]}>
                        <sphereGeometry args={[0.07, 10, 10]} />
                        <meshStandardMaterial color={f.c} roughness={0.5} />
                    </mesh>
                </group>
            ))}

            {[[-4.8, -0.4], [4.9, -0.2], [-3.6, 1.4], [3.8, 1.5]].map(([bx, bz], i) => (
                <group key={i} position={[bx, 0, bz]}>
                    <mesh material={bushMat} position={[0, 0.28, 0]}><sphereGeometry args={[0.42, 14, 14]} /></mesh>
                    <mesh material={bushMat} position={[0.3, 0.2, 0.1]}><sphereGeometry args={[0.3, 12, 12]} /></mesh>
                    <mesh material={bushMat} position={[-0.28, 0.18, -0.05]}><sphereGeometry args={[0.26, 12, 12]} /></mesh>
                </group>
            ))}

            {/* ── Balloon seller's wooden stand with a LARGER sign ─── */}
            <group position={[-1.9, 0, 0.5]} rotation={[0, 0.35, 0]}>
                <mesh material={woodMat} position={[0, 0.42, 0]}><boxGeometry args={[1.0, 0.1, 0.5]} /></mesh>
                <mesh material={woodMat} position={[-0.42, 0.2, 0.18]}><boxGeometry args={[0.07, 0.42, 0.07]} /></mesh>
                <mesh material={woodMat} position={[0.42, 0.2, 0.18]}><boxGeometry args={[0.07, 0.42, 0.07]} /></mesh>
                <mesh material={woodMat} position={[-0.42, 0.2, -0.18]}><boxGeometry args={[0.07, 0.42, 0.07]} /></mesh>
                <mesh material={woodMat} position={[0.42, 0.2, -0.18]}><boxGeometry args={[0.07, 0.42, 0.07]} /></mesh>
                {/* Sign post + enlarged board (text fully contained) */}
                <mesh material={woodMat} position={[0, 1.05, -0.15]}><cylinderGeometry args={[0.035, 0.035, 1.25, 8]} /></mesh>
                <mesh material={woodMat} position={[0, 1.72, -0.15]}><boxGeometry args={[1.7, 0.5, 0.06]} /></mesh>
                <Html
                    center
                    position={[0, 1.72, -0.1]}
                    distanceFactor={5}
                    style={{ pointerEvents: "none" }}
                    zIndexRange={[4, 0]}
                >
                    <div style={{
                        width: 200,
                        textAlign: "center",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: 15,
                        letterSpacing: "0.12em",
                        color: "var(--bg)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                    }}>
                        BALLOONS · SKILLS
                    </div>
                </Html>
            </group>
        </group>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   THE MAN — wardrobe lerps with world.night
   ═══════════════════════════════════════════════════════════════════ */
function Man() {
    const body = useRef();
    const headGrp = useRef();
    const torso = useRef();

    const shirtMat = useMemo(() => new THREE.MeshStandardMaterial({ color: DAY_OUTFIT.shirt, roughness: 0.62 }), []);
    const pantsMat = useMemo(() => new THREE.MeshStandardMaterial({ color: DAY_OUTFIT.pants, roughness: 0.82 }), []);
    const bootsMat = useMemo(() => new THREE.MeshStandardMaterial({ color: DAY_OUTFIT.boots, roughness: 0.4, metalness: 0.15 }), []);
    const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.6 }), []);
    const hairMat = useMemo(() => new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.9 }), []);
    const beltMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#4a3826", roughness: 0.5 }), []);

    const palette = useMemo(() => ({
        dayShirt: new THREE.Color(DAY_OUTFIT.shirt), nightShirt: new THREE.Color(NIGHT_OUTFIT.shirt),
        dayPants: new THREE.Color(DAY_OUTFIT.pants), nightPants: new THREE.Color(NIGHT_OUTFIT.pants),
        dayBoots: new THREE.Color(DAY_OUTFIT.boots), nightBoots: new THREE.Color(NIGHT_OUTFIT.boots),
    }), []);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        body.current.rotation.z = Math.sin(t * 0.5) * 0.02;
        body.current.position.y = MAN_BASE_Y + Math.sin(t * 1.4) * 0.015;
        torso.current.scale.y = 1 + Math.sin(t * 1.4) * 0.012;
        headGrp.current.rotation.x = -0.22 + Math.sin(t * 0.8) * 0.03;
        headGrp.current.rotation.y = Math.sin(t * 0.4) * 0.06;

        const n = world.night ?? 0;
        shirtMat.color.lerpColors(palette.dayShirt, palette.nightShirt, n);
        pantsMat.color.lerpColors(palette.dayPants, palette.nightPants, n);
        bootsMat.color.lerpColors(palette.dayBoots, palette.nightBoots, n);
    });

    return (
        <group ref={body} position={[0, MAN_BASE_Y, 0]}>
            <group position={[-0.17, 0.1, 0.03]}>
                <mesh material={bootsMat}><boxGeometry args={[0.17, 0.17, 0.3]} /></mesh>
                <mesh material={bootsMat} position={[0, -0.02, 0.16]}><sphereGeometry args={[0.085, 12, 12]} /></mesh>
            </group>
            <group position={[0.17, 0.1, 0.03]}>
                <mesh material={bootsMat}><boxGeometry args={[0.17, 0.17, 0.3]} /></mesh>
                <mesh material={bootsMat} position={[0, -0.02, 0.16]}><sphereGeometry args={[0.085, 12, 12]} /></mesh>
            </group>

            <mesh material={pantsMat} position={[-0.16, 0.62, 0]}><capsuleGeometry args={[0.095, 0.72, 4, 12]} /></mesh>
            <mesh material={pantsMat} position={[0.16, 0.62, 0]}><capsuleGeometry args={[0.095, 0.72, 4, 12]} /></mesh>

            <mesh material={pantsMat} position={[0, 1.05, 0]} scale={[1.15, 0.72, 0.9]}>
                <sphereGeometry args={[0.24, 20, 20]} />
            </mesh>
            <mesh material={beltMat} position={[0, 1.18, 0]}>
                <cylinderGeometry args={[0.255, 0.255, 0.06, 20]} />
            </mesh>

            <group ref={torso} position={[0, 1.52, 0]}>
                <mesh material={shirtMat}><cylinderGeometry args={[0.3, 0.235, 0.68, 20]} /></mesh>
                <mesh material={shirtMat} position={[-0.28, 0.3, 0]}><sphereGeometry args={[0.11, 16, 16]} /></mesh>
                <mesh material={shirtMat} position={[0.28, 0.3, 0]}><sphereGeometry args={[0.11, 16, 16]} /></mesh>
                <mesh material={shirtMat} position={[0, 0.36, 0]}><cylinderGeometry args={[0.11, 0.13, 0.08, 16]} /></mesh>
            </group>

            <mesh material={skinMat} position={[0, 1.94, 0]}><cylinderGeometry args={[0.075, 0.08, 0.12, 12]} /></mesh>
            <group ref={headGrp} position={[0, 2.14, 0]}>
                <mesh material={skinMat}><sphereGeometry args={[0.23, 24, 24]} /></mesh>
                <mesh material={hairMat} position={[0, 0.05, -0.03]} rotation={[-0.25, 0, 0]}>
                    <sphereGeometry args={[0.235, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                </mesh>
                <mesh material={skinMat} position={[-0.22, -0.02, 0]}><sphereGeometry args={[0.045, 10, 10]} /></mesh>
                <mesh material={skinMat} position={[0.22, -0.02, 0]}><sphereGeometry args={[0.045, 10, 10]} /></mesh>
                <mesh material={skinMat} position={[0, -0.03, 0.22]}><sphereGeometry args={[0.04, 10, 10]} /></mesh>
            </group>

            <mesh material={shirtMat} position={[-0.34, 1.6, 0]} rotation={[0, 0, 0.2]}>
                <capsuleGeometry args={[0.068, 0.3, 4, 12]} />
            </mesh>
            <mesh material={skinMat} position={[-0.41, 1.26, 0.04]} rotation={[0.12, 0, 0.1]}>
                <capsuleGeometry args={[0.058, 0.28, 4, 12]} />
            </mesh>
            <mesh material={skinMat} position={[-0.44, 1.06, 0.07]}><sphereGeometry args={[0.075, 12, 12]} /></mesh>

            <mesh material={shirtMat} position={[0.42, 1.74, 0.07]} rotation={[0, 0, -1.35]}>
                <capsuleGeometry args={[0.068, 0.28, 4, 12]} />
            </mesh>
            <mesh material={skinMat} position={[0.58, 1.83, 0.11]} rotation={[0.1, 0, -0.32]}>
                <capsuleGeometry args={[0.058, 0.26, 4, 12]} />
            </mesh>
            <mesh material={skinMat} position={[0.62, 1.95, 0.15]}>
                <sphereGeometry args={[0.09, 14, 14]} />
            </mesh>

            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.9, 32]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.12} />
            </mesh>
        </group>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   RESPONSIVE CAMERA — wider FOV on mobile so balloons + scene fit
   ═══════════════════════════════════════════════════════════════════ */
function ResponsiveCamera() {
    const { camera } = useThree();
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w < 480) { camera.fov = 58; camera.position.z = 11; }
            else if (w < 640) { camera.fov = 55; camera.position.z = 10; }
            else if (w < 768) { camera.fov = 50; camera.position.z = 9.5; }
            else { camera.fov = FOV; camera.position.z = CAM_Z; }
            camera.updateProjectionMatrix();
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [camera]);
    return null;
}

/* ═══════════════════════════════════════════════════════════════════
   MOUSE PARALLAX RIG
   ═══════════════════════════════════════════════════════════════════ */
function ParallaxRig() {
    useFrame(({ camera }, dt) => {
        const ease = Math.min(1, dt * 1.8);
        camera.position.x += (world.mouse.x * 0.45 - camera.position.x) * ease;
        camera.position.y += (CAM_Y + world.mouse.y * -0.28 - camera.position.y) * ease;
        camera.lookAt(0, -0.3, 0);
    });
    return null;
}

/* ═══════════════════════════════════════════════════════════════════
   AMBIENT DEPTH FOG
   ═══════════════════════════════════════════════════════════════════ */
function DepthFog() {
    const { scene } = useThree();
    if (!scene.fog) scene.fog = new THREE.FogExp2("#c8c0b8", 0.035);
    return null;
}

/* ═══════════════════════════════════════════════════════════════════
   BALLOON MAN IN THE GARDEN — main export
   ═══════════════════════════════════════════════════════════════════ */
export default function SkillsOrbit() {
    return (
        <Canvas
            camera={{ position: [0, CAM_Y, CAM_Z], fov: FOV }}
            dpr={[1, 1.8]}
            style={{ overflow: "visible" }}
            gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        >
            <ambientLight intensity={0.65} />
            <pointLight position={[5, 5, 5]} intensity={38} color="#ffd9a0" />
            <pointLight position={[-4, -3, 3]} intensity={10} color="#a0c8ff" />

            <DepthFog />
            <ResponsiveCamera />
            <Garden />
            <Man />

            {SKILLS.map((skill, idx) => (
                <Balloon key={`b-${skill.name}`} skill={skill} idx={idx} total={SKILLS.length} />
            ))}

            <SkillsCarousel skills={SKILLS} />

            <ParallaxRig />
        </Canvas>
    );
}
