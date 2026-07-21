import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaLaptopCode, FaInstagram, FaBook, FaMobileAlt,
    FaKeyboard, FaPhone, FaWhatsapp, FaTimes
} from "react-icons/fa";

const ITEMS = [
    {
        Icon: FaLaptopCode, label: "Email",
        detail: "rohankundliya@gmail.com",
        action: () => window.location.href = "mailto:rohankundliya@gmail.com",
        big: true,
    },
    {
        Icon: FaMobileAlt, label: "LinkedIn",
        detail: "linkedin.com/in/pranjal-kundliya-2179b628a",
        action: () => window.open("https://linkedin.com/in/pranjal-kundliya-2179b628a", "_blank"),
    },
    {
        Icon: FaWhatsapp, label: "WhatsApp",
        detail: "+91-8126977256",
        action: () => window.open("https://wa.me/918126977256", "_blank"),
    },
    {
        Icon: FaPhone, label: "Call",
        detail: "+91-8126977256",
        action: () => window.location.href = "tel:+918126977256",
    },
    {
        Icon: FaInstagram, label: "Instagram",
        detail: "@rohankundliya",
        action: () => window.open("https://instagram.com/rohankundliya", "_blank"),
    },
    {
        Icon: FaBook, label: "Resume",
        detail: "Pranjal Kundliya.pdf",
        action: () => window.open("/PranjalKundliya.pdf", "_blank"),
    },
    {
        Icon: FaKeyboard, label: "GitHub",
        detail: "github.com/GODslayer003",
        action: () => window.open("https://github.com/GODslayer003", "_blank"),
    },
];

export default function Contact() {
    const scope = useRef();
    const [modalItem, setModalItem] = useState(null);

    useGSAP(() => {
        gsap.from(".desk-item", {
            y: 60, opacity: 0, stagger: 0.1, duration: 0.9, ease: "back.out(1.7)",
            scrollTrigger: { trigger: scope.current, start: "top 70%" },
        });
    }, { scope });

    const openModal = (item) => setModalItem(item);
    const closeModal = useCallback(() => setModalItem(null), []);

    const handleAction = (item) => {
        item.action();
        closeModal();
    };

    useEffect(() => {
        if (!modalItem) return;
        const onKey = (e) => { if (e.key === "Escape") closeModal(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [modalItem, closeModal]);

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
                Everything on it does something. Tap an icon to see how we can connect.
            </p>

            {/* ── Desk ─────────────────────────────────────────── */}
            <div className="glass" style={{ borderRadius: "2rem", marginTop: "3rem", padding: "clamp(2rem, 5vw, 4rem)" }}>
                <div className="contact-desk-grid">
                    {ITEMS.map((item) => {
                        const { Icon, label, big } = item;
                        return (
                            <div
                                key={label}
                                className="desk-item-wrap"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    width: big ? 130 : 115,
                                }}
                            >
                                <button
                                    data-cursor
                                    data-big={big || undefined}
                                    aria-label={label}
                                    onClick={() => openModal(item)}
                                    onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -12, scale: 1.12, duration: 0.35, ease: "back.out(2)" })}
                                    onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.4, ease: "power3.out" })}
                                    className="desk-item"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                        background: "none",
                                        border: "none",
                                        cursor: "inherit",
                                        width: "100%",
                                    }}
                                >
                                    <span
                                        className="glass"
                                        style={{
                                            display: "grid",
                                            placeItems: "center",
                                            borderRadius: "1.25rem",
                                            width: big ? 96 : 72,
                                            height: big ? 96 : 72,
                                        }}
                                    >
                                        <Icon size={big ? 40 : 28} style={{ color: "var(--accent)" }} />
                                    </span>
                                    <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 500 }}>
                                        {label}
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="desk-surface" />
            </div>

            {/* ── Modal ────────────────────────────────────────── */}
            <AnimatePresence>
                {modalItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={closeModal}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 200,
                            display: "grid",
                            placeItems: "center",
                            background: "color-mix(in srgb, var(--ink) 60%, transparent)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            padding: "1rem",
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.92 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass"
                            style={{
                                width: "100%",
                                maxWidth: "24rem",
                                borderRadius: "1.75rem",
                                padding: "2.5rem 2rem",
                                textAlign: "center",
                                position: "relative",
                            }}
                        >
                            {/* Close */}
                            <button
                                onClick={closeModal}
                                aria-label="Close"
                                style={{
                                    position: "absolute",
                                    top: "1rem",
                                    right: "1rem",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--muted)",
                                    padding: "0.25rem",
                                    display: "grid",
                                    placeItems: "center",
                                    borderRadius: "50%",
                                    transition: "color 0.2s",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                            >
                                <FaTimes size={18} />
                            </button>

                            {/* Icon */}
                            <span
                                className="glass"
                                style={{
                                    display: "inline-grid",
                                    placeItems: "center",
                                    borderRadius: "1.25rem",
                                    width: 80,
                                    height: 80,
                                    marginBottom: "1.25rem",
                                }}
                            >
                                <modalItem.Icon size={34} style={{ color: "var(--accent)" }} />
                            </span>

                            {/* Copy */}
                            <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                                Thanks for reaching out!
                            </h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6, margin: "0.6rem 0 1.5rem" }}>
                                Tap the button below and I&rsquo;ll connect with you on {modalItem.label}.
                            </p>

                            {/* Action button */}
                            <button
                                data-cursor
                                onClick={() => handleAction(modalItem)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.6rem",
                                    width: "100%",
                                    borderRadius: "9999px",
                                    padding: "0.9rem 1.5rem",
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    background: "var(--ink)",
                                    color: "var(--bg)",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "transform 0.2s, opacity 0.2s",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <modalItem.Icon size={18} />
                                {modalItem.label}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
