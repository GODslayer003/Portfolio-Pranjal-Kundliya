import {
    SiReact, SiThreedotjs, SiGreensock, SiNodedotjs, SiMongodb, SiExpress,
    SiTailwindcss, SiJavascript, SiStripe,
    SiSocketdotio, SiWebrtc, SiCloudinary, SiRedux, SiHtml5, SiCss,
    SiBootstrap, SiVite, SiGit, SiFigma, SiVercel, SiRender,
} from "react-icons/si";
import { TbBrandOpenai } from "react-icons/tb";
import { FaCuttlefish } from "react-icons/fa";

export const SKILLS = [
    { name: "React", Icon: SiReact, color: "#61dafb" },
    { name: "Three.js", Icon: SiThreedotjs, color: "#c9c9c9" },
    { name: "GSAP", Icon: SiGreensock, color: "#8ac640" },
    { name: "Node.js", Icon: SiNodedotjs, color: "#68a063" },
    { name: "MongoDB", Icon: SiMongodb, color: "#4db33d" },
    { name: "Express", Icon: SiExpress, color: "#bcbcbc" },
    { name: "Tailwind", Icon: SiTailwindcss, color: "#38bdf8" },
    { name: "JavaScript", Icon: SiJavascript, color: "#f7df1e" },
    { name: "Redux", Icon: SiRedux, color: "#764abc" },
    { name: "C++", Icon: FaCuttlefish, color: "#00599c" },
    { name: "HTML5", Icon: SiHtml5, color: "#e34f26" },
    { name: "CSS3", Icon: SiCss, color: "#1572b6" },
    { name: "Bootstrap", Icon: SiBootstrap, color: "#7952b3" },
    { name: "Vite", Icon: SiVite, color: "#646cff" },
    { name: "Git", Icon: SiGit, color: "#f05032" },
    { name: "Figma", Icon: SiFigma, color: "#f24e1e" },
    { name: "OpenAI", Icon: TbBrandOpenai, color: "#9fe3c5" },
    { name: "Stripe", Icon: SiStripe, color: "#635bff" },
    { name: "Socket.IO", Icon: SiSocketdotio, color: "#d3d3d3" },
    { name: "WebRTC", Icon: SiWebrtc, color: "#ff6d5a" },
    { name: "Cloudinary", Icon: SiCloudinary, color: "#3448c5" },
    { name: "Vercel", Icon: SiVercel, color: "#ffffff" },
    { name: "Render", Icon: SiRender, color: "#46e3b7" },
];

export const JOURNEY = [
    { title: "B.Tech in CSE", detail: "Graphic Era Hill University, Dehradun — 2021 – 2025. Built a strong foundation in Computer Science, algorithms, and full-stack development." },
    { title: "Full-Stack Developer Intern", detail: "Unified Mentor — Jul 2025 – Sep 2025. Designed and shipped production-ready apps: Weather App, Money Tracker, and Sports Buddy using React, Node.js, Express, and MongoDB." },
    { title: "MERN Stack Developer & UI/UX Engineer", detail: "DR Design Private Limited — Oct 2025 – Present. Building production-grade full-stack features for Indian Railways, KaroFlight, Maven Jobs, and mawahib.ai — serving international clients with React, Three.js, Node.js, and GSAP." },
    { title: "Maven Jobs", detail: "Architected a 30+ page AI-powered job platform with real-time application pipeline, resume builder, Socket.IO chat, and WebRTC — connecting candidates and employers at scale." },
    { title: "Novel Den", detail: "Full-stack MERN platform for novels and writers with immersive 3D UI, JWT auth, OTP verification, admin analytics dashboard, and a custom PDF.js mobile reader." },
    { title: "My Quote Mate", detail: "AI-powered quote analysis platform with tiered subscriptions (Stripe), OTP-based SMS verification (ClickSend), and OpenAI-powered document analysis pipelines." },
    { title: "Biome360 PDF Generator", detail: "Secure medical reporting system for Proven Code (UK) with JWT auth, RBAC, automated PDF generation — actively used by 10,000+ individuals worldwide for microbiome screening." },
];

