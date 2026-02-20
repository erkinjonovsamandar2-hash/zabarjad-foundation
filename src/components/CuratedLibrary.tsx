import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BookFlipModal from "./BookFlipModal";
import { useData } from "@/context/DataContext";
import { useLang, locField } from "@/context/LanguageContext";

const CuratedLibrary = () => {
  const { books } = useData();
  const { lang, t } = useLang();
  const filterKeys = ["new", "soon", "gold"] as const;
  const filterMap: Record<string, string> = {
    new: "Yangi Nashrlar",
    soon: "Tez Kunda",
    gold: "Oltin Kolleksiya",
  };
  const [active, setActive] = useState<string>("new");
  const [selectedBook, setSelectedBook] = useState<{ title: string; author: string } | null>(null);

  const filtered = books.filter((b) => b.category === filterMap[active]);
  // Show max 6 on homepage
  const displayed = filtered.slice(0, 6);

  return (
    <section id="library" className="section-padding bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">{t.library.badge}</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-8">{t.library.title}</h2>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-10">
          {filterKeys.map((f) => (
            <button key={f} onClick={() => setActive(f)} className={`rounded-lg px-4 py-2 text-sm font-sans font-medium transition-colors ${active === f ? "bg-primary text-primary-foreground" : "glass-card text-muted-foreground hover:text-foreground"}`}>
              {t.library.filters[f]}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          <AnimatePresence mode="popLayout">
            {displayed.map((book, i) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass-card break-inside-avoid rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="relative overflow-hidden" style={{ height: `${180 + (i % 3) * 40}px` }}>
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={locField(book, "title", lang)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex items-center justify-center bg-secondary w-full h-full">
                      <BookOpen className="h-10 w-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                  {book.enable_3d_flip && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-sans text-muted-foreground/40 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.library.peekInside}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">{locField(book, "title", lang)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{locField(book, "author", lang)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length > 6 && (
          <div className="text-center mt-10">
            <Link to="/library" className="inline-flex items-center gap-2 rounded-lg glass-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30">
              {t.seeAll} →
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedBook && <BookFlipModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default CuratedLibrary;
