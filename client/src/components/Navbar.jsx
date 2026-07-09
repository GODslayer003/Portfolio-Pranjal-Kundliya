import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const links = ["about", "skills", "experience", "projects", "contact"];

const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => { setOpen(false); }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <>
            <nav className="navbar">
                <NavLink to="/" end data-cursor className="navbar-logo">PK.</NavLink>

                {/* Desktop links */}
                <div className="navbar-links glass" data-desktop-nav>
                    {links.map((l) => (
                        <NavLink
                            key={l}
                            to={`/${l}`}
                            data-cursor
                            style={({ isActive }) => ({
                                opacity: isActive ? 1 : 0.75,
                                fontWeight: isActive ? 600 : 500,
                            })}
                        >
                            {l}
                        </NavLink>
                    ))}
                </div>

                {/* Hamburger button — visible only on mobile */}
                <button
                    className="hamburger"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                >
                    <span className={`hamburger-line ${open ? "open" : ""}`} />
                    <span className={`hamburger-line ${open ? "open" : ""}`} />
                </button>
            </nav>

            {/* Mobile overlay menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <nav className="mobile-menu-links">
                            {links.map((l, i) => (
                                <motion.div
                                    key={l}
                                    custom={i}
                                    variants={linkVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <NavLink
                                        to={`/${l}`}
                                        onClick={() => setOpen(false)}
                                        style={({ isActive }) => ({
                                            color: "var(--bg)",
                                            opacity: isActive ? 1 : 0.6,
                                            fontWeight: isActive ? 700 : 400,
                                            fontSize: "clamp(1.8rem, 6vw, 3rem)",
                                            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                                            letterSpacing: "-0.03em",
                                            textDecoration: "none",
                                            transition: "opacity 0.2s",
                                            display: "block",
                                            padding: "0.3rem 0",
                                        })}
                                    >
                                        {l}
                                    </NavLink>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
