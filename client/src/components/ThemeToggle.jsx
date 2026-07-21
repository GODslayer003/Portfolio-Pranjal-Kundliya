import { useState, useCallback } from "react";
import { world, DAY_T, NIGHT_T } from "../three/world";

const SunIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);

const MoonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

export default function ThemeToggle() {
    const [isNight, setIsNight] = useState(false);

    const handleToggle = useCallback(() => {
        if (isNight) {
            world.manualNight = false;
            world.targetT = DAY_T;
            world.lerping = true;
        } else {
            world.manualNight = true;
            world.targetT = NIGHT_T;
            world.lerping = true;
        }
        setIsNight((v) => !v);
    }, [isNight]);

    return (
        <button
            className={`theme-toggle ${isNight ? "is-night" : "is-day"}`}
            onClick={handleToggle}
            aria-label={isNight ? "Switch to day" : "Switch to night"}
            data-cursor
        >
            <div className="theme-toggle-icons">
                <span className={`theme-icon theme-sun ${isNight ? "hide" : ""}`}>
                    <SunIcon />
                </span>
                <span className={`theme-icon theme-moon ${isNight ? "" : "hide"}`}>
                    <MoonIcon />
                </span>
            </div>
        </button>
    );
}
