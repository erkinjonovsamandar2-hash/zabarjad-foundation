import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import type { Book } from "@/context/DataContext";
import { useLang, locField } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import librarySeal from "@/assets/design/library-seal.png";

// ── Local Categories Configuration ────────────────────────────────────────────
const CATEGORIES = ["all", "new", "featured", "golden", "got"] as const;
const GOT_CATEGORY_KEY = "got";

// ── Featured Books for Carousel (Publishing House Selection) ─────────────────
const FEATURED_BOOKS = [
  {
    id: "dorian",
    title: "Dorian Greyning portreti",
    author: "Oskar Uayld",
    description: "Go'zallik va abadiy yoshlik vasvasasiga tushgan yigitning hayotiy fojiasi. Dunyo klassikasining durdona asari.",
    coverImage: "https://backend.book.uz/user-api/img/img-file-f2a929a2a32d5bb4bb4e05dcd8f8670c.jpg"
  },
  {
    id: "zulayho",
    title: "Zulayho ko'zini ochyapti",
    author: "Go'zal Yaxina",
    description: "Surgun qilingan ayolning qahraton Sibirdagi omon qolish va sevgi tarixi. Zamonaviy adabiyotning eng kuchli asarlaridan biri.",
    coverImage: "https://backend.book.uz/user-api/img/img-8b1bc484779e7dd00942b1a3a9a3735b.jpg"
  },
  {
    id: "qirolicha",
    title: "Qirolichaning yurishi",
    author: "Uolter Tevis",
    description: "Shaxmat dahosi bo'lgan qizning ichki kurashi, yolg'izlik va yuksalish yo'li. Iroda va iste'dodning kuchli hikoyasi.",
    coverImage: "https://upload.wikimedia.org/wikipedia/uz/a/a5/Qirolichaning_yurishi_%28roman%29.jpg"
  }
] as const;

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

