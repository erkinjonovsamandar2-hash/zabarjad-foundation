import { useState, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";

const Hero = () => {
  const { books } = useData();
  const featuredBooks = books.filter((b) => b.featured);
  const [active, setActive] = useState(0);

  const safeActive = Math.min(active, featuredBooks.length - 1);
  const next = useCallback(() => setActive((p) => (p + 1) % featuredBooks.length), [featuredBooks.length]);
  const prev = useCallback(() => setActive((p) => (p - 1 + featuredBooks.length) % featuredBooks.length), [featuredBooks.length]);

  if (featuredBooks.length === 0) return null;
  const book = featuredBooks[safeActive];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center section-padding pt-24 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={safeActive}
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 40%, hsl(var(--primary) / 0.12) 0%, hsl(var(--background)) 70%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p className="mb-4 text-sm font-sans font-medium uppercase tracking-[0.3em] text-primary">Premium nashriyot</p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold leading-tight text-foreground mb-6">
          Eng Yaxshisini <span className="text-gold-gradient">Ilinamiz.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Dunyo adabiyotining eng sara namunalarini o'zbek tilida taqdim etamiz.
        </p>
        <a href="#library" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Kutubxonani ko'rish <ChevronRight className="h-4 w-4" />
        </a>
      </motion.div>

      {/* 3D Carousel */}
      <div className="relative z-10 mt-16 w-full max-w-5xl">
        <div className="relative flex items-center justify-center h-64 md:h-80" style={{ perspective: "1200px" }}>
          {featuredBooks.map((b, i) => {
            const offset = i - safeActive;
            const absOffset = Math.abs(offset);
            const isActive = i === safeActive;
            return (
              <motion.div
                key={b.id}
                className="absolute w-40 md:w-52 cursor-pointer"
                animate={{
                  x: offset * 120, z: isActive ? 0 : -150, rotateY: offset * -15,
                  scale: isActive ? 1.15 : 0.85 - absOffset * 0.05,
                  opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.2,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                style={{ transformStyle: "preserve-3d", zIndex: 10 - absOffset }}
                onClick={() => setActive(i)}
              >
                <div
                  className="glass-card flex flex-col items-center justify-center rounded-xl overflow-hidden relative"
                  style={{
                    height: isActive ? "260px" : "220px",
                    background: b.cover_url ? undefined : `linear-gradient(145deg, hsl(${b.bg_color}), hsl(var(--secondary)))`,
                    boxShadow: isActive
                      ? "0 20px 60px -10px hsl(var(--primary) / 0.3), 0 0 30px -5px hsl(var(--primary) / 0.15)"
                      : "0 10px 30px -10px rgba(0,0,0,0.3)",
                    transition: "height 0.3s, box-shadow 0.3s",
                  }}
                >
                  {b.cover_url ? (
                    <img src={b.cover_url} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="font-serif text-sm md:text-base font-bold text-foreground text-center px-4">{b.title}</span>
                      <span className="text-xs text-muted-foreground mt-2">{b.author}</span>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} className="glass-card p-2 rounded-full text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {featuredBooks.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all ${i === safeActive ? "w-6 bg-primary" : "w-2 bg-muted"}`} />
            ))}
          </div>
          <button onClick={next} className="glass-card p-2 rounded-full text-muted-foreground hover:text-primary transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
