import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowRight, FiExternalLink, FiLock } from "react-icons/fi";
import { PROJECTS } from "../data/content";
import ProjectLogo from "./ProjectLogo";

gsap.registerPlugin(ScrollTrigger);

export const PROJECT_TONES = {
    Mugafi: { accent: "#ff4b4b", bg: "#180b10", wash: "#ff4b4b" },
    Traveamer: { accent: "#3a86ff", bg: "#071221", wash: "#3a86ff" },
    "Maven Jobs": { accent: "#38b000", bg: "#07170d", wash: "#38b000" },
    Mawahib: { accent: "#9b5cff", bg: "#120b1f", wash: "#7209b7" },
    "ReKHAnSh (CORS)": { accent: "#ef233c", bg: "#19080b", wash: "#d90429" },
    "My Quote Mate": { accent: "#2a9d8f", bg: "#061817", wash: "#2a9d8f" },
    SlideIt: { accent: "#ff9f1c", bg: "#1c1205", wash: "#ff9f1c" },
    "Novel Den": { accent: "#b69cff", bg: "#100d1b", wash: "#7b5ea7" },
    "Indian Railways": { accent: "#00a6fb", bg: "#071522", wash: "#0077b6" },
    "Biome360 ProvenCode": { accent: "#35d0ba", bg: "#061817", wash: "#e76f51" },
};

