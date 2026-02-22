import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, PenLine } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useData } from "@/context/DataContext";
import FeedbackForm from "./FeedbackForm";

// ── Design assets ─────────────────────────────────────────────────────────────
import waxSeal from "@/assets/design/seal.png";
import pen     from "@/assets/design/pen.png";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Review {
  id:    string | number;
  name:  string;
  role:  string | null;
  city:  string | null;
  text:  string;
  stars: number;
}

// ── Hardcoded seed reviews (shown when DB is empty / loading) ─────────────────
const SEED_REVIEWS: Review[] = [
  {
    id:    "seed-1",
    name:  "Malika Yusupova",
    role:  "Adabiyot o'qituvchisi",
    city:  "Toshkent",
    text:  "Tarjima shunchalik ravonki, asar ichiga sho'ng'ib ketdim. Har bir so'z o'z joyida — go'yo kitob dastlab o'zbek tilida yozilgandek. Bu — haqiqiy san'at.",
    stars: 5,
  },
  {
    id:    "seed-2",
    name:  "Jasur Normatov",
    role:  "Yozuvchi va bloger",
    city:  "Samarqand",
    text:  "Zabarjad Media tarjimalarida tilning ruhi saqlanib qolgan. Xarakterlarning nutqi, his-tuyg'ulari — hammasi juda tabiiy. Bolalarimga katta faxr bilan tavsiya etaman.",
    stars: 5,
  },
  {
    id:    "seed-3",
    name:  "Dilnoza Rahimova",
    role:  "Universitet talabasi",
    city:  "Buxoro",
    text:  "Avval rus tilidagi versiyasini o'qigandim. O'zbek tarjimasini o'qib, yangi kitob kashf etgandek his qildim — bu qadar boy va ifodali. Rahmat, Zabarjad!",
    stars: 5,
  },
  {
    id:    "seed-4",
    name:  "Sherzod Karimov",
    role:  "Muhandis, kitob ixlosmandi",
    city:  "Namangan",
    text:  "Texnik odam bo'lsam ham, Zabarjad kitoblarini qo'yib yuborolmayapman. Uslub shunchalik o'tkir va aniqki, har bir jumla ichingda qoladi. G'oyat professional ish.",
    stars: 5,
  },
  {
    id:    "seed-5",
    name:  "Feruza Mirzayeva",
    role:  "Psixolog",
    city:  "Farg'ona",
    text:  "Insonning ichki dunyosini tasvirlashda tarjimonlar juda nozik yondashgan. Hissiyotlar bir tomchi ham yo'qolmagan. Bunday sifatli tarjimani uzoq kutgan edik.",
    stars: 5,
  },
  {
    id:    "seed-6",
    name:  "Otabek Xolmatov",
    role:  "Jurnalist",
    city:  "Qarshi",
    text:  "Zabarjad — shunchaki nashriyot emas, bu — madaniy missiya. Har bir kitob o'zbek tiliga yangi nafas olib kirmoqda. Tahririyat jamoasiga katta rahmat!",
    stars: 5,
  },
  {
    id:    "seed-7",
    name:  "Mohira Sultonova",
    role:  "Doktorant, filolog",
    city:  "Toshkent",
    text:  "Ilmiy nuqtai nazardan ham tarjima sifati yuqori darajada. Leksika, sintaksis, uslub — hamma jihat puxta o'ylangan. O'zbek adabiyotiga qo'shilgan munosib hissa.",
    stars: 5,
  },
  {
    id:    "seed-8",
    name:  "Bahodir Toshmatov",
    role:  "Maktab o'quvchisi",
    city:  "Andijon",
    text:  "O'qishni yoqtirmas edim, lekin Zabarjad kitobini olganimdan keyin tunlari yashirincha o'qidim! Endi navbatdagi kitobni kutib o'tiraman. Juda zo'r!",
    stars: 5,
  },
];

const SCROLL_STEP = 432;
const AUTOPLAY_MS = 4000;
const PAUSE_MS    = 8000;

