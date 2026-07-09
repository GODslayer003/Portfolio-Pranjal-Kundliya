import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ROUTE_ORDER = ["/", "/about", "/skills", "/experience", "/projects", "/contact"];

export default function useKeyboardNav() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handler = (e) => {
            const idx = ROUTE_ORDER.indexOf(location.pathname);
            const lenis = window.lenis;

            switch (e.key) {
                case "ArrowUp": {
                    e.preventDefault();
                    const delta = window.innerHeight * 0.6;
                    if (lenis) {
                        const cur = lenis.targetScroll ?? lenis.scroll ?? 0;
                        lenis.scrollTo(Math.max(0, cur - delta), { duration: 0.8 });
                    } else {
                        window.scrollBy({ top: -delta, behavior: "smooth" });
                    }
                    break;
                }
                case "ArrowDown": {
                    e.preventDefault();
                    const delta = window.innerHeight * 0.6;
                    if (lenis) {
                        const cur = lenis.targetScroll ?? lenis.scroll ?? 0;
                        const max = lenis.limit ?? document.documentElement.scrollHeight - window.innerHeight;
                        lenis.scrollTo(Math.min(cur + delta, max), { duration: 0.8 });
                    } else {
                        window.scrollBy({ top: delta, behavior: "smooth" });
                    }
                    break;
                }
                case "ArrowRight": {
                    if (idx < ROUTE_ORDER.length - 1) {
                        e.preventDefault();
                        navigate(ROUTE_ORDER[idx + 1]);
                    }
                    break;
                }
                case "ArrowLeft": {
                    if (idx > 0) {
                        e.preventDefault();
                        navigate(ROUTE_ORDER[idx - 1]);
                    }
                    break;
                }
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [location.pathname, navigate]);
}
