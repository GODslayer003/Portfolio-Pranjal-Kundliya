import { motion } from "framer-motion";

export const pageVariants = {
    initial: { opacity: 0, x: 80, filter: "blur(6px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
    exit:    { opacity: 0, x: -80, filter: "blur(6px)", transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

export function PageWrapper({ children }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ minHeight: "calc(100vh + 1px)" }}
        >
            {children}
        </motion.div>
    );
}
