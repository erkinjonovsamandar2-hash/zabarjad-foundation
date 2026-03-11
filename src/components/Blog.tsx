import { useState } from "react";
import { CalendarDays, Feather, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import parchmentTexture from "@/assets/design/parchment-texture.png";

// ── Mock Data for Design Preview ──────────────────────────────────────────────
const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Jorj R.R. Martin yangi asar ustida ishlamoqda: Vesterosga qaytish",
    excerpt: "Vesteros olami kengayishda davom etmoqda. Muallif o'zining so'nggi intervyusida 'Qish shamollari' va kelajakdagi rejalar haqida ma'lumot berdi...",
    category: "Taxtlar O'yini",
    date: "12 May, 2025",
    readTime: "5 daqiqa",
    image: "https://images.squarespace-cdn.com/content/v1/5fbc4a62c2150e62cfcb09aa/1711923533756-RKYMH1UTDE6GRWN9TFA4/maxresdefault.jpg"
  },
  {
    id: 2,
    title: "Kuzgi xalqaro kitob ko'rgazmasi: Booktopia yangiliklari",
    excerpt: "Bu yilgi xalqaro kitob ko'rgazmasida nashriyotimiz o'zining eng sara asarlari va yangi tarjimalari bilan ishtirok etadi.",
    category: "Yangiliklar",
    date: "05 May, 2025",
    readTime: "3 daqiqa",
    image: "https://www.gazeta.uz/media/img/2023/12/0TgTqp17029053661735_l.jpg"
  },
  {
    id: 3,
    title: "Tarjima san'ati: 'Dorian Greyning portreti' qanday o'zbekchalashtirildi?",
    excerpt: "Oskar Uayldning mashhur asarini o'zbek tiliga o'girishdagi qiyinchiliklar, badiiy echimlar va yutuqlar haqida mutaxassislar bilan suhbat.",
    category: "Maqolalar",
    date: "28 Aprel, 2024",
    readTime: "8 daqiqa",
    image: "https://assets.asaxiy.uz/product/items/desktop/c9f0f895fb98ab9159f51fd0297e236d2025031722075875443vyRTNlvRhA.jpg.webp"
  }
];

const BLOG_CATEGORIES = ["Barchasi", "Yangiliklar", "Maqolalar", "Taxtlar O'yini"];