export function projectSlug(name) {
    return name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function getCategory(project) {
    const text = `${project.tag} ${project.desc}`.toLowerCase();
    if (text.includes("ai")) return "AI Product";
    if (text.includes("travel")) return "Travel Tech";
    if (text.includes("job") || text.includes("recruit")) return "Recruitment";
    if (text.includes("gis") || text.includes("railway") || text.includes("government")) return "Gov / Infra";
    if (text.includes("fintech") || text.includes("pay")) return "Fintech";
    if (text.includes("medical") || text.includes("health")) return "Health Tech";
    return "Full Stack";
}

const ALL_CATEGORIES = ["All", "AI Product", "Travel Tech", "Recruitment", "Gov / Infra", "Fintech", "Full Stack"];

function ProjectCard({ project, index }) {
    const cardRef = useRef(null);
    const tone = PROJECT_TONES[project.name] || { accent: "var(--accent)", wash: "#8f8fff" };
    const category = getCategory(project);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.from(el, {
                y: 50,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });
        }, el);
        return () => ctx.revert();
    }, []);

    return (
        <article
            ref={cardRef}
            className="projects-card"
            style={{ "--project-accent": tone.accent, "--status-tone": tone.wash }}
        >
            <div className="projects-card-media">
                <div className="projects-card-screen">
                    {project.preview ? (
                        <img src={project.preview} alt={`${project.name} preview`} loading={index < 3 ? "eager" : "lazy"} />
                    ) : (
                        <div className="projects-empty-preview">
                            <ProjectLogo src={project.logo} name={project.name} size={80} />
                        </div>
                    )}
                    <span className="projects-rank-badge">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                </div>
            </div>

            <div className="projects-card-body">
                <div className="projects-card-header">
                    <div className="projects-logo-wrap">
                        <ProjectLogo src={project.logo} name={project.name} size={36} />
                    </div>
                    <div className="projects-card-tags">
                        <span className="projects-cat-pill" style={{ "--pill-color": tone.accent }}>
                            {category}
                        </span>
                        <span className="projects-status-pill" style={{ "--pill-color": tone.wash }}>
                            {project.demo ? <><FiExternalLink size={12} /> Live</> : <><FiLock size={12} /> Private</>}
                        </span>
                    </div>
                </div>

                <h3 className="projects-card-name">
                    <Link to={`/projects/${projectSlug(project.name)}`}>
                        {project.name}
                    </Link>
                </h3>
                <p className="projects-card-tag">{project.tag}</p>
                <p className="projects-card-desc">{project.desc}</p>

                <div className="projects-tech-strip">
                    {project.tech.slice(0, 4).map((tech) => (
                        <span key={tech} className="projects-tech-pill">{tech}</span>
                    ))}
                </div>

                <div className="projects-card-actions">
                    {project.demo ? (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="projects-action-live">
                            Live <FiExternalLink size={15} />
                        </a>
                    ) : (
                        <span className="projects-action-private">
                            <FiLock size={13} /> Private
                        </span>
                    )}
                    <Link to={`/projects/${projectSlug(project.name)}`} className="projects-action-case">
                        Case Study <FiArrowRight size={15} />
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default function Projects() {
    const [showAll, setShowAll] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");

    const toggleShowAll = useCallback(() => {
        setShowAll((prev) => {
            const next = !prev;
            requestAnimationFrame(() => {
                setTimeout(() => window.lenis?.resize(), 80);
            });
            return next;
        });
    }, []);

    useEffect(() => {
        window.lenis?.resize();
    }, [activeCategory]);

    const categories = useMemo(() => {
        const cats = PROJECTS.map((p) => getCategory(p));
        return ["All", ...new Set(cats)];
    }, []);

    const filteredProjects = useMemo(() => {
        let list = activeCategory === "All" ? PROJECTS : PROJECTS.filter((p) => getCategory(p) === activeCategory);
        if (!showAll) list = list.slice(0, 5);
        return list;
    }, [showAll, activeCategory]);

    const totalInCategory = useMemo(() => {
        return activeCategory === "All" ? PROJECTS.length : PROJECTS.filter((p) => getCategory(p) === activeCategory).length;
    }, [activeCategory]);

    return (
        <section id="projects" className="projects-section">
            <div className="projects-ambient" aria-hidden />

            <div className="projects-hero">
                <span className="projects-kicker">
                    Building digital products
                </span>
                <h1>Projects</h1>
                <p className="projects-hero-sub">
                    Real products, real impact — across AI, SaaS, government, and fintech.
                </p>

                <div className="projects-summary">
                    <div>
                        <strong>{PROJECTS.length}+</strong>
                        <span>products shipped</span>
                    </div>
                    <div>
                        <strong>{PROJECTS.filter((p) => p.demo).length}</strong>
                        <span>live in production</span>
                    </div>
                    <div>
                        <strong>{categories.length - 1}</strong>
                        <span>categories served</span>
                    </div>
                </div>
            </div>

            <div className="projects-filters">
                {ALL_CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        className={`projects-filter-btn ${activeCategory === cat ? "is-active" : ""}`}
                        onClick={() => { setActiveCategory(cat); setShowAll(false); }}
                    >
                        {cat}
                        {cat !== "All" && (
                            <span className="projects-filter-count">
                                {PROJECTS.filter((p) => getCategory(p) === cat).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="projects-carousel-shell">
                <div className="projects-carousel-header">
                    <div>
                        <span>Featured work</span>
                        <strong>
                            {activeCategory === "All" ? "All projects" : activeCategory}
                            {" — "}
                            {showAll ? totalInCategory : Math.min(5, totalInCategory)}
                            {!showAll && totalInCategory > 5 ? ` of ${totalInCategory}` : ""}
                        </strong>
                    </div>
                </div>

                {filteredProjects.length === 0 ? (
                    <div className="projects-empty">
                        <p>No projects found in this category.</p>
                    </div>
                ) : (
                    <div className="projects-carousel-viewport">
                        <div className="projects-carousel-track">
                            {filteredProjects.map((project, index) => (
                                <ProjectCard key={project.name} project={project} index={PROJECTS.indexOf(project)} />
                            ))}
                        </div>
                    </div>
                )}

                {totalInCategory > 5 && (
                    <button
                        className="projects-view-toggle"
                        type="button"
                        onClick={toggleShowAll}
                        aria-expanded={showAll}
                    >
                        {showAll
                            ? <>Show less <span>&uarr;</span></>
                            : <>Show all {totalInCategory} projects <span>&darr;</span></>}
                    </button>
                )}
            </div>
        </section>
    );
}
