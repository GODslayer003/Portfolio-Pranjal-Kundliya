import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useWorld } from "../store/useWorld";

export default function Preloader() {
    const wrap = useRef(), num = useRef();
    const setReady = useWorld((s) => s.setReady);

    useGSAP(() => {
        const counter = { v: 0 };
        gsap.timeline({
            onComplete: () => {
                setReady();
                window.lenis?.resize();
            },
        })
            .to(counter, {
                v: 100, duration: 1.6, ease: "power2.inOut",
                onUpdate: () => (num.current.textContent = Math.round(counter.v)),
            })
            .to(wrap.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" })
            .set(wrap.current, { display: "none" });
    }, []);

    return (
        <div ref={wrap} className="preloader">
            <p className="h-display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.12em", fontWeight: 700 }}>PRANJAL KUNDLIYA</p>
            <p className="h-display" style={{ fontSize: "clamp(4rem, 12vw, 7rem)", fontWeight: 700 }}>
                <span ref={num}>0</span>%
            </p>
        </div>
    );
}
