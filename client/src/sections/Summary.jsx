import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import SummaryScene from "../three/SummaryScene";
import MinigamesHub from "./MinigamesHub";

export default function Summary() {
    const scope = useRef();
    const titleRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: scope.current, start: "top 75%" } });
        const split = new SplitText(titleRef.current, { type: "chars", charsClass: "char" });
        tl.from(split.chars, {
            yPercent: 110, opacity: 0, rotateX: -70, stagger: 0.02, duration: 0.8, ease: "power3.out",
        })
            .from(".summary-headline", {
                y: 30, opacity: 0, duration: 0.7, ease: "power3.out",
            }, "-=0.3")
            .from(".summary-body", {
                y: 24, opacity: 0, duration: 0.6, ease: "power3.out",
            }, "-=0.2");
        gsap.from(".summary-ambient", {
            opacity: 0, duration: 1.2, ease: "power2.out",
            scrollTrigger: { trigger: scope.current, start: "top 70%" },
        });
    }, { scope });

    return (
        <>
            <section
                id="summary"
                ref={scope}
                style={{
                    minHeight: "100svh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Ambient 3D layer */}
                <div
                    className="summary-ambient"
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                        opacity: 0.5,
                    }}
                >
                    <SummaryScene />
                </div>

                {/* Content layer */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        maxWidth: "1280px",
                        width: "100%",
                        marginInline: "auto",
                        paddingInline: "clamp(32px, 5vw, 96px)",
                        paddingBlock: "6rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: "2.5rem",
                    }}
                >
                    {/* Title */}
                    <h2
                        ref={titleRef}
                        className="h-display"
                        style={{
                            fontSize: "clamp(4.5rem, 11vw, 11rem)",
                            fontWeight: 700,
                            lineHeight: 0.92,
                            color: "var(--ink)",
                            letterSpacing: "-0.04em",
                            perspective: "800px",
                        }}
                    >
                        SUMMARY
                    </h2>

                    {/* Headline */}
                    <p
                        className="summary-headline h-display"
                        style={{
                            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                            fontWeight: 600,
                            color: "var(--accent)",
                            lineHeight: 1.35,
                            maxWidth: "720px",
                        }}
                    >
                        Code is my foundation. Creativity is my language.
                    </p>

                    {/* Body */}
                    <p
                        className="summary-body"
                        style={{
                            fontSize: "clamp(1rem, 1.6vw, 1.375rem)",
                            color: "var(--muted)",
                            lineHeight: 1.8,
                            maxWidth: "800px",
                        }}
                    >
                        I'm a Full-Stack MERN Developer who enjoys pushing the boundaries of modern web
                        experiences. I combine scalable backend architecture with immersive frontend
                        interactions to build products that don't just work—they inspire. From AI-powered
                        systems and enterprise platforms to cinematic Three.js experiences, I focus on
                        performance, usability, and meaningful design. Every pixel has a purpose. Every
                        animation tells a story. Every interaction is designed to feel effortless.
                    </p>
                </div>
            </section>
            <MinigamesHub />
        </>
    );
}
