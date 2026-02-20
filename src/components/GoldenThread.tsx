import { useScroll, useTransform, motion } from "framer-motion";

const GoldenThread = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden lg:block overflow-hidden">
      {/* Left ribbon */}
      <svg
        className="absolute left-0 top-0 h-full"
        width="120"
        height="100%"
        viewBox="0 0 120 2000"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="ribbon-gradient-l" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--obsidian))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
          <filter id="ribbon-shadow-l">
            <feDropShadow dx="4" dy="0" stdDeviation="8" floodColor="hsl(var(--primary))" floodOpacity="0.3" />
          </filter>
        </defs>
        <motion.path
          d="M-30 0 C60 150 10 300 -20 500 C-50 700 80 800 60 1000 C40 1200 -30 1300 -10 1500 C10 1700 70 1800 -20 2000"
          stroke="url(#ribbon-gradient-l)"
          strokeWidth="28"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength }}
          filter="url(#ribbon-shadow-l)"
        />
        {/* Thinner inner highlight */}
        <motion.path
          d="M-30 0 C60 150 10 300 -20 500 C-50 700 80 800 60 1000 C40 1200 -30 1300 -10 1500 C10 1700 70 1800 -20 2000"
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength }}
          opacity={0.7}
        />
      </svg>

      {/* Right ribbon */}
      <svg
        className="absolute right-0 top-0 h-full"
        width="120"
        height="100%"
        viewBox="0 0 120 2000"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="ribbon-gradient-r" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--obsidian))" />
            <stop offset="40%" stopColor="hsl(var(--primary))" />
            <stop offset="80%" stopColor="hsl(var(--obsidian))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
          <filter id="ribbon-shadow-r">
            <feDropShadow dx="-4" dy="0" stdDeviation="8" floodColor="hsl(var(--primary))" floodOpacity="0.3" />
          </filter>
        </defs>
        <motion.path
          d="M150 0 C40 200 110 400 140 600 C170 800 30 900 60 1100 C90 1300 150 1400 130 1600 C110 1800 50 1900 150 2000"
          stroke="url(#ribbon-gradient-r)"
          strokeWidth="28"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength }}
          filter="url(#ribbon-shadow-r)"
        />
        <motion.path
          d="M150 0 C40 200 110 400 140 600 C170 800 30 900 60 1100 C90 1300 150 1400 130 1600 C110 1800 50 1900 150 2000"
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength }}
          opacity={0.7}
        />
      </svg>
    </div>
  );
};

export default GoldenThread;
