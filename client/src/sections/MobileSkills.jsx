import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MobileCarousel from "./MobileCarousel";
import FloatingBubbles from "./MobileBubbles";
import MobileAnalytics from "./MobileAnalytics";

gsap.registerPlugin(ScrollTrigger);

export default function MobileSkills() {
    const titleRef = useRef();
    const carouselRef = useRef();
    const analyticsRef = useRef();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { y: 36, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: titleRef.current, start: "top 88%", toggleActions: "play none none reverse" } }
            );

            gsap.fromTo(
                carouselRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: carouselRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
            );

            gsap.fromTo(
                analyticsRef.current,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: analyticsRef.current, start: "top 80%", toggleActions: "play none none reverse" } }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <FloatingBubbles />
            <section
                id="mobile-skills-root"
                style={{ width: "100%", padding: "40px 0 0", boxSizing: "border-box", overflow: "hidden" }}
            >
                <div ref={titleRef} data-interactive style={{ textAlign: "center", padding: "0 16px 8px", position: "relative", zIndex: 2 }}>
                    <h1
                        style={{
                            fontSize: "clamp(28px, 7vw, 40px)", fontWeight: 700,
                            color: "var(--ink)", margin: 0, lineHeight: 1.2,
                        }}
                    >
                        A living universe<br />of tools.
                    </h1>
                    <p style={{ color: "var(--muted)", fontSize: 14, margin: "8px 0 0", lineHeight: 1.5 }}>
                        Every framework, every API — crafted with intent.
                    </p>
                </div>

                <div ref={carouselRef} data-interactive style={{ padding: "24px 0", width: "100%", display: "flex", justifyContent: "center", position: "relative", zIndex: 2 }}>
                    <MobileCarousel />
                </div>

                <div ref={analyticsRef} data-interactive style={{ width: "100%", position: "relative", zIndex: 2 }}>
                    <MobileAnalytics />
                </div>
            </section>
        </>
    );
}
