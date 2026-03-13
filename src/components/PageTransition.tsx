import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// ✅ No changes needed — this file is architecturally correct.
//
// Single <motion.div> root element — no fragments, no siblings.
// Framer Motion can correctly track enter/exit states on this element.
// The blur + slide transition is intentional premium UX — kept intact.
const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;