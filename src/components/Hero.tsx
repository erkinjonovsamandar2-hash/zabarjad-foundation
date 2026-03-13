// @refresh reset
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, ChevronLeft, Library, BookOpen, ChevronDown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useLang, locField, type Lang } from "@/context/LanguageContext";
import type { Book } from "@/types/database";

// ── Constants ─────────────────────────────────────────────────────────────────
const INTERVAL_MS = 5000;
const CARD_W_DESK = 76;
const CARD_W_MOB = 60;

import heroBg from "@/assets/hero/hero-bg7.png";

// ── Resolve cover URL ─────────────────────────────────────────────────────────
const getImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base}/storage/v1/object/public/${url}`;
};

// ── Background layer ──────────────────────────────────────────────────────────
const Background = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Base Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
      style={{ backgroundImage: `url(${heroBg})` }}
    />

    {/* FIXED: removed mix-blend-overlay which was fighting theme colors. Removed backdrop-blur for scroll perf */}
    <div className="absolute inset-0 bg-background/50 z-0 transition-colors duration-500" />

    {/* FIXED: removed dark:opacity-10 — single opacity value, theme controls the color via --primary */}
    <div
      className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full opacity-20 blur-[120px] mix-blend-multiply"
      style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
    />

    {/* FIXED: hardcoded #fff → hsl(var(--background)) so it responds to theme */}
    <div
      className="absolute top-[20%] -right-[15%] w-[90vw] h-[90vw] rounded-full opacity-30 blur-[140px] mix-blend-overlay"
      style={{ background: "radial-gradient(circle, hsl(var(--background)) 0%, transparent 60%)" }}
    />

    {/* Subtle paper-like grain */}
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/felt.png')] mix-blend-multiply" />

    {/* FIXED: removed dark: variant — single unified vignette that works for all themes */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.08)_100%)]" />
  </div>
);

// ── Typewriter Headline ───────────────────────────────────────────────────────
const TypewriterHeadline = ({ text }: { text: string }) => {
  const reduced = useReducedMotion();
  const words = text.trim().split(" ");
  const CHAR_STAGGER = reduced ? 0 : 0.04;
  const CHAR_FADE = reduced ? 0 : 0.03;

  return (
    <div className="relative w-full flex justify-center lg:justify-start">
      <motion.h1
        className="text-5xl sm:text-6xl lg:text-7xl font-heading leading-[1.05] text-foreground tracking-wide text-center lg:text-left drop-shadow-sm text-balance max-w-2xl mx-auto lg:mx-0 will-change-transform"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: CHAR_STAGGER } } }}
      >
        {words.map((word, wIndex) => {
          // FIXED: was `wIndex === words.length - 1` (only last word highlighted)
          // Now highlights the last TWO words ("yangi" and "olam")
          const isHighlighted = wIndex >= words.length - 2;

          return (
            <span key={`w-${wIndex}`} className="block sm:inline-block sm:mr-3 lg:mr-4">
              {word.split("").map((char, i) => (
                <motion.span
                  key={`c-${i}`}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: CHAR_FADE } },
                  }}
                  style={{ display: "inline-block" }}
                  // FIXED: was `isLast ? "text-primary italic" : ""`
                  // Removed italic — keeps typography strong and uniform
                  className={isHighlighted ? "text-primary" : ""}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          );
        })}
      </motion.h1>
    </div>
  );
};

// ── Animated Number ───────────────────────────────────────────────────────────
const AnimatedNumber = ({ target }: { target: number }) => {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) { setCount(target); return; }
    let startTime: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / 1500, 1);
      setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * target));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setCount(target);
    };
    const timeout = setTimeout(() => { raf = requestAnimationFrame(step); }, 600);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, reduced]);

  return <>{count}</>;
};

// ── Unified Horizontal Stats & CTA Band ──────────────────────────────────────
const CtaStatsBand = ({ onNavigate }: { onNavigate: () => void }) => {
  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center sm:items-stretch gap-5 mt-8 w-full xl:w-auto"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      {/* $8k UI Glassmorphism */}
      <div className="flex items-center justify-between sm:justify-center rounded-2xl border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-md py-3.5 px-6 sm:px-10 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-[480px] sm:w-auto transition-colors duration-500 ease-out gap-4 sm:gap-6">

        <div className="flex flex-col items-center text-center">
          <p className="font-heading text-3xl sm:text-4xl text-foreground">
            2<span className="text-xl italic"> Yillik</span>
          </p>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold mt-1 font-bold">Faoliyat</p>
        </div>

        <div className="w-px h-12 bg-border mx-2 sm:mx-0" />

        <div className="flex flex-col items-center text-center">
          <p className="font-heading text-3xl sm:text-4xl text-foreground">
            20<span className="text-xl italic">+</span>
          </p>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold mt-1 font-bold">Sara Kitoblar</p>
        </div>

        <div className="w-px h-12 bg-border mx-2 sm:mx-0" />

        <div className="flex flex-col items-center text-center">
          <p className="font-heading text-3xl sm:text-4xl text-foreground">
            5000<span className="text-xl italic">+</span>
          </p>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold mt-1 font-bold">Kitobxonlar</p>
        </div>

      </div>

      <motion.button
        onClick={onNavigate}
        whileTap={{ scale: 0.985 }}
        className="btn-glass text-white dark:text-white w-full max-w-[360px] sm:w-auto px-10 py-4 font-sans font-bold text-[11px] sm:text-[13px] tracking-[0.2em] uppercase transition-all duration-500 ease-out z-10 rounded-2xl"
      >
        <Library className="h-4 w-4" />
        <span className="font-sans font-bold text-[11px] sm:text-[13px] tracking-[0.2em] uppercase">KOLLEKSIYANI KO'RISH</span>
        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
      </motion.button>
    </motion.div>
  );
};

// ── Active Book Showcase ──────────────────────────────────────────────────────
const ActiveBookShowcase = ({
  book, lang, onClick,
}: {
  book: Book; lang: Lang; onClick: () => void;
}) => {
  const imgSrc = getImageUrl(book.cover_url);
  const glow = `hsl(${book.bg_color ?? "207 48% 51%"})`;

  return (
    <motion.div
      key={book.id}
      className="absolute inset-0 cursor-pointer select-none flex flex-col items-center justify-start pt-2 will-change-transform"
      initial={{ opacity: 0, scale: 0.7, rotateY: -30, y: 50 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotateY: 20, y: -40 }}
      transition={{ type: "spring", stiffness: 90, damping: 18, mass: 1.1 }}
      onClick={onClick}
    >
      <div className="relative w-full flex items-center justify-center mb-3 sm:mb-4">
        {/* Relative wrapper matches the book's dimensions exactly */}
        <div className="relative w-[150px] sm:w-[200px] lg:w-[240px] aspect-[2/3] z-20">

          {/* Glow locked to cover boundary */}
          <div
            className="absolute inset-[-15%] z-0 pointer-events-none rounded-full blur-[25px] sm:blur-[35px]"
            style={{ background: `radial-gradient(circle, ${glow}60 0%, transparent 60%)` }}
          />

          {/* 3D Cover */}
          <motion.div
            className="relative z-10 w-full h-full rounded-[6px] sm:rounded-[10px] overflow-hidden will-change-transform"
            style={{
              boxShadow: `0 20px 40px -12px ${glow}99, 0 10px 20px -8px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.2)`,
            }}
            whileHover={{ scale: 1.05, rotateY: -5, rotateX: 2 }}
          >
            {imgSrc
              ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="w-full h-full bg-muted aspect-[2/3]"
                >
                  <img src={imgSrc} alt={locField(book, "title", lang)} className="w-full h-full object-cover" draggable={false} />
                </motion.div>
              )
              : <div className="w-full h-full bg-muted aspect-[2/3]" />
            }
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent mix-blend-overlay pointer-events-none"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            />
            <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-transparent to-black/25 pointer-events-none" />
          </motion.div>

          {/* Star badge — locked to top-right corner of cover wrapper */}
          <div className="absolute -top-3 -right-3 z-30 w-8 h-8 sm:w-10 sm:h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg border-2 border-background">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center px-4 py-2 sm:px-6 sm:py-3 w-max max-w-[95%] mx-auto rounded-xl backdrop-blur-xl bg-background/95 border border-border/50 shadow-lg z-30"
      >
        <h2 className="font-serif font-bold text-lg sm:text-2xl text-foreground leading-tight tracking-wide line-clamp-2">
          {locField(book, "title", lang)}
        </h2>
        <p className="mt-1 font-sans font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase text-gold line-clamp-1">
          {locField(book, "author", lang)}
        </p>
      </motion.div>
    </motion.div>
  );
};

// ── Book Info Panel ───────────────────────────────────────────────────────────
const BookInfoPanel = ({
  motto, subtitle, onNavigate,
}: {
  motto: string; subtitle: string; onNavigate: () => void;
}) => {
  const formatSubtitle = (text?: string) => {
    if (!text) return null;
    const separator = text.includes(" — ") ? " — " : text.includes(" - ") ? " - " : null;
    if (separator) {
      const parts = text.split(separator);
      const brand = parts.shift();
      const rest = parts.join(separator);
      return (
        <>
          <strong className="font-bold text-foreground">{brand}</strong>
          <span className="text-gold font-bold mx-1.5">—</span>
          <span className="text-foreground/90 font-medium">{rest}</span>
        </>
      );
    }
    return <span className="text-foreground/90 font-medium">{text}</span>;
  };

  return (
    <div className="flex flex-col items-center lg:items-start justify-center flex-1 min-w-0 w-full pt-0 lg:pt-2 z-20">
      <TypewriterHeadline text={motto} />

      {/* EDITORIAL SUBTITLE */}
      <motion.div
        className="relative mt-4 sm:mt-6 mb-2 max-w-xl"
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gold rounded-l-xl shadow-[0_0_10px_rgba(213,173,54,0.4)]" />
        <div className="pl-4">
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-r-xl rounded-l-sm py-3 sm:py-4 px-5 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/60 dark:border-white/10 transition-colors duration-500 ease-out">
            {formatSubtitle(subtitle)}
          </p>
        </div>
      </motion.div>

      <CtaStatsBand onNavigate={onNavigate} />
    </div>
  );
};

// ── Mini Shelf Carousel ───────────────────────────────────────────────────────
const MiniShelf = ({
  books, activeIndex, total, duration, isPaused, onSelect, onPrev, onNext, lang,
}: {
  books: Book[]; activeIndex: number; total: number; duration: number;
  isPaused: boolean; onSelect: (i: number) => void;
  onPrev: () => void; onNext: () => void; lang: Lang;
}) => {
  const cardWidth = window.innerWidth < 640 ? CARD_W_MOB : CARD_W_DESK;

  return (
    <div className="flex items-center gap-1 sm:gap-3 mt-6 sm:mt-8 w-full max-w-2xl px-1 sm:px-0">
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrev}
        className="p-1.5 rounded-full text-foreground/70 transition-colors focus:outline-none shrink-0 hidden sm:flex backdrop-blur-sm"
      >
        <ChevronLeft className="h-6 w-6" />
      </motion.button>

      <div className="flex items-end gap-2.5 sm:gap-3 overflow-x-auto flex-1 justify-start sm:justify-center py-4 px-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {books.map((book, i) => {
          const isActive = i === activeIndex;
          const imgSrc = getImageUrl(book.cover_url);
          const diff = Math.abs(i - activeIndex);

          return (
            <motion.button
              key={book.id}
              onClick={() => onSelect(i)}
              aria-label={locField(book, "title", lang)}
              className="relative overflow-hidden rounded-[5px] focus:outline-none shrink-0 cursor-pointer snap-center group will-change-transform"
              whileHover={!isActive ? { scale: 1.08, y: -4, filter: "grayscale(0%)" } : {}}
              animate={{
                scale: isActive ? 1.15 : Math.max(0.75, 1 - diff * 0.08),
                opacity: isActive ? 1 : Math.max(0.5, 1 - diff * 0.15),
                y: isActive ? -6 : 0,
                filter: isActive ? "grayscale(0%)" : "grayscale(40%)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={{
                width: `${cardWidth}px`,
                aspectRatio: "2/3",
                boxShadow: isActive
                  ? "0 10px 20px rgba(0,0,0,0.3)"
                  : "0 4px 8px rgba(0,0,0,0.2)",
              }}
            >
              {imgSrc
                ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.1, margin: "50px" }}
                    transition={{ duration: 1.2 }}
                    className="w-full h-full bg-muted aspect-[2/3] transform-gpu"
                  >
                    <img src={imgSrc} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" draggable={false} />
                  </motion.div>
                )
                : <div className="w-full h-full bg-muted aspect-[2/3]" />
              }
              {!isActive && (
                <div className="absolute inset-0 ring-2 ring-primary/0 group-hover:ring-primary/40 transition-all rounded-[5px]" />
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/40 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    key={`prog-${activeIndex}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={
                      isPaused
                        ? { duration: 0 }
                        : { duration: duration / 1000, ease: "linear" }
                    }
                  />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        className="p-1.5 rounded-full text-foreground/70 transition-colors focus:outline-none shrink-0 hidden sm:flex backdrop-blur-sm"
      >
        <ChevronRight className="h-6 w-6" />
      </motion.button>
    </div>
  );
};

