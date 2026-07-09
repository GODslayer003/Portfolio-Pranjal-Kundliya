import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

const GAME_DURATION = 30;

const SNIPPETS = [
    `const greeting = "Hello, World!";`,
    `function add(a, b) { return a + b; }`,
    `const [count, setCount] = useState(0);`,
    `document.querySelector(".hero").classList.add("active");`,
    `items.map(item => <li key={item.id}>{item.name}</li>);`,
    `const sorted = arr.sort((a, b) => a - b);`,
    `@media (max-width: 768px) { .container { padding: 1rem; } }`,
    `const { name, email } = user || {};`,
    `const res = await fetch("/api/users", { method: "POST" });`,
    `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);`,
    `const unique = [...new Set(array)];`,
    `useEffect(() => { fetchData(); }, []);`,
    `const merged = { ...defaults, ...overrides };`,
    `const filtered = items.filter(i => i.active && i.price > 0);`,
    `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));`,
    `const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;`,
    `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`,
    `localStorage.setItem("token", JSON.stringify(data));`,
    `const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };`,
    `export default function App() { return <div className="app">Hello</div>; }`,
];

const SNIPPET_BG = "#f6efe3";
const SNIPPET_INK = "#3E2723";
const MUTED = "#7a6252";
const ACCENT = "#b07d4f";
const FIELD_BG = "#efe5d3";

