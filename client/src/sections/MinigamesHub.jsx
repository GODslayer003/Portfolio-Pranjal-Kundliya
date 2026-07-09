import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import MiniGame from "./MiniGame";
import TypingGame from "./TypingGame";

const GAMES = [
    {
        id: "reflex",
        title: "REFLEX.EXE",
        tagline: "Pop orbs. Chain combos. Beat your best.",
        desc: "Aim, click, repeat. Gold orbs are worth 5x. Miss and your combo resets. 30 seconds of pure reaction training.",
        tags: ["Canvas 2D", "Particles", "Combo System"],
    },
    {
        id: "typing",
        title: "TYPING.EXE",
        tagline: "Type code. Beat the clock. Prove your speed.",
        desc: "20 real-world code snippets. Type them exactly. WPM, accuracy, and total chars tracked. Can you hit 60+ WPM?",
        tags: ["Char-by-char", "WPM Tracker", "20 Snippets"],
    },
];

export default function MinigamesHub() {
    const scope = useRef();
    const [activeGame, setActiveGame] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => window.lenis?.resize(), 80);
        return () => clearTimeout(timer);
    }, [activeGame]);

    useGSAP(() => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: scope.current, start: "top 75%" } });
        const split = new SplitText(scope.current.querySelector(".hub-title"), { type: "chars", charsClass: "char" });
        tl.from(split.chars, {
            yPercent: 110, opacity: 0, rotateX: -70, stagger: 0.02, duration: 0.8, ease: "power3.out",
        })
            .from(".hub-sub", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.3")
            .from(".hub-card", { y: 40, opacity: 0, scale: 0.95, duration: 0.8, ease: "power3.out", stagger: 0.15 }, "-=0.2");
    }, { scope });

    const cardStyle = {
        flex: "1 1 380px", maxWidth: "520px", minHeight: "clamp(280px, 38vh, 360px)",
        borderRadius: "24px", padding: "clamp(1.5rem, 2.5vw, 2.5rem)",
        border: "1px solid color-mix(in srgb, var(--ink) 10%, transparent)",
        background: "color-mix(in srgb, var(--ink) 3%, transparent)",
        backdropFilter: "blur(6px)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        textAlign: "left", cursor: "pointer", position: "relative", overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
    };

    if (activeGame) {
        return activeGame === "reflex" ? <MiniGame onBack={() => setActiveGame(null)} /> : <TypingGame onBack={() => setActiveGame(null)} />;
    }

    return (
        <section
            id="minigames"
            ref={scope}
            style={{
                minHeight: "100svh", display: "flex", alignItems: "center",
                justifyContent: "center", position: "relative", overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "relative", zIndex: 1, maxWidth: "1280px", width: "100%",
                    marginInline: "auto", paddingInline: "clamp(16px, 5vw, 96px)",
                    paddingBlock: "clamp(4rem, 8vw, 6rem)", display: "flex",
                    flexDirection: "column", alignItems: "center", textAlign: "center",
                    gap: "clamp(1.5rem, 3vw, 3rem)",
                }}
            >
                <h2
                    className="hub-title h-display"
                    style={{
                        fontSize: "clamp(2.5rem, 8vw, 7rem)", fontWeight: 700, lineHeight: 0.92,
                        color: "var(--ink)", letterSpacing: "-0.04em", perspective: "800px",
                    }}
                >
                    MINIGAMES.EXE
                </h2>

                <p
                    className="hub-sub"
                    style={{
                        fontSize: "clamp(0.95rem, 1.6vw, 1.25rem)", color: "var(--muted)",
                        maxWidth: "600px", lineHeight: 1.7,
                    }}
                >
                    Two challenges. One mission: prove you belong. Pick your game.
                </p>

                <div
                    style={{
                        display: "flex", flexWrap: "wrap", justifyContent: "center",
                        gap: "clamp(1.25rem, 2.5vw, 2rem)", width: "100%",
                    }}
                >
                    {GAMES.map((game) => (
                        <div
                            key={game.id}
                            className="hub-card"
                            style={cardStyle}
                            onClick={() => setActiveGame(game.id)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-6px)";
                                e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.12)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: "clamp(1.5rem, 2.8vw, 2.4rem)",
                                        fontWeight: 700, color: "var(--ink)",
                                        lineHeight: 1.1, marginBottom: "0.5rem",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    {game.title}
                                </div>
                                <div
                                    style={{
                                        fontSize: "clamp(0.85rem, 1.3vw, 1.1rem)",
                                        color: "var(--accent)", fontWeight: 500,
                                        marginBottom: "0.75rem",
                                    }}
                                >
                                    {game.tagline}
                                </div>
                                <p
                                    style={{
                                        fontSize: "clamp(0.8rem, 1.1vw, 0.95rem)",
                                        color: "var(--muted)", lineHeight: 1.7,
                                    }}
                                >
                                    {game.desc}
                                </p>
                            </div>

                            <div>
                                <div
                                    style={{
                                        display: "flex", flexWrap: "wrap", gap: "0.4rem",
                                        marginBottom: "1.25rem",
                                    }}
                                >
                                    {game.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            style={{
                                                fontSize: "0.65rem", padding: "0.2rem 0.55rem",
                                                borderRadius: "999px",
                                                border: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
                                                color: "var(--muted)", letterSpacing: "0.05em",
                                                textTransform: "uppercase", fontWeight: 600,
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                        padding: "0.6rem 1.4rem", borderRadius: "999px",
                                        background: "var(--accent)", color: "#fff",
                                        fontWeight: 700, fontSize: "0.8rem",
                                        letterSpacing: "0.1em", textTransform: "uppercase",
                                    }}
                                >
                                    Launch Game
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