// ── i18n ──────────────────────────────────────────────────────────────────────
const SECTION_TEXT = {
  uz: {
    badge:         "Kitobxonlar fikri", // UPDATED
    title:         "Taassurotlar",
    subtitle:      "Kitob sahifalaridan ko'ngilga ko'chgan so'zlar.",
    leaveFeedback: "Fikr qoldiring",
    hideForm:      "Yopish",
  },
  ru: {
    badge:         "Мнения читателей", // UPDATED to align with "fikri"
    title:         "Отзывы",
    subtitle:      "Слова, которые перешли со страниц книг в сердца.",
    leaveFeedback: "Оставить отзыв",
    hideForm:      "Закрыть",
  },
  en: {
    badge:         "Readers' Thoughts", // UPDATED to align with "fikri"
    title:         "Testimonials",
    subtitle:      "Words that travelled from the page into the heart.",
    leaveFeedback: "Leave a Review",
    hideForm:      "Close",
  },
} as const;

type SectionLang = keyof typeof SECTION_TEXT;

// ── Stars ─────────────────────────────────────────────────────────────────────
const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5 mb-4" aria-label={`${count} yulduz`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-sm leading-none ${i < count ? "text-primary" : "text-neutral-300 dark:text-neutral-600"}`}>
        ★
      </span>
    ))}
  </div>
);

