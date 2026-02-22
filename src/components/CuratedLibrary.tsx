import { useState } from "react";
import { BookOpen, Library, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { useLang, locField } from "@/context/LanguageContext";
import parchmentTexture from "@/assets/design/parchment-texture.png";

// ── Local Categories Configuration (Matches LibraryPage Exactly) ─────────────
const CATEGORIES = ["all", "new", "featured", "golden", "got"] as const;
const GOT_CATEGORY_KEY = "got";

// ── Helper: Get Category Label (Multilingual) ─────────────────────────────────
const getCategoryLabel = (key: string, lang: string): string => {
  const labels: Record<string, { uz: string; ru: string; en: string }> = {
    all:      { uz: "Barchasi",          ru: "Все",                  en: "All" },
    new:      { uz: "Yangi nashrlar",    ru: "Новинки",              en: "New Releases" },
    featured: { uz: "Tez kunda",         ru: "Скоро",                en: "Coming Soon" },
    golden:   { uz: "Oltin kolleksiya",  ru: "Золотая коллекция",    en: "Golden Collection" },
    got:      { uz: "Taxtlar O'yini",    ru: "Игра Престолов",       en: "Game of Thrones" },
  };
  return labels[key]?.[lang as keyof typeof labels.all] ?? key;
};

// ── Resolve cover URL (guards bare Supabase storage paths) ───────────────────
const getImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base}/storage/v1/object/public/${url}`;
};

const CuratedLibrary = () => {
  const { books } = useData();
  const { lang, t } = useLang();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("all");

  // ── Filter Logic with Special Handling for "All" and "Taxtlar O'yini" ──────
  const filtered = books.filter((b) => {
    // Show all books for "Barchasi" category
    if (activeTab === "all") return true;
    
    // Special filter for Game of Thrones series
    if (activeTab === GOT_CATEGORY_KEY) {
      const seriesLower = b.series?.toLowerCase() || "";
      const titleLower = b.title?.toLowerCase() || "";
      const titleEnLower = b.title_en?.toLowerCase() || "";
      const titleRuLower = b.title_ru?.toLowerCase() || "";
      return (
        seriesLower.includes("taxtlar") ||
        seriesLower.includes("game") ||
        seriesLower.includes("thrones") ||
        titleLower.includes("taxtlar") ||
        titleLower.includes("qirollar") ||
        titleEnLower.includes("game") ||
        titleEnLower.includes("thrones") ||
        titleRuLower.includes("престол") ||
        titleRuLower.includes("игра")
      );
    }
    
    // Regular category filter (for "new", "featured", "golden")
    return b.category === activeTab;
  });

  const displayedBooks = filtered.slice(0, 3);

  return (
    <section id="library" className="relative isolate overflow-hidden section-padding bg-charcoal">
      
      {/* ── Classic Parchment Texture Overlay (Premium & Visible) ──────────── */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 opacity-20 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen" 
        style={{ backgroundImage: `url(${parchmentTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      {/* Subtle vignette gradient to blend the edges into the site background */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)]" />

      <div className="mx-auto max-w-7xl">

        {/* ── CENTERED SECTION HEADER WITH EDITORIAL SUBTITLE ──────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center mb-16 pt-8 md:pt-12"
        >
          {/* 1. Giant Elegant Watermark Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full text-[80px] md:text-[130px] lg:text-[160px] font-serif font-black text-amber-900/5 dark:text-amber-500/5 uppercase tracking-widest select-none pointer-events-none -z-10 leading-none whitespace-nowrap">
            Kutubxona
          </div>

          {/* 2. Classic Book-Plate Badge */}
          <div className="inline-flex items-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-amber-500/50"></span>
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] text-amber-600 dark:text-amber-500 uppercase">
              {t.library.badge}
            </p>
            <span className="w-12 h-[1px] bg-amber-500/50"></span>
          </div>

          {/* 3. Grand Main Title */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 tracking-tight">
            {t.library.title}
          </h2>

          {/* 4. Refined Editorial Subtitle */}
          <p className="text-muted-foreground text-base md:text-lg text-center max-w-2xl mx-auto font-medium leading-relaxed">
            Nashriyotimizning eng sara, jahon va o'zbek adabiyoti durdonalari bilan tanishing. O'zingiz uchun yangi olam kashf eting.
          </p>
        </motion.div>

        {/* ── PREMIUM CATEGORY PILL TABS (Synced with LibraryPage) ────── */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {CATEGORIES.map((categoryKey) => {
            const isActive = activeTab === categoryKey;
            const isGoT = categoryKey === GOT_CATEGORY_KEY;
            
            return (
              <button
                key={categoryKey}
                onClick={() => setActiveTab(categoryKey)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium
                  transition-all duration-300
                  ${isActive 
                    ? isGoT
                      ? "bg-amber-500 text-black font-got tracking-wider shadow-md transform scale-105"
                      : "bg-foreground text-background shadow-md transform scale-105"
                    : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                {getCategoryLabel(categoryKey, lang)}
              </button>
            );
          })}
        </div>

        {/* ── SCALED-DOWN 3D HARDCOVER BOOK GRID (3 Books with Badges) ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-3xl md:max-w-4xl mx-auto px-4">
          <AnimatePresence mode="popLayout">
            {displayedBooks.map((book, i) => {
              const imgSrc = getImageUrl(book.cover_url);
              
              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => navigate(`/book/${book.id}`)}
                  className="group flex flex-col gap-2 max-w-[220px] mx-auto w-full cursor-pointer"
                >
                  {/* 3D Hardcover Cover */}
                  <div className="relative w-full aspect-[2/3] rounded-l-sm rounded-r-xl overflow-hidden shadow-[4px_4px_10px_rgba(0,0,0,0.15),_inset_-4px_0_4px_rgba(255,255,255,0.4)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.5),_inset_-4px_0_4px_rgba(255,255,255,0.1)] group-hover:-translate-y-3 group-hover:-rotate-1 group-hover:shadow-[15px_20px_30px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[15px_20px_30px_rgba(0,0,0,0.6)] transition-all duration-500 bg-muted">
                    {imgSrc ? (
                      <img 
                        src={imgSrc} 
                        alt={locField(book, "title", lang)} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center bg-secondary w-full h-full">
                        <BookOpen className="h-10 w-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
                      </div>
                    )}
                    
                    {/* Spine Hinge Gradient */}
                    <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 via-white/20 to-transparent pointer-events-none border-l border-white/20" />
                    
                    {/* Premium Floating Badge (First book only) */}
                    {i === 0 && (
                      <div className="absolute top-4 right-0 z-20 translate-x-1">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-l-sm shadow-[0_4px_10px_rgba(245,158,11,0.4)]">
                          Yangi nashr
                        </div>
                        {/* Ribbon fold effect */}
                        <div className="absolute -bottom-1 right-0 border-t-4 border-l-4 border-t-amber-700 border-l-transparent w-1 h-1" />
                      </div>
                    )}
                    
                    {/* Dark Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-5 py-2.5 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        Batafsil
                      </span>
                    </div>
                  </div>

                  {/* Museum Placard Typography (Scaled Down) */}
                  <div className="flex flex-col items-center text-center mt-3 px-2">
                    <h3 className="font-serif font-bold text-sm md:text-base text-foreground leading-snug line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                      {locField(book, "title", lang)}
                    </h3>
                    <span className="w-8 h-[1.5px] bg-amber-500/40 my-2 transition-all duration-500 group-hover:w-16 group-hover:bg-amber-500" />
                    <p className="text-[9px] md:text-[10px] font-semibold text-muted-foreground tracking-[0.15em] uppercase">
                      {locField(book, "author", lang)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── HERO-STYLE "VIEW ALL" BUTTON (UNTOUCHED) ───────────────── */}
        <div className="flex justify-center mt-10 mb-8">
          <motion.button
            onClick={() => navigate("/library")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2.5 rounded-xl border border-primary/35 px-8 py-3 text-sm font-semibold text-foreground overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Library className="relative z-10 h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            <span className="relative z-10 font-sans group-hover:text-primary-foreground transition-colors duration-300">
              Barcha kitoblarni ko'rish
            </span>
            <ChevronRight className="relative z-10 h-4 w-4 text-primary group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all duration-300" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CuratedLibrary;