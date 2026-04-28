import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CalendarDays, Clock, ArrowLeft, Feather, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import parchmentTexture from "@/assets/design/parchment-texture.png";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

const UZ_MONTHS = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getDate()} ${UZ_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
};

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { articles, loading } = useData();
  const isMobile = useIsMobile();

  // support both slug-based and legacy UUID-based URLs
  const article = useMemo(
    () => articles.find(
      (a) => a.published && ((a.slug && a.slug === slug) || a.id === slug)
    ),
    [articles, slug]
  );

  // Split content into paragraphs for readable rendering
  const paragraphs = useMemo(() => {
    if (!article?.content) return [];
    return article.content
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [article]);

  return (
    <div className="min-h-screen bg-background relative isolate flex flex-col">
      <Navbar />

      {/* ── Canvas Background ── */}
      <div
        className="absolute inset-0 pointer-events-none -z-20 opacity-20 dark:opacity-40"
        style={{ backgroundImage: `url(${parchmentTexture})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-700/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <main className="flex-grow pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-3xl w-full">

        {/* ── Back link ── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 sm:mb-10"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </button>
        </motion.div>

        {loading ? (
          /* Loading skeleton */
          <div className="space-y-6 animate-pulse">
            <div className="h-4 w-24 bg-muted rounded-full" />
            <div className="h-10 w-4/5 bg-muted rounded-lg" />
            <div className="h-4 w-40 bg-muted rounded-full" />
            <div className="aspect-[16/9] w-full bg-muted rounded-2xl" />
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-muted rounded" style={{ width: `${85 + (i % 3) * 5}%` }} />
              ))}
            </div>
          </div>
        ) : !article ? (
          /* Not found */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Feather className="w-12 h-12 text-accent/30 mb-6" />
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
              Maqola topilmadi
            </h1>
            <p className="text-muted-foreground mb-8">
              Bu maqola mavjud emas yoki nashr qilinmagan.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 btn-glass"
            >
              <ArrowLeft className="h-4 w-4" />
              Barcha maqolalarga qaytish
            </Link>
          </div>
        ) : (
          /* ── Article ── */
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Category */}
            {article.category && (
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary mb-4">
                {article.category}
              </p>
            )}

            {/* Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight mb-6 break-words hyphens-auto">
              {article.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-6 font-medium uppercase tracking-wide border-b border-border/50 pb-6">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              {article.reading_time && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{article.reading_time}</span>
                </div>
              )}
            </div>

            {/* Cover image */}
            {article.image_url && (
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 sm:mb-10 shadow-2xl shadow-black/20">
                <img
                  src={article.image_url}
                  alt={article.title}
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  className="img-fade w-full h-full object-cover"
                  style={{
                    objectPosition: isMobile
                      ? `${article.focus_mobile_x ?? 50}% ${article.focus_mobile_y ?? 50}%`
                      : `${article.focus_desktop_x ?? 50}% ${article.focus_desktop_y ?? 50}%`,
                  }}
                  onLoad={(e) => e.currentTarget.classList.add("loaded")}
                />
              </div>
            )}

            {/* ── Reading card ── */}
            <div className="sm:bg-card/70 sm:dark:bg-card/60 sm:backdrop-blur-md sm:border sm:border-border/50 sm:rounded-2xl px-0 sm:px-10 py-0 sm:py-10 sm:shadow-xl sm:shadow-black/10">

              {/* Excerpt / lead */}
              {article.excerpt && (
                <p className="text-base sm:text-xl font-serif text-foreground/80 leading-relaxed border-l-2 border-gold/50 pl-4 sm:pl-5 mb-6 sm:mb-8 italic">
                  {article.excerpt}
                </p>
              )}

              {/* Body content */}
              {paragraphs.length > 0 ? (
                <div className="space-y-5">
                  {paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className="font-serif text-base sm:text-[1.05rem] leading-[1.9] text-foreground/90 hyphens-auto"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic font-serif">
                  Maqola matni hozircha mavjud emas.
                </p>
              )}

              {/* ── Author ── */}
              {article.author_name && (
                <div className="mt-8 pt-7 border-t border-border/40 flex items-center gap-4">
                  {article.author_photo ? (
                    <img
                      src={article.author_photo}
                      alt={article.author_name}
                      className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-border shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full shrink-0 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-900/10 ring-2 ring-border flex items-center justify-center">
                      <span className="font-heading font-black text-xl text-amber-700 dark:text-amber-400 select-none">
                        {article.author_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50 mb-0.5">
                      Muallif
                    </span>
                    {article.author_link ? (
                      <a
                        href={article.author_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-heading font-bold text-base text-foreground hover:text-primary transition-colors"
                      >
                        {article.author_name}
                        <ExternalLink className="w-3.5 h-3.5 opacity-40" />
                      </a>
                    ) : (
                      <span className="font-heading font-bold text-base text-foreground">
                        {article.author_name}
                      </span>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* ── Footer nav ── */}
            <div className="mt-16 pt-8 border-t border-border/50 flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Orqaga
              </button>
              <Link
                to="/blog"
                className="text-sm font-medium text-primary hover:underline"
              >
                Barcha maqolalar →
              </Link>
            </div>
          </motion.article>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostDetail;