export default function TypingGame({ onBack }) {
    const scope = useRef();
    const titleRef = useRef();
    const inputRef = useRef();
    const endGameRef = useRef();
    const stateRef = useRef({
        running: false, timeLeft: GAME_DURATION, snippetIndex: 0,
        completedCorrect: 0, totalKeystrokes: 0, snippetMaxLen: 0, startTime: 0,
    });

    const [phase, setPhase] = useState("idle");
    const [score, setScore] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [best, setBest] = useState(() => {
        try { return Number(localStorage.getItem("typing-best") || 0); } catch { return 0; }
    });
    const [snippetIndex, setSnippetIndex] = useState(0);
    const [charStates, setCharStates] = useState([]);

    useGSAP(() => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: scope.current, start: "top 75%" } });
        const split = new SplitText(titleRef.current, { type: "chars", charsClass: "char" });
        tl.from(split.chars, {
            yPercent: 110, opacity: 0, rotateX: -70, stagger: 0.02, duration: 0.8, ease: "power3.out",
        })
            .from(".tgame-sub", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.3")
            .from(".tgame-frame", { y: 40, opacity: 0, scale: 0.97, duration: 0.8, ease: "power3.out" }, "-=0.2");
    }, { scope });

    const target = SNIPPETS[snippetIndex];

    const updateStats = useCallback((states) => {
        const s = stateRef.current;
        if (!s.running) return;
        const correctNow = states.filter((st) => st === "correct").length;
        const totalCorrect = s.completedCorrect + correctNow;
        const elapsed = (performance.now() - s.startTime) / 1000 / 60;
        const w = Math.round((totalCorrect / 5) / Math.max(elapsed, 0.01));
        const acc = s.totalKeystrokes > 0
            ? Math.round((totalCorrect / s.totalKeystrokes) * 100)
            : 100;
        setWpm(w);
        setAccuracy(acc);
        setScore(totalCorrect);
    }, []);

    const advanceSnippet = useCallback(() => {
        const s = stateRef.current;
        s.completedCorrect += SNIPPETS[s.snippetIndex].length;
        s.snippetIndex += 1;
        s.snippetMaxLen = 0;
        setSnippetIndex(s.snippetIndex);
        setCharStates([]);
        if (inputRef.current) inputRef.current.value = "";
    }, []);

    const handleInput = useCallback((e) => {
        const s = stateRef.current;
        if (!s.running) return;
        const val = e.target.value;
        const targetStr = SNIPPETS[s.snippetIndex];
        if (val.length > s.snippetMaxLen) {
            s.totalKeystrokes += val.length - s.snippetMaxLen;
            s.snippetMaxLen = val.length;
        }
        const states = targetStr.split("").map((ch, i) => {
            if (i >= val.length) return "pending";
            return val[i] === ch ? "correct" : "incorrect";
        });
        setCharStates(states);
        updateStats(states);
        if (val === targetStr) {
            if (s.snippetIndex < SNIPPETS.length - 1) {
                advanceSnippet();
            } else {
                advanceSnippet();
                endGameRef.current();
            }
        }
    }, [updateStats, advanceSnippet]);

    const endGame = useCallback(() => {
        const s = stateRef.current;
        if (!s.running) return;
        s.running = false;
        setPhase("over");
        const elapsed = (performance.now() - s.startTime) / 1000 / 60;
        const w = Math.round((s.completedCorrect / 5) / Math.max(elapsed, 0.01));
        const acc = s.totalKeystrokes > 0
            ? Math.round((s.completedCorrect / s.totalKeystrokes) * 100)
            : 100;
        setWpm(w);
        setAccuracy(acc);
        setScore(s.completedCorrect);
        setBest((prev) => {
            const nb = Math.max(prev, s.completedCorrect);
            try { localStorage.setItem("typing-best", nb); } catch { /* noop */ }
            return nb;
        });
    }, []);

    endGameRef.current = endGame;

    useEffect(() => {
        if (phase !== "playing") return;
        const id = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(id);
                    endGameRef.current();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [phase]);

    const startGame = useCallback(() => {
        const s = stateRef.current;
        s.running = true;
        s.timeLeft = GAME_DURATION;
        s.snippetIndex = 0;
        s.completedCorrect = 0;
        s.totalKeystrokes = 0;
        s.snippetMaxLen = 0;
        s.startTime = performance.now();
        setScore(0);
        setWpm(0);
        setAccuracy(100);
        setTimeLeft(GAME_DURATION);
        setPhase("playing");
        setSnippetIndex(0);
        setCharStates([]);
        if (inputRef.current) inputRef.current.value = "";
        setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 50);
    }, []);

    const statStyle = {
        fontSize: "clamp(0.75rem, 1.4vw, 0.9rem)",
        color: "var(--muted)",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
    };
    const valStyle = {
        fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
        fontWeight: 700,
        color: "var(--ink)",
        fontVariantNumeric: "tabular-nums",
    };

    const renderSnippetChars = () => {
        return target.split("").map((ch, i) => {
            const state = charStates[i] || "pending";
            let color = SNIPPET_INK;
            if (state === "correct") color = "#2e7d32";
            else if (state === "incorrect") color = "#c62828";
            return (
                <span
                    key={i}
                    style={{
                        color,
                        background: state === "incorrect" ? "rgba(198, 40, 40, 0.12)" : "transparent",
                        borderRadius: "2px",
                        fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
                        fontSize: "clamp(0.8rem, 1.5vw, 1.05rem)",
                        whiteSpace: "pre",
                    }}
                >
                    {ch}
                </span>
            );
        });
    };

    return (
        <section
            id="typinggame"
            ref={scope}
            style={{
                display: "flex", alignItems: "center",
                justifyContent: "center", position: "relative", overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "relative", zIndex: 1, maxWidth: "1280px", width: "100%",
                    marginInline: "auto", paddingInline: "clamp(16px, 5vw, 96px)",
                    paddingBlock: "clamp(4rem, 8vw, 6rem)", display: "flex",
                    flexDirection: "column", alignItems: "center", textAlign: "center",
                    gap: "clamp(1.25rem, 3vw, 2.5rem)",
                }}
            >
                {onBack && (
                    <button
                        onClick={onBack}
                        style={{
                            position: "absolute", top: "clamp(1rem, 2vw, 1.5rem)", left: "clamp(16px, 5vw, 96px)",
                            padding: "0.4rem 1rem", borderRadius: "999px", border: "none",
                            background: "color-mix(in srgb, var(--ink) 6%, transparent)",
                            color: "var(--muted)", fontSize: "0.75rem", fontWeight: 600,
                            cursor: "pointer", letterSpacing: "0.05em", display: "inline-flex",
                            alignItems: "center", gap: "0.35rem", backdropFilter: "blur(4px)",
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back
                    </button>
                )}
                <h2
                    ref={titleRef}
                    className="h-display"
                    style={{
                        fontSize: "clamp(3rem, 10vw, 9rem)", fontWeight: 700, lineHeight: 0.92,
                        color: "var(--ink)", letterSpacing: "-0.04em", perspective: "800px",
                    }}
                >
                    TYPING.EXE
                </h2>

                <p
                    className="tgame-sub"
                    style={{
                        fontSize: "clamp(0.95rem, 1.6vw, 1.25rem)", color: "var(--muted)",
                        maxWidth: "620px", lineHeight: 1.7,
                    }}
                >
                    Recruiters read resumes. Developers type them. You have{" "}
                    <span style={{ color: "var(--accent)", fontWeight: 600 }}>30 seconds</span>.
                    Type each snippet exactly. Speed and accuracy both count.
                </p>

                <div style={{ display: "flex", gap: "clamp(1.5rem, 5vw, 4rem)", flexWrap: "wrap", justifyContent: "center" }}>
                    <div><div style={statStyle}>Chars</div><div style={valStyle}>{score}</div></div>
                    <div>
                        <div style={statStyle}>WPM</div>
                        <div style={{ ...valStyle, color: wpm >= 60 ? "var(--accent)" : "var(--ink)" }}>{wpm}</div>
                    </div>
                    <div>
                        <div style={statStyle}>Accuracy</div>
                        <div style={{ ...valStyle, color: accuracy >= 95 ? "#2e7d32" : "var(--ink)" }}>{accuracy}%</div>
                    </div>
                    <div>
                        <div style={statStyle}>Time</div>
                        <div style={{ ...valStyle, color: timeLeft <= 5 && phase === "playing" ? "#c62828" : "var(--ink)" }}>
                            {timeLeft}s
                        </div>
                    </div>
                    <div><div style={statStyle}>Best</div><div style={{ ...valStyle, color: "#ffce54" }}>{best}</div></div>
                </div>

                <div
                    className="tgame-frame"
                    style={{
                        position: "relative", width: "100%", maxWidth: "900px",
                        minHeight: "clamp(280px, 45vh, 420px)", borderRadius: "20px",
                        border: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
                        background: "color-mix(in srgb, var(--ink) 3%, transparent)",
                        overflow: "hidden",
                        backdropFilter: "blur(4px)", display: "flex", flexDirection: "column",
                    }}
                >
                    {phase === "playing" && (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "clamp(1rem, 2vw, 1.5rem)" }}>
                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                marginBottom: "0.75rem",
                            }}>
                                <span style={{
                                    fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.1em",
                                    textTransform: "uppercase", fontWeight: 600,
                                }}>
                                    Snippet {Math.min(snippetIndex + 1, SNIPPETS.length)} / {SNIPPETS.length}
                                </span>
                                <span style={{
                                    fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.1em",
                                    textTransform: "uppercase", fontWeight: 600,
                                }}>
                                    {target.length} chars
                                </span>
                            </div>
                            <pre
                                style={{
                                    background: SNIPPET_BG,
                                    borderRadius: "12px",
                                    padding: "clamp(0.75rem, 1.5vw, 1.25rem)",
                                    border: `1px solid ${MUTED}20`,
                                    margin: 0, overflowX: "auto",
                                    lineHeight: 1.8, minHeight: "80px",
                                    textAlign: "left", whiteSpace: "pre-wrap",
                                    wordBreak: "break-all",
                                    fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
                                    fontSize: "clamp(0.8rem, 1.5vw, 1.05rem)",
                                }}
                            >
                                {renderSnippetChars()}
                            </pre>
                            <textarea
                                ref={inputRef}
                                onChange={handleInput}
                                spellCheck={false}
                                autoCapitalize="off"
                                autoCorrect="off"
                                autoComplete="off"
                                placeholder="Type the snippet here..."
                                style={{
                                    marginTop: "0.75rem", padding: "clamp(0.6rem, 1.2vw, 0.9rem)",
                                    borderRadius: "10px", border: `1px solid ${MUTED}25`,
                                    background: FIELD_BG, color: SNIPPET_INK, resize: "none",
                                    fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
                                    fontSize: "clamp(0.8rem, 1.5vw, 1.05rem)",
                                    lineHeight: 1.6, minHeight: "60px", outline: "none",
                                    width: "100%", boxSizing: "border-box",
                                }}
                            />
                        </div>
                    )}

                    {phase !== "playing" && (
                        <div
                            style={{
                                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", gap: "1.25rem",
                                background: "color-mix(in srgb, black 35%, transparent)",
                                backdropFilter: "blur(6px)", padding: "1rem",
                            }}
                        >
                            {phase === "over" && (
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ ...statStyle, marginBottom: "0.25rem" }}>Results</div>
                                    <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", justifyContent: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                                        <div>
                                            <div style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--accent)" }}>{wpm}</div>
                                            <div style={{ ...statStyle }}>WPM</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: accuracy >= 95 ? "#2e7d32" : "var(--ink)" }}>
                                                {accuracy}%
                                            </div>
                                            <div style={{ ...statStyle }}>Accuracy</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--ink)" }}>{score}</div>
                                            <div style={{ ...statStyle }}>Chars</div>
                                        </div>
                                    </div>
                                    <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginTop: "0.5rem", maxWidth: "400px", marginInline: "auto" }}>
                                        {score >= best && score > 0
                                            ? "New personal best. Now imagine what I do with production code."
                                            : wpm >= 60
                                                ? "60+ WPM. Sharp mind, sharper fingers."
                                                : wpm >= 40
                                                    ? "Solid pace. The code editor is your arena."
                                                    : "Speed comes with practice. My code is already fast."}
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={startGame}
                                style={{
                                    padding: "0.9rem 2.5rem", borderRadius: "999px",
                                    border: "1px solid var(--accent)", background: "var(--accent)",
                                    color: "#fff", fontWeight: 700, fontSize: "1rem",
                                    letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                                }}
                            >
                                {phase === "over" ? "Run it back" : "Initialize"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
