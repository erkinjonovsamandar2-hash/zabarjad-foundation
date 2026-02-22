// @refresh reset
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { ChevronRight, ChevronLeft, Library, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useLang, locField, type Lang } from "@/context/LanguageContext";
import type { Book } from "@/types/database";

// ── Hero asset imports ────────────────────────────────────────────────────────
import imgOpenBook from "@/assets/hero/openbook.png";
import imgInkDrop  from "@/assets/hero/inkdrop.png";

// ── Constants ─────────────────────────────────────────────────────────────────
const INTERVAL_MS   = 3500;
const VISIBLE_RANGE = 2;
const CARD_W        = 120;
const SPACING       = 138;
const SHELF_H       = 230;

// ── Resolve cover URL ─────────────────────────────────────────────────────────
const getImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base}/storage/v1/object/public/${url}`;
};

// ── Floating photo parallax layer ────────────────────────────────────────────
const PhotoParallaxLayer = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => (
  <>
    {/* Open book — large, left side, mid-depth layer */}
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        left:   "2%",
        top:    "18%",
        width:  "clamp(180px, 18vw, 280px)",
        zIndex: 1,
      }}
      initial={{ opacity: 0, x: -30, y: 20 }}
      animate={{
        opacity: 1,
        x: mouseX * -28,
        y: mouseY * -28,
      }}
      transition={{ opacity: { delay: 0.6, duration: 1.1 }, x: { type: "spring", stiffness: 45, damping: 18 }, y: { type: "spring", stiffness: 45, damping: 18 } }}
    >
      <img
        src={imgOpenBook}
        alt=""
        className="w-full h-auto select-none"
        style={{
          opacity: 0.13,
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.45)) drop-shadow(0 4px 12px rgba(139,105,20,0.3))",
          transform: "rotate(-8deg)",
          mixBlendMode: "luminosity",
        }}
        draggable={false}
      />
    </motion.div>

    {/* Ink drop — small, upper right, fastest parallax (closest to viewer) */}
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        right:  "4%",
        top:    "8%",
        width:  "clamp(90px, 9vw, 140px)",
        zIndex: 2,
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: 1,
        x: mouseX * 42,
        y: mouseY * 42,
      }}
      transition={{ opacity: { delay: 0.9, duration: 1.0 }, x: { type: "spring", stiffness: 35, damping: 14 }, y: { type: "spring", stiffness: 35, damping: 14 } }}
    >
      <img
        src={imgInkDrop}
        alt=""
        className="w-full h-auto select-none"
        style={{
          opacity: 0.18,
          filter: "drop-shadow(0 8px 24px rgba(139,105,20,0.5)) drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
          transform: "rotate(12deg)",
          mixBlendMode: "luminosity",
        }}
        draggable={false}
      />
    </motion.div>

  </>
);

// ── Paper grain + endpaper background ────────────────────────────────────────
const AtmosphericBackground = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => (
  <>
    {/* SVG grain filter definition */}
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>
    </svg>

    {/* Grain overlay */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.025] dark:opacity-[0.04]"
      style={{ filter: "url(#hero-grain)", background: "#7a5a10" }}
    />

    {/* Endpaper top-left — motion.animate drives the parallax so React re-renders update it */}
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 w-64 h-64 opacity-[0.055] dark:opacity-[0.08]"
      animate={{ x: mouseX * -20, y: mouseY * -20 }}
      transition={{ type: "spring", stiffness: 55, damping: 18, mass: 1.1 }}
    >
      <svg viewBox="0 0 200 200" fill="none">
        <path d="M0 0 Q100 0 100 100 Q100 0 200 0" stroke="#8B6914" strokeWidth="0.8" fill="none"/>
        <path d="M0 0 Q80 0 80 80 Q80 0 160 0" stroke="#8B6914" strokeWidth="0.6" fill="none"/>
        <path d="M0 0 Q55 0 55 55 Q55 0 110 0" stroke="#8B6914" strokeWidth="0.5" fill="none"/>
        <circle cx="0" cy="0" r="130" stroke="#8B6914" strokeWidth="0.4" fill="none" strokeDasharray="4 9"/>
        <circle cx="0" cy="0" r="100" stroke="#8B6914" strokeWidth="0.3" fill="none" strokeDasharray="2 7"/>
        <line x1="35" y1="0" x2="0" y2="35" stroke="#8B6914" strokeWidth="0.4"/>
        <line x1="70" y1="0" x2="0" y2="70" stroke="#8B6914" strokeWidth="0.3"/>
        <line x1="110" y1="0" x2="0" y2="110" stroke="#8B6914" strokeWidth="0.25"/>
      </svg>
    </motion.div>

    {/* Endpaper bottom-right */}
    <motion.div
      aria-hidden
      className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 opacity-[0.045] dark:opacity-[0.065]"
      animate={{ x: mouseX * 20, y: mouseY * 20, rotate: 180 }}
      transition={{ type: "spring", stiffness: 55, damping: 18, mass: 1.1 }}
    >
      <svg viewBox="0 0 200 200" fill="none">
        <path d="M0 0 Q100 0 100 100 Q100 0 200 0" stroke="#8B6914" strokeWidth="0.8" fill="none"/>
        <path d="M0 0 Q80 0 80 80 Q80 0 160 0" stroke="#8B6914" strokeWidth="0.6" fill="none"/>
        <circle cx="0" cy="0" r="130" stroke="#8B6914" strokeWidth="0.4" fill="none" strokeDasharray="4 9"/>
        <line x1="35" y1="0" x2="0" y2="35" stroke="#8B6914" strokeWidth="0.4"/>
        <line x1="70" y1="0" x2="0" y2="70" stroke="#8B6914" strokeWidth="0.3"/>
      </svg>
    </motion.div>

    {/* Floating compass/astrolabe mid-left — faster parallax layer for depth */}
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-[7%] top-[35%] w-52 h-52 opacity-[0.03] dark:opacity-[0.055]"
      animate={{ x: mouseX * -32, y: mouseY * -32 }}
      transition={{ type: "spring", stiffness: 38, damping: 16, mass: 1.4 }}
    >
      <svg viewBox="0 0 160 160" fill="none">
        <circle cx="80" cy="80" r="74" stroke="#8B6914" strokeWidth="0.5" strokeDasharray="3 8"/>
        <circle cx="80" cy="80" r="54" stroke="#8B6914" strokeWidth="0.4" strokeDasharray="2 6"/>
        <circle cx="80" cy="80" r="34" stroke="#8B6914" strokeWidth="0.3"/>
        <line x1="80" y1="6" x2="80" y2="154" stroke="#8B6914" strokeWidth="0.3"/>
        <line x1="6" y1="80" x2="154" y2="80" stroke="#8B6914" strokeWidth="0.3"/>
        <line x1="27" y1="27" x2="133" y2="133" stroke="#8B6914" strokeWidth="0.2"/>
        <line x1="133" y1="27" x2="27" y2="133" stroke="#8B6914" strokeWidth="0.2"/>
      </svg>
    </motion.div>

    {/* Floating compass mid-right */}
    <motion.div
      aria-hidden
      className="pointer-events-none absolute right-[5%] top-[18%] w-40 h-40 opacity-[0.028] dark:opacity-[0.045]"
      animate={{ x: mouseX * 26, y: mouseY * 26 }}
      transition={{ type: "spring", stiffness: 42, damping: 16, mass: 1.3 }}
    >
      <svg viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="54" stroke="#8B6914" strokeWidth="0.5" strokeDasharray="3 7"/>
        <circle cx="60" cy="60" r="36" stroke="#8B6914" strokeWidth="0.35"/>
        <line x1="60" y1="6" x2="60" y2="114" stroke="#8B6914" strokeWidth="0.3"/>
        <line x1="6" y1="60" x2="114" y2="60" stroke="#8B6914" strokeWidth="0.3"/>
      </svg>
    </motion.div>

    {/* Subtle header rule under nav */}
    <div
      aria-hidden
      className="pointer-events-none absolute top-[68px] left-0 right-0 h-px opacity-[0.07]"
      style={{ background: "linear-gradient(to right, transparent, #8B6914 25%, #8B6914 75%, transparent)" }}
    />
  </>
);

// ── Oversized decorative initial behind headline ──────────────────────────────
const DecorativeLetter = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
    style={{ zIndex: 0 }}
  >
    <span
      className="font-serif font-bold text-foreground/[0.022] dark:text-foreground/[0.038] leading-none"
      style={{ fontSize: "clamp(150px, 26vw, 320px)", userSelect: "none", letterSpacing: "-0.04em" }}
    >
      Z
    </span>
  </div>
);

// ── Hero headline ─────────────────────────────────────────────────────────────
const HeroHeadline = ({ motto, badge, subtitle }: { motto: string; badge: string; subtitle: string }) => {
  const reduced = useReducedMotion();
  const words    = motto.trim().split(" ");
  const lastWord = words.slice(-1)[0];
  const mainText = words.slice(0, -1).join(" ");

  return (
    <motion.div
      className="relative z-10 text-center w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Badge with side lines */}
      <motion.div
        className="inline-flex items-center gap-2.5 mb-4"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.45 }}
      >
        <div className="h-px w-7 bg-primary/45" />
        <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.44em] text-primary">
          {badge}
        </p>
        <div className="h-px w-7 bg-primary/45" />
      </motion.div>

      {/* Headline */}
      <h1
        className="font-serif font-bold leading-[1.04] text-foreground"
        style={{ fontSize: "clamp(2.5rem, 6.2vw, 5.2rem)" }}
      >
        {reduced ? (
          <>
            {mainText}{" "}
            <em className="not-italic text-gold-gradient">{lastWord}</em>
          </>
        ) : (
          <motion.span
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.038, delayChildren: 0.16 } },
            }}
          >
            {mainText.split("").map((ch, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden:   { opacity: 0, y: 14 },
                  visible:  { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
                }}
                style={{ display: ch === " " ? "inline" : "inline-block" }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
            {"\u00A0"}
            <em className="not-italic text-gold-gradient">
              {lastWord.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden:   { opacity: 0, y: 14 },
                    visible:  { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  style={{ display: "inline-block" }}
                >
                  {ch}
                </motion.span>
              ))}
            </em>
          </motion.span>
        )}
      </h1>

      {/* Subtitle */}
      <motion.p
        className="mt-4 text-sm md:text-[15px] text-muted-foreground max-w-sm mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.72, duration: 0.6 }}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
};

// ── Individual Stat Card ──────────────────────────────────────────────────────
const StatCard = ({
  target, suffix, label, delay, isInView,
}: {
  target: number; suffix: string; label: string; delay: number; isInView: boolean;
}) => {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (reduced) { setCount(target); return; }
    let startTime: number | null = null;
    let raf: number;
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / 1400, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) raf = requestAnimationFrame(step);
        else setCount(target);
      };
      raf = requestAnimationFrame(step);
    }, (0.8 + delay) * 1000);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [isInView, target, delay, reduced]);

  return (
    <div className="flex flex-col items-center text-center px-6 first:border-r first:border-amber-300/40 dark:first:border-amber-700/30">
      <p
        className="font-serif font-bold tabular-nums leading-none bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 bg-clip-text text-transparent"
        style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)" }}
      >
        {count}
        <span style={{ fontSize: "0.72em" }}>{suffix}</span>
      </p>
      <p className="mt-1.5 font-sans text-[9px] uppercase tracking-[0.3em] text-amber-800/55 dark:text-amber-300/50">
        {label}
      </p>
    </div>
  );
};

// ── CTA + Stats horizontal band ───────────────────────────────────────────────
const CtaStatsBand = ({ onNavigate }: { onNavigate: () => void }) => {
  const reduced = useReducedMotion();
  const ref     = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  const stats = [
    { target: 7,   suffix: " Yillik", label: "Faoliyat",     delay: 0    },
    { target: 150, suffix: "+",       label: "Sara Kitoblar", delay: 0.18 },
  ];

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-0 mt-7"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { delay: 1.0, duration: 0.52, ease: "easeOut" }}
    >
      {/* Stats pill */}
      <div
        className="flex items-center rounded-xl border border-amber-200/65 dark:border-amber-800/40 bg-amber-50/70 dark:bg-amber-950/30 backdrop-blur-sm py-3"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,210,80,0.18), 0 2px 14px -4px rgba(140,90,8,0.10)" }}
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} isInView={isInView} />
        ))}
      </div>

      {/* Vertical divider */}
      <div className="w-px h-9 bg-amber-200/50 dark:bg-amber-800/30 mx-5 shrink-0" />

      {/* CTA */}
      <motion.button
        onClick={onNavigate}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="group relative inline-flex items-center gap-2.5 rounded-xl border border-primary/40 px-6 py-3 text-sm font-semibold text-foreground overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
      >
        <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Library className="relative z-10 h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors duration-300 shrink-0" />
        <span className="relative z-10 font-sans group-hover:text-primary-foreground transition-colors duration-300 whitespace-nowrap">
          Barcha kitoblarni ko'rish
        </span>
        <ChevronRight className="relative z-10 h-4 w-4 text-primary group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
      </motion.button>
    </motion.div>
  );
};

// ── Stagger variants ──────────────────────────────────────────────────────────
const shelfVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};
const cardEntrance = {
  hidden:  { opacity: 0, y: 55, scale: 0.86 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 95, damping: 17 },
  },
};

// ── BookCard ──────────────────────────────────────────────────────────────────
const BookCard = ({
  book, offset, onClick, lang,
}: {
  book: Book; offset: number; onClick: () => void; lang: Lang; isFirstRender: boolean;
}) => {
  const reduced  = useReducedMotion();
  const abs      = Math.abs(offset);
  const isActive = offset === 0;

  const scale   = isActive ? 1 : Math.max(0.50, 0.74 - abs * 0.10);
  const yLift   = isActive ? -26 : abs * 6;
  const rotateY = reduced  ? 0   : offset * -8;
  const opacity = abs > VISIBLE_RANGE ? 0 : 1 - abs * 0.20;
  const zIdx    = isActive ? 30  : 20 - abs;

  const glow  = `hsl(${book.bg_color ?? "40 65% 30%"})`;
  const cardW = isActive
    ? `clamp(148px, 15vw, 200px)`
    : `${Math.round(CARD_W * scale)}px`;

  const imgSrc = getImageUrl(book.cover_url);

  return (
    <motion.div
      layout
      role="button"
      tabIndex={abs > VISIBLE_RANGE ? -1 : 0}
      aria-label={`${locField(book, "title", lang)} — ochish`}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      animate={{ y: yLift, rotateY, opacity, zIndex: zIdx }}
      transition={{ type: "spring", stiffness: 130, damping: 22 }}
      whileHover={abs <= VISIBLE_RANGE ? { y: yLift - 6, transition: { duration: 0.18 } } : {}}
      className="absolute cursor-pointer select-none focus:outline-none"
      style={{
        transformStyle: "preserve-3d",
        left:  `calc(50% + ${offset * SPACING}px - ${CARD_W / 2}px)`,
        bottom: 0,
        pointerEvents: abs > VISIBLE_RANGE ? "none" : "auto",
        width: cardW,
      }}
    >
      {/* Ambient glow halo */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="glow"
            className="absolute pointer-events-none"
            style={{ inset: "-26px", borderRadius: "30px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-full h-full" style={{
              background: `radial-gradient(ellipse at 50% 82%, ${glow} 0%, transparent 60%)`,
              filter: "blur(24px)",
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cover */}
      <div
        className="relative w-full overflow-hidden rounded-[14px] bg-neutral-800"
        style={{
          aspectRatio: "2/3",
          boxShadow: isActive
            ? `0 30px 64px -10px ${glow}bb, 0 6px 22px rgba(0,0,0,0.52)`
            : "0 8px 22px rgba(0,0,0,0.32)",
          transition: "box-shadow 0.5s ease",
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={locField(book, "title", lang)}
            className="w-full h-full object-cover"
            draggable={false}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3"
            style={{ background: `linear-gradient(145deg, hsl(${book.bg_color ?? "40 60% 20%"}), hsl(var(--secondary)))` }}
          >
            <span className="font-serif text-xs font-bold text-white/80 text-center leading-snug line-clamp-4">
              {locField(book, "title", lang)}
            </span>
            <span className="font-sans text-[10px] text-white/50 text-center">
              {locField(book, "author", lang)}
            </span>
          </div>
        )}
        <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/45 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-black/22 pointer-events-none" />
      </div>
    </motion.div>
  );
};

// ── Shelf surface ─────────────────────────────────────────────────────────────
const ShelfSurface = ({ glowColor }: { glowColor: string }) => (
  <div className="w-full flex flex-col items-center">
    <motion.div
      className="w-full max-w-2xl h-[2px] rounded-full"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: 0.45, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "linear-gradient(to right, transparent, hsl(var(--primary)/0.55) 18%, hsl(var(--primary)/0.55) 82%, transparent)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.12)",
      }}
    />
    <motion.div
      className="w-full max-w-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.9 }}
      style={{
        height: "8px",
        background: "linear-gradient(to right, transparent, rgba(0,0,0,0.055) 18%, rgba(0,0,0,0.055) 82%, transparent)",
        filter: "blur(2px)",
        marginTop: "1px",
      }}
    />
    <div
      style={{
        width: "300px",
        height: "16px",
        background: `radial-gradient(ellipse, ${glowColor}44 0%, transparent 68%)`,
        filter: "blur(8px)",
        transition: "background 0.75s ease",
        marginTop: "-5px",
      }}
    />
  </div>
);

// ── Control bar ───────────────────────────────────────────────────────────────
const ControlBar = ({
  active, total, duration, isPaused, onPrev, onNext,
}: {
  active: number; total: number; duration: number;
  isPaused: boolean; onPrev: () => void; onNext: () => void;
}) => (
  <div className="flex items-center gap-3 mt-3">
    <motion.button
      whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.88 }}
      onClick={onPrev}
      className="glass-card p-1.5 rounded-full text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Oldingi kitob"
    >
      <ChevronLeft className="h-4 w-4" />
    </motion.button>

    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="relative h-[3px] rounded-full overflow-hidden bg-muted/60"
          style={{ width: i === active ? "28px" : "6px", transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)" }}
        >
          {i === active && (
            <motion.div
              key={`fill-${active}`}
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={isPaused ? { duration: 0 } : { duration: duration / 1000, ease: "linear" }}
            />
          )}
          {i < active && <div className="absolute inset-0 bg-primary/40 rounded-full" />}
        </div>
      ))}
    </div>

    <motion.button
      whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.88 }}
      onClick={onNext}
      className="glass-card p-1.5 rounded-full text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Keyingi kitob"
    >
      <ChevronRight className="h-4 w-4" />
    </motion.button>
  </div>
);

// ── "Safarni boshlash" scroll CTA ────────────────────────────────────────────
const ScrollCta = () => {
  const handleClick = () => {
    const hero = document.getElementById("hero");
    if (hero) {
      window.scrollTo({ top: hero.offsetTop + hero.offsetHeight, behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 group flex flex-col items-center gap-2 focus:outline-none"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.4, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label="Safarni boshlash"
    >
      {/* Label */}
      <span className="font-sans text-[9px] uppercase tracking-[0.42em] text-primary/55 group-hover:text-primary/80 transition-colors duration-300">
        Safarni boshlash
      </span>

      {/* Animated pill with arrow */}
      <span className="relative flex flex-col items-center justify-center w-7 h-10 rounded-full border border-primary/30 group-hover:border-primary/60 transition-colors duration-300 overflow-hidden">
        {/* Scroll-fill animation inside pill */}
        <motion.span
          className="absolute top-0 left-0 right-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300"
          animate={{ height: ["0%", "100%", "0%"] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", times: [0, 0.5, 1] }}
        />
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="relative z-10"
        >
          <ChevronDown className="h-3 w-3 text-primary/50 group-hover:text-primary transition-colors duration-300" />
        </motion.div>
      </span>
    </motion.button>
  );
};

// ── Main Hero ─────────────────────────────────────────────────────────────────
const Hero = () => {
  const { books, siteSettings, loading } = useData();
  const { lang, t } = useLang();
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused,    setIsPaused]    = useState(false);
  const [mouse,       setMouse]       = useState({ x: 0, y: 0 });
  const [isFirstRender, setIsFirstRender] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const displayBooks: Book[] = (
    books.filter((b) => b.featured === true).length > 0
      ? books.filter((b) => b.featured === true)
      : books
  ).slice(0, 7);

  const total = displayBooks.length;

  const advance = useCallback(
    (dir: 1 | -1) => {
      setIsFirstRender(false);
      setActiveIndex((p) => (p + dir + total) % total);
    },
    [total]
  );

  useEffect(() => {
    if (isPaused || total < 2) return;
    timerRef.current = setInterval(() => advance(1), INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, advance, total]);

  useEffect(() => {
    const tid = setTimeout(() => setIsFirstRender(false), 2000);
    return () => clearTimeout(tid);
  }, []);

  const manualNav = useCallback((dir: 1 | -1) => {
    if (timerRef.current) clearInterval(timerRef.current);
    advance(dir);
  }, [advance]);

  const handleBookClick = useCallback(
    (book: Book) => navigate(`/book/${book.id}`),
    [navigate]
  );

  // Subtle parallax
  useEffect(() => {
    const handle = (e: MouseEvent) => setMouse({
      x: e.clientX / window.innerWidth  - 0.5,
      y: e.clientY / window.innerHeight - 0.5,
    });
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const activeBook = displayBooks[activeIndex] ?? null;
  const glowColor  = `hsl(${activeBook?.bg_color ?? "40 65% 30%"})`;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center section-padding pt-24 overflow-hidden">
        <div className="relative z-10 text-center max-w-3xl mx-auto w-full animate-pulse space-y-4 mb-16">
          <div className="h-2 w-20 bg-primary/20 rounded-full mx-auto" />
          <div className="h-14 w-3/4 bg-foreground/10 rounded-xl mx-auto" />
          <div className="h-14 w-1/2 bg-foreground/10 rounded-xl mx-auto" />
          <div className="h-4 w-2/3 bg-muted/20 rounded-lg mx-auto" />
        </div>
        <div className="flex items-end justify-center gap-4">
          {[0.50, 0.74, 1, 0.74, 0.50].map((s, i) => (
            <div key={i} className="rounded-xl bg-neutral-800/40 animate-pulse shrink-0"
              style={{ width: `${Math.round(CARD_W * s)}px`, height: `${Math.round(CARD_W * s * 1.5)}px`, opacity: 1 - Math.abs(i - 2) * 0.2 }}
            />
          ))}
        </div>
      </section>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────
  if (books.length === 0) {
    return (
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center section-padding pt-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%, hsl(var(--primary)/0.12) 0%, hsl(var(--background)) 70%)" }}
        />
        <motion.div className="relative z-10 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        >
          <p className="mb-4 text-sm font-sans font-medium uppercase tracking-[0.3em] text-primary">
            {(t as any).hero?.badge}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold leading-tight text-foreground mb-6">
            {siteSettings.hero.motto.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-gold-gradient">{siteSettings.hero.motto.split(" ").slice(-1)[0]}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {siteSettings.hero.subtitle}
          </p>
          <button onClick={() => navigate("/library")}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Barcha kitoblarni ko'rish <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center section-padding pt-20 pb-16 overflow-hidden"
    >
      {/* ── Atmospheric layers ─────────────────────────────────────────────── */}
      <AtmosphericBackground mouseX={mouse.x} mouseY={mouse.y} />
      <PhotoParallaxLayer mouseX={mouse.x} mouseY={mouse.y} />

      {/* Ambient book-color glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="pointer-events-none absolute inset-0 z-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.3 }}
        >
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at 50% 74%, ${glowColor}32 0%, transparent 58%)`,
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Top vignette */}
      <div className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(ellipse at 50% -5%, transparent 42%, hsl(var(--background)/0.45) 100%)" }}
      />

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">

        {/* Headline — z-40 keeps it above book cards at all times */}
        <div className="relative z-40 w-full pt-2 pb-1">
          <DecorativeLetter />
          <HeroHeadline
            motto={siteSettings.hero.motto}
            badge={(t as any).hero?.badge ?? "Premium Nashriyot"}
            subtitle={siteSettings.hero.subtitle}
          />
        </div>

        {/* ── Book shelf ───────────────────────────────────────────────────── */}
        <div
          className="relative w-full mt-11"
          style={{ height: `${SHELF_H}px`, clipPath: "inset(-300px -9999px -9999px -9999px)" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <motion.div
            className="absolute inset-0"
            style={{ perspective: "1000px", perspectiveOrigin: "50% 88%" }}
            variants={shelfVariants}
            initial="hidden"
            animate="visible"
          >
            {displayBooks.map((book, i) => {
              const raw     = i - activeIndex;
              const wrapped = total > 1
                ? ((raw + Math.floor(total / 2) + total) % total) - Math.floor(total / 2)
                : 0;
              return (
                <motion.div key={book.id} variants={cardEntrance} className="absolute inset-0">
                  <BookCard
                    book={book}
                    offset={wrapped}
                    onClick={() => handleBookClick(book)}
                    lang={lang}
                    isFirstRender={isFirstRender}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Shelf surface */}
        <ShelfSurface glowColor={glowColor} />

        {/* Book caption */}
        <div className="h-10 mt-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeBook && (
              <motion.div
                key={activeBook.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-200/50 dark:border-amber-700/35 bg-amber-50/65 dark:bg-amber-950/30 backdrop-blur-sm"
              >
                <span className="font-serif text-sm font-semibold text-foreground leading-none">
                  {locField(activeBook, "title", lang)}
                </span>
                <span className="text-amber-400/45 text-[9px] leading-none">◆</span>
                <span className="font-sans text-xs text-amber-700/60 dark:text-amber-400/55 leading-none">
                  {locField(activeBook, "author", lang)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <ControlBar
          active={activeIndex}
          total={total}
          duration={INTERVAL_MS}
          isPaused={isPaused}
          onPrev={() => manualNav(-1)}
          onNext={() => manualNav(1)}
        />

        <div className="h-4 mt-1">
          <AnimatePresence>
            {isPaused && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[9px] font-sans text-muted-foreground/35 uppercase tracking-widest text-center"
              >
                To'xtatildi
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* CTA + Stats */}
        <CtaStatsBand onNavigate={() => navigate("/library")} />

      </div>

      {/* Scroll invite */}
      <ScrollCta />

    </section>
  );
};

export default Hero;