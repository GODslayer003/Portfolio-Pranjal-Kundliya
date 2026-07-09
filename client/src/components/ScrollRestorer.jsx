import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollRestorer() {
    const location = useLocation();

    useEffect(() => {
        const lenis = window.lenis;
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname]);

    return null;
}
