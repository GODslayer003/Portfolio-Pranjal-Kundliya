import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

const GAME_DURATION = 30;

function getCSSVar(name, fallback) {
    try {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
    } catch { return fallback; }
}

export default function MiniGame({ onBack }) {
    const scope = useRef();
    const titleRef = useRef();
    const canvasRef = useRef();
    const rafRef = useRef();
    const endGameRef = useRef();
    const stateRef = useRef({ orbs: [], particles: [], running: false, lastSpawn: 0, combo: 0, comboTimer: 0, timeLeft: GAME_DURATION });

    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [phase, setPhase] = useState("idle");
    const [best, setBest] = useState(() => {
        try { return Number(localStorage.getItem("reflex-best") || 0); } catch { return 0; }
    });

    useGSAP(() => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: scope.current, start: "top 75%" } });
        const split = new SplitText(titleRef.current, { type: "chars", charsClass: "char" });
        tl.from(split.chars, {
            yPercent: 110, opacity: 0, rotateX: -70, stagger: 0.02, duration: 0.8, ease: "power3.out",
        })
            .from(".game-sub", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.3")
            .from(".game-frame", { y: 40, opacity: 0, scale: 0.97, duration: 0.8, ease: "power3.out" }, "-=0.2");
    }, { scope });

    const accent = useCallback(() => getCSSVar("--accent", "#7c6cff"), []);
    const ink = useCallback(() => getCSSVar("--ink", "#eaeaea"), []);

    const spawnOrb = (w, h) => {
        const r = Math.min(w, h) < 480 ? 26 + Math.random() * 14 : 20 + Math.random() * 16;
        stateRef.current.orbs.push({
            x: r + Math.random() * (w - r * 2),
            y: r + Math.random() * (h - r * 2),
            r, life: 1, decay: 0.006 + Math.random() * 0.004,
            hue: Math.random() > 0.85 ? "gold" : "accent",
        });
    };

    const burst = (x, y, color) => {
        for (let i = 0; i < 14; i++) {
            const a = (Math.PI * 2 * i) / 14;
            stateRef.current.particles.push({
                x, y, vx: Math.cos(a) * (2 + Math.random() * 3),
                vy: Math.sin(a) * (2 + Math.random() * 3),
                life: 1, color,
            });
        }
    };

    const loop = useCallback((t) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        const s = stateRef.current;

        ctx.clearRect(0, 0, w, h);

        if (s.running) {
            const rate = Math.max(380, 850 - (GAME_DURATION - s.timeLeft) * 18);
            if (t - s.lastSpawn > rate && s.orbs.length < 8) {
                spawnOrb(w, h);
                s.lastSpawn = t;
            }
            if (s.combo > 0 && t - s.comboTimer > 1500) {
                s.combo = 0;
                setCombo(0);
            }
        }

        const ac = accent();
        s.orbs = s.orbs.filter((o) => {
            o.life -= o.decay;
            if (o.life <= 0) return false;
            const color = o.hue === "gold" ? "#ffce54" : ac;
            const pulse = o.r * (0.85 + 0.15 * Math.sin(t / 150));
            ctx.beginPath();
            ctx.arc(o.x, o.y, pulse * o.life, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = o.life;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(o.x, o.y, pulse * o.life * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.globalAlpha = 1;
            return true;
        });

        s.particles = s.particles.filter((p) => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= 0.03;
            if (p.life <= 0) return false;
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 3, 3);
            ctx.globalAlpha = 1;
            return true;
        });

        rafRef.current = requestAnimationFrame(loop);
    }, [accent]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);
        rafRef.current = requestAnimationFrame(loop);
        return () => {
            window.removeEventListener("resize", resize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [loop]);

    const endGame = useCallback(() => {
        const s = stateRef.current;
        if (!s.running) return;
        s.running = false;
        setPhase("over");
        setScore((finalScore) => {
            setBest((prev) => {
                const nb = Math.max(prev, finalScore);
                try { localStorage.setItem("reflex-best", nb); } catch { /* noop */ }
                return nb;
            });
            return finalScore;
        });
    }, []);

    endGameRef.current = endGame;

    useEffect(() => {
        if (phase !== "playing") return;
        const id = setInterval(() => {
            setTimeLeft((prev) => {
                stateRef.current.timeLeft = prev - 1;
                if (prev <= 1) {
                    clearInterval(id);
                    endGameRef.current();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [phase]);

    const startGame = useCallback(() => {
        const s = stateRef.current;
        s.orbs = []; s.particles = []; s.running = true; s.combo = 0; s.timeLeft = GAME_DURATION; s.lastSpawn = 0;
        setScore(0); setCombo(0); setTimeLeft(GAME_DURATION); setPhase("playing");
    }, []);

    const handleHit = useCallback((e) => {
        const s = stateRef.current;
        if (!s.running) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        for (let i = s.orbs.length - 1; i >= 0; i--) {
            const o = s.orbs[i];
            if (Math.hypot(o.x - cx, o.y - cy) < o.r + 12) {
                const isGold = o.hue === "gold";
                s.combo += 1;
                s.comboTimer = performance.now();
                const gained = (isGold ? 50 : 10) * Math.min(s.combo, 5);
                burst(o.x, o.y, isGold ? "#ffce54" : accent());
                s.orbs.splice(i, 1);
                setScore((v) => v + gained);
                setCombo(s.combo);
                return;
            }
        }
        s.combo = 0;
        setCombo(0);
    }, [accent]);

    const statStyle = {
        fontSize: "clamp(0.75rem, 1.4vw, 0.9rem)",
        color: "var(--muted)",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
    };
    const valStyle = {
        fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
        fontWeight: 700,
        color: "var(--ink)",
        fontVariantNumeric: "tabular-nums",
    };

    return (
        <section
            id="minigame"
            ref={scope}
            style={{
                display: "flex", alignItems: "center",
                justifyContent: "center", position: "relative", overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "relative", zIndex: 1, maxWidth: "1280px", width: "100%",
                    marginInline: "auto", paddingInline: "clamp(16px, 5vw, 96px)",
                    paddingBlock: "clamp(4rem, 8vw, 6rem)", display: "flex",
                    flexDirection: "column", alignItems: "center", textAlign: "center",
                    gap: "clamp(1.25rem, 3vw, 2.5rem)",
                }}
            >
                {onBack && (
                    <button
                        onClick={onBack}
                        style={{
                            position: "absolute", top: "clamp(1rem, 2vw, 1.5rem)", left: "clamp(16px, 5vw, 96px)",
                            padding: "0.4rem 1rem", borderRadius: "999px", border: "none",
                            background: "color-mix(in srgb, var(--ink) 6%, transparent)",
                            color: "var(--muted)", fontSize: "0.75rem", fontWeight: 600,
                            cursor: "pointer", letterSpacing: "0.05em", display: "inline-flex",
                            alignItems: "center", gap: "0.35rem", backdropFilter: "blur(4px)",
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back
                    </button>
                )}
                <h2
                    ref={titleRef}
                    className="h-display"
                    style={{
                        fontSize: "clamp(3rem, 10vw, 9rem)", fontWeight: 700, lineHeight: 0.92,
                        color: "var(--ink)", letterSpacing: "-0.04em", perspective: "800px",
                    }}
                >
                    REFLEX.EXE
                </h2>

                <p
                    className="game-sub"
                    style={{
                        fontSize: "clamp(0.95rem, 1.6vw, 1.25rem)", color: "var(--muted)",
                        maxWidth: "620px", lineHeight: 1.7,
                    }}
                >
                    Recruiters read resumes. Legends pop orbs. You have{" "}
                    <span style={{ color: "var(--accent)", fontWeight: 600 }}>30 seconds</span>.
                    Chain hits for combos, gold orbs are worth 5x. Miss and your combo resets.
                </p>

                <div style={{ display: "flex", gap: "clamp(1.5rem, 5vw, 4rem)", flexWrap: "wrap", justifyContent: "center" }}>
                    <div><div style={statStyle}>Score</div><div style={valStyle}>{score}</div></div>
                    <div>
                        <div style={statStyle}>Combo</div>
                        <div style={{ ...valStyle, color: combo >= 3 ? "var(--accent)" : "var(--ink)" }}>
                            x{Math.min(combo, 5) || 1}
                        </div>
                    </div>
                    <div>
                        <div style={statStyle}>Time</div>
                        <div style={{ ...valStyle, color: timeLeft <= 5 && phase === "playing" ? "#ff5c5c" : "var(--ink)" }}>
                            {timeLeft}s
                        </div>
                    </div>
                    <div><div style={statStyle}>Best</div><div style={{ ...valStyle, color: "#ffce54" }}>{best}</div></div>
                </div>

                <div
                    className="game-frame"
                    style={{
                        position: "relative", width: "100%", maxWidth: "900px",
                        height: "clamp(320px, 55vh, 520px)", borderRadius: "20px",
                        border: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
                        background: "color-mix(in srgb, var(--ink) 3%, transparent)",
                        overflow: "hidden", touchAction: "none", cursor: "crosshair",
                        backdropFilter: "blur(4px)",
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        onPointerDown={handleHit}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                    />

                    {phase !== "playing" && (
                        <div
                            style={{
                                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", gap: "1.25rem",
                                background: "color-mix(in srgb, black 35%, transparent)",
                                backdropFilter: "blur(6px)", padding: "1rem",
                            }}
                        >
                            {phase === "over" && (
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ ...statStyle, marginBottom: "0.25rem" }}>Final Score</div>
                                    <div style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800, color: "var(--accent)" }}>
                                        {score}
                                    </div>
                                    <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
                                        {score >= best && score > 0
                                            ? "New personal best. Now imagine what I do with production code."
                                            : score > 200
                                                ? "Sharp reflexes. Sharper code."
                                                : "The orbs won this round. My code never loses."}
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={startGame}
                                style={{
                                    padding: "0.9rem 2.5rem", borderRadius: "999px",
                                    border: "1px solid var(--accent)", background: "var(--accent)",
                                    color: "#fff", fontWeight: 700, fontSize: "1rem",
                                    letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                                }}
                            >
                                {phase === "over" ? "Run it back" : "Initialize"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
