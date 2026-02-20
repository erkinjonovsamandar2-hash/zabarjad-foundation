import { useState } from "react";
import { BookOpen } from "lucide-react";

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

  const filtered = books.filter((b) => b.filter === active);

  return (
    <section id="library" className="section-padding bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">
          Kutubxona
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-8">
          Tanlangan Kitoblar
        </h2>

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
          {filtered.map((book, i) => (
            <div
              key={`${book.title}-${i}`}
              className="glass-card break-inside-avoid rounded-xl overflow-hidden group"
            >
              {/* Book cover placeholder */}
              <div
                className="flex items-center justify-center bg-secondary"
                style={{ height: `${180 + (i % 3) * 40}px` }}
              >
                <BookOpen className="h-10 w-10 text-primary/30" />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CuratedLibrary;