// ── Main component ────────────────────────────────────────────────────────────
const Blog = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Barchasi");

  // Filter mock articles based on active tab AND limit to 3 for the homepage
  const displayed = (activeTab === "Barchasi"
    ? MOCK_ARTICLES
    : MOCK_ARTICLES.filter(a => a.category === activeTab)).slice(0, 3);

  return (
    <section id="blog" className="py-24 md:py-32 relative isolate overflow-hidden bg-background">

      {/* ── 1. The Physical Canvas (Boosted Visibility) ── */}
      <div
        className="absolute inset-0 pointer-events-none -z-20 opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen"
        style={{ backgroundImage: `url(${parchmentTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      {/* Top Right Warm Glow */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/20 dark:bg-primary/15 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10" />
      {/* Bottom Left Deep Amber Glow */}
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-amber-700/20 dark:bg-amber-900/30 rounded-full blur-[100px] md:blur-[120px] pointer-events-none -z-10" />

      {/* ── 3. Edge Vignette (Blends into the rest of the site) ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_90%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Clean Editorial Header ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-col items-center text-center"
        >
          {/* Classic Book-Plate Badge */}
          <div className="inline-flex items-center gap-4 mb-5">
            <span className="w-8 h-[1px] bg-primary/50"></span>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-accent">
              Booktopia Kundaligi
            </p>
            <span className="w-8 h-[1px] bg-primary/50"></span>
          </div>

          <h2 className="font-heading text-5xl font-bold leading-[1.05] tracking-wide text-foreground mb-4">
            {t.blog?.title || "So'nggi maqolalar"}
          </h2>

          <p className="font-serif text-foreground/80 text-lg max-w-2xl mx-auto leading-loose">
            Adabiyot olami yangiliklari, eksklyuziv intervyular va nashriyotimizdagi so'nggi jarayonlar bilan tanishing.
          </p>
        </motion.div>

        {/* ── Premium Category Tabs ────────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap items-center justify-center w-full gap-3 mb-10 border-b border-border/50 pb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {BLOG_CATEGORIES.map((category) => {
            const isActive = activeTab === category;
            const isGoT = category === "Taxtlar O'yini";

            return (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`
                  font-sans text-[11px] font-bold tracking-[0.2em] uppercase px-6 py-2.5 rounded-full transition-all duration-500 ease-out
                  ${isActive
                    ? "bg-primary text-primary-foreground shadow-[0_10px_25px_-5px_rgba(0,205,254,0.4)] transform scale-105 border-none"
                    : "bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/60 dark:border-white/10 text-foreground/70 hover:shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:text-foreground"
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </motion.div>

        {/* ── Tab Content / Article Grid ───────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {displayed.length === 0 ? (
              // ── Editorial empty state ─────────────────────────────────────
              <div className="border border-dashed border-border/60 bg-muted/10 py-20 flex flex-col items-center justify-center rounded-2xl">
                <Feather className="w-10 h-10 text-accent/30 mb-4" />
                <p className="font-serif text-lg text-muted-foreground">
                  Hozircha ushbu ruknda maqolalar yo'q
                </p>
              </div>
            ) : (
              // ── Editorial Article Cards ───────────────────────────────────
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {displayed.map((article, i) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: i * 0.07 } }}
                    className="group flex flex-col h-full bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(38,89,153,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(38,89,153,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.16)] hover:-translate-y-1 transition-all duration-500 ease-out"
                  >
                    <Link to={`/blog/${article.id}`} className="flex flex-col h-full">
                      {/* Image Container with 16/10 Ratio */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 1.2 }}
                          className="w-full h-full"
                        >
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                        </motion.div>
                        {/* Floating Category Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className={`px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-md backdrop-blur-md
                            ${article.category === "Taxtlar O'yini"
                              ? "bg-primary/90 text-foreground shadow-[0_4px_15px_rgba(245,158,11,0.2)] border-none"
                              : "bg-white/80 dark:bg-black/60 text-foreground border border-white/60 dark:border-white/10"
                            }`}
                          >
                            {article.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 font-sans text-[10px] text-muted-foreground mb-4 font-bold uppercase tracking-[0.2em]">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>{article.date}</span>
                          </div>
                          <span className="w-1 h-1 rounded-full bg-primary/50"></span>
                          <span>{article.readTime}</span>
                        </div>

                        <h3 className="font-heading tracking-wide leading-tight text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-500 ease-out line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="font-serif text-foreground/80 leading-loose line-clamp-3 mb-6 flex-grow">
                          {article.excerpt}
                        </p>

                        <div className="mt-auto flex items-center font-sans text-[11px] font-bold text-foreground group-hover:text-accent transition-colors duration-500 ease-out uppercase tracking-[0.2em]">
                          Batafsil o'qish
                          <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-500 ease-out">&rarr;</span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── HERO-STYLE "VIEW ALL" BUTTON ───────────────── */}
        <div className="flex justify-center mt-12 mb-8 relative z-10">
          <motion.button
            onClick={() => navigate("/blog")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2.5 rounded-2xl border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-2xl hover:bg-primary px-8 py-3.5 sm:py-4 transition-all duration-500 ease-out shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-2xl" />
            <Feather className="relative z-10 h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors duration-500 ease-out" />
            <span className="relative z-10 font-sans text-[11px] tracking-[0.2em] font-bold uppercase group-hover:text-primary-foreground transition-colors duration-500 ease-out text-foreground">
              Barcha maqolalarni ko'rish
            </span>
            <ChevronRight className="relative z-10 h-4 w-4 text-primary group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all duration-500 ease-out" />
          </motion.button>
        </div>

      </div>
    </section >
  );
};

export default Blog;