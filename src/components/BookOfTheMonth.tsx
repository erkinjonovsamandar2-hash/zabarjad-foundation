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

  if (!spotlightBook) return null;

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
    <section className="relative flex flex-col justify-center min-h-[auto] lg:min-h-[85vh] overflow-hidden bg-[#faf9f5] dark:bg-[#080808] py-16 lg:py-20 border-y border-neutral-200/60 dark:border-white/5 z-10">
      
      {/* ── Background: Van Gogh Feather & Texture ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div aria-hidden className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
            backgroundSize: "cover", backgroundPosition: "center right", backgroundRepeat: "no-repeat",
            opacity: 0.85, 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f5] via-[#faf9f5]/80 to-transparent dark:from-[#080808] dark:via-[#080808]/80 dark:to-transparent" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-15 dark:opacity-20"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }} />
        <svg width="0" height="0" className="absolute" aria-hidden>
          <defs><filter id="botm-grain"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>
        </svg>
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]" style={{ filter: "url(#botm-grain)" }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-12">
        {/* Changed to flex-col on mobile, grid on desktop for exact flow control */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── Left Column (Editorial Content) ── */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
            
            {/* 1. Premium Badge - MADE BIGGER */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-500 font-bold tracking-[0.2em] text-xs sm:text-sm mb-6"
            >
              <span className="text-sm sm:text-base leading-none">✦</span>
              OY KITOBI
            </motion.div>

            {/* 2. Giant Pull Quote */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="relative mb-6"
            >
              <Quote className="absolute -top-3 -left-5 w-8 h-8 lg:w-10 lg:h-10 text-amber-500/20 dark:text-amber-500/10 rotate-180" />
              <blockquote className="text-xl sm:text-2xl lg:text-[1.75rem] lg:leading-tight font-serif italic text-foreground drop-shadow-sm max-w-2xl">
                "Ba'zan eng yuksakka chiqish uchun eng quyiga tushish kerak, eng toza bo'lish uchun butun tubanliklardan o'tish kerak, hayotni yangidan boshlash uchun xarob ahvolga kelish kerak."
              </blockquote>
            </motion.div>

            {/* 3. Title & Author */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="w-full flex flex-col items-center lg:items-start"
            >
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {locField(spotlightBook, "title", lang)}
              </h2>
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500 font-bold mt-1.5">
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
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/80 dark:border-neutral-800 shadow-sm text-[11px] sm:text-xs font-semibold text-foreground/80">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Jahon durdonasi
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/80 dark:border-neutral-800 shadow-sm text-[11px] sm:text-xs font-semibold text-foreground/80">
                <Brain className="w-3.5 h-3.5 text-amber-500" /> {genre}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/80 dark:border-neutral-800 shadow-sm text-[11px] sm:text-xs font-semibold text-foreground/80">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> ~{pages} sahifa
              </div>
            </motion.div>

            {/* 5. "Why Read It" Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="relative w-full max-w-xl mb-8 text-left"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 rounded-l-2xl shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
              <div className="bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-neutral-200/50 dark:border-white/10 rounded-2xl rounded-l-none p-5 sm:p-6 shadow-lg shadow-black/5">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    Nega o'qish kerak?
                  </h4>
                </div>
                <p className="font-serif text-sm sm:text-base text-foreground/90 leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>

            {/* 6. CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/book/${spotlightBook.id}`)}
              className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl border border-amber-300/80 dark:border-amber-700/60 bg-white/60 dark:bg-black/50 backdrop-blur-xl hover:bg-amber-500 hover:border-amber-500 px-8 py-3.5 sm:py-4 text-sm font-semibold text-foreground transition-all shadow-md w-full sm:w-auto focus:outline-none"
            >
              <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:text-black transition-colors" />
              <span className="font-sans tracking-wide group-hover:text-black transition-colors">Batafsil o'qish</span>
              <ChevronRight className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
            </motion.button>

          </div>

          {/* ── Right Column (Floating Book) - DESKTOP ONLY ── */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative">
            <FloatingBookVisual />
          </div>

        </div>
      </div>
    </section>
  );
};

export default BookOfTheMonth;