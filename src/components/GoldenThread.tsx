import { useScroll, useTransform, motion } from "framer-motion";

const GoldenThread = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden lg:block overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 3000"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="thread-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="30%" stopColor="hsl(var(--obsidian))" />
            <stop offset="50%" stopColor="hsl(var(--primary))" />
            <stop offset="70%" stopColor="hsl(var(--obsidian))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
          <filter id="thread-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow layer */}
        <motion.path
          d="M-40 0 C200 200 1300 250 1480 500 C1500 750 200 700 -40 1000 C-60 1300 1250 1200 1480 1500 C1500 1800 150 1700 -40 2000 C-60 2300 1300 2200 1480 2500 C1500 2700 200 2800 -40 3000"
          stroke="hsl(var(--primary))"
          strokeWidth="30"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength }}
          opacity={0.15}
          filter="url(#thread-glow)"
        />

        {/* Main bold ribbon */}
        <motion.path
          d="M-40 0 C200 200 1300 250 1480 500 C1500 750 200 700 -40 1000 C-60 1300 1250 1200 1480 1500 C1500 1800 150 1700 -40 2000 C-60 2300 1300 2200 1480 2500 C1500 2700 200 2800 -40 3000"
          stroke="url(#thread-grad)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength }}
        />

        {/* Bright inner core */}
        <motion.path
          d="M-40 0 C200 200 1300 250 1480 500 C1500 750 200 700 -40 1000 C-60 1300 1250 1200 1480 1500 C1500 1800 150 1700 -40 2000 C-60 2300 1300 2200 1480 2500 C1500 2700 200 2800 -40 3000"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength }}
          opacity={0.9}
        />
      </svg>
    </div>
  );
};

export default GoldenThread;
