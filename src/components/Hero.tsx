// @refresh reset
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { ChevronRight, ChevronLeft, Library, BookOpen, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useLang, locField, type Lang } from "@/context/LanguageContext";
import type { Book } from "@/types/database";

// ── Constants ─────────────────────────────────────────────────────────────────
const INTERVAL_MS   = 5000;
const CARD_W_DESK   = 76;
const CARD_W_MOB    = 60;

// ── Resolve cover URL ─────────────────────────────────────────────────────────
const getImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base}/storage/v1/object/public/${url}`;
};

// ── Background image import ───────────────────────────────────────────────────
let heroBgUrl: string | undefined;
try { heroBgUrl = new URL("@/assets/hero/hero-bg7.png", import.meta.url).href; } catch { heroBgUrl = undefined; }

// ── Background layer (100% VIBRANT - NO WHITE EFFECT) ─────────────────────────
const Background = ({ glowColor }: { glowColor: string }) => (
  <>
    {/* Full vibrancy painting */}
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700"
      style={{
        backgroundImage: heroBgUrl ? `url(${heroBgUrl})` : undefined,
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
        opacity: 1, 
      }}
    />
    
    {/* Adjustable White Effect for Light Mode + Dark Overlay for Dark Mode */}
    <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.5)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(10,20,40,0.6)_0%,rgba(0,5,15,0.95)_100%)] transition-colors duration-700" />
    
    {/* Dynamic Book Glow - localized behind the book */}
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0"
      style={{ background: `radial-gradient(ellipse at 25% 45%, ${glowColor}30 0%, transparent 50%)`, mixBlendMode: "overlay" }} />
  </>
);

// ── Typewriter Headline (MOBILE STACKING FIX) ─────────────────────────────────
const TypewriterHeadline = ({ text }: { text: string }) => {
  const reduced = useReducedMotion();
  const words    = text.trim().split(" ");
  const CHAR_STAGGER = reduced ? 0 : 0.04;
  const CHAR_FADE    = reduced ? 0 : 0.03;

  return (
    <div className="relative w-full flex justify-center lg:justify-start">
      <motion.h1
  className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight text-foreground tracking-tight drop-shadow-[0_2px_15px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] text-center lg:text-left"
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: CHAR_STAGGER } } }}
      >
        {words.map((word, wIndex) => {
          const isLast = wIndex === words.length - 1;
          return (
            // CRITICAL FIX: "block" on mobile forces each word to its own line perfectly. "sm:inline-block" returns it to a normal row on desktop.
            <span key={`w-${wIndex}`} className="block sm:inline-block sm:mr-3 lg:mr-4">
              {word.split("").map((char, i) => (
                <motion.span 
                  key={`c-${i}`} 
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: CHAR_FADE } } }} 
                  style={{ display: "inline-block" }}
                  className={isLast ? "text-gold-gradient drop-shadow-sm leading-snug py-1" : ""}
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
    let startTime: number | null = null; let raf: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / 1500, 1);
      setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * target));
      if (progress < 1) raf = requestAnimationFrame(step); else setCount(target);
    };
    const timeout = setTimeout(() => { raf = requestAnimationFrame(step); }, 600);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, reduced]);
  return <>{count}</>;
};

// // ── Unified Horizontal Stats & CTA Band ───────────────────────────────────────
const CtaStatsBand = ({ onNavigate }: { onNavigate: () => void }) => {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 mt-5 w-full xl:w-auto"
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
    >
      <div className="flex items-center justify-between sm:justify-center rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/95 dark:bg-amber-950/95 backdrop-blur-xl py-3 px-6 sm:px-8 shadow-md w-[90%] max-w-[320px] sm:w-auto sm:max-w-none">
        
        <div className="flex flex-col items-center text-center sm:pr-5">
          {/* Increased mobile text from text-2xl to text-3xl */}
          <p className="font-serif font-bold leading-none text-3xl sm:text-4xl bg-gradient-to-br from-amber-500 to-amber-700 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">
            <AnimatedNumber target={7} /><span className="text-xl sm:text-2xl"> Yillik</span>
          </p>
          {/* Increased label size slightly */}
          <p className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-amber-800/80 dark:text-amber-400/80 mt-1.5">Faoliyat</p>
        </div>

        <div className="w-px h-10 bg-amber-300/60 dark:bg-amber-700/60 mx-4 sm:mx-0" />
        
        <div className="flex flex-col items-center text-center sm:pl-5">
          {/* Increased mobile text from text-2xl to text-3xl */}
          <p className="font-serif font-bold leading-none text-3xl sm:text-4xl bg-gradient-to-br from-amber-500 to-amber-700 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">
            <AnimatedNumber target={150} /><span className="text-xl sm:text-2xl">+</span>
          </p>
          {/* Increased label size slightly */}
          <p className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-amber-800/80 dark:text-amber-400/80 mt-1.5">Sara Kitoblar</p>
        </div>

      </div>

      <motion.button onClick={onNavigate} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl border border-amber-300/80 dark:border-amber-700/60 bg-white/60 dark:bg-black/50 backdrop-blur-xl hover:bg-amber-500 hover:border-amber-500 px-8 py-3.5 sm:py-4 text-sm font-semibold text-foreground transition-all shadow-md w-[90%] max-w-[320px] sm:w-auto sm:max-w-none"
      >
        <Library className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:text-black transition-colors" />
        <span className="font-sans tracking-wide group-hover:text-black transition-colors">Barcha kitoblarni ko'rish</span>
        <ChevronRight className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
      </motion.button>
    </motion.div>
  );
};

// ── Active book Showcase (STRONG CAPTION & RESPONSIVE PROPORTIONS) ────────────
const ActiveBookShowcase = ({ book, lang, onClick }: { book: Book; lang: Lang; onClick: () => void }) => {
  const imgSrc = getImageUrl(book.cover_url);
  const glow   = `hsl(${book.bg_color ?? "40 65% 30%"})`;

  return (
    <motion.div
      key={book.id}
      className="absolute inset-0 cursor-pointer select-none flex flex-col items-center justify-start pt-2"
      initial={{ opacity: 0, scale: 0.7, rotateY: -30, y: 50, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.8, rotateY: 20, y: -40, filter: "blur(4px)" }}
      transition={{ type: "spring", stiffness: 90, damping: 18, mass: 1.1 }}
      onClick={onClick}
    >
      <motion.div className="relative w-full flex items-center justify-center mb-3 sm:mb-4"
        animate={{ y: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
        
        <div className="absolute pointer-events-none rounded-full blur-[25px]"
          style={{ width: "80%", height: "80%", background: `radial-gradient(circle, ${glow}50 0%, transparent 70%)` }} />

        {/* 3D Cover - Slightly smaller on mobile to avoid crushing text */}
        <motion.div className="relative w-[150px] sm:w-[200px] lg:w-[240px] aspect-[2/3] rounded-[6px] sm:rounded-[10px] z-20 overflow-hidden"
          style={{ boxShadow: `0 20px 40px -12px ${glow}99, 0 10px 20px -8px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.2)` }}
          whileHover={{ scale: 1.05, rotateY: -5, rotateX: 2 }}
        >
          {imgSrc ? <img src={imgSrc} alt={locField(book, "title", lang)} className="w-full h-full object-cover rounded-[6px] sm:rounded-[10px]" draggable={false} /> : <div className="w-full h-full bg-neutral-800 rounded-[6px] sm:rounded-[10px]" />}
          
          <motion.div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent mix-blend-overlay pointer-events-none"
            initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }} />
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-transparent to-black/25 pointer-events-none" />
        </motion.div>

        <div className="absolute z-30 top-[2%] right-[2%] sm:right-[5%] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-primary-foreground bg-gradient-to-br from-primary to-primary/80 shadow-md">
          Tanlangan
        </div>
      </motion.div>
      
      {/* PERFECT VISIBILITY CAPTION: Same background texture as Stats Box */}
      <motion.div 
         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
         className="text-center px-4 py-2 sm:px-6 sm:py-3 w-max max-w-[95%] mx-auto rounded-xl backdrop-blur-xl bg-amber-50/95 dark:bg-amber-950/95 border border-amber-200/60 dark:border-amber-800/60 shadow-lg z-30"
      >
        <h2 className="font-serif text-sm sm:text-xl font-bold text-foreground leading-tight line-clamp-1 drop-shadow-sm">
            {locField(book, "title", lang)}
        </h2>
        <p className="mt-0.5 font-sans text-[9px] sm:text-[10px] tracking-widest uppercase text-amber-600 dark:text-amber-500 font-bold line-clamp-1">
            {locField(book, "author", lang)}
        </p>
      </motion.div>
    </motion.div>
  );
};

// ── Book info panel (UPGRADED: Subtitle is now a clear, designed block) ───────
const BookInfoPanel = ({
  motto, subtitle, onNavigate
}: {
  motto: string; subtitle: string; onNavigate: () => void;
}) => {
  
  // Smart formatter: Makes "Zabarjad Media" bold and turns the dash gold
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
          <span className="text-amber-500 font-bold mx-1.5">—</span>
          <span className="text-foreground/90 font-medium">{rest}</span>
        </>
      );
    }
    return <span className="text-foreground/90 font-medium">{text}</span>;
  };

  return (
    <div className="flex flex-col items-center lg:items-start justify-center flex-1 min-w-0 w-full pt-0 lg:pt-2 z-20">
      <TypewriterHeadline text={motto} />
      
      {/* EDITORIAL SUBTITLE: Enclosed in a frosted box to guarantee visibility on any painting */}
      <motion.div
        className="relative mt-4 sm:mt-6 mb-2 max-w-xl"
        initial={{ opacity: 0, x: -15 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 rounded-l-xl shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
        <div className="pl-4">
           <p className="text-sm sm:text-base lg:text-lg leading-relaxed bg-amber-50/95 dark:bg-amber-950/95 backdrop-blur-xl rounded-r-xl rounded-l-sm py-3 sm:py-4 px-5 shadow-md border border-amber-200/50 dark:border-amber-800/50">
             {formatSubtitle(subtitle)}
           </p>
        </div>
      </motion.div>

      <CtaStatsBand onNavigate={onNavigate} />
    </div>
  );
};

// ── Mini shelf carousel ───────────────────────────────────────────────────────
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
    <motion.button whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }} whileTap={{ scale: 0.9 }} onClick={onPrev}
      className="p-1.5 rounded-full text-foreground/70 transition-colors focus:outline-none shrink-0 hidden sm:flex backdrop-blur-sm">
      <ChevronLeft className="h-6 w-6" />
    </motion.button>

    <div className="flex items-end gap-2.5 sm:gap-3 overflow-x-auto flex-1 justify-start sm:justify-center py-4 px-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {books.map((book, i) => {
        const isActive = i === activeIndex;
        const imgSrc   = getImageUrl(book.cover_url);
        const diff     = Math.abs(i - activeIndex);
        
        return (
          <motion.button key={book.id} onClick={() => onSelect(i)} aria-label={locField(book, "title", lang)}
            className="relative overflow-hidden rounded-[5px] focus:outline-none shrink-0 cursor-pointer snap-center group"
            whileHover={!isActive ? { scale: 1.08, y: -4, filter: "grayscale(0%)" } : {}}
            animate={{ 
              scale: isActive ? 1.15 : Math.max(0.75, 1 - diff * 0.08), 
              opacity: isActive ? 1 : Math.max(0.5, 1 - diff * 0.15), 
              y: isActive ? -6 : 0,
              filter: isActive ? "grayscale(0%)" : "grayscale(40%)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            style={{ width: `${cardWidth}px`, aspectRatio: "2/3", boxShadow: isActive ? "0 10px 20px rgba(0,0,0,0.3)" : "0 4px 8px rgba(0,0,0,0.2)" }}
          >
            {imgSrc ? <img src={imgSrc} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" draggable={false} /> : <div className="w-full h-full bg-neutral-800" />}
            {!isActive && <div className="absolute inset-0 ring-2 ring-primary/0 group-hover:ring-primary/40 transition-all rounded-[5px]" />}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/40 overflow-hidden">
                <motion.div className="h-full bg-primary" key={`prog-${activeIndex}`} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={isPaused ? { duration: 0 } : { duration: duration / 1000, ease: "linear" }} />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>

    <motion.button whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }} whileTap={{ scale: 0.9 }} onClick={onNext}
      className="p-1.5 rounded-full text-foreground/70 transition-colors focus:outline-none shrink-0 hidden sm:flex backdrop-blur-sm">
      <ChevronRight className="h-6 w-6" />
    </motion.button>
  </div>
)};

// ── Safarni boshlash scroll CTA (BROUGHT BACK TO MOBILE AND FIXED) ─────────────
const ScrollCta = () => {
  const handleClick = () => {
    const hero = document.getElementById("hero");
    const target = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <motion.div className="w-full flex flex-col items-center gap-3 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 0.7 }}>
      <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-transparent to-primary/50" />
      <motion.button onClick={handleClick}
        className="group flex flex-col items-center justify-center gap-1.5 px-6 py-2.5 rounded-full focus:outline-none backdrop-blur-xl bg-white/50 dark:bg-black/40 border border-white/40 dark:border-white/20 shadow-md"
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.7)" }} whileTap={{ scale: 0.97 }} aria-label="Safarni boshlash"
      >
        <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/90 group-hover:text-amber-600 transition-colors">
          Kashf etish
        </span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/70 group-hover:text-amber-600 transition-colors" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

// ── Main Hero (FULL VIEWPORT FIX: justify-between) ────────────────────────────
const Hero = () => {
  const { books, siteSettings, loading } = useData();
  const { lang } = useLang();
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused,    setIsPaused]    = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const displayBooks: Book[] = (
    books.filter((b) => b.featured === true).length > 0 ? books.filter((b) => b.featured === true) : books
  ).slice(0, 7);

  const total = displayBooks.length;
  const advance = useCallback((dir: 1 | -1) => setActiveIndex((p) => (p + dir + total) % total), [total]);

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

  const handleBookClick = useCallback((book: Book) => navigate(`/book/${book.id}`), [navigate]);

  const activeBook = displayBooks[activeIndex] ?? null;
  const glowColor  = `hsl(${activeBook?.bg_color ?? "40 65% 30%"})`;

  if (loading) return null;

  return (
    // FULL VIEWPORT HEIGHT: justify-between pushes the main content to center and ScrollCta exactly to bottom
    <section id="hero" className="relative min-h-[100svh] flex flex-col justify-between section-padding pt-24 lg:pt-28 pb-6 overflow-hidden bg-background">
      <Background glowColor={glowColor} />

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-2 sm:gap-8 lg:gap-12 mt-2 flex-1">

        {/* LEFT — Active book showcase (LOCKED HEIGHT FOR MOBILE) */}
        <div
          className="relative flex flex-col items-center justify-start shrink-0 w-full lg:w-[320px]"
          style={{ height: "clamp(300px, 35vh, 440px)" }} // Strict container stops crushing
          onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence>
            {activeBook && (
              <ActiveBookShowcase key={activeBook.id} book={activeBook} lang={lang} onClick={() => handleBookClick(activeBook)} />
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT — Info + controls column */}
        <div className="flex flex-col justify-start flex-1 min-w-0 w-full z-20">
          
          <BookInfoPanel
            motto={siteSettings.hero.motto} subtitle={siteSettings.hero.subtitle}
            onNavigate={() => navigate("/library")}
          />

          {/* Carousel */}
          {total > 1 && (
            <div className="w-full" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                <MiniShelf books={displayBooks} activeIndex={activeIndex} total={total} duration={INTERVAL_MS} isPaused={isPaused} onSelect={selectBook} onPrev={() => manualNav(-1)} onNext={() => manualNav(1)} lang={lang} />
            </div>
          )}

        </div>
      </div>

      {/* Kashf Etish Button (Restored to mobile view, pushed to absolute bottom) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-center">
        <ScrollCta />
      </div>
    </section>
  );
};

export default Hero;