import { lazy, Suspense, useRef, useState, useEffect } from "react";
import MobileSkills from "./MobileSkills";

const SkillsOrbit = lazy(() => import("../three/SkillsOrbit"));

export default function Skills() {
    const ref = useRef();
    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        if (isMobile) return;
        const io = new IntersectionObserver(
            ([e]) => e.isIntersecting && setVisible(true),
            { rootMargin: "200px" }
        );
        io.observe(ref.current);
        return () => io.disconnect();
    }, [isMobile]);

    if (isMobile) return <MobileSkills />;

    return (
        <section
            id="skills"
            ref={ref}
            className="section"
            style={{
                maxWidth: "76rem",
                margin: "0 auto",
            }}
        >
            {/* Text header */}
            <div style={{ position: "relative", zIndex: 2 }}>
                <h2
                    className="h-display"
                    style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 700, color: "var(--ink)" }}
                >
                    A living universe of tools.
                </h2>
                <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", maxWidth: "28rem", color: "var(--muted)", lineHeight: 1.65 }}>
                    Click a sphere to burst it. Every technology here has shipped to production.
                </p>
            </div>

            <div
                className="skills-canvas-wrap"
                style={{
                    position: "relative",
                    height: "clamp(60vh, 82vh, 94vh)",
                    marginTop: "3rem",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0, bottom: 0,
                        left: "50%",
                        width: "116vw",
                        transform: "translateX(-50%)",
                    }}
                >
                    {visible && (
                        <Suspense
                            fallback={
                                <div style={{
                                    height: "100%",
                                    display: "grid",
                                    placeItems: "center",
                                    fontSize: "0.875rem",
                                    color: "var(--muted)",
                                }}>
                                    Summoning the universe…
                                </div>
                            }
                        >
                            <SkillsOrbit />
                        </Suspense>
                    )}
                </div>
            </div>
        </section>
    );
}
