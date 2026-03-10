"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import type { Book } from "@/types/database";

import margaritaBg from "../assets/backgrounds/margarita-bg.png";
import edenBg from "../assets/backgrounds/eden-bg.png";
import ascanioBg from "../assets/backgrounds/ascanio-bg.png";
import xukBg from "../assets/backgrounds/xuk-bg.png";

// ── Per-book tension hooks ────────────────────────────────────────────────────
const BOOK_HOOKS = [
  "Shayton Moskvaga kelsa nima bo'ladi? Va u sizning eng yashirin istaklaringizni bilsa?",
  "Sevgi uchun hamma narsadan voz kechgan odam — oxirida nima topadi?",
  "San'at va muhabbat o'rtasida qolgan inson — qaysi birini tanlasa ham, yo'qotadi. U nima qiladi?",
  "Agar yovuzlik inson tabiatining bir qismi bo'lsa — uni 'davolash' mumkinmi, yoki bu erkinlikni o'ldirish demakmi?",
];

const BOOK_BACKGROUNDS = [
  margaritaBg,
  edenBg,
  ascanioBg,
  xukBg,
];

function getHook(book: Book, index: number) {
  return BOOK_HOOKS[index] || book.description || "";
}

const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base}/storage/v1/object/public/${url}`;
};

export default function GlobalClassics() {
  const { books, loading } = useData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const displayBooks = useMemo(() => books.slice(0, 4), [books]);
  const total = displayBooks.length;
  const activeBook = displayBooks[activeIndex];
  const displayIndex = isMobile ? mobileIndex : activeIndex;

  // Next 3 books after active (wrapping) — shown as thumbnails
  const thumbBooks = useMemo(() => {
    if (total <= 1) return [];
    return Array.from({ length: Math.min(3, total - 1) }, (_, i) =>
      displayBooks[(activeIndex + i + 1) % total]
    );
  }, [displayBooks, activeIndex, total]);

  useEffect(() => {
    console.log("GlobalClassics mounted. Total books:", books.length, "Displaying:", displayBooks.length);
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [books.length, displayBooks.length]);

  // ── Mobile Infinite Auto-Scroll ───────────────────────────────────────────
  useEffect(() => {
    if (!isMobile || !mobileScrollRef.current || total === 0) return;
    const scroller = mobileScrollRef.current;
    const delay = mobileIndex === 0 ? 3000 : 6000;
    const timer = setTimeout(() => {
      const isEnd = mobileIndex >= total - 1;
      if (isEnd) {
        scroller.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroller.scrollBy({ left: 344, behavior: "smooth" });
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [mobileIndex, isMobile, total]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const goTo = useCallback(
    (idx: number, dir: number) => {
      if (isAnimating || total === 0) return;
      setDirection(dir);
      setActiveIndex(idx);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);
    },
    [isAnimating, total]
  );

  const handleNext = useCallback(() => {
    if (total === 0) return;
    goTo((activeIndex + 1) % total, 1);
  }, [activeIndex, total, goTo]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    goTo((activeIndex - 1 + total) % total, -1);
  }, [activeIndex, total, goTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (total > 1) timerRef.current = setInterval(handleNext, 6000);
  }, [handleNext, total]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const onNext = () => { handleNext(); resetTimer(); };
  const onPrev = () => { handlePrev(); resetTimer(); };
  const onDot = (i: number) => {
    if (i !== activeIndex) { goTo(i, i > activeIndex ? 1 : -1); resetTimer(); }
  };
  const onThumb = (i: number) => { onDot((activeIndex + i + 1) % total); };

  // ── NavControls ───────────────────────────────────────────────────────────
  const NavControls = () => (
    <>
      <div className="hidden md:flex items-center gap-4">
        {/* Prev */}
        <motion.button
          onClick={onPrev}
          aria-label="Previous book"
          whileHover={{ scale: 1.1, borderColor: "var(--accent)", background: "rgba(229,193,88,0.15)" }}
          whileTap={{ scale: 0.92 }}
          className="w-10 h-10 rounded-full border border-accent/40 bg-transparent flex items-center justify-center text-accent cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
        </motion.button>

        {/* Next */}
        <motion.button
          onClick={onNext}
          aria-label="Next book"
          whileHover={{ scale: 1.1, borderColor: "var(--accent)", background: "rgba(229,193,88,0.15)" }}
          whileTap={{ scale: 0.92 }}
          className="w-10 h-10 rounded-full border border-accent/40 bg-transparent flex items-center justify-center text-accent cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </motion.button>
      </div>

      {/* Clickable dot progress */}
      <div className="flex items-center gap-1.5 ml-2">
        {displayBooks.map((b, i) => (
          <motion.div
            key={b.id}
            onClick={() => onDot(i)}
            animate={{
              width: i === activeIndex ? 20 : 4,
              backgroundColor: i === activeIndex
                ? "var(--accent)"
                : "rgba(255,255,255,0.25)",
            }}
            whileHover={{ opacity: 1, scaleY: 1.4 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-1 rounded-full shrink-0 cursor-pointer"
          />
        ))}
      </div>
    </>
  );

  if (loading || total === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center gap-6 px-6 pt-24 pb-20 bg-background overflow-hidden relative">
        <div className="flex items-center gap-8 w-full max-w-7xl mx-auto justify-between">
          <div className="flex-1 flex flex-col gap-6">
            <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-48 h-10 bg-muted/60 rounded-md" />
            <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-full h-80 bg-muted/60 rounded-2xl" />
          </div>
          <div className="shrink-0 flex justify-center w-[260px] sm:w-[300px] lg:w-[340px]">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-full aspect-[2/3] bg-muted/80 rounded-[14px] shadow-2xl" />
          </div>
          <div className="flex-1 hidden lg:flex flex-col items-end gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div key={i} animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} className="w-[105px] aspect-[2/3] bg-muted/60 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      id="library"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative w-full min-h-screen bg-cover bg-center transition-all duration-1000 ease-in-out overflow-hidden"
      style={{
        backgroundImage: `url(${BOOK_BACKGROUNDS[displayIndex] || BOOK_BACKGROUNDS[0]})`,
      }}
    >
      {/* ── Dark overlay — tones down bg image for readability ── */}
      <div className="absolute inset-0 bg-background/30 dark:bg-black/50 backdrop-blur-[2px] z-0 transition-colors duration-700" />

      {/* ── SECTION TITLE (Displays globally on Top) ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-20 lg:pt-32">
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground tracking-widest text-center lg:text-left w-full relative z-10 mb-2 md:mb-4">
          JAHON KLASSIKLARI
        </h2>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          GOLD PULSE KEYFRAMES
      ══════════════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes goldPulse {
          0%   { box-shadow: 8px 28px 70px rgba(0,0,0,0.80), -2px 0 18px rgba(0,0,0,0.40), 0 0 28px rgba(229,193,88,0.18), 0 0 0px rgba(229,193,88,0); }
          50%  { box-shadow: 8px 28px 70px rgba(0,0,0,0.80), -2px 0 18px rgba(0,0,0,0.40), 0 0 55px rgba(229,193,88,0.52), 0 0 90px rgba(229,193,88,0.18); }
          100% { box-shadow: 8px 28px 70px rgba(0,0,0,0.80), -2px 0 18px rgba(0,0,0,0.40), 0 0 28px rgba(229,193,88,0.18), 0 0 0px rgba(229,193,88,0); }
        }
        @keyframes goldPulseHover {
          0%   { box-shadow: 8px 28px 70px rgba(0,0,0,0.85), -2px 0 18px rgba(0,0,0,0.40), 0 0 70px rgba(229,193,88,0.70), 0 0 120px rgba(229,193,88,0.30); }
          50%  { box-shadow: 8px 28px 70px rgba(0,0,0,0.85), -2px 0 18px rgba(0,0,0,0.40), 0 0 90px rgba(229,193,88,0.90), 0 0 160px rgba(229,193,88,0.45); }
          100% { box-shadow: 8px 28px 70px rgba(0,0,0,0.85), -2px 0 18px rgba(0,0,0,0.40), 0 0 70px rgba(229,193,88,0.70), 0 0 120px rgba(229,193,88,0.30); }
        }
        .hero-cover {
          animation: goldPulse 3.2s ease-in-out infinite;
          cursor: pointer;
        }
        .hero-cover:hover {
          animation: goldPulseHover 1.6s ease-in-out infinite;
          transform: perspective(900px) rotateY(-4deg) rotateX(1deg) scale(1.025) !important;
          filter: brightness(1.08);
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT — strict max-w-7xl flex column
      ══════════════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-24 lg:pb-32 flex flex-col pt-8">

          {/* ── 2. THREE-COLUMN FLEX ROW ── */}
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

            {/* ── LEFT COLUMN: Glass card with text + button ── */}
            <AnimatePresence mode="wait">
              {activeBook && (
                <motion.div
                  key={`text-${activeBook.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 w-full lg:max-w-lg bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col items-start text-left z-10"
                >
                  {/* Genre tag + meta row */}
                  <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                    <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase bg-accent text-accent-foreground rounded-[4px] px-[9px] py-[3px]">
                      {activeBook.category}
                    </span>
                    {activeBook.price && (
                      <span className="font-sans font-bold uppercase text-[11px] text-foreground/45 tracking-[0.2em]">
                        {activeBook.price.toLocaleString()} so'm
                      </span>
                    )}
                  </div>

                  {/* Counter + Author */}
                  <div className="font-sans font-bold text-[11px] sm:text-[13px] uppercase tracking-[0.2em] text-foreground/80 mb-3 flex items-center gap-2">
                    <span>
                      {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </span>
                    <span className="text-foreground/40 text-[0.6rem]">◆</span>
                    <span>{activeBook.author}</span>
                  </div>

                  {/* Book Title */}
                  <h3 className="font-heading text-4xl md:text-5xl text-foreground font-bold mb-4 drop-shadow-md leading-[1.05] tracking-wide">
                    {activeBook.title}
                  </h3>

                  {/* Hook */}
                  {getHook(activeBook, activeIndex) && (
                    <p className="font-serif text-xl md:text-2xl text-foreground/90 italic leading-loose mb-8 drop-shadow-sm">
                      {getHook(activeBook, activeIndex)}
                    </p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-bold text-[11px] sm:text-[13px] tracking-[0.2em] uppercase px-8 py-3.5 rounded-full shadow-[0_10px_25px_-5px_rgba(0,205,254,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(0,205,254,0.5)] hover:scale-105 transition-all duration-500 ease-out border-none"
                  >
                    Batafsil
                    <svg
                      className="w-[13px] h-[13px] shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CENTER COLUMN: Active hero book cover ── */}
            <div className="shrink-0 relative z-30 flex justify-center w-[260px] sm:w-[300px] lg:w-[340px]">
              <AnimatePresence mode="popLayout" custom={direction}>
                {activeBook && (
                  <motion.div
                    key={`hero-${activeBook.id}`}
                    custom={direction}
                    variants={{
                      initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 90 : -90, scale: 0.93 }),
                      animate: { opacity: 1, x: 0, scale: 1 },
                      exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -90 : 90, scale: 0.93 }),
                    }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
                    className="hero-cover relative w-full aspect-[2/3] rounded-[14px] overflow-hidden"
                  >
                    {/* Cover image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${getImageUrl(activeBook.cover_url)})` }}
                    />
                    {/* Cinematic gloss */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-black/30"
                    />
                    {/* Spine shadow */}
                    <div
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 left-0 w-[18px] z-[2] pointer-events-none bg-gradient-to-r from-black/45 to-transparent"
                    />
                    {/* Gold shimmer line */}
                    <div
                      aria-hidden="true"
                      className="absolute top-0 left-0 right-0 h-px z-[3] bg-gradient-to-r from-transparent via-accent/70 to-transparent"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT COLUMN: Thumbnail strip ── */}
            <div className="flex-1 flex-col items-center lg:items-end w-full hidden lg:flex gap-[14px]">
              {thumbBooks.map((book, i) => (
                <motion.div
                  key={`thumb-${book.id}-${i}`}
                  onClick={() => onThumb(i)}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 0.72 - i * 0.18, x: 0 }}
                  whileHover={{
                    opacity: 1,
                    scale: 1.06,
                    boxShadow: "0 14px 34px rgba(0,0,0,0.65), 0 0 0 1px rgba(229,193,88,0.50)",
                  }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
                  className="relative w-[clamp(76px,7.5vw,105px)] aspect-[2/3] rounded-lg overflow-hidden cursor-pointer border border-accent/20 shadow-lg shrink-0"
                  style={{
                    backgroundImage: `url(${getImageUrl(book.cover_url)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Bottom fade + title label */}
                  <div className="absolute bottom-0 left-0 right-0 p-[18px_7px_7px] bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                    <p className="m-0 font-sans text-[8px] font-semibold tracking-[0.06em] text-white/90 uppercase leading-[1.3] line-clamp-2 overflow-hidden">
                      {book.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>{/* end 3-col flex row */}

          {/* ── 3. NAV CONTROLS — below 3-col row ── */}
          <div className="flex items-center gap-4 mt-8">
            <NavControls />
          </div>

        </div>
      )}{/* end desktop layout */}

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE CAROUSEL — unchanged functional logic
      ══════════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <div className="relative z-10 w-full pt-16 pb-16 flex flex-col justify-start min-h-screen">
          <div
            ref={mobileScrollRef}
            onScroll={(e) => {
              const scroller = e.currentTarget;
              const index = Math.round(
                scroller.scrollLeft / (scroller.scrollWidth / total)
              );
              setMobileIndex(index);
            }}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 w-full hide-scrollbar relative z-40 px-[calc(50vw-160px)]"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {displayBooks.map((book, idx) => (
              <div
                key={`mob-${book.id}`}
                className="w-[85vw] max-w-[320px] shrink-0 snap-center flex flex-col items-center justify-start relative px-1 pb-6"
              >
                {/* Cover */}
                <div className="w-[140px] sm:w-[160px] md:w-[260px] shrink-0 mx-auto mb-6 relative z-10">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-accent/30 dark:bg-accent/20 blur-[40px] -z-10 rounded-full pointer-events-none" />
                  <img
                    src={getImageUrl(book.cover_url)}
                    alt={book.title}
                    className="w-full h-auto aspect-[2/3] object-cover rounded-md shadow-2xl relative z-10"
                  />
                </div>

                {/* Info card */}
                <div className="w-full bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-xl p-5 text-center flex flex-col items-center gap-4 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase bg-accent text-accent-foreground rounded px-2 py-1">
                      {book.category}
                    </span>
                    {book.price && (
                      <span className="text-[11px] text-foreground/45 tracking-[0.2em] font-sans font-bold uppercase">
                        {book.price.toLocaleString()} so'm
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-2xl text-foreground font-bold drop-shadow-md leading-tight m-0">
                    {book.title}
                  </h3>

                  {/* Author */}
                  <div className="font-sans font-bold text-xs uppercase tracking-widest text-foreground/80 drop-shadow-sm">
                    {book.author}
                  </div>

                  {/* Hook */}
                  {getHook(book, idx) && (
                    <p className="font-serif text-xl sm:text-2xl italic text-foreground/90 leading-relaxed drop-shadow-sm text-center max-w-3xl mx-auto">
                      {getHook(book, idx)}
                    </p>
                  )}

                  {/* Batafsil button — mobile */}
                  <button className="mt-2 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 py-2 font-sans text-[11px] font-bold tracking-[0.2em] uppercase shadow-[0_10px_25px_-5px_rgba(0,205,254,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(0,205,254,0.5)] transition-all duration-500 ease-out border-none">
                    Batafsil
                    <svg
                      className="w-[12px] h-[12px] shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}{/* end mobile layout */}

    </motion.section>
  );
}