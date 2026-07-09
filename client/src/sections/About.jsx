import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STORY = [
    { year: "July 2002", title: "The Beginning", text: "The day my journey began. Though my childhood aspirations were set on medicine, my passion shifted towards technology, igniting a new dream to engineer impactful solutions for society." },
    { year: "2018 - 2020", title: "Dreaming Big", text: "Completed my High School and Intermediate education with a consistent 85%+. This academic foundation fueled my ambition, leading to rigorous preparation and relentless hard work for engineering entrance examinations." },
    { year: "2021 - 2025", title: "University Life", text: "My formal technical journey commenced at Graphic Era Hill University, Dehradun. Pursuing a B.Tech in Computer Science and Engineering, I developed a strong foundation in algorithms and software engineering." },
    { year: "The Grind", title: "Overcoming Failures", text: "The path was paved with failures and rejections, but these became my greatest teachers. I learned to analyze my shortcomings—be it technical depth or communication skills—and used them as stepping stones to continuously evolve." },
    { year: "2025", title: "Leadership & Growth", text: "Transitioned into a leadership role as a Full Stack Developer at Unified Mentor. Working alongside talented freelancers, I mastered backend architecture and cultivated leadership skills by managing a team of four exceptional engineers." },
    { year: "Present", title: "Professional Leap", text: "Secured a pivotal role as a MERN Stack & UI/UX Developer at Dr Design Private Limited. Successfully navigated over 100 meetings with international clients, mastering Agile SCRUM, AWS, and full-cycle production deployment." },
    { year: "Future", title: "To Be Continued...", text: "The journey has just begun. I remain committed to building scalable, production-grade systems and leaving a lasting impact in the world of technology." }
];

export default function About() {
    const container = useRef();

    useGSAP(() => {
        // Animate the scrolling line
        gsap.fromTo(".timeline-fill", 
            { scaleY: 0 },
            {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: ".timeline-wrapper",
                    start: "top 60%", 
                    end: "bottom 80%", 
                    scrub: 1,
                }
            }
        );

        const cards = gsap.utils.toArray(".story-card-wrapper");
        
        cards.forEach((card, i) => {
            const innerCard = card.querySelector(".story-card");

            // Scroll leaving animation (rotates out)
            gsap.to(innerCard, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 25%", 
                    end: "bottom top", 
                    scrub: 1, 
                },
                rotationX: -40,
                rotationZ: i % 2 === 0 ? -1.5 : 1.5,
                scale: 0.9,
                opacity: 0,
                y: -100,
                transformOrigin: "top center",
                ease: "none"
            });

            // Entrance animation
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
                y: 80,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });
    }, { scope: container });

    return (
        <section id="about" ref={container} className="section" style={{ minHeight: "100vh", perspective: "1500px", overflow: "hidden" }}>
            <style>
                {`
                .timeline-wrapper {
                    position: relative;
                    max-width: 72rem;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                }
                .timeline-track, .timeline-fill {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    border-radius: 4px;
                }
                .timeline-track {
                    background: var(--border);
                    opacity: 0.5;
                }
                .timeline-fill {
                    background: var(--accent);
                    transform-origin: top;
                }
                .card-container {
                    width: 100%;
                    padding-left: 3rem;
                    margin-bottom: 6rem;
                    position: relative;
                }
                .card-container:last-child {
                    margin-bottom: 0;
                }
                .timeline-dot {
                    position: absolute;
                    top: 3rem;
                    width: 1.25rem;
                    height: 1.25rem;
                    background: var(--bg);
                    border: 3px solid var(--accent);
                    border-radius: 50%;
                    z-index: 2;
                }
                .decorative-number {
                    position: absolute;
                    top: -1.5rem;
                    fontSize: clamp(5rem, 12vw, 8rem);
                    font-weight: 800;
                    color: var(--muted);
                    opacity: 0.04;
                    line-height: 1;
                    pointer-events: none;
                    user-select: none;
                }
                
                /* Desktop layout */
                @media (min-width: 768px) {
                    .timeline-track, .timeline-fill {
                        left: 50%;
                        transform: translateX(-50%);
                    }
                    .card-container {
                        width: 50%;
                        padding-left: 0;
                    }
                    .card-container.left {
                        padding-right: 4rem;
                        text-align: right;
                    }
                    .card-container.right {
                        margin-left: 50%;
                        padding-left: 4rem;
                        text-align: left;
                    }
                    /* Timeline dots */
                    .card-container.left .timeline-dot {
                        right: 0; 
                        transform: translateX(50%);
                    }
                    .card-container.right .timeline-dot {
                        left: 0;
                        transform: translateX(-50%);
                    }
                    /* Decorative numbers */
                    .card-container.left .decorative-number {
                        left: 2rem;
                        right: auto;
                    }
                    .card-container.right .decorative-number {
                        right: 2rem;
                        left: auto;
                    }
                }
                /* Mobile layout dots */
                @media (max-width: 767px) {
                    .timeline-track, .timeline-fill {
                        left: 1rem;
                    }
                    .timeline-dot {
                        left: 1rem;
                        transform: translateX(-50%);
                    }
                    .card-container.left, .card-container.right {
                        text-align: left;
                    }
                    .decorative-number {
                        right: 1.5rem;
                    }
                }
                `}
            </style>

            <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "6rem 1rem 4rem", position: "relative" }}>
                <h2 className="h-display" style={{ 
                    fontSize: "clamp(3rem, 8vw, 6rem)", 
                    fontWeight: 800, 
                    marginBottom: "2rem", 
                    color: "var(--ink)", 
                    textAlign: "center" 
                }}>
                    My Story
                </h2>
            </div>

            <div className="timeline-wrapper">
                <div className="timeline-track" />
                <div className="timeline-fill" />

                <div style={{ display: "flex", flexDirection: "column" }}>
                    {STORY.map((item, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <div key={i} className={`card-container story-card-wrapper ${isLeft ? 'left' : 'right'}`}>
                                <div className="timeline-dot" />
                                <div className="story-card glass" style={{
                                    padding: "clamp(2rem, 4vw, 3.5rem)",
                                    borderRadius: "1.5rem",
                                    border: "1px solid var(--border)",
                                    position: "relative",
                                    transformStyle: "preserve-3d",
                                    willChange: "transform, opacity",
                                    background: "rgba(255, 255, 255, 0.02)",
                                    backdropFilter: "blur(12px)",
                                }}>
                                    <div className="decorative-number">
                                        0{i + 1}
                                    </div>

                                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                        <span style={{ 
                                            color: "var(--accent)", 
                                            fontWeight: 700, 
                                            letterSpacing: "0.15em", 
                                            fontSize: "clamp(1.1rem, 2vw, 1.25rem)", 
                                            textTransform: "uppercase",
                                            display: "inline-block"
                                        }}>
                                            {item.year}
                                        </span>
                                        <h3 className="h-display" style={{ 
                                            fontSize: "clamp(2rem, 5vw, 3.25rem)", 
                                            color: "var(--ink)", 
                                            fontWeight: 800, 
                                            margin: 0,
                                            lineHeight: 1.2
                                        }}>
                                            {item.title}
                                        </h3>
                                        <p style={{ 
                                            fontSize: "clamp(1.15rem, 2.5vw, 1.4rem)", 
                                            color: "var(--muted)", 
                                            lineHeight: 1.8, 
                                            marginTop: "0.5rem",
                                            fontWeight: 500
                                        }}>
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
