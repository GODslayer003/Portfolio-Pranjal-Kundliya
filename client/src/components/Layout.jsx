import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import AudioToggle from "./AudioToggle";
import ScrollRestorer from "./ScrollRestorer";
import useKeyboardNav from "../hooks/useKeyboardNav";

export default function Layout() {
    const location = useLocation();

    useKeyboardNav();

    // Recalculate Lenis scroll limit after each route change
    // so pages with different heights scroll correctly.
    useEffect(() => {
        const timer = setTimeout(() => {
            window.lenis?.resize();
        }, 100);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <>
            <Navbar />
            <AudioToggle />
            <ScrollRestorer />
            <main>
                <AnimatePresence mode="wait">
                    <Outlet key={location.pathname} />
                </AnimatePresence>
            </main>
            <footer
                style={{
                    padding: "2.5rem 1.5rem",
                    textAlign: "center",
                    fontSize: "0.78rem",
                    color: "var(--muted)",
                    borderTop: "1px solid color-mix(in srgb, var(--ink) 8%, transparent)",
                }}
            >
                                Home Page- Pranjal Kundliya @2026 Portfolio
            </footer>
        </>
    );
}
