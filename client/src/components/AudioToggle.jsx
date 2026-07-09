import { useRef, useState } from "react";

export default function AudioToggle() {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const toggle = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
        }
        setPlaying(!playing);
    };

    return (
        <>
            <audio ref={audioRef} src="/nature.mp4" loop preload="auto" />
            <button
                onClick={toggle}
                aria-label={playing ? "Pause music" : "Play music"}
                className="audio-toggle"
            >
                {playing ? "⏸" : "▶"}
            </button>
        </>
    );
}
