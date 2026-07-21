import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiExternalLink, FiLock } from "react-icons/fi";
import { PROJECTS } from "../data/content";
import ProjectLogo from "../sections/ProjectLogo";
import { PROJECT_TONES, projectSlug } from "../sections/Projects";

function getProjectBySlug(slug) {
    return PROJECTS.find((project) => projectSlug(project.name) === slug);
}

function getAdjacent(index, direction) {
    const nextIndex = (index + direction + PROJECTS.length) % PROJECTS.length;
    return PROJECTS[nextIndex];
}

export default function ProjectCaseStudyPage() {
    const { slug } = useParams();
    const project = getProjectBySlug(slug);

    if (!project) {
        return (
            <main className="project-case-page project-case-missing">
                <h1>Project not found.</h1>
                <Link to="/projects"><FiArrowLeft /> Back to projects</Link>
            </main>
        );
    }

    const index = PROJECTS.findIndex((item) => item.name === project.name);
    const previous = getAdjacent(index, -1);
    const next = getAdjacent(index, 1);
    const tone = PROJECT_TONES[project.name] || PROJECT_TONES.Mugafi;
    const architecture = ["Experience UI", "State + API", "Authentication", "Data Layer", project.demo ? "Live Deployment" : "Private Deployment"];

    return (
        <main className="project-case-page" style={{ "--case-accent": tone.accent, "--case-bg": tone.bg }}>
            <section className="project-case-hero">
                <div className="project-case-copy">
                    <Link className="project-case-back" to="/projects"><FiArrowLeft /> Projects</Link>
                    <div className="project-case-logo">
                        <ProjectLogo src={project.logo} name={project.name} size={78} />
                    </div>
                    <p>{project.tag}</p>
                    <h1>{project.name}</h1>
                    <span>{project.desc}</span>
                    <div className="project-case-actions">
                        {project.demo ? (
                            <a href={project.demo} target="_blank" rel="noopener noreferrer">Live Demo <FiExternalLink /></a>
                        ) : (
                            <strong><FiLock /> Private product</strong>
                        )}
                    </div>
                </div>
                <div className="project-case-screen">
                    {project.preview ? (
                        <img src={project.preview} alt={`${project.name} screenshot`} />
                    ) : (
                        <ProjectLogo src={project.logo} name={project.name} size={120} />
                    )}
                </div>
            </section>

            <section className="project-case-grid" aria-label={`${project.name} case study`}>
                {[
                    ["Problem", project.challenge],
                    ["Solution", project.solution],
                    ["Impact", project.impact || "A production-ready product experience with responsive UX, clean systems thinking, and deployable architecture."],
                ].map(([label, copy]) => (
                    <article key={label}>
                        <span>{label}</span>
                        <p>{copy}</p>
                    </article>
                ))}
            </section>

            <section className="project-case-section">
                <div>
                    <span>Architecture</span>
                    <h2>Built as a product system, not a page.</h2>
                </div>
                <div className="project-case-flow">
                    {architecture.map((step, stepIndex) => (
                        <strong key={`${step}-${stepIndex}`}>
                            {step}
                            {stepIndex < architecture.length - 1 && <FiArrowRight />}
                        </strong>
                    ))}
                </div>
            </section>

            <section className="project-case-section">
                <div>
                    <span>Stack</span>
                    <h2>Technology chosen around the product job.</h2>
                </div>
                <div className="project-case-tech">
                    {project.tech.map((tech) => <span key={tech}>{tech}</span>)}
                </div>
            </section>

            <nav className="project-case-next" aria-label="Adjacent projects">
                <Link to={`/projects/${projectSlug(previous.name)}`}><FiArrowLeft /> {previous.name}</Link>
                <Link to={`/projects/${projectSlug(next.name)}`}>{next.name} <FiArrowRight /></Link>
            </nav>
        </main>
    );
}
