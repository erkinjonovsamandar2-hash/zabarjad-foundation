import { useState } from "react";
import { BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookFlipModal from "./BookFlipModal";

const filters = ["Yangi Nashrlar", "Tez Kunda", "Oltin Kolleksiya"] as const;

const books = [
  { title: "Muz va Olov Qo'shig'i", author: "Jorj R.R. Martin", filter: "Yangi Nashrlar" },
  { title: "Hobbit", author: "J.R.R. Tolkien", filter: "Oltin Kolleksiya" },
  { title: "1984", author: "Jorj Oruell", filter: "Oltin Kolleksiya" },
  { title: "Duna", author: "Frank Herbert", filter: "Tez Kunda" },
  { title: "Xarri Potter", author: "J.K. Rouling", filter: "Yangi Nashrlar" },
  { title: "Narnia Kundaliklari", author: "K.S. Lyuis", filter: "Tez Kunda" },
  { title: "Ender O'yini", author: "Orson Skott Kard", filter: "Yangi Nashrlar" },
  { title: "Witcher", author: "Andrzej Sapkovski", filter: "Oltin Kolleksiya" },
  { title: "Yulduzlar Urushi", author: "Timothy Zan", filter: "Tez Kunda" },
  { title: "Asoslar", author: "Ayzek Azimov", filter: "Oltin Kolleksiya" },
];

const CuratedLibrary = () => {
  const [active, setActive] = useState<typeof filters[number]>(filters[0]);
  const [selectedBook, setSelectedBook] = useState<{ title: string; author: string } | null>(null);

  const filtered = books.filter((b) => b.filter === active);

  return (
    <section id="library" className="section-padding bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">
            Kutubxona
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-8">
            Tanlangan Kitoblar
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-lg px-4 py-2 text-sm font-sans font-medium transition-colors ${
                active === f
                  ? "bg-primary text-primary-foreground"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((book, i) => (
              <motion.div
                key={book.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass-card break-inside-avoid rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                {/* Book cover placeholder */}
                <div
                  className="flex items-center justify-center bg-secondary relative overflow-hidden"
                  style={{ height: `${180 + (i % 3) * 40}px` }}
                >
                  <BookOpen className="h-10 w-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                  <span className="absolute bottom-2 right-2 text-[10px] font-sans text-muted-foreground/40 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Ichiga qarang →
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Book Flip Modal */}
      <AnimatePresence>
        {selectedBook && (
          <BookFlipModal book={selectedBook} onClose={() => setSelectedBook(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CuratedLibrary;
