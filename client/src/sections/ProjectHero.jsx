import { memo } from "react";
import gsap from "gsap";
import ProjectLogo from "./ProjectLogo";

const ProjectHero = memo(function ProjectHero({ project, variant = "center" }) {
    const p = project;
    const isCenter = variant === "center";

    const status = p.demo ? "LIVE" : p.demo === "" ? "PRIVATE" : "IN DEVELOPMENT";
    const stColor = status === "LIVE" ? "#2e7d32" : status === "PRIVATE" ? "#b07d4f" : "#e65100";
    const stBg = status === "LIVE" ? "rgba(46,125,50,0.12)" : status === "PRIVATE" ? "rgba(176,125,79,0.12)" : "rgba(230,81,0,0.12)";

    const btnHover = (e) => {
        const t = e.currentTarget;
        gsap.to(t, { y: -3, duration: 0.35, ease: "power2.out", boxShadow: "0 12px 40px -8px color-mix(in srgb, var(--accent) 50%, transparent)" });
        const span = t.querySelector("span");
        if (span) gsap.to(span, { x: 4, duration: 0.35, ease: "power2.out" });
    };
    const btnLeave = (e) => {
        const t = e.currentTarget;
        gsap.to(t, { y: 0, duration: 0.35, ease: "power2.out", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" });
        const span = t.querySelector("span");
        if (span) gsap.to(span, { x: 0, duration: 0.35, ease: "power2.out" });
    };
    const ghostHover = (e) => {
        gsap.to(e.currentTarget, { y: -3, duration: 0.35, ease: "power2.out", background: "color-mix(in srgb, var(--accent) 6%, transparent)", borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)" });
    };
    const ghostLeave = (e) => {
        gsap.to(e.currentTarget, { y: 0, duration: 0.35, ease: "power2.out", background: "transparent", borderColor: "color-mix(in srgb, var(--ink) 12%, transparent)" });
    };

    if (!isCenter) {
        return (
            <article aria-hidden style={{
                width: "100%", height: "100%",
                borderRadius: 24, overflow: "hidden",
                display: "flex", flexDirection: "column",
                background: "color-mix(in srgb, var(--card) 50%, transparent)",
                border: "1px solid color-mix(in srgb, var(--ink) 5%, transparent)",
                backdropFilter: "blur(16px)",
            }}>
                <div style={{
                    flex: 1,
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--ink) 4%, transparent), color-mix(in srgb, var(--ink) 8%, transparent))`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", padding: 16, position: "relative",
                }}>
                    {p.preview ? (
                        <img src={p.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "color-mix(in srgb, var(--ink) 6%, transparent)" }} />
                    )}
                </div>
                <div style={{ padding: "14px 20px 18px" }}>
                    <h4 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: 0, lineHeight: 1.2 }}>{p.name}</h4>
                    <p style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500, margin: "4px 0 0", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.tag}
                    </p>
                </div>
            </article>
        );
    }

    return (
        <figure aria-label={`${p.name} project showcase`} style={{
            width: "100%", height: "100%",
            borderRadius: 28, overflow: "hidden",
            display: "grid", gridTemplateRows: "42% 58%",
            background: "color-mix(in srgb, var(--card) 65%, transparent)",
            border: "1px solid color-mix(in srgb, var(--ink) 8%, transparent)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.08), 0 0 60px color-mix(in srgb, var(--accent) 6%, transparent)",
            backdropFilter: "blur(20px) saturate(1.1)",
        }}>
            <div style={{
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(135deg, color-mix(in srgb, var(--ink) 3%, transparent), color-mix(in srgb, var(--ink) 7%, transparent))`,
            }}>
                {p.preview ? (
                    <img
                        data-gsap="image"
                        src={p.preview}
                        alt={`${p.name} screenshot`}
                        style={{
                            width: "100%", height: "100%",
                            objectFit: "contain", display: "block",
                            padding: 24, boxSizing: "border-box",
                        }}
                        loading="lazy"
                    />
                ) : (
                    <div style={{ textAlign: "center", opacity: 0.25 }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                        </svg>
                        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>Preview</p>
                    </div>
                )}
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
                    background: "linear-gradient(to top, color-mix(in srgb, var(--card) 40%, transparent), transparent)",
                    pointerEvents: "none",
                }} />
            </div>

            <div style={{
                padding: "32px 36px",
                display: "grid",
                gridTemplateRows: "auto auto auto auto 1fr auto",
                gap: 16, alignContent: "start",
            }}>
                <div data-gsap="logo" style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 14,
                        background: "color-mix(in srgb, var(--ink) 4%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--ink) 6%, transparent)",
                        padding: 5, display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, overflow: "hidden",
                    }}>
                        <ProjectLogo src={p.logo} name={p.name} size={46} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                            <h2 data-gsap="title" style={{
                                fontSize: 48, fontWeight: 700, color: "var(--ink)",
                                margin: 0, lineHeight: 1.05, letterSpacing: "-0.03em",
                            }}>
                                {p.name}
                            </h2>
                            <span style={{
                                padding: "3px 12px", borderRadius: 999,
                                fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                                whiteSpace: "nowrap", background: stBg, color: stColor,
                                border: `1px solid color-mix(in srgb, ${stColor} 20%, transparent)`,
                                marginTop: 8, alignSelf: "flex-start",
                            }}>
                                {status}
                            </span>
                        </div>
                        <p data-gsap="industry" style={{
                            fontSize: 18, color: "var(--accent)",
                            fontWeight: 500, margin: "2px 0 0", letterSpacing: "0.01em",
                        }}>
                            {p.tag}
                        </p>
                    </div>
                </div>

                <p data-gsap="desc" style={{
                    fontSize: 18, color: "var(--muted)",
                    lineHeight: 1.65, margin: 0, maxWidth: "70ch",
                }}>
                    {p.desc}
                </p>

                <div data-gsap="tech" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {p.tech.map((t) => (
                        <span key={t} style={{
                            padding: "4px 14px", borderRadius: 999,
                            fontSize: 14, fontWeight: 500,
                            background: "color-mix(in srgb, var(--ink) 4%, transparent)",
                            border: "1px solid color-mix(in srgb, var(--ink) 6%, transparent)",
                            color: "var(--muted)", display: "inline-block",
                        }}>
                            {t}
                        </span>
                    ))}
                </div>

                <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24,
                    paddingTop: 8, borderTop: "1px solid color-mix(in srgb, var(--ink) 6%, transparent)",
                }}>
                    <div data-gsap="challenge">
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>
                            Challenge
                        </span>
                        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>{p.challenge}</p>
                    </div>
                    <div data-gsap="solution">
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>
                            Solution
                        </span>
                        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>{p.solution}</p>
                    </div>
                    <div data-gsap="impact">
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>
                            Impact
                        </span>
                        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>{p.impact || "Production-ready deployment"}</p>
                    </div>
                </div>

                <div data-gsap="buttons" style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 4 }}>
                    {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={btnHover} onMouseLeave={btnLeave}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "10px 24px", borderRadius: 999,
                            fontSize: 16, fontWeight: 600,
                            background: "var(--accent)", color: "#fff",
                            textDecoration: "none", border: "none", cursor: "pointer",
                            boxShadow: "0 4px 20px -4px color-mix(in srgb, var(--accent) 40%, transparent)",
                        }}>
                        <span style={{ display: "inline-block", transition: "none" }}>→</span>
                        Live Demo
                    </a>
                    )}
                    <button
                        onMouseEnter={ghostHover} onMouseLeave={ghostLeave}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "10px 24px", borderRadius: 999,
                            fontSize: 16, fontWeight: 600,
                            background: "transparent",
                            border: "1.5px solid color-mix(in srgb, var(--ink) 12%, transparent)",
                            color: "var(--ink)", cursor: "pointer",
                        }}>
                        Case Study →
                    </button>
                </div>
            </div>
        </figure>
    );
});

export default ProjectHero;
