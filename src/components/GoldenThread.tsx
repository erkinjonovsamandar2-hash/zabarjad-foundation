import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const GoldenThread = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="pointer-events-none fixed left-1/2 top-0 z-40 h-full w-px -translate-x-1/2 hidden lg:block">
      <svg
        className="h-full w-8 -translate-x-1/2"
        viewBox="0 0 8 2000"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d="M4 0 Q6 200 2 400 Q-1 600 5 800 Q8 1000 3 1200 Q0 1400 5 1600 Q7 1800 4 2000"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength }}
          opacity={0.4}
        />
        <motion.path
          d="M4 0 Q6 200 2 400 Q-1 600 5 800 Q8 1000 3 1200 Q0 1400 5 1600 Q7 1800 4 2000"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength }}
          opacity={0.15}
          filter="url(#glow)"
        />
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default GoldenThread;
