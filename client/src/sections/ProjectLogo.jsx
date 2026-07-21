import { useState, useCallback } from "react";

const MAX_RETRIES = 2;

const FORMAT_EXTENSIONS = [
    "svg", "png", "webp", "jpg", "jpeg", "avif",
];

/* tries alternative extensions if the original path fails */
function tryExtensionSwap(path) {
    const dot = path.lastIndexOf(".");
    if (dot === -1) return null;
    const base = path.slice(0, dot);
    const ext = path.slice(dot + 1).toLowerCase();
    const idx = FORMAT_EXTENSIONS.indexOf(ext);
    if (idx === -1) return null;
    /* cycle forward one */
    const next = FORMAT_EXTENSIONS[(idx + 1) % FORMAT_EXTENSIONS.length];
    return `${base}.${next}`;
}

export default function ProjectLogo({ src, name, size = 64 }) {
    const [imgSrc, setImgSrc] = useState(src);
    const [retry, setRetry] = useState(0);
    const [failed, setFailed] = useState(false);

    const handleError = useCallback(() => {
        if (retry < MAX_RETRIES) {
            const swapped = tryExtensionSwap(imgSrc);
            if (swapped && swapped !== imgSrc) {
                setImgSrc(swapped);
                setRetry((r) => r + 1);
                return;
            }
        }
        setFailed(true);
    }, [imgSrc, retry]);

    if (failed || !src) {
        return (
            <div
                style={{
                    width: size, height: size, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "color-mix(in srgb, var(--ink) 6%, transparent)",
                    color: "var(--muted)", fontSize: Math.round(size * 0.35),
                    fontWeight: 700, flexShrink: 0,
                }}
                aria-label={`${name} logo placeholder`}
            >
                {(name || "?").charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={`${name} logo`}
            onError={handleError}
            style={{
                width: "100%", height: "100%",
                objectFit: "contain",
                display: "block",
            }}
            loading="lazy"
        />
    );
}
