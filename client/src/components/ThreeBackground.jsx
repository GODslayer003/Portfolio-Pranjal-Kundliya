import { memo, useEffect, useRef } from "react";
import * as THREE from "three";

function makeGradientMat() {
    return new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color("#070714") },
            uColor2: { value: new THREE.Color("#10102a") },
            uColor3: { value: new THREE.Color("#0a0a20") },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform vec3 uColor3;
            varying vec2 vUv;
            void main() {
                float g1 = sin(vUv.x * 2.8 + vUv.y * 1.4 + uTime * 0.07) * 0.5 + 0.5;
                float g2 = cos(vUv.y * 2.2 + uTime * 0.10) * 0.5 + 0.5;
                float g3 = sin((vUv.x + vUv.y) * 1.6 + uTime * 0.05) * 0.5 + 0.5;
                vec3 c = mix(uColor1, uColor2, g1);
                c = mix(c, uColor3, g2 * 0.3);
                gl_FragColor = vec4(c, 1.0);
            }
        `,
        depthWrite: false,
    });
}

function makeBeamTex() {
    const c = document.createElement("canvas");
    c.width = 4; c.height = 128;
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, "rgba(80,140,255,0)");
    g.addColorStop(0.2, "rgba(80,140,255,0.4)");
    g.addColorStop(0.45, "rgba(120,180,255,0.7)");
    g.addColorStop(0.55, "rgba(120,180,255,0.7)");
    g.addColorStop(0.8, "rgba(80,140,255,0.4)");
    g.addColorStop(1, "rgba(80,140,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 128);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
}

function makeGlowTex() {
    const c = document.createElement("canvas");
    c.width = 64; c.height = 64;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.1, "rgba(180,210,255,0.7)");
    g.addColorStop(0.35, "rgba(100,150,255,0.15)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
}

function disposeScene(scene, renderer) {
    scene.traverse((obj) => {
        if (obj.isMesh || obj.isPoints || obj.isSprite || obj.isLine) {
            obj.geometry?.dispose();
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            for (const m of mats) {
                if (m.map) m.map.dispose();
                if (m.envMap) m.envMap.dispose();
                if (m.alphaMap) m.alphaMap.dispose();
                if (m.lightMap) m.lightMap.dispose();
                if (m.aoMap) m.aoMap.dispose();
                m.dispose();
            }
        }
    });
    renderer.dispose();
}

const ThreeBackground = memo(function ThreeBackground({ sectionRef }) {
    const canvasRef = useRef();
    const cleanupRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (!parent) return;

        const dpr = Math.min(window.devicePixelRatio, 2);
        const renderer = new THREE.WebGLRenderer({
            canvas, alpha: true, antialias: true,
            powerPreference: "high-performance",
        });
        renderer.setPixelRatio(dpr);
        renderer.setSize(parent.clientWidth, parent.clientHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, parent.clientWidth / parent.clientHeight, 0.1, 50);
        camera.position.z = 14;

        const group = new THREE.Group();
        scene.add(group);

        scene.add(new THREE.AmbientLight(0x223366, 0.3));

        const dl = new THREE.DirectionalLight(0x4488ff, 0.4);
        dl.position.set(5, 8, 6);
        scene.add(dl);

        const fl = new THREE.DirectionalLight(0x8855ff, 0.12);
        fl.position.set(-5, -3, 4);
        scene.add(fl);

        const cursorPt = new THREE.PointLight(0x6688ff, 0.5, 20);
        cursorPt.position.set(0, 0, 4);
        scene.add(cursorPt);

        const gradMat = makeGradientMat();
        const gradGeo = new THREE.PlaneGeometry(30, 20);
        const gradMesh = new THREE.Mesh(gradGeo, gradMat);
        gradMesh.position.z = -12;
        group.add(gradMesh);

        const glassCount = 60;
        const glassGeo = new THREE.PlaneGeometry(1, 1);
        const glassMat = new THREE.MeshPhysicalMaterial({
            transparent: true, opacity: 0.1, roughness: 0.06, metalness: 0.04,
            side: THREE.DoubleSide, depthWrite: false,
        });
        const glassMesh = new THREE.InstancedMesh(glassGeo, glassMat, glassCount);
        const dummy = new THREE.Object3D();
        const col = new THREE.Color();
        const gd = [];
        for (let i = 0; i < glassCount; i++) {
            const d = {
                ix: (Math.random() - 0.5) * 26, iy: (Math.random() - 0.5) * 18,
                iz: (Math.random() - 0.5) * 9 - 1.5,
                rx: Math.random() * Math.PI, ry: Math.random() * Math.PI,
                rz: (Math.random() - 0.5) * 0.12,
                sx: 0.3 + Math.random() * 2.2, sy: 0.2 + Math.random() * 1.5,
                sp: 0.06 + Math.random() * 0.25, ph: Math.random() * Math.PI * 2,
            };
            gd.push(d);
            dummy.position.set(d.ix, d.iy, d.iz);
            dummy.rotation.set(d.rx, d.ry, d.rz);
            dummy.scale.set(d.sx, d.sy, 1);
            dummy.updateMatrix();
            glassMesh.setMatrixAt(i, dummy.matrix);
            col.setHSL(0.55 + Math.random() * 0.18, 0.35, 0.25 + Math.random() * 0.25);
            glassMesh.setColorAt(i, col);
        }
        glassMesh.instanceMatrix.needsUpdate = true;
        if (glassMesh.instanceColor) glassMesh.instanceColor.needsUpdate = true;
        group.add(glassMesh);

        const beamTex = makeBeamTex();
        const beams = [];
        for (let i = 0; i < 18; i++) {
            const bw = 0.03 + Math.random() * 0.08;
            const bh = 4 + Math.random() * 7;
            const m = new THREE.Mesh(
                new THREE.PlaneGeometry(bw, bh),
                new THREE.MeshBasicMaterial({
                    map: beamTex, transparent: true, opacity: 0.02 + Math.random() * 0.025,
                    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
                }),
            );
            m.position.set((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 16, -1.5 + Math.random() * 4);
            m.rotation.set(0, 0, (Math.random() - 0.5) * 0.25);
            group.add(m);
            beams.push({
                mesh: m, sr: 0.08 + Math.random() * 0.25, sp: Math.random() * 100,
                so: 0.02 + Math.random() * 0.03, op: Math.random() * Math.PI * 2,
            });
        }

        const pc = 150;
        const pp = new Float32Array(pc * 3);
        const pd = [];
        for (let i = 0; i < pc; i++) {
            pp[i * 3] = (Math.random() - 0.5) * 32;
            pp[i * 3 + 1] = (Math.random() - 0.5) * 22;
            pp[i * 3 + 2] = (Math.random() - 0.5) * 12 - 3;
            pd.push({ ph: Math.random() * Math.PI * 2, sp: 0.04 + Math.random() * 0.12 });
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute("position", new THREE.BufferAttribute(pp, 3));
        const pMesh = new THREE.Points(
            pGeo,
            new THREE.PointsMaterial({
                size: 0.05, transparent: true, opacity: 0.12,
                blending: THREE.AdditiveBlending, depthWrite: false,
                color: 0x5588cc, sizeAttenuation: true,
            }),
        );
        group.add(pMesh);

        const glowTex = makeGlowTex();
        const glowSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: glowTex, transparent: true,
                blending: THREE.AdditiveBlending, opacity: 0.15, depthWrite: false,
            }),
        );
        glowSprite.scale.set(6, 6, 1);
        glowSprite.position.z = 3;
        scene.add(glowSprite);

        const mouse = { x: 0, y: 0 };
        const sy = { v: 0 };
        let visible = true;
        const clock = new THREE.Clock();

        const onMouse = (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", onMouse, { passive: true });

        const onScroll = () => { sy.v = window.scrollY; };
        window.addEventListener("scroll", onScroll, { passive: true });

        const onResize = () => {
            const w = parent.clientWidth, h = parent.clientHeight;
            if (w === 0 || h === 0) return;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);

        const obs = new IntersectionObserver(
            ([e]) => { visible = e.isIntersecting; },
            { threshold: 0 },
        );
        if (sectionRef?.current) obs.observe(sectionRef.current);

        let id;
        const loop = () => {
            id = requestAnimationFrame(loop);
            if (!visible) return;
            const t = clock.getElapsedTime();

            gradMat.uniforms.uTime.value = t;

            for (let i = 0; i < glassCount; i++) {
                const d = gd[i];
                dummy.position.set(
                    d.ix + Math.sin(t * d.sp * 0.5 + d.ph) * 0.35,
                    d.iy + Math.cos(t * d.sp * 0.3 + d.ph) * 0.25,
                    d.iz + Math.sin(t * d.sp * 0.2 + d.ph) * 0.15,
                );
                dummy.rotation.set(
                    d.rx + Math.sin(t * d.sp + d.ph) * 0.05,
                    d.ry + Math.cos(t * d.sp * 0.7 + d.ph) * 0.05,
                    d.rz,
                );
                dummy.scale.set(d.sx, d.sy, 1);
                dummy.updateMatrix();
                glassMesh.setMatrixAt(i, dummy.matrix);
            }
            glassMesh.instanceMatrix.needsUpdate = true;

            for (const b of beams) {
                b.mesh.rotation.z += Math.sin(t * b.sr + b.sp) * 0.0006;
                b.mesh.position.x += Math.sin(t * b.so + b.op) * 0.002;
                b.mesh.material.opacity = 0.025 + Math.sin(t * b.sr * 2 + b.op) * 0.012;
            }

            const pos = pMesh.geometry.attributes.position.array;
            for (let i = 0; i < pc; i++) {
                pos[i * 3 + 1] += Math.sin(t * pd[i].sp + pd[i].ph) * 0.0008;
                pos[i * 3] += Math.cos(t * pd[i].sp * 0.6 + pd[i].ph) * 0.0004;
            }
            pMesh.geometry.attributes.position.needsUpdate = true;

            cursorPt.position.x = mouse.x * 7;
            cursorPt.position.y = mouse.y * 5;
            glowSprite.position.x = mouse.x * 6;
            glowSprite.position.y = mouse.y * 4.5;

            const px = mouse.x * 0.25;
            const py = mouse.y * 0.15;
            const pr = ((sy.v % 200) / 200) * 0.002 - 0.001;
            group.position.x += (px - group.position.x) * 0.025;
            group.position.y += (py - group.position.y) * 0.025;
            group.rotation.x += (pr - group.rotation.x) * 0.015;

            renderer.render(scene, camera);
        };
        loop();

        cleanupRef.current = () => {
            cancelAnimationFrame(id);
            obs.disconnect();
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            disposeScene(scene, renderer);
        };

        return () => cleanupRef.current?.();
    }, [sectionRef]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                zIndex: 1, pointerEvents: "none", display: "block",
            }}
        />
    );
});

export default ThreeBackground;
