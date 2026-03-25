import { useState, useMemo, startTransition } from "react";
import { BookOpen, Library, ChevronRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { useLang, locField } from "@/context/LanguageContext";
import parchmentTexture from "@/assets/design/parchment-texture.png";

// ── Local Categories Configuration ───────────────────────────────────────────
// FIX: Removed "got" and "featured" (Tez Kunda) so it doesn't overlap with YangiNashrlar
const CATEGORIES = ["all", "new", "golden"] as const;

// ── Helper: Get Category Label (Multilingual) ─────────────────────────────────
const getCategoryLabel = (key: string, lang: string): string => {
  const labels: Record<string, { uz: string; ru: string; en: string }> = {
    all: { uz: "Barchasi", ru: "Все", en: "All" },
    new: { uz: "Yangi nashrlar", ru: "Новинки", en: "New Releases" },
    golden: { uz: "Oltin kolleksiya", ru: "Золотая коллекция", en: "Golden Collection" },
  };
  return labels[key]?.[lang as keyof typeof labels.all] ?? key;
};

// ── Resolve cover URL ─────────────────────────────────────────────────────────
const getImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base}/storage/v1/object/public/${url}`;
};

// ── Skeleton Book Card ────────────────────────────────────────────────────────────────
const BookSkeleton = () => (
  <div className="flex flex-col gap-2 max-w-[220px] mx-auto w-full" aria-hidden>
    <div className="skeleton-shimmer w-full aspect-[2/3] rounded-[var(--radius)]" />
    <div className="flex flex-col items-center gap-2 mt-3 px-2">
      <div className="skeleton-shimmer h-4 rounded-[4px]" style={{ width: "70%" }} />
      <div className="skeleton-shimmer h-3 rounded-[4px]" style={{ width: "40%" }} />
    </div>
  </div>
);

const GRID_COUNT = 3;

const CuratedLibrary = () => {
  const { books, loading: dataLoading, booksError } = useData() as ReturnType<typeof useData> & { booksError?: boolean };
  const { lang, t } = useLang();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("all");

  // ── Filter Logic ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (activeTab === "all") return true;
      if (activeTab === "featured") return b.featured === true;
      if (activeTab === "new") return b.sort_order !== null && b.sort_order <= 5;
      return b.category === activeTab;
    });
  }, [books, activeTab]);

  const displayedBooks = useMemo(() => filtered.slice(0, 3), [filtered]);

  return (
    <section id="library" className="relative isolate overflow-hidden section-padding bg-charcoal">

      {/* ── Parchment Texture Overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: `url(${parchmentTexture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)]" />

      <div className="mx-auto max-w-7xl">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center mb-16 pt-8 md:pt-12"
        >
          {/* Giant Watermark */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full text-[80px] md:text-[130px] lg:text-[160px] font-serif font-black text-foreground/5 uppercase tracking-widest select-none pointer-events-none -z-10 leading-none whitespace-nowrap">
            Kutubxona
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-primary/50" />
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] text-primary uppercase">
              {t.library.badge}
            </p>
            <span className="w-12 h-[1px] bg-primary/50" />
          </div>

          {/* Title */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] tracking-wide text-foreground mb-6">
            {t.library.title}
          </h2>

          {/* Subtitle */}
          <p className="font-serif text-lg leading-loose text-muted-foreground text-center max-w-2xl mx-auto">
            Nashriyotimizning eng sara, jahon va o'zbek adabiyoti durdonalari bilan tanishing. O'zingiz uchun yangi olam kashf eting.
          </p>
        </motion.div>

        {/* ── Category Pill Tabs ── */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {CATEGORIES.map((categoryKey) => {
            const isActive = activeTab === categoryKey;
            // FIX: Removed `isGoT` constant and conditional styling.
            // The button now uses a single style path.

            return (
              <button
                key={categoryKey}
                onClick={() => {
                  startTransition(() => {
                    setActiveTab(categoryKey);
                  });
                }}
                className={`
                  font-sans text-[11px] font-bold tracking-[0.2em] uppercase
                  px-6 py-2.5 rounded-[var(--radius)] transition-colors duration-200
                  ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-muted-foreground border-[0.5px] border-border hover:bg-muted"
                  }
                `}
              >
                {getCategoryLabel(categoryKey, lang)}
              </button>
            );
          })}
        </div>

        {/* ── 3D Book Grid ── */}
        {dataLoading ? (
          /* Skeleton: same 3-column grid, same dimensions as real cards */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-3xl md:max-w-4xl mx-auto px-4" aria-label="Yuklanmoqda...">
            {Array.from({ length: GRID_COUNT }).map((_, i) => (
              <BookSkeleton key={i} />
            ))}
          </div>
        ) : booksError ? (
          /* Error state */
          <div className="flex flex-col items-center justify-center py-12 text-center" role="alert">
            <AlertTriangle className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="font-sans text-sm text-muted-foreground">Kitoblarni yuklashda xatolik yuz berdi</p>
            <p className="font-sans text-xs text-muted-foreground/70 mt-1">Iltimos, sahifani yangilang</p>
          </div>
        ) : (
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
                    <div className="relative w-full aspect-[2/3] rounded-l-sm rounded-r-xl overflow-hidden shadow-[4px_4px_10px_rgba(0,0,0,0.15),_inset_-4px_0_4px_rgba(255,255,255,0.4)] group-hover:-translate-y-3 group-hover:-rotate-1 group-hover:shadow-[15px_20px_30px_rgba(0,0,0,0.2)] transition-all duration-500 bg-muted">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={locField(book, "title", lang)}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center bg-secondary w-full h-full">
                          <BookOpen className="h-10 w-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
                        </div>
                      )}

                      {/* Spine Hinge */}
                      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 via-white/20 to-transparent pointer-events-none border-l border-white/20" />

                      {/* Ribbon Badge (first book only) */}
                      {i === 0 && (
                        <div className="absolute top-4 right-0 z-20 translate-x-1">
                          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-foreground text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-l-sm shadow-[0_4px_10px_rgba(245,158,11,0.4)]">
                            Yangi nashr
                          </div>
                          <div className="absolute -bottom-1 right-0 border-t-4 border-l-4 border-t-amber-700 border-l-transparent w-1 h-1" />
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 bg-primary text-primary-foreground rounded-full shadow-[0_10px_25px_-5px_rgba(115,197,238,0.4)] scale-90 group-hover:scale-100 transition-transform duration-500 ease-out">
                          Batafsil
                        </span>
                      </div>
                    </div>

                    {/* Museum Placard Typography */}
                    <div className="flex flex-col items-center text-center mt-3 px-2">
                      <h3 className="font-heading text-lg font-bold leading-tight tracking-wide text-foreground text-center line-clamp-2 group-hover:text-primary transition-colors duration-500 ease-out">
                        {locField(book, "title", lang)}
                      </h3>
                      <span className="w-8 h-[1.5px] bg-primary/40 my-2 transition-all duration-500 group-hover:w-16 group-hover:bg-primary" />
                      <p className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-primary mt-1 line-clamp-1">
                        {locField(book, "author", lang)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ── View All Button ── */}
        <div className="flex justify-center mt-10 mb-8 w-full">
          <motion.button
            onClick={() => navigate("/library")}
            whileTap={{ scale: 0.985 }}
            className="btn-glass flex items-center justify-center gap-2.5 w-full max-w-[320px] sm:max-w-md px-8 py-4 transition-all duration-200"
          >
            <Library className="relative z-10 h-4 w-4" />
            <span className="relative z-10 font-sans text-[11px] tracking-[0.2em] font-bold uppercase">
              Barcha kitoblarni ko'rish
            </span>
            <ChevronRight className="relative z-10 h-4 w-4" />
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default CuratedLibrary;