import { useState, useMemo } from "react";
import { Feather, ChevronRight, AlertTriangle, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useData } from "@/context/DataContext";
import parchmentTexture from "@/assets/design/parchment-texture.png";

// ── Normalise a DB article into the same shape ───────────────
const toCardShape = (a: { id: string; title: string | null; excerpt: string | null; cover_url: string | null; date: string; published: boolean | null; category?: string | null; reading_time?: string | null }) => ({
  id: a.id,
  title: a.title ?? "",
  excerpt: a.excerpt ?? "",
  category: a.category ?? "Maqolalar",
  date: a.date,
  readTime: a.reading_time ?? null,
  image: a.cover_url ?? "",
});

const BLOG_CATEGORIES = ["Barchasi", "Tahlil", "Adabiy tahlil", "O'qish madaniyati", "Muallif haqida", "Yangiliklar", "Maqolalar"];

// ── Main component ────────────────────────────────────────────────────────────
const Blog = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const { articles, loading, articlesError } = useData();
  const [activeTab, setActiveTab] = useState("Barchasi");

  const publishedArticles = useMemo(
    () => articles.filter((a) => a.published).map(toCardShape),
    [articles]
  );

  const displayed = useMemo(
    () =>
      (activeTab === "Barchasi"
        ? publishedArticles
        : publishedArticles.filter((a) => a.category === activeTab)
      ).slice(0, 3),
    [publishedArticles, activeTab]
  );

  return (
    <section id="blog" className="py-24 md:py-32 relative isolate overflow-hidden bg-background border-y border-border">

      <div
        className="absolute inset-0 pointer-events-none -z-20 opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen"
        style={{ backgroundImage: `url(${parchmentTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/20 dark:bg-primary/15 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10" />
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_90%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Clean Editorial Header ──────────────────────── */}
        <div className="mb-12 flex flex-col items-start text-left w-full">
          <div className="inline-flex items-center gap-4 mb-5">
            <span className="w-8 h-[1px] bg-gold/50"></span>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              Booktopia Kundaligi
            </p>
          </div>

          <h2 className="font-heading text-5xl sm:text-6xl text-foreground mb-4 w-full">
            {t.blog?.title || "So'nggi maqolalar"}
          </h2>

          <p className="font-serif text-muted-foreground text-lg max-w-2xl leading-loose">
            Adabiyot olami yangiliklari, eksklyuziv intervyular va nashriyotimizdagi so'nggi jarayonlar bilan tanishing.
          </p>
        </div>

        {/* ── Navigation / Tabs ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-start w-full gap-4 mb-12 border-b border-border/50 pb-8">
          {BLOG_CATEGORIES.map((category) => {
            const isActive = activeTab === category;
            return (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`
                  transition-all duration-200
                  ${isActive
                    ? "btn-glass"
                    : "btn-glass-ghost opacity-70 hover:opacity-100"
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* ── Main Content Area ───────────────────────────────────── */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col h-full bg-card border-[0.5px] border-border rounded-[var(--radius)] overflow-hidden" aria-hidden="true">
                <div className="skeleton-shimmer w-full aspect-[16/9]" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="skeleton-shimmer h-3 w-1/3 rounded-[4px]" />
                  <div className="skeleton-shimmer h-5 w-5/6 rounded-[4px]" />
                  <div className="skeleton-shimmer h-3 w-1/4 rounded-[4px]" />
                  <div className="skeleton-shimmer h-12 w-full rounded-[4px] mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : articlesError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
            <AlertTriangle className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="font-sans text-sm text-muted-foreground">Maqolalarni yuklashda xatolik yuz berdi</p>
            <p className="font-sans text-xs text-muted-foreground/70 mt-1">Iltimos, sahifani yangilang</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {displayed.length === 0 ? (
                <div className="border border-dashed border-border/60 bg-muted/10 py-20 flex flex-col items-center justify-center rounded-[var(--radius)]">
                  <Feather className="w-10 h-10 text-muted-foreground mb-4" />
                  <p className="font-serif text-lg text-muted-foreground">
                    Hozircha ushbu ruknda maqolalar yo'q
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {displayed.map((article, i) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }}
                      className="group flex flex-col h-full bg-card border-[0.5px] border-border rounded-[var(--radius)] overflow-hidden hover:border-primary/30 transition-[0.2s] cursor-pointer"
                      onClick={() => navigate(`/blog/${article.id}`)}
                    >
                      <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
                        <img
                          src={article.image || "https://placehold.co/600x400/121212/262626?text=Image"}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-t-[var(--radius)]"
                        />
                      </div>

                      <p className="font-sans text-[0.6rem] uppercase tracking-[0.14em] text-primary mt-3 px-4">
                        {article.category}
                      </p>

                      <h3 className="font-heading text-[1.1rem] line-clamp-2 px-4 py-1 text-foreground">
                        {article.title}
                      </h3>

                      <p className="font-sans text-[0.7rem] text-muted-foreground px-4 mb-2">
                        {article.date} {article.readTime && `• ${article.readTime}`}
                      </p>

                      <p className="font-serif text-[0.85rem] line-clamp-3 text-muted-foreground px-4 pb-4">
                        {article.excerpt}
                      </p>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── HERO-STYLE "VIEW ALL" BUTTON ───────────────── */}
        <div className="flex justify-center mt-12 mb-8 relative z-10 w-full">
          <motion.button
            onClick={() => navigate("/blog")}
            whileTap={{ scale: 0.985 }}
            className="btn-glass"
          >
            <Feather className="h-4 w-4" />
            <span className="font-sans text-[11px] tracking-[0.2em] font-bold uppercase">
              Barcha maqolalarni ko'rish
            </span>
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>

      </div>
    </section >
  );
};

export default Blog;