import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { PROJECTS } from "../data/content";

export default function Projects() {
    const scope = useRef();
    useGSAP(() => {
        gsap.utils.toArray(".project-panel").forEach((panel) => {
            const inner = panel.querySelector(".project-inner");
            gsap.fromTo(inner,
                { scale: 0.92, opacity: 0.3, y: 60 },
                {
                    scale: 1, opacity: 1, y: 0, ease: "power2.out",
                    scrollTrigger: { trigger: panel, start: "top 80%", end: "top 30%", scrub: 1 }
                });
            panel.querySelectorAll(".float-chip").forEach((chip, i) => {
                gsap.to(chip, { y: -14 - i * 4, duration: 2 + i * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" });
            });
        });
    }, { scope });

    return (
        <section id="projects" ref={scope} style={{ position: "relative" }}>
            {/* Section header */}
            <div className="section" style={{ maxWidth: "64rem", margin: "0 auto", minHeight: 0, paddingBottom: 0 }}>
                <h2
                    className="h-display"
                    style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 700, color: "var(--ink)" }}
                >
                    Each project is a world.
                </h2>
            </div>

            {PROJECTS.map((p) => (
                <div
                    key={p.name}
                    className="project-panel"
                    style={{ background: p.atmosphere, minHeight: "100svh", display: "flex", alignItems: "center", padding: "clamp(2rem, 4vw, 4rem) 1.5rem" }}
                >
                    <article
                        className="project-inner glass"
                        data-cursor
                        style={{
                            borderRadius: "2rem",
                            maxWidth: "56rem",
                            margin: "0 auto",
                            width: "100%",
                            padding: "clamp(2rem, 5vw, 3.5rem)",
                        }}
                    >
                        {/* Tag */}
                        <span style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>
                            {p.tag}
                        </span>

                        {/* Name */}
                        <h3
                            className="h-display"
                            style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)", fontWeight: 700, marginTop: "0.5rem", color: "var(--ink)" }}
                        >
                            {p.name}
                        </h3>

                        {/* Desc */}
                        <p style={{ marginTop: "1rem", maxWidth: "36rem", color: "var(--muted)", lineHeight: 1.65 }}>{p.desc}</p>

                        {/* Tech chips */}
                        <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                            {p.tech.map((t) => (
                                <span
                                    key={t}
                                    className="float-chip glass"
                                    style={{ fontSize: "0.72rem", borderRadius: "9999px", padding: "0.3rem 0.8rem", color: "var(--ink)" }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* Details grid */}
                        <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1.5rem", fontSize: "0.85rem" }}>
                            {[["Challenge", p.challenge], ["Solution", p.solution], ["Impact", p.impact]].map(([k, v]) => (
                                <div key={k}>
                                    <p style={{ fontWeight: 600, marginBottom: "0.3rem", color: "var(--accent)" }}>{k}</p>
                                    <p style={{ color: "var(--muted)", lineHeight: 1.55 }}>{v}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }} className="project-ctas">
                            <a
                                href={p.demo}
                                data-cursor
                                className="project-btn-primary"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    borderRadius: "9999px",
                                    padding: "0.75rem 1.5rem",
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    background: "var(--ink)",
                                    color: "var(--bg)",
                                    textDecoration: "none",
                                    transition: "transform 0.2s, opacity 0.2s",
                                    minHeight: 44,
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                Live Demo <FiExternalLink />
                            </a>
                            <a
                                href={p.repo}
                                data-cursor
                                className="project-btn-secondary"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    borderRadius: "9999px",
                                    padding: "0.75rem 1.5rem",
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    border: "1px solid var(--ink)",
                                    color: "var(--ink)",
                                    textDecoration: "none",
                                    transition: "transform 0.2s",
                                    minHeight: 44,
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                GitHub <FiGithub />
                            </a>
                        </div>
                    </article>
                </div>
            ))}
        </section>
    );
}
