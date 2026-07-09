import { useRef, useEffect, useState } from "react";
import {
    SiReact, SiJavascript, SiHtml5, SiCss, SiNodedotjs, SiMongodb,
    SiExpress, SiThreedotjs, SiGreensock, SiTailwindcss, SiSocketdotio,
    SiGit, SiRedux, SiFigma,
} from "react-icons/si";

const DATA = [
    { name: "React.js", rating: 9.6, years: "2 Years", Icon: SiReact, color: "#61dafb" },
    { name: "JavaScript", rating: 9.7, years: "2 Years", Icon: SiJavascript, color: "#f7df1e" },
    { name: "HTML5", rating: 9.5, years: "2 Years", Icon: SiHtml5, color: "#e34f26" },
    { name: "CSS3", rating: 9.3, years: "2 Years", Icon: SiCss, color: "#1572b6" },
    { name: "Node.js", rating: 9.0, years: "1 Year", Icon: SiNodedotjs, color: "#68a063" },
    { name: "MongoDB", rating: 8.9, years: "1 Year", Icon: SiMongodb, color: "#4db33d" },
    { name: "Express", rating: 8.5, years: "1 Year", Icon: SiExpress, color: "#bcbcbc" },
    { name: "Three.js", rating: 8.8, years: "1 Year", Icon: SiThreedotjs, color: "#c9c9c9" },
    { name: "GSAP", rating: 9.2, years: "1 Year", Icon: SiGreensock, color: "#8ac640" },
    { name: "Tailwind", rating: 8.7, years: "1 Year", Icon: SiTailwindcss, color: "#38bdf8" },
    { name: "Socket.IO", rating: 8.3, years: "1 Year", Icon: SiSocketdotio, color: "#d3d3d3" },
    { name: "Git", rating: 9.0, years: "2 Years", Icon: SiGit, color: "#f05032" },
    { name: "Redux", rating: 8.6, years: "1 Year", Icon: SiRedux, color: "#764abc" },
    { name: "Figma", rating: 8.2, years: "1 Year", Icon: SiFigma, color: "#a258ff" },
];

const CELLS = 188;
const R = 80;

function RadialChart({ rating, size = 120, strokeW = 6, color }) {
    const c = 2 * Math.PI * R;
    const offset = c * (1 - rating / 10);

    return (
        <svg width={size} height={size} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={R} fill="none" stroke="color-mix(in srgb, var(--ink) 6%, transparent)" strokeWidth={strokeW} />
            <circle
                cx="100" cy="100" r={R} fill="none"
                stroke={color || "var(--accent)"}
                strokeWidth={strokeW}
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={offset}
                transform="rotate(-90 100 100)"
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
            <text x="100" y="94" textAnchor="middle" fill="var(--ink)" fontSize="28" fontWeight="700">{rating.toFixed(1)}</text>
            <text x="100" y="122" textAnchor="middle" fill="var(--muted)" fontSize="12" fontWeight="500">/ 10</text>
        </svg>
    );
}

function Stars({ count = 5, fill = 5 }) {
    return (
        <div style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: count }, (_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < fill ? "var(--accent)" : "color-mix(in srgb, var(--ink) 10%, transparent)"} stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
}

function GlassCard({ skill, index }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const o = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        o.observe(el);
        return () => o.disconnect();
    }, []);

    const { name, rating, years, Icon, color } = skill;
    return (
        <div
            ref={ref}
            style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", borderRadius: 18,
                background: "color-mix(in srgb, var(--ink) 2%, transparent)",
                border: "1px solid color-mix(in srgb, var(--ink) 6%, transparent)",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease, box-shadow 0.4s ease",
                transform: visible ? "translateY(0)" : "translateY(18px)",
                opacity: visible ? 1 : 0,
                transitionDelay: `${index * 60}ms`,
                cursor: "default",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,100,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "color-mix(in srgb, var(--ink) 4%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={20} color={color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{years}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                <Stars fill={Math.round(rating / 2)} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>{rating.toFixed(1)}</span>
            </div>
        </div>
    );
}

export default function MobileAnalytics({ analyticsRef }) {
    return (
        <div ref={analyticsRef} style={{ width: "100%", padding: "24px 16px 40px", boxSizing: "border-box" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h3 style={{ color: "var(--ink)", fontSize: 24, fontWeight: 700, margin: 0 }}>Skill Overview</h3>
                <p style={{ color: "var(--muted)", fontSize: 13, margin: "4px 0 0" }}>Comprehensive analytics dashboard</p>
            </div>

            {/* radial section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 32 }}>
                {DATA.slice(0, 6).map((s, i) => (
                    <div key={s.name} style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                        padding: "12px 4px", borderRadius: 16,
                        background: "color-mix(in srgb, var(--ink) 1%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--ink) 4%, transparent)",
                        backdropFilter: "blur(8px)",
                    }}>
                        <RadialChart rating={s.rating} size={80} strokeW={5} color={s.color} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink)", textAlign: "center", lineHeight: 1.2 }}>{s.name}</span>
                    </div>
                ))}
            </div>

            {/* glass cards listing */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {DATA.map((s, i) => (
                    <GlassCard key={s.name} skill={s} index={i} />
                ))}
            </div>
        </div>
    );
}
