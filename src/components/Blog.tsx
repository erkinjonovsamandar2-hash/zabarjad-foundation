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
    title: "Kuzgi xalqaro kitob ko'rgazmasi: Zabarjad Media yangiliklari",
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
    <section id="blog" className="py-20 md:py-28 relative isolate overflow-hidden bg-background">
      
      {/* ── 1. The Physical Canvas (Boosted Visibility) ── */}
      <div 
        className="absolute inset-0 pointer-events-none -z-20 opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" 
        style={{ backgroundImage: `url(${parchmentTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      
      {/* ── 2. The "Candlelight" Orbs (Stronger Glow) ── */}
      {/* Top Right Warm Glow */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-amber-500/20 dark:bg-amber-500/15 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10" />
      {/* Bottom Left Deep Amber Glow */}
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-amber-700/20 dark:bg-amber-900/30 rounded-full blur-[100px] md:blur-[120px] pointer-events-none -z-10" />

      {/* ── 3. Edge Vignette (Blends into the rest of the site) ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_90%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Clean Editorial Header ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          {/* Classic Book-Plate Badge */}
          <div className="inline-flex items-center gap-4 mb-5">
            <span className="w-8 h-[1px] bg-amber-500/50"></span>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-500">
              Zabarjad Kundaligi
            </p>
            <span className="w-8 h-[1px] bg-amber-500/50"></span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight mb-4">
            {t.blog?.title || "So'nggi maqolalar"}
          </h2>
          
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Adabiyot olami yangiliklari, eksklyuziv intervyular va nashriyotimizdagi so'nggi jarayonlar bilan tanishing.
          </p>
        </motion.div>

        {/* ── Premium Category Tabs ────────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap items-center gap-3 mb-10 border-b border-border/50 pb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {BLOG_CATEGORIES.map((category) => {
            const isActive = activeTab === category;
            const isGoT = category === "Taxtlar O'yini";

            return (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive 
                    ? isGoT 
                      ? "bg-amber-500 text-black font-got tracking-wider shadow-md transform scale-105" 
                      : "bg-foreground text-background shadow-md transform scale-105"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
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
                <Feather className="w-10 h-10 text-amber-500/30 mb-4" />
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
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.07 } }}
                    className="group flex flex-col h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-500"
                  >
                    <Link to={`/blog/${article.id}`} className="flex flex-col h-full">
                      {/* Image Container with 16/10 Ratio */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Floating Category Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md backdrop-blur-md
                            ${article.category === "Taxtlar O'yini" 
                              ? "bg-amber-500/90 text-black font-got shadow-amber-500/20" 
                              : "bg-background/90 text-foreground border border-border/50"
                            }`}
                          >
                            {article.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wide">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>{article.date}</span>
                          </div>
                          <span className="w-1 h-1 rounded-full bg-amber-500/50"></span>
                          <span>{article.readTime}</span>
                        </div>
                        
                        <h3 className="text-xl font-serif font-bold text-foreground leading-snug mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                          {article.excerpt}
                        </p>

                        <div className="mt-auto flex items-center text-sm font-bold text-foreground group-hover:text-amber-500 transition-colors uppercase tracking-widest">
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

        {/* ── HERO-STYLE "VIEW ALL" BUTTON ───────────────── */}
        <div className="flex justify-center mt-12 mb-8 relative z-10">
          <motion.button
            onClick={() => navigate("/blog")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2.5 rounded-xl border border-primary/35 px-8 py-3 text-sm font-semibold text-foreground overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Feather className="relative z-10 h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            <span className="relative z-10 font-sans group-hover:text-primary-foreground transition-colors duration-300">
              Barcha maqolalarni ko'rish
            </span>
            <ChevronRight className="relative z-10 h-4 w-4 text-primary group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all duration-300" />
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default Blog;