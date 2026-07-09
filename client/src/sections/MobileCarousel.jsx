import { useRef, useState, useCallback, useEffect } from "react";
import {
    SiReact, SiJavascript, SiHtml5, SiCss, SiNodedotjs, SiMongodb,
    SiExpress, SiThreedotjs, SiGreensock, SiTailwindcss, SiSocketdotio,
    SiWebrtc, SiGit, SiRedux, SiVite,
} from "react-icons/si";
import { TbBrandOpenai } from "react-icons/tb";

const CARD_DATA = [
    { name: "React.js", Icon: SiReact, color: "#61dafb", years: "2 Years", projects: 15, desc: "Built scalable SPAs and enterprise dashboards." },
    { name: "JavaScript", Icon: SiJavascript, color: "#f7df1e", years: "2 Years", projects: 20, desc: "ES6+, async, closures, prototypes, event loop." },
    { name: "HTML5", Icon: SiHtml5, color: "#e34f26", years: "2 Years", projects: 25, desc: "Semantic markup, accessibility, SEO, ARIA." },
    { name: "CSS3", Icon: SiCss, color: "#1572b6", years: "2 Years", projects: 25, desc: "Animations, grid, flexbox, custom properties." },
    { name: "Node.js", Icon: SiNodedotjs, color: "#68a063", years: "1 Year", projects: 14, desc: "REST APIs, auth, WebSocket, file streaming." },
    { name: "MongoDB", Icon: SiMongodb, color: "#4db33d", years: "1 Year", projects: 12, desc: "Schema design, aggregation, Atlas, indexing." },
    { name: "Express", Icon: SiExpress, color: "#bcbcbc", years: "1 Year", projects: 14, desc: "Middleware, routing, error handling, JWT." },
    { name: "Three.js", Icon: SiThreedotjs, color: "#c9c9c9", years: "1 Year", projects: 8, desc: "3D scenes, R3F, shaders, GLB, bloom." },
    { name: "GSAP", Icon: SiGreensock, color: "#8ac640", years: "1 Year", projects: 12, desc: "Scroll-triggered, timeline, morph, split text." },
    { name: "Tailwind", Icon: SiTailwindcss, color: "#38bdf8", years: "1 Year", projects: 10, desc: "Responsive design, utility-first, config." },
    { name: "Socket.IO", Icon: SiSocketdotio, color: "#d3d3d3", years: "1 Year", projects: 3, desc: "Real-time bidirectional event-based communication." },
    { name: "WebRTC", Icon: SiWebrtc, color: "#ff6d5a", years: "1 Year", projects: 2, desc: "Peer-to-peer, data channels, media streaming." },
    { name: "Git", Icon: SiGit, color: "#f05032", years: "2 Years", projects: 20, desc: "Version control, branching, CI/CD." },
    { name: "Redux", Icon: SiRedux, color: "#764abc", years: "1 Year", projects: 6, desc: "Global state, middleware, devtools, slices." },
    { name: "Vite", Icon: SiVite, color: "#646cff", years: "1 Year", projects: 10, desc: "Build tooling, HMR, optimization, bundling." },
    { name: "OpenAI", Icon: TbBrandOpenai, color: "#9fe3c5", years: "1 Year", projects: 4, desc: "LLM integration, prompt engineering, embeddings." },
];

export default function MobileCarousel({ carouselRef, sectionRef }) {
    const ref = useRef();
    const [current, setCurrent] = useState(0);
    const [animState, setAnimState] = useState("idle");

    const next = useCallback(() => {
        if (animState !== "idle") return;
        setAnimState("out");
        setTimeout(() => {
            setCurrent((p) => (p + 1) % CARD_DATA.length);
            setAnimState("in");
            requestAnimationFrame(() => requestAnimationFrame(() => setAnimState("idle")));
        }, 450);
    }, [animState]);

    useEffect(() => {
        const t = setInterval(next, 3500);
        return () => clearInterval(t);
    }, [next]);

    const skill = CARD_DATA[current];
    const nextIdx = (current + 1) % CARD_DATA.length;
    const nextSkill = CARD_DATA[nextIdx];
    const { Icon } = skill;
    const NextIcon = nextSkill.Icon;

    const outTransform = "translateX(-120%) scale(0.92)";
    const inTransform = "translateX(120%) scale(0.92)";
    const idleTransform = "translateX(0) scale(1)";

    return (
        <div ref={ref} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingInline: 16, boxSizing: "border-box" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 340, height: 240, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", right: -32, top: "50%", marginTop: -80, width: 260, height: 160, borderRadius: 20, background: "color-mix(in srgb, var(--ink) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--ink) 7%, transparent)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.4, transform: "scale(0.82)", pointerEvents: "none" }}>
                    <NextIcon size={18} color="var(--muted)" />
                </div>
                <div style={{
                    width: "100%", maxWidth: 300, borderRadius: 24,
                    background: "color-mix(in srgb, var(--ink) 3%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--ink) 8%, transparent)",
                    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                    padding: "22px 20px", boxSizing: "border-box",
                    transition: `transform 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease`,
                    transform: animState === "out" ? outTransform : animState === "in" ? inTransform : idleTransform,
                    opacity: animState === "out" || animState === "in" ? 0.3 : 1,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                        <div style={{ width: 50, height: 50, borderRadius: 16, background: "color-mix(in srgb, var(--ink) 5%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={26} color={skill.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 18, color: "var(--ink)", lineHeight: 1.2 }}>{skill.name}</div>
                            <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginTop: 2 }}>{skill.years} · {skill.projects}+ projects</div>
                        </div>
                        <div style={{ padding: "3px 10px", borderRadius: 999, background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", whiteSpace: "nowrap", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                            FEATURED
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        ))}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{skill.desc}</div>
                </div>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
                {CARD_DATA.slice(0, 7).map((_, i) => (
                    <div key={i} style={{ width: i === (current % 7) ? 22 : 5, height: 5, borderRadius: 3, background: i === (current % 7) ? "var(--accent)" : "color-mix(in srgb, var(--ink) 12%, transparent)", transition: "all 0.4s ease" }} />
                ))}
            </div>
        </div>
    );
}
