import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { useWorld } from "../store/useWorld";

export default function Hero() {
    const scope = useRef(), title = useRef();
    const ready = useWorld((s) => s.ready);

    useGSAP(() => {
        if (!ready) return;
        const split = new SplitText(title.current, { type: "chars,words", charsClass: "char" });
        gsap.timeline({ defaults: { ease: "expo.out" } })
            .from(split.chars, { yPercent: 120, opacity: 0, rotateX: -70, stagger: 0.028, duration: 1.2 })
            .from(".hero-name",   { y: 40, opacity: 0, duration: 0.9 }, "-=0.7")
            .from(".hero-role",   { y: 24, opacity: 0, stagger: 0.12, duration: 0.7 }, "-=0.6")
            .from(".scroll-hint", { opacity: 0, duration: 1 }, "-=0.3");
    }, { scope, dependencies: [ready] });

    return (
        <section
            id="top"
            ref={scope}
            className="section"
            style={{
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}
        >
            <div style={{
                position: "absolute", inset: 0, zIndex: 0,
                backgroundImage: "url(/Sun.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: "calc(1 - var(--hero-nightness, 0))",
                transition: "opacity 1.5s ease",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", inset: 0, zIndex: 0,
                backgroundImage: "url(/Night.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: "var(--hero-nightness, 0)",
                transition: "opacity 1.5s ease",
                pointerEvents: "none",
            }} />

            <div style={{
                position: "relative", zIndex: 1,
                color: "color-mix(in srgb, #f5efe6, white calc(var(--hero-nightness, 0) * 100%))",
            }}>
                <h1
                    ref={title}
                    className="h-display"
                    style={{
                        fontWeight: 700,
                        lineHeight: 0.95,
                        fontSize: "clamp(2.6rem, 9vw, 8rem)",
                        maxWidth: "76rem",
                        perspective: "800px",
                    }}
                >
                    My work speaks before I do.
                </h1>

                <p
                    className="hero-name h-display"
                    style={{
                        marginTop: "2.5rem",
                        fontSize: "clamp(1.4rem, 3vw, 2rem)",
                        fontWeight: 600,
                    }}
                >
                    Pranjal Kundliya
                </p>

                <div
                    style={{
                        marginTop: "1rem",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "0.75rem",
                    }}
                >
                    {["Full Stack MERN Developer", "UI/UX Engineer", "Creative Developer"].map((r) => (
                        <span key={r} className="hero-role hero-role-badge glass">{r}</span>
                    ))}
                </div>
            </div>

            <a href="#about" data-cursor className="scroll-hint" style={{ color: "color-mix(in srgb, #f5efe6, white calc(var(--hero-nightness, 0) * 100%))" }}>
                Scroll — the sun is moving
            </a>
        </section>
    );
}