// ── Review card ───────────────────────────────────────────────────────────────
const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const reduced    = useReducedMotion();
  const rotateDeg  = reduced ? 0 : index % 2 === 0 ? 1.6 : -1.6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1, y: 0,
        transition: {
          type: "spring", stiffness: 100, damping: 18,
          delay: Math.min(index * 0.06, 0.36),
        },
      }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={reduced ? {} : { rotate: 0, y: -8, scale: 1.02, zIndex: 30, transition: { duration: 0.2 } }}
      className="
        relative w-[85vw] max-w-[400px] shrink-0 snap-center whitespace-normal
        rounded-xl p-7 cursor-default select-none
        bg-[#fdfbf7] dark:bg-[#1a1a1a]
        shadow-xl border border-amber-100/80 dark:border-amber-900/20
      "
      style={{ rotate: rotateDeg, transformOrigin: "center bottom" }}
    >
      <img
        src={waxSeal} alt="" aria-hidden draggable={false}
        className="absolute -top-4 -right-4 w-14 h-14 object-contain pointer-events-none select-none"
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.22))" }}
      />
      <div
        className="font-serif text-primary/20 dark:text-primary/15 select-none mb-1 leading-none"
        style={{ fontSize: "52px", lineHeight: 1, marginTop: "-4px" }}
        aria-hidden
      >
        "
      </div>
      <Stars count={review.stars} />
      <p className="font-serif text-sm italic leading-relaxed mb-6 break-words text-neutral-700 dark:text-neutral-300">
        {review.text}
      </p>
      <div className="h-px w-10 bg-amber-300/50 dark:bg-amber-700/30 mb-4" />
      <p className="font-serif text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
        {review.name}
      </p>
      <p className="font-sans text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
        {[review.role, review.city].filter(Boolean).join(" · ")}
      </p>
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Taassurotlar = () => {
  const { lang }     = useLang();
  const { reviews: dbReviews = [] } = useData() as any;
  const sectionRef   = useRef<HTMLElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const reduced      = useReducedMotion();

  const [isPaused,  setIsPaused]  = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const pauseTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tx = SECTION_TEXT[(lang as SectionLang)] ?? SECTION_TEXT.uz;

  // Merge: DB published reviews first, then seeds to pad out the carousel
  const reviews: Review[] = dbReviews.length >= 4
    ? dbReviews
    : [
        ...dbReviews,
        ...SEED_REVIEWS.slice(dbReviews.length),
      ];

  // ── Scroll helpers ────────────────────────────────────────────────────────
  const scrollRight = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: SCROLL_STEP, behavior: "smooth" });
    }
  }, []);

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" });
  }, []);

  const triggerPause = useCallback(() => {
    setIsPaused(true);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => setIsPaused(false), PAUSE_MS);
  }, []);

  const handleLeft  = useCallback(() => { scrollLeft();  triggerPause(); }, [scrollLeft,  triggerPause]);
  const handleRight = useCallback(() => { scrollRight(); triggerPause(); }, [scrollRight, triggerPause]);

  // ── Auto-play ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || reduced || showForm) return;
    const interval = setInterval(scrollRight, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [isPaused, reduced, scrollRight, showForm]);

  // Cleanup pause timer on unmount
  useEffect(() => {
    return () => { if (pauseTimer.current) clearTimeout(pauseTimer.current); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="taassurotlar"
      className="
        relative overflow-hidden py-16 md:py-20
        bg-stone-50 dark:bg-[#0f0f0f]
        border-y border-stone-200 dark:border-neutral-800/60
      "
    >
      {/* Decorative pen (Background) */}
      <div className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none" aria-hidden>
        <img src={pen} alt="" draggable={false}
          className="w-48 md:w-64 object-contain opacity-[0.05] dark:opacity-[0.03]"
          style={{ transform: "rotate(-22deg)", filter: "grayscale(1)" }}
        />
      </div>

      {/* Vignette light */}
      <div className="pointer-events-none absolute inset-0 block dark:hidden"
        style={{ background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(245,235,220,0.4) 100%)" }}
      />
      {/* Vignette dark */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{ background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)" }}
      />

      <div className="relative z-10">

        {/* Header (UPDATED) */}
        <motion.div
          className="text-center px-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <div className="inline-flex items-center justify-center gap-4 mb-4">
            {/* Left Pen - Flipped horizontally to point inwards */}
            <img src={pen} alt="" aria-hidden draggable={false}
              className="w-7 h-7 object-contain opacity-60 dark:opacity-40 -scale-x-100 drop-shadow-sm"
              style={{ filter: "grayscale(0.4)" }}
            />
            {/* Badge Text (Updated in tx variable) */}
            <p className="text-xs font-sans font-semibold uppercase tracking-[0.35em] text-primary whitespace-nowrap">
              {tx.badge}
            </p>
            {/* Right Pen - Default orientation pointing inwards */}
            <img src={pen} alt="" aria-hidden draggable={false}
              className="w-7 h-7 object-contain opacity-60 dark:opacity-40 drop-shadow-sm"
              style={{ filter: "grayscale(0.4)" }}
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-3">
            {tx.title}
          </h2>
          <p className="font-serif italic text-muted-foreground/70 text-base max-w-md mx-auto">
            {tx.subtitle}
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 pb-10 pt-6 px-6 sm:px-12 md:px-20 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          <style>{`#taassurotlar div::-webkit-scrollbar{display:none}`}</style>
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
          <div className="shrink-0 w-6 sm:w-10" aria-hidden />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.90 }}
            onClick={handleLeft}
            className="glass-card p-2.5 rounded-full text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Oldingi sharh"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>

          {/* Auto-play indicator */}
          <div className="flex items-center gap-1.5 w-6 justify-center">
            {isPaused ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
              </>
            ) : (
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-primary/50"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              />
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.90 }}
            onClick={handleRight}
            className="glass-card p-2.5 rounded-full text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Keyingi sharh"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Leave feedback toggle */}
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowForm((p) => !p); triggerPause(); }}
            className="
              inline-flex items-center gap-2 rounded-xl px-6 py-2.5
              text-sm font-semibold font-sans
              bg-amber-100 dark:bg-amber-900/20
              border border-amber-300 dark:border-amber-800/40
              text-amber-900 dark:text-amber-200
              hover:bg-amber-200 dark:hover:bg-amber-900/30
              transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
            "
          >
            <PenLine className="h-4 w-4" />
            {showForm ? tx.hideForm : tx.leaveFeedback}
          </motion.button>
        </div>

        {/* Collapsible feedback form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{   opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mx-auto max-w-2xl px-6 mt-8 pb-4">
                <FeedbackForm />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom flourish */}
        <motion.div
          className="flex items-center justify-center gap-4 mt-10"
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/40" />
          <img src={waxSeal} alt="" aria-hidden draggable={false}
            className="w-7 h-7 object-contain opacity-25"
            style={{ filter: "grayscale(0.4)" }}
          />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/40" />
        </motion.div>

      </div>
    </section>
  );
};

export default Taassurotlar;