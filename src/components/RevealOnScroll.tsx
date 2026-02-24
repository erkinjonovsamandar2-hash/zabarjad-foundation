import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const RevealOnScroll = ({ children, className = "", delay = 0 }: RevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" }); // Triggers when 10% of element is visible

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, clipPath: "inset(10% 0 0 0)" }} // Start slightly hidden/clipped
      animate={isInView ? { opacity: 1, y: 0, clipPath: "inset(0 0 0 0)" } : {}}
      transition={{ duration: 0.8, delay: delay, ease: [0.22, 1, 0.36, 1] }} // "Apple-like" smooth ease
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;