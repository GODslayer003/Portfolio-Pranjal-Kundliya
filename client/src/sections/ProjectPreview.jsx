import { useState } from "react";

export default function ProjectPreview({ src, name, aspect = "16 / 9" }) {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);

    return (
        <div
            style={{
                width: "100%",
                aspectRatio: aspect,
                borderRadius: 12,
                overflow: "hidden",
                position: "relative",
                background: "color-mix(in srgb, var(--ink) 3%, transparent)",
                border: "1px solid color-mix(in srgb, var(--ink) 6%, transparent)",
            }}
        >
            {src && !errored ? (
                <img
                    src={src}
                    alt={`${name} preview`}
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    onError={() => setErrored(true)}
                    style={{
                        width: "100%", height: "100%",
                        objectFit: "cover", display: "block",
                        opacity: loaded ? 1 : 0,
                        transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                    }}
                    className="project-preview-img"
                />
            ) : (
                <Placeholder name={name} />
            )}
            {src && !loaded && !errored && <LoadingShimmer />}
            <GlassOverlay />
        </div>
    );
}

function LoadingShimmer() {
    return (
        <div
            style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--ink) 4%, transparent) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
            }}
        />
    );
}

function GlassOverlay() {
    return (
        <div
            style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, transparent 60%, color-mix(in srgb, var(--bg) 40%, transparent) 100%)",
                pointerEvents: "none",
                borderRadius: 12,
            }}
        />
    );
}

function Placeholder({ name }) {
    return (
        <div
            style={{
                width: "100%", height: "100%",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 8, color: "var(--muted)", fontSize: 13,
                padding: 20, textAlign: "center", boxSizing: "border-box",
            }}
        >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Project Preview</span>
            <span style={{ fontSize: 11, opacity: 0.6 }}>Coming Soon</span>
        </div>
    );
}
