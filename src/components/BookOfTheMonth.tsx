// @refresh reset
import { motion } from "framer-motion";
import { ChevronRight, Award, Clock, Brain, Quote, Info, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useLang, locField } from "@/context/LanguageContext";

// ── Background image import ───────────────────────────────────────────────────
let bgUrl: string | undefined;
try { bgUrl = new URL("@/assets/design/botm-bg.png", import.meta.url).href; } catch { bgUrl = undefined; }

const BookOfTheMonth = () => {
  const { books } = useData();
  const { lang } = useLang();
  const navigate = useNavigate();

  const spotlightBook = books.find((b) => b.featured) || books[0];

  const getImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = import.meta.env.VITE_SUPABASE_URL as string;
    return `${base}/storage/v1/object/public/${url}`;
  };

  // Keep a skeleton state if loading or timed out without books
  if (!spotlightBook) {
    return (
      <section className="relative flex flex-col justify-center min-h-[50vh] overflow-hidden bg-background py-24 lg:py-32 border-y border-border z-10">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 text-muted-foreground font-sans text-sm tracking-widest uppercase">
          [Kitob ma'lumotlari yuklanmoqda...]
        </div>
      </section>
    );
  }

  const coverUrl = getImageUrl(spotlightBook.cover_url);
  const glowColor = `hsl(${spotlightBook.bg_color ?? "40 65% 30%"})`;

  const genre = (spotlightBook as any).genre ?? (spotlightBook as any).category ?? "Psixologik roman";
  const pages = (spotlightBook as any).pages ?? (spotlightBook as any).page_count ?? "340";

  const description = (spotlightBook as any).description ?? "Shaxmat taxtasi ortidagi daholik, ruhiy inqirozlar va mutlaq g'alabaga bo'lgan mashaqqatli yo'l. Bu asar inson o'z-o'zini qanday qilib qayta yaratishi haqidagi eng kuchli hikoyalardan biridir.";

  // ── Reusable Book Visual Component (For clever mobile ordering) ─────────────
  const FloatingBookVisual = () => (
    <>
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 perspective-1000"
      >
        <div
          className="relative w-52 sm:w-64 lg:w-72 aspect-[2/3] rounded-md sm:rounded-lg overflow-hidden border-l-[3px] border-white/20"
          style={{
            transform: "rotateY(-15deg) rotateX(5deg)",
            boxShadow: `-20px 20px 40px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.15)`
          }}
        >
          {coverUrl ? (
            <img src={coverUrl} alt={locField(spotlightBook, "title", lang)} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-neutral-800" />
          )}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.1] via-transparent to-black/40 pointer-events-none" />
        </div>
      </motion.div>

      {/* Floor Shadow */}
      <motion.div
        animate={{ scale: [1, 0.85, 1], opacity: [0.4, 0.2, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="w-44 sm:w-56 h-6 bg-black/20 dark:bg-black/80 blur-[12px] rounded-[100%] mt-6"
      />
    </>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative flex flex-col justify-center min-h-[auto] lg:min-h-[85vh] overflow-hidden bg-background py-24 lg:py-32 border-y border-border z-10"
    >

      {/* ── Background: Van Gogh Feather & Texture ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div aria-hidden className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
            backgroundSize: "cover", backgroundPosition: "center right", backgroundRepeat: "no-repeat",
            opacity: 0.85,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-15 dark:opacity-20"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }} />
        {/* FIX: Removed SVG <feTurbulence> to prevent full-section paint thrashing on scroll */}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-12">
        {/* Changed to flex-col on mobile, grid on desktop for exact flow control */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── Left Column (Editorial Content) ── */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left w-full">

            {/* 1. Premium Badge - MADE BIGGER */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-primary/10 text-primary/90 dark:text-accent font-bold tracking-[0.2em] font-sans text-[11px] uppercase mb-6"
            >
              <span className="text-sm sm:text-base leading-none">✦</span>
              OY KITOBI
            </motion.div>

            {/* 2. Giant Pull Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="relative mb-6"
            >
              <Quote className="absolute -top-3 -left-5 w-8 h-8 lg:w-10 lg:h-10 text-accent/20 dark:text-accent/10 rotate-180" />
              <blockquote className="text-xl sm:text-2xl lg:text-[1.75rem] leading-loose font-serif italic text-foreground drop-shadow-sm max-w-2xl">
                "Ba'zan eng yuksakka chiqish uchun eng quyiga tushish kerak, eng toza bo'lish uchun butun tubanliklardan o'tish kerak, hayotni yangidan boshlash uchun xarob ahvolga kelish kerak."
              </blockquote>
            </motion.div>

            {/* 3. Title & Author */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="w-full flex flex-col items-center lg:items-start"
            >
              <h2 className="font-heading leading-[1.05] tracking-wide text-2xl sm:text-3xl font-bold text-foreground">
                {locField(spotlightBook, "title", lang)}
              </h2>
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-primary dark:text-accent font-bold mt-1.5">
                {locField(spotlightBook, "author", lang)}
              </p>
            </motion.div>

            {/* ── MOBILE ONLY: Book Cover inserted here in the exact order requested ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="flex lg:hidden flex-col items-center justify-center relative w-full mt-6 mb-0"
            >
              <FloatingBookVisual />
            </motion.div>

            {/* 4. Badges (Added mt-6 on desktop to space from author, mt-0 on mobile because of book) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-0 lg:mt-6 mb-6"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-black/40 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-foreground/80">
                <Award className="w-3.5 h-3.5 text-accent" /> Jahon durdonasi
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-black/40 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-foreground/80">
                <Brain className="w-3.5 h-3.5 text-accent" /> {genre}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-black/40 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-foreground/80">
                <Clock className="w-3.5 h-3.5 text-accent" /> ~{pages} sahifa
              </div>
            </motion.div>

            {/* 5. "Why Read It" Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="relative w-full max-w-xl mb-8 text-left"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-2xl shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
              <div className="bg-white/95 dark:bg-black/60 border border-white/60 dark:border-white/10 rounded-2xl rounded-l-none p-5 sm:p-6 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-primary dark:text-accent" />
                  <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                    Nega o'qish kerak?
                  </h4>
                </div>
                <p className="font-serif text-sm sm:text-base text-foreground/90 leading-loose">
                  {description}
                </p>
              </div>
            </motion.div>

            {/* 6. CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/book/${spotlightBook.id}`)}
              className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/60 dark:border-white/10 bg-white dark:bg-black/40 hover:bg-primary hover:border-primary px-8 py-3.5 sm:py-4 transition-all duration-500 ease-out shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full sm:w-auto focus:outline-none hover:text-primary-foreground"
            >
              <BookOpen className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors duration-500 ease-out" />
              <span className="font-sans font-bold text-[11px] tracking-[0.2em] uppercase group-hover:text-primary-foreground transition-colors duration-500 ease-out">Batafsil o'qish</span>
              <ChevronRight className="h-4 w-4 text-primary group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-transform duration-500 ease-out" />
            </motion.button>

          </div>

          {/* ── Right Column (Floating Book) - DESKTOP ONLY ── */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative">
            <FloatingBookVisual />
          </div>

        </div>
      </div>
    </motion.section>
  );
};

export default BookOfTheMonth;