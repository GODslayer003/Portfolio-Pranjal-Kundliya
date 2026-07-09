import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
    const dot = useRef(), ring = useRef();
    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        const dx = gsap.quickTo(dot.current, "x", { duration: 0.1, ease: "power2" });
        const dy = gsap.quickTo(dot.current, "y", { duration: 0.1, ease: "power2" });
        const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
        const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
        const move = (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
        const over = (e) => {
            const hot = e.target.closest("[data-cursor]");
            gsap.to(ring.current, { scale: hot ? 2.2 : 1, opacity: hot ? 0.5 : 1, duration: 0.3 });
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerover", over);
        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerover", over);
        };
    }, []);
    return (
        <>
            <div ref={dot} className="custom-cursor fixed z-[99] pointer-events-none -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
            <div ref={ring} className="custom-cursor fixed z-[99] pointer-events-none -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border" style={{ borderColor: "var(--accent)" }} />
        </>
    );
}