export const EXPERIENCE = [
    {
        company: "DR Design Private Limited",
        role: "MERN Stack Developer & UI/UX Engineer",
        period: "Oct 2025 — Present",
        stack: ["React", "Node.js", "Three.js", "GSAP", "MongoDB", "OpenAI"],
        points: [
            "Engineered production-grade full-stack features for Indian Railways (Pulley Detection System) and KaroFlight (One-Way, Round-Trip & Multi-City flight booking) — delivering scalable end-to-end systems with React.js and Node.js.",
            "Architected the complete Maven Jobs platform — built Admin, CRM, and Sales modules with role-based access control (RBAC), serving B2B corporate clients as part of a production travel and recruitment platform.",
            "Built and optimized the full frontend of mawahib.ai (AI hiring platform for a Jordan-based client) using React, Three.js, and GSAP — delivering interactive 3D components and performance-optimized animations.",
            "Integrated OpenAI API across multiple products to automate workflows, enhance UX, and deliver AI-powered features; collaborated directly with international clients to meet production SLAs.",
        ],
        metric: { value: "4+", label: "products shipped" },
    },
    {
        company: "Unified Mentor",
        role: "Full-Stack Developer Intern",
        period: "Jul 2025 — Sep 2025",
        stack: ["React", "Node.js", "Express", "MongoDB"],
        points: [
            "Designed and shipped multiple production-ready full-stack applications — Weather App, Money Tracker, and Sports Buddy.",
            "Strengthened core competencies in React.js, Node.js, Express.js, and MongoDB through end-to-end project delivery.",
        ],
        metric: { value: "3", label: "apps shipped" },
    },
];

export const PROJECTS = [
    {
        name: "Maven Jobs",
        tag: "AI Job Platform",
        atmosphere: "radial-gradient(circle at 30% 20%, #3d5a80aa, transparent 60%)",
        desc: "A 30+ page full-stack job portal connecting candidates with employers — featuring AI-powered job-match scoring, multi-faceted search, and a 7-stage real-time application pipeline with analytics dashboards.",
        tech: ["React", "Vite", "Node.js", "Express", "MongoDB", "Socket.IO", "WebRTC", "GSAP"],
        challenge: "Real-time matching across thousands of resumes with a 7-stage application pipeline without blocking the UI.",
        solution: "Queue-based AI pipeline + optimistic UI + WebSocket updates + timeline visualisation with analytics dashboards.",
        impact: "Built Resume Builder with 20+ templates, AI content enhancement, ATS scoring, and PDF export — connecting candidates and employers in real-time.",
        demo: "#", repo: "#",
    },
    {
        name: "Novel Den",
        tag: "Reading Universe",
        atmosphere: "radial-gradient(circle at 70% 30%, #7b5ea7aa, transparent 60%)",
        desc: "Full-stack MERN platform for novels and writers — featuring JWT-authenticated user registration, OTP email verification, an immersive 3D UI, and a separate Admin SPA with Recharts-powered analytics.",
        tech: ["React 18", "Vite", "Node.js", "Express", "MongoDB", "Three.js", "GSAP", "Framer Motion", "Cloudinary"],
        challenge: "Making long-form reading feel cinematic yet performant with a custom mobile reader.",
        solution: "Three.js 3D particle backgrounds, GSAP scroll-triggered animations, virtualized chapters, and a custom PDF.js canvas-based mobile reader.",
        impact: "RESTful API with Cloudinary signed expiring URLs, chapter-level rate-limiting, Helmet security, CORS whitelisting — deployed to Vercel and Render.",
        demo: "#", repo: "#",
    },
    {
        name: "My Quote Mate",
        tag: "AI Companion",
        atmosphere: "radial-gradient(circle at 40% 70%, #2a9d8faa, transparent 60%)",
        desc: "AI-powered quote analysis platform with a tiered subscription model — integrated Stripe for payments and ClickSend for OTP-based SMS verification.",
        tech: ["React.js", "Node.js", "MongoDB", "OpenAI API", "Stripe", "ClickSend"],
        challenge: "Building an AI orchestration layer with deterministic prompt engineering and OCR-based document pipelines.",
        solution: "Structured prompt engineering with JSON schema enforcement, fault-tolerant background processing for PDF and image uploads.",
        impact: "Tiered subscription model (Free / Standard / Premium) with Stripe integration — paid conversions from day one.",
        demo: "#", repo: "#",
    },
    {
        name: "Biome360 PDF Generator",
        tag: "Health Intelligence",
        atmosphere: "radial-gradient(circle at 60% 40%, #e76f51aa, transparent 60%)",
        desc: "Secure medical reporting system for Proven Code (UK) — featuring structured patient data entry, lab result inputs, and automated PDF generation for their Biome360 Health Check product.",
        tech: ["React.js", "Redux Toolkit", "Node.js", "Express.js", "MongoDB"],
        challenge: "Handling dense medical data with strict security and reliability requirements at scale.",
        solution: "JWT authentication with RBAC, structured patient data entry, and automated PDF generation pipeline.",
        impact: "Actively used by 10,000+ individuals worldwide for microbiome screening — validating production-grade reliability, security, and scalability.",
        demo: "#", repo: "#",
    },
];