// ── Scroll CTA ────────────────────────────────────────────────────────────────
const ScrollCta = () => {
  const handleClick = () => {
    const hero = document.getElementById("hero");
    const target = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <motion.div
      className="w-full flex flex-col items-center gap-3 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4, duration: 0.7 }}
    >
      <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-transparent to-primary/50" />
      <button
        onClick={handleClick}
        className="group flex flex-col items-center justify-center gap-1.5 px-6 py-2.5 rounded-full focus:outline-none backdrop-blur-md bg-white/40 dark:bg-black/20 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-colors duration-500 ease-out"
        aria-label="Safarni boshlash"
      >
        <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] text-foreground group-hover:text-gold transition-colors">
          Kashf etish
        </span>
        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/70 group-hover:text-gold transition-colors mt-1" />
      </button>
    </motion.div>
  );
};

// ── Main Hero ─────────────────────────────────────────────────────────────────
const Hero = () => {
  const { books, siteSettings, loading } = useData();
  const { lang } = useLang();
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const displayBooks: Book[] = (
    books.filter((b) => b.featured === true).length > 0
      ? books.filter((b) => b.featured === true)
      : books
  ).slice(0, 7);

  const total = displayBooks.length;
  const advance = useCallback(
    (dir: 1 | -1) => setActiveIndex((p) => (p + dir + total) % total),
    [total]
  );

  useEffect(() => {
    if (isPaused || total < 2) return;
    timerRef.current = setInterval(() => advance(1), INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, advance, total]);

  const manualNav = useCallback((dir: 1 | -1) => {
    if (timerRef.current) clearInterval(timerRef.current);
    advance(dir);
  }, [advance]);

  const selectBook = useCallback((i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveIndex(i);
  }, []);

  const handleBookClick = useCallback(
    (book: Book) => navigate(`/book/${book.id}`),
    [navigate]
  );

  const activeBook = displayBooks[activeIndex] ?? null;

  if (loading) {
    return (
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-background overflow-hidden p-6 space-y-12 pt-24 text-center">
        <div className="w-full max-w-2xl mx-auto space-y-4">
          <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-3/4 mx-auto h-16 bg-muted/60 rounded-xl" />
          <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1/2 mx-auto h-8 bg-muted/60 rounded-lg" />
        </div>
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          {[1, 2, 3].map((i) => (
            <motion.div key={i} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} className="w-32 sm:w-48 lg:w-56 aspect-[2/3] bg-muted/80 rounded-2xl shadow-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    // FIXED: removed any hardcoded bg classes — bg-background + text-foreground picks up theme-N
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-between section-padding pt-24 lg:pt-28 pb-6 overflow-hidden bg-background text-foreground transition-colors duration-500"
    >
      <Background />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-2 sm:gap-8 lg:gap-12 mt-2 flex-1">

        {/* LEFT — Active book showcase */}
        <div
          className="relative flex flex-col items-center justify-start shrink-0 w-full lg:w-[320px]"
          style={{ height: "clamp(300px, 35vh, 440px)" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence>
            {activeBook && (
              <ActiveBookShowcase
                key={activeBook.id}
                book={activeBook}
                lang={lang}
                onClick={() => handleBookClick(activeBook)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT — Info + controls column */}
        <div className="flex flex-col justify-start flex-1 min-w-0 w-full z-20">
          <BookInfoPanel
            motto={siteSettings.hero.motto || "Kitobsevarlar uchun yangi olam"}
            subtitle={siteSettings.hero.subtitle}
            onNavigate={() => navigate("/library")}
          />

          {total > 1 && (
            <div
              className="w-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <MiniShelf
                books={displayBooks}
                activeIndex={activeIndex}
                total={total}
                duration={INTERVAL_MS}
                isPaused={isPaused}
                onSelect={selectBook}
                onPrev={() => manualNav(-1)}
                onNext={() => manualNav(1)}
                lang={lang}
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-center">
        <ScrollCta />
      </div>
    </section>
  );
};

export default Hero;