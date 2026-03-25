import { useState, useMemo } from "react";
import { CalendarDays, Feather } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useData } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import parchmentTexture from "@/assets/design/parchment-texture.png";
import blogHeaderArt from "@/assets/design/blog-header-art.png"; // Your newly generated art!

// ── Normalise a DB article into the same shape ───────────────
const toCardShape = (a: { id: string; title: string | null; excerpt: string | null; cover_url: string | null; date: string; published: boolean | null }) => ({
  id: a.id,
  title: a.title ?? "",
  excerpt: a.excerpt ?? "",
  category: "Maqolalar" as string,
  date: a.date,
  readTime: null as string | null,
  image: a.cover_url ?? "",
});

const BLOG_CATEGORIES = ["Barchasi", "Yangiliklar", "Maqolalar"];

const BlogPage = () => {
  const { t } = useLang();
  const { articles, loading } = useData();
  const [activeTab, setActiveTab] = useState("Barchasi");

  const publishedArticles = useMemo(
    () => articles.filter((a) => a.published).map(toCardShape),
    [articles]
  );

  const displayed = useMemo(
    () => activeTab === "Barchasi"
      ? publishedArticles
      : publishedArticles.filter((a) => a.category === activeTab),
    [publishedArticles, activeTab]
  );

  return (
    <div className="min-h-screen bg-background relative isolate flex flex-col">
      <Navbar />

      {/* ── 1. The Physical Canvas Background ── */}
      <div
        className="absolute inset-0 pointer-events-none -z-20 opacity-20 dark:opacity-40"
        style={{ backgroundImage: `url(${parchmentTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* ── 2. Cinematic Lighting Orbs ── */}
      <div className="absolute top-0 right-0 w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] bg-primary/15 dark:bg-primary/10 rounded-full blur-[120px] md:blur-[180px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-amber-700/15 dark:bg-amber-900/20 rounded-full blur-[120px] md:blur-[150px] pointer-events-none -z-10" />
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_90%)]" />

      {/* ── Main Content Wrapper ── */}
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">

        {/* ── Cinematic Editorial Hero Header ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 relative z-10">
          {/* Left Column: Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <span className="w-12 h-[1px] bg-gold/50"></span>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-gold">
                Booktopia Kundaligi
              </p>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight font-bold text-foreground mb-8 tracking-tight leading-tight">
              {t.blog?.title || "So'nggi maqolalar"}
            </h1>

            {/* Elegant Blockquote Style Description */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10 border-l-2 border-gold/40 pl-5">
              Adabiyot olami yangiliklari, eksklyuziv intervyular, asarlar tahlili va nashriyotimizdagi so'nggi jarayonlar bilan tanishing.
            </p>

            {/* Action Button & Meta-tags */}
            <div className="flex flex-wrap items-center gap-6">
              <button
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="btn-glass px-10 py-4"
              >
                Maqolalarni o'qish &darr;
              </button>

              <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <span>Intervyular</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold/50"></span>
                <span>Tahlil</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Artistic Element Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Premium Golden Corner Accents */}
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-gold/50 rounded-tl-2xl z-10 pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-gold/50 rounded-br-2xl z-10 pointer-events-none" />

            {/* The Artistic Image Container */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/30 dark:shadow-amber-500/10 border border-border/50 group">
              <img
                src={blogHeaderArt}
                alt="Booktopia Kundaligi Art"
                className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000"
              />

              {/* Dark gradient at the bottom so the text pops */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

              {/* Floating Caption / Stamp */}
              <div className="absolute bottom-6 left-8 z-20">
                <p className="text-accent font-serif italic text-2xl drop-shadow-lg">"Qalam va Qog'oz Sehri"</p>
                <p className="text-white/70 text-xs tracking-widest uppercase font-bold mt-2">Nashriyot Kundaligi</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Premium Category Tabs ────────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap items-center gap-3 mb-12 border-b border-border/50 pb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {BLOG_CATEGORIES.map((category) => {
            const isActive = activeTab === category;

            return (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`
                  transition-all duration-300
                  ${isActive
                    ? "btn-glass scale-105"
                    : "btn-glass-ghost opacity-70 hover:opacity-100"
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </motion.div>

        {/* ── Article Grid ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {loading ? (
              // Loading state
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col h-full bg-card/50 border border-border/50 rounded-2xl overflow-hidden" aria-hidden="true">
                    <div className="skeleton-shimmer w-full aspect-[16/10]" />
                    <div className="p-6 flex flex-col gap-3">
                      <div className="skeleton-shimmer h-3 w-1/3 rounded-full" />
                      <div className="skeleton-shimmer h-6 w-5/6 rounded-md my-2" />
                      <div className="skeleton-shimmer h-4 w-1/4 rounded-full" />
                      <div className="skeleton-shimmer h-16 w-full rounded-md mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayed.length === 0 ? (
              // Empty State
              <div className="border border-dashed border-border/60 bg-muted/10 py-32 flex flex-col items-center justify-center rounded-3xl">
                <Feather className="w-12 h-12 text-accent/30 mb-6" />
                <p className="font-serif text-xl text-muted-foreground">
                  Hozircha ushbu ruknda maqolalar yo'q
                </p>
              </div>
            ) : (
              // Grid
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {displayed.map((article, i) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.05 } }}
                    className="group flex flex-col h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-500"
                  >
                    <Link to={`/blog/${article.id}`} className="flex flex-col h-full">
                      {/* Image */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                        <img
                          src={article.image || "https://placehold.co/600x400/121212/262626?text=Image"}
                          alt={article.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 z-10">
                          <span className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-md backdrop-blur-md border border-white/20
                            ${article.category === "Taxtlar O'yini"
                              ? "bg-gold text-white"
                              : "bg-background/90 text-foreground"
                            }`}
                          >
                            {article.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wide">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>{article.date}</span>
                          </div>
                          {article.readTime && (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-gold/50"></span>
                              <span>{article.readTime}</span>
                            </>
                          )}
                        </div>

                        <h3 className="text-xl font-heading font-black tracking-tight font-bold text-foreground leading-snug mb-3 group-hover:text-primary dark:group-hover:text-accent transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                          {article.excerpt}
                        </p>

                        <div className="mt-auto flex items-center text-sm font-bold text-foreground group-hover:text-accent transition-colors uppercase tracking-widest">
                          Batafsil o'qish
                          <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;