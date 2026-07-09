import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useSmoothScroll from "./hooks/useSmoothScroll";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Layout from "./components/Layout";

const World = lazy(() => import("./three/Experience"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

function AppContent() {
    useSmoothScroll();
    return (
        <>
            <Suspense fallback={null}>
                <World />
            </Suspense>
            <Preloader />
            <Cursor />
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="skills" element={<SkillsPage />} />
                        <Route path="experience" element={<ExperiencePage />} />
                        <Route path="projects" element={<ProjectsPage />} />
                        <Route path="contact" element={<ContactPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default function App() {
    return <AppContent />;
}
