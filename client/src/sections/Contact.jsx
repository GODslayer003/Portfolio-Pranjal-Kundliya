import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FaLaptopCode, FaMugHot, FaBook, FaMobileAlt, FaKeyboard, FaPhone } from "react-icons/fa";
import { sendMessage } from "../utils/api";

const ITEMS = [
    { Icon: FaLaptopCode, label: "Email me",  action: () => (window.location.href = "mailto:rohankundliya@gmail.com"), big: true },
    { Icon: FaMobileAlt,  label: "LinkedIn",  action: () => window.open("https://linkedin.com/in/pranjal-kundliya", "_blank") },
    { Icon: FaPhone,      label: "Call me",   action: () => window.location.href = "tel:+918126977256" },
    { Icon: FaBook,       label: "Resume",    action: () => window.open("/resume.pdf", "_blank") },
    { Icon: FaKeyboard,   label: "GitHub",    action: () => window.open("https://github.com/GODslayer003", "_blank") },
    { Icon: FaMugHot,     label: "Coffee",    action: null },
];

export default function Contact() {
    const scope = useRef();
    const [status, setStatus] = useState(null);

    useGSAP(() => {
        gsap.from(".desk-item", {
            y: 60, opacity: 0, stagger: 0.1, duration: 0.9, ease: "back.out(1.7)",
            scrollTrigger: { trigger: scope.current, start: "top 70%" },
        });
    }, { scope });

    const wiggle = (el) =>
        gsap.fromTo(el, { rotate: -8 }, { rotate: 8, duration: 0.1, yoyo: true, repeat: 7, ease: "sine.inOut", onComplete: () => gsap.to(el, { rotate: 0, duration: 0.2 }) });

    const onSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        setStatus("sending");
        try {
            await sendMessage(Object.fromEntries(form));
            setStatus("sent");
            e.target.reset();
        } catch {
            setStatus("error");
        }
    };

    return (
        <section
            id="contact"
            ref={scope}
            className="section"
            style={{ maxWidth: "52rem", margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
            <h2
                className="h-display"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 700, color: "var(--ink)" }}
            >
                Pull up a chair. This is my desk.
            </h2>
            <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Everything on it does something. The laptop opens my inbox. The mug just enjoys being a mug.
            </p>

            {/* ── Desk ─────────────────────────────────────────── */}
            <div className="glass" style={{ borderRadius: "2rem", marginTop: "3rem", padding: "clamp(2rem, 5vw, 4rem)" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "center", gap: "2.5rem" }}>
                    {ITEMS.map(({ Icon, label, action, big }) => (
                        <button
                            key={label}
                            data-cursor
                            aria-label={label}
                            onClick={(e) => (action ? action() : wiggle(e.currentTarget))}
                            onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -12, scale: 1.12, duration: 0.35, ease: "back.out(2)" })}
                            onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0,   scale: 1,    duration: 0.4,  ease: "power3.out" })}
                            className="desk-item"
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", background: "none", border: "none", cursor: "inherit" }}
                        >
                            <span
                                className="glass"
                                style={{
                                    display: "grid",
                                    placeItems: "center",
                                    borderRadius: "1.25rem",
                                    width:  big ? 96 : 72,
                                    height: big ? 96 : 72,
                                }}
                            >
                                <Icon size={big ? 40 : 28} style={{ color: "var(--accent)" }} />
                            </span>
                            <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 500 }}>{label}</span>
                        </button>
                    ))}
                </div>
                {/* desk surface */}
                <div className="desk-surface" />
            </div>

            {/* ── Contact form ──────────────────────────────────── */}
            <form
                onSubmit={onSubmit}
                className="glass"
                style={{ borderRadius: "1.75rem", marginTop: "2rem", padding: "2rem", display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}
            >
                <input
                    required name="name" placeholder="Your name"
                    className="form-input"
                    style={{ gridColumn: "1" }}
                />
                <input
                    required type="email" name="email" placeholder="Your email"
                    className="form-input"
                    style={{ gridColumn: "2" }}
                />
                <textarea
                    required name="message" rows="3" placeholder="Leave a note on the desk…"
                    className="form-input"
                    style={{ gridColumn: "1 / -1", resize: "none" }}
                />
                <button
                    data-cursor type="submit" disabled={status === "sending"}
                    style={{
                        gridColumn: "1 / -1",
                        justifySelf: "start",
                        borderRadius: "9999px",
                        padding: "0.75rem 2rem",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        background: "var(--ink)",
                        color: "var(--bg)",
                        border: "none",
                        cursor: "inherit",
                        opacity: status === "sending" ? 0.5 : 1,
                        transition: "transform 0.2s, opacity 0.2s",
                    }}
                    onMouseEnter={(e) => { if (status !== "sending") e.currentTarget.style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                    {status === "sending" ? "Sending…" : status === "sent" ? "Delivered ✓" : "Send message"}
                </button>
                {status === "error" && (
                    <p style={{ gridColumn: "1 / -1", fontSize: "0.875rem", color: "#e76f51" }}>
                        Something broke — email me directly instead.
                    </p>
                )}
            </form>
        </section>
    );
}