const LibraryPage = () => {
  const { books } = useData();
  const { lang, t } = useLang();

  const [active, setActive] = useState<string>("all");
  
  // Carousel state for Featured Books
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Auto-rotate featured books every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_BOOKS.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const featuredBook = FEATURED_BOOKS[currentIndex];

  // ── Filter Logic with Special Handling for "All" and "Taxtlar O'yini" ──────
  const filtered = books.filter((b) => {
    // Show all books for "Barchasi" category
    if (active === "all") return true;
    
    // Special filter for Game of Thrones series
    if (active === GOT_CATEGORY_KEY) {
      const titleLower = b.title?.toLowerCase() || "";
      const titleEnLower = b.title_en?.toLowerCase() || "";
      const titleRuLower = b.title_ru?.toLowerCase() || "";
      return (
        titleLower.includes("taxtlar") ||
        titleLower.includes("qirollar") ||
        titleEnLower.includes("game") ||
        titleEnLower.includes("thrones") ||
        titleRuLower.includes("престол") ||
        titleRuLower.includes("игра")
      );
    }
    
    // Regular category filter (for "new", "featured", "golden")
    return b.category === active;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="section-padding pt-24 bg-charcoal">
        <div className="mx-auto max-w-7xl">
          
          {/* ── DECORATED FEATURED BOOKS HERO CAROUSEL ─────────────────── */}
          <div className="relative w-full max-w-6xl mx-auto min-h-[450px] flex flex-col md:flex-row items-center bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-[#0a0806] border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden p-8 md:p-12 shadow-2xl mb-16">
            
            {/* Elegant Corner Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-amber-500/20 rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-amber-500/20 rounded-br-3xl pointer-events-none" />

            {/* Custom 3D Library Seal / Watermark */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 md:w-96 md:h-96 opacity-10 dark:opacity-[0.15] pointer-events-none mix-blend-luminosity z-0 transform -rotate-12">
              <img 
                src={librarySeal} 
                alt="Library Seal" 
                className="w-full h-full object-contain drop-shadow-2xl" 
              />
            </div>

            <AnimatePresence mode="wait">
              {/* Left Column: Book Image */}
              <motion.div
                key={`book-${currentIndex}`}
                initial={{ opacity: 0, y: -50, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: 50, rotate: 5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex-1 flex justify-center items-center relative z-10"
              >
                {/* Glowing Aura Behind Book */}
                <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full scale-75" />
                <img 
                  src={featuredBook.coverImage} 
                  alt={featuredBook.title} 
                  className="w-48 md:w-64 aspect-[2/3] object-cover rounded-md shadow-2xl relative z-10 border border-white/10" 
                />
              </motion.div>

              {/* Right Column: Text Content */}
              <motion.div
                key={`text-${currentIndex}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="flex-1 flex flex-col justify-center items-start text-left mt-8 md:mt-0 relative z-10"
              >
                <span className="text-amber-600 dark:text-amber-500 font-bold tracking-[0.2em] text-xs uppercase mb-4">
                  Hafta Tanlovi
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4 leading-tight">
                  {featuredBook.title}
                </h2>
                <p className="text-muted-foreground text-base md:text-lg mb-8 line-clamp-3 max-w-xl">
                  {featuredBook.description}
                </p>
                <button className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                  Kitob haqida
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {FEATURED_BOOKS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-amber-500 w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to book ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── HEADER + FILTER PILLS + PDF CATALOG BUTTON ─────────────── */}
          <div className="mb-10 mt-16">
            {/* Premium Centered Header */}
            <div className="text-center mb-8">
              <p className="text-sm font-semibold tracking-[0.2em] text-amber-500 uppercase mb-3">
                KUTUBXONA
              </p>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground">
                Tanlangan kitoblar
              </h1>
            </div>

            {/* Filters + PDF Catalog Button */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Category Filters */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {CATEGORIES.map((categoryKey) => {
                  const isActive = active === categoryKey;
                  const isGoT = categoryKey === GOT_CATEGORY_KEY;
                  
                  return (
                    <button
                      key={categoryKey}
                      onClick={() => setActive(categoryKey)}
                      className={`
                        px-6 py-2.5 rounded-full text-sm font-medium
                        transition-all duration-300
                        ${isActive 
                          ? isGoT
                            ? "bg-amber-500 text-black font-got tracking-wider shadow-md transform scale-105"
                            : "bg-foreground text-background shadow-md transform scale-105"
                          : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted hover:text-foreground hover:border-border/50"
                        }
                      `}
                    >
                      {getCategoryLabel(categoryKey, lang)}
                    </button>
                  );
                })}
              </div>

              {/* PDF Catalog Download Button */}
              <a 
                href="/zabarjad-katalog.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-md text-sm font-medium hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-500 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
                Katalogni yuklab olish
              </a>
            </div>
          </div>

          {/* ── PHYSICAL HARDCOVER 3D ILLUSION CARDS (Direct Routing) ──── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((book, i) => (
                <Link to={`/book/${book.id}`} key={book.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group flex flex-col gap-4 cursor-pointer"
                  >
                    {/* Physical Hardcover Book with Spine & Page Geometry */}
                    <div className="relative w-full aspect-[2/3] rounded-l-sm rounded-r-xl overflow-hidden shadow-[4px_4px_10px_rgba(0,0,0,0.15),_inset_-4px_0_4px_rgba(255,255,255,0.4)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.5),_inset_-4px_0_4px_rgba(255,255,255,0.1)] group-hover:shadow-[15px_20px_30px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[15px_20px_30px_rgba(0,0,0,0.6)] group-hover:-translate-y-3 group-hover:-rotate-1 transition-all duration-500 border border-black/5 dark:border-white/10">
                      {book.cover_url ? (
                        <img 
                          src={book.cover_url} 
                          alt={locField(book, "title", lang)} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="flex items-center justify-center bg-secondary w-full h-full">
                          <BookOpen className="h-10 w-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
                        </div>
                      )}

                      {/* Hinge/Crease Gradient - Hardcover Book Indentation */}
                      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 via-white/20 to-transparent pointer-events-none border-l border-white/20" />
                      
                      {/* Glass Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-5 py-2.5 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          Batafsil
                        </span>
                      </div>
                    </div>

                    {/* Museum Placard Typography */}
                    <div className="flex flex-col items-center text-center mt-5 px-2">
                      <h3 className="font-serif font-bold text-base md:text-[17px] text-foreground leading-snug line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                        {locField(book, "title", lang)}
                      </h3>
                      {/* Expanding Gold Divider */}
                      <span className="w-8 h-[1.5px] bg-amber-500/40 my-2.5 transition-all duration-500 group-hover:w-16 group-hover:bg-amber-500" />
                      <p className="text-[11px] font-semibold text-muted-foreground tracking-[0.15em] uppercase">
                        {locField(book, "author", lang)}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LibraryPage;