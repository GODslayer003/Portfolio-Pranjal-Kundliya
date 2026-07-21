import { useRef, useEffect, useCallback } from "react";
import { FiExternalLink, FiX, FiCheck, FiArrowRight } from "react-icons/fi";
import { gsap } from "gsap";
import ProjectLogo from "./ProjectLogo";

function trapFocus(e, el) {
    const focusable = el.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === "Tab") {
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }
}

export default function ProjectModal({ project, onClose }) {
    const overlayRef = useRef();
    const panelRef = useRef();
    const closeRef = useRef();
    const prevFocusRef = useRef();

    const handleKey = useCallback((e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "Tab" && panelRef.current) trapFocus(e, panelRef.current);
    }, [onClose]);

    useEffect(() => {
        prevFocusRef.current = document.activeElement;
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        const panel = panelRef.current;
        const overlay = overlayRef.current;
        gsap.fromTo(panel, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
        closeRef.current?.focus();
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
            prevFocusRef.current?.focus();
        };
    }, []);

    const handleOverlay = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    const p = project;
    const status = p.demo ? "LIVE" : p.demo === "" ? "PRIVATE" : "IN DEVELOPMENT";

    const statusColor = status === "LIVE" ? "#2e7d32" : status === "PRIVATE" ? "#b07d4f" : "#e65100";
    const statusBg = status === "LIVE" ? "rgba(46,125,50,0.12)" : status === "PRIVATE" ? "rgba(176,125,79,0.12)" : "rgba(230,81,0,0.12)";

    const sections = [
        { label: "Overview", content: p.desc },
        { label: "The Challenge — Real World Problem", content: p.challenge },
        { label: "The Solution — What We Built", content: p.solution },
        { label: "Impact & Results", content: p.impact },
    ];

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlay}
            role="dialog"
            aria-modal="true"
            aria-label={`${p.name} project details`}
            style={{
                position: "fixed", inset: 0, zIndex: 999,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "color-mix(in srgb, var(--bg) 30%, transparent)",
                backdropFilter: "blur(32px) saturate(140%)", WebkitBackdropFilter: "blur(32px) saturate(140%)",
                padding: 16, boxSizing: "border-box",
            }}
        >
            <div
                ref={panelRef}
                style={{
                    width: "100%", maxWidth: 820, maxHeight: "90vh",
                    overflowY: "auto", overflowX: "hidden",
                    borderRadius: 24,
                    background: "color-mix(in srgb, var(--card) 75%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--ink) 10%, transparent)",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
                    padding: 0, boxSizing: "border-box",
                }}
            >
                {/* close */}
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 12px 0" }}>
                    <button
                        ref={closeRef}
                        onClick={onClose}
                        aria-label="Close details"
                        style={{
                            width: 36, height: 36, borderRadius: "50%",
                            border: "none", background: "color-mix(in srgb, var(--ink) 6%, transparent)",
                            color: "var(--ink)", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18, transition: "background 0.2s, transform 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--ink) 12%, transparent)"; e.currentTarget.style.transform = "scale(1.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--ink) 6%, transparent)"; e.currentTarget.style.transform = "scale(1)"; }}
                    >
                        <FiX />
                    </button>
                </div>

                <div style={{ padding: "0 28px 32px" }}>
                    {/* hero */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: 18,
                            background: "color-mix(in srgb, var(--ink) 4%, transparent)",
                            padding: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                            <ProjectLogo src={p.logo} name={p.name} size={60} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0, lineHeight: 1.2 }}>{p.name}</h2>
                            <p style={{ fontSize: 13, color: "var(--muted)", margin: "2px 0 6px" }}>{p.tag}</p>
                            <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", background: statusBg, color: statusColor, border: `1px solid color-mix(in srgb, ${statusColor} 30%, transparent)` }}>
                                {status}
                            </span>
                        </div>
                    </div>

                    {/* CTAs */}
                    {p.demo && (
                        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                            <a href={p.demo} target="_blank" rel="noopener noreferrer"
                                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: "var(--accent)", color: "#fff", textDecoration: "none", transition: "transform 0.2s, background 0.2s", boxShadow: "0 4px 16px -4px color-mix(in srgb, var(--accent) 35%, transparent)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
                                Live Demo <FiExternalLink />
                            </a>
                        </div>
                    )}

                    {/* content sections */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {sections.map((s) => (
                            <div key={s.label}>
                                <h4 style={{
                                    fontSize: 13, fontWeight: 700,
                                    color: "var(--accent)", textTransform: "uppercase",
                                    letterSpacing: "0.08em", margin: "0 0 6px",
                                }}>
                                    {s.label}
                                </h4>
                                <p style={{
                                    fontSize: 14, color: "var(--muted)",
                                    lineHeight: 1.7, margin: 0,
                                }}>
                                    {s.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* full tech stack */}
                    <div style={{ marginTop: 24 }}>
                        <h4 style={{
                            fontSize: 13, fontWeight: 700,
                            color: "var(--accent)", textTransform: "uppercase",
                            letterSpacing: "0.08em", margin: "0 0 10px",
                        }}>
                            Technology Stack
                        </h4>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {p.tech.map((t) => (
                                <span key={t} style={{
                                    padding: "4px 12px", borderRadius: 999,
                                    fontSize: 12, fontWeight: 500,
                                    background: "color-mix(in srgb, var(--ink) 5%, transparent)",
                                    border: "1px solid color-mix(in srgb, var(--ink) 8%, transparent)",
                                    color: "var(--ink)",
                                }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* key features */}
                    <div style={{
                        marginTop: 24, padding: "16px 20px", borderRadius: 16,
                        background: "color-mix(in srgb, var(--ink) 2%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--ink) 5%, transparent)",
                    }}>
                        <h4 style={{
                            fontSize: 13, fontWeight: 700,
                            color: "var(--accent)", textTransform: "uppercase",
                            letterSpacing: "0.08em", margin: "0 0 10px",
                        }}>
                            Key Features
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {[
                                `Production-ready ${p.tech[0] || "React"} architecture`,
                                `Responsive, accessible UI across all devices`,
                                `Performance-optimized with ${p.tech[1] || "modern tooling"}`,
                                `Secure authentication & data handling`,
                                `Cross-browser & cross-platform compatible`,
                            ].map((f, i) => (
                                <div key={i} style={{
                                    display: "flex", gap: 8, alignItems: "flex-start",
                                    fontSize: 13, color: "var(--muted)", lineHeight: 1.5,
                                }}>
                                    <FiCheck size={14} style={{ color: "var(--accent)", marginTop: 2, flexShrink: 0 }} />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* bottom CTA */}
                    {p.demo && (
                        <div style={{ marginTop: 24, textAlign: "center" }}>
                            <a href={p.demo} target="_blank" rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 8,
                                    padding: "12px 28px", borderRadius: 999,
                                    fontSize: 14, fontWeight: 600,
                                    background: "var(--accent)", color: "#fff",
                                    textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s",
                                    boxShadow: "0 4px 20px -4px color-mix(in srgb, var(--accent) 40%, transparent)",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
                            >
                                Visit Live Project <FiArrowRight />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}