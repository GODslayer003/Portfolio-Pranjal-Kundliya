import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { JOURNEY } from "../data/content";

export default function About() {
    const scope = useRef();
    useGSAP(() => {
        gsap.from(".journey-line", {
            scaleY: 0, transformOrigin: "top", ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top 60%", end: "bottom 80%", scrub: 1 },
        });
        gsap.utils.toArray(".milestone").forEach((el, i) => {
            gsap.from(el, {
                x: i % 2 ? 80 : -80, opacity: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 85%" },
            });
        });
    }, { scope });

    return (
        <section id="about" ref={scope} className="section" style={{ maxWidth: "64rem", margin: "0 auto" }}>
            <h2
                className="h-display"
                style={{
                    fontSize: "clamp(2rem, 5vw, 4rem)",
                    fontWeight: 700,
                    marginBottom: "5rem",
                    color: "var(--ink)",
                }}
            >
                The journey, not the résumé.
            </h2>

            <div style={{ position: "relative" }}>
                {/* Center spine - hidden on mobile via CSS */}
                <div className="journey-line" />

                <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
                    {JOURNEY.map((m, i) => (
                        <div
                            key={m.title}
                            className="milestone"
                            style={{
                                display: "flex",
                                justifyContent: i % 2 ? "flex-end" : "flex-start",
                            }}
                        >
                            <div
                                className="glass about-card"
                                data-cursor
                            >
                                <span
                                    style={{
                                        fontSize: "0.7rem",
                                        letterSpacing: "0.12em",
                                        color: "var(--accent)",
                                        fontWeight: 600,
                                    }}
                                >
                                    0{i + 1}
                                </span>
                                <h3
                                    className="h-display"
                                    style={{
                                        fontSize: "1.4rem",
                                        fontWeight: 700,
                                        marginTop: "0.25rem",
                                        color: "var(--ink)",
                                    }}
                                >
                                    {m.title}
                                </h3>
                                <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--muted)" }}>
                                    {m.detail}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
