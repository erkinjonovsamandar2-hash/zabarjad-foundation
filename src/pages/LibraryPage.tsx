import { useState, useEffect, useMemo, startTransition } from "react";
import { BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import type { Book } from "@/context/DataContext";
import { useLang, locField } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmptyState from "@/components/EmptyState";
import SpotlightCard from "@/components/SpotlightCard";
import librarySeal from "@/assets/design/library-seal.png";

// ── Local Categories Configuration ────────────────────────────────────────────
const CATEGORIES = ["all", "new", "featured", "golden"] as const;

// ── Featured Books for Carousel ───────────────────────────────────────────────
const FEATURED_BOOKS = [
  {
    id: "dorian",
    title: "Dorian Greyning portreti",
    author: "Oskar Uayld",
    description:
      "Go'zallik va abadiy yoshlik vasvasasiga tushgan yigitning hayotiy fojiasi. Dunyo klassikasining durdona asari.",
    coverImage:
      "https://backend.book.uz/user-api/img/img-file-f2a929a2a32d5bb4bb4e05dcd8f8670c.jpg",
  },
  {
    id: "zulayho",
    title: "Zulayho ko'zini ochyapti",
    author: "Go'zal Yaxina",
    description:
      "Surgun qilingan ayolning qahraton Sibirdagi omon qolish va sevgi tarixi. Zamonaviy adabiyotning eng kuchli asarlaridan biri.",
    coverImage:
      "https://backend.book.uz/user-api/img/img-8b1bc484779e7dd00942b1a3a9a3735b.jpg",
  },
  {
    id: "qirolicha",
    title: "Qirolichaning yurishi",
    author: "Uolter Tevis",
    description:
      "Shaxmat dahosi bo'lgan qizning ichki kurashi, yolg'izlik va yuksalish yo'li. Iroda va iste'dodning kuchli hikoyasi.",
    coverImage:
      "https://upload.wikimedia.org/wikipedia/uz/a/a5/Qirolichaning_yurishi_%28roman%29.jpg",
  },
] as const;

// ── Helper: Get Category Label ─────────────────────────────────────────────────
const getCategoryLabel = (key: string, lang: string): string => {
  const labels: Record<string, { uz: string; ru: string; en: string }> = {
    all: { uz: "Barchasi", ru: "Все", en: "All" },
    new: { uz: "Yangi nashrlar", ru: "Новинки", en: "New Releases" },
    featured: { uz: "Tez kunda", ru: "Скоро", en: "Coming Soon" },
    golden: { uz: "Oltin kolleksiya", ru: "Золотая коллекция", en: "Golden Collection" },
  };
  return labels[key]?.[lang as keyof typeof labels.all] ?? key;
};

const LibraryPage = () => {
  const { books } = useData();
  const { lang } = useLang();

  const [active, setActive] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Auto-rotate featured books every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_BOOKS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const featuredBook = FEATURED_BOOKS[currentIndex];

  // FIX: Memoized filter — only recomputes when books or active changes.
  // Previously ran inline on every render, blocking the main thread.
  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (active === "all") return true;

      return b.category === active;
    });
  }, [books, active]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="section-padding pt-24 bg-charcoal relative">
        <div className="mx-auto max-w-7xl">

          {/* ── FEATURED BOOKS HERO CAROUSEL ─────────────────────────────── */}
          <div className="relative w-full max-w-6xl mx-auto min-h-[450px] flex flex-col md:flex-row items-center bg-gradient-to-br from-background/80 to-background/60 border border-border/20 rounded-3xl overflow-hidden p-8 md:p-12 shadow-2xl mb-16 backdrop-blur-md">

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-accent/20 rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-accent/20 rounded-br-3xl pointer-events-none" />

            {/* Library Seal */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 md:w-96 md:h-96 opacity-[0.08] pointer-events-none mix-blend-luminosity z-0 transform -rotate-12">
              <img
                src={librarySeal}
                alt="Library Seal"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>

            <AnimatePresence mode="wait">
              {/* Left — Book Cover */}
              <motion.div
                key={`book-${currentIndex}`}
                initial={{ opacity: 0, y: -50, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: 50, rotate: 5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex-1 flex justify-center items-center relative z-10"
              >
                <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-75" />
                {/* FIX: aspect-[2/3] + bg-muted wrapper prevents layout shift */}
                <div className="w-48 md:w-64 aspect-[2/3] bg-muted rounded-md shadow-2xl relative z-10 border border-border/20 overflow-hidden">
                  <img
                    src={featuredBook.coverImage}
                    alt={featuredBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Right — Text */}
              <motion.div
                key={`text-${currentIndex}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="flex-1 flex flex-col justify-center items-start text-left mt-8 md:mt-0 relative z-10"
              >
                <span className="text-gold font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase mb-4">
                  Hafta Tanlovi
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-foreground mb-4 leading-tight">
                  {featuredBook.title}
                </h2>
                <p className="text-muted-foreground text-base md:text-lg mb-8 line-clamp-3 max-w-xl">
                  {featuredBook.description}
                </p>
                <button className="btn-glass px-8 py-3.5">
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
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2"
                    }`}
                  aria-label={`Go to book ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── HEADER + FILTERS + PDF BUTTON ────────────────────────────── */}
          <div className="mb-10 mt-16">
            <div className="text-center mb-8">
              <p className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-gold uppercase mb-3 text-center">
                KUTUBXONA
              </p>
              <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-foreground text-center">
                Tanlangan kitoblar
              </h1>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {CATEGORIES.map((categoryKey) => {
                  const isActive = active === categoryKey;

                  return (
                    <button
                      key={categoryKey}
                      onClick={() => {
                        // FIX: startTransition keeps UI responsive while React
                        // recomputes the filtered grid in the background
                        startTransition(() => {
                          setActive(categoryKey);
                        });
                      }}
                      className={`
                        ${isActive
                          ? "btn-glass scale-105"
                          : "btn-glass-ghost opacity-70 hover:opacity-100"
                        }
                      `}
                    >
                      {getCategoryLabel(categoryKey, lang)}
                    </button>
                  );
                })}
              </div>

              {/* PDF Catalog */}
              <a
                href="/booktopia-katalog.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass-ghost px-8 py-3 group"
              >
                <div className="flex items-center justify-center w-4 h-4 mr-2 group-hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                </div>
                Katalogni yuklab olish
              </a>
            </div>
          </div>

          {/* ── BOOK GRID / EMPTY STATE ───────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div className="py-10 max-w-2xl mx-auto">
              <EmptyState
                title="Sahifalar hozircha bo'sh..."
                description="Ushbu ruknda hozircha kitoblar yo'q. Biz uni tez orada yangi va sara asarlar bilan boyitamiz."
                actionLabel="Barcha kitoblarni ko'rish"
                onAction={() => {
                  startTransition(() => setActive("all"));
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((book, i) => (
                  // FIX: Removed [content-visibility:auto] — Framer Motion's
                  // `layout` prop recalculates all element positions during
                  // grid shuffle animations. content-visibility interferes
                  // with this by making the browser skip layout for "hidden"
                  // elements, causing cards to snap instead of animate smoothly.
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link to={`/book/${book.id}`} className="h-full block">
                      <SpotlightCard className="h-full p-4 md:p-6 group cursor-pointer">
                        <div className="flex flex-col gap-4 h-full">

                          {/* Hardcover Book */}
                          {/* FIX: aspect-[2/3] + bg-muted = stable placeholder
                              before image loads — zero layout shift            */}
                          <div className="relative w-full aspect-[2/3] rounded-l-sm rounded-r-xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 border border-border/10 mx-auto bg-muted">
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

                            {/* Spine Hinge */}
                            <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 via-white/20 to-transparent pointer-events-none border-l border-white/20" />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="px-4 py-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                                Ko'rish
                              </span>
                            </div>
                          </div>

                          {/* Book Info */}
                          <div className="flex flex-col items-center text-center mt-auto">
                            <h3 className="font-heading font-black tracking-tight text-base md:text-[17px] text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {locField(book, "title", lang)}
                            </h3>
                            <span className="w-8 h-[1.5px] bg-primary/30 my-3 transition-all duration-500 group-hover:w-16 group-hover:bg-primary" />
                            <p className="text-[10px] font-bold text-muted-foreground tracking-[0.15em] uppercase">
                              {locField(book, "author", lang)}
                            </p>
                          </div>

                        </div>
                      </SpotlightCard>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LibraryPage;