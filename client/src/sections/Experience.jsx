import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { EXPERIENCE } from "../data/content";

export default function ExperienceSection() {
    const scope = useRef();
    useGSAP(() => {
        gsap.utils.toArray(".xp-card").forEach((card) => {
            gsap.from(card, {
                y: 90, opacity: 0, rotateX: -12, transformPerspective: 800, duration: 1.1, ease: "power4.out",
                scrollTrigger: { trigger: card, start: "top 82%" },
            });
            const metric = card.querySelector(".xp-metric");
            const target = metric.dataset.value;
            gsap.from(metric, {
                textContent: 0, duration: 1.6, ease: "power2.out", snap: { textContent: 1 },
                scrollTrigger: { trigger: card, start: "top 75%" },
                onUpdate() { metric.textContent = Math.round(this.targets()[0].textContent) + target.replace(/\d+/, ""); },
            });
        });
    }, { scope });

    return (
        <section id="experience" ref={scope} className="section" style={{ maxWidth: "64rem", margin: "0 auto" }}>
            <h2
                className="h-display"
                style={{
                    fontSize: "clamp(2rem, 5vw, 4rem)",
                    fontWeight: 700,
                    marginBottom: "4rem",
                    color: "var(--ink)",
                }}
            >
                Chapters that unfold.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                {EXPERIENCE.map((xp) => (
                    <article
                        key={xp.company}
                        className="xp-card glass"
                        data-cursor
                        style={{ borderRadius: "1.75rem", padding: "2rem 2.5rem" }}
                    >
                        {/* Header row */}
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem" }}>
                            <h3 className="h-display" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "var(--ink)" }}>
                                {xp.company}
                            </h3>
                            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{xp.period}</span>
                        </div>

                        {/* Role */}
                        <p style={{ marginTop: "0.25rem", fontWeight: 500, color: "var(--accent)" }}>{xp.role}</p>

                        {/* Points */}
                        <ul style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.875rem", color: "var(--muted)", listStyle: "none" }}>
                            {xp.points.map((p) => <li key={p}>— {p}</li>)}
                        </ul>

                        {/* Footer: stack tags + metric */}
                        <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                {xp.stack.map((s) => (
                                    <span
                                        key={s}
                                        style={{
                                            fontSize: "0.7rem",
                                            fontWeight: 500,
                                            borderRadius: "9999px",
                                            padding: "0.25rem 0.75rem",
                                            border: "1px solid var(--accent)",
                                            color: "var(--accent)",
                                        }}
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p className="xp-metric h-display" data-value={xp.metric.value}
                                    style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>
                                    {xp.metric.value}
                                </p>
                                <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.2rem" }}>{xp.metric.label}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
