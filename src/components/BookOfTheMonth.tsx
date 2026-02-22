import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useData } from "@/context/DataContext";

const BookOfTheMonth = () => {
  const { books } = useData();
  const spotlightBook = books.find((b) => b.featured) || books[0];

  // Image URL helper
  const getImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = import.meta.env.VITE_SUPABASE_URL as string;
    return `${base}/storage/v1/object/public/${url}`;
  };

  const coverUrl = getImageUrl(spotlightBook?.cover_url);

  return (
    <section className="
      relative overflow-hidden
      bg-[#fdfbf7]/50
      dark:bg-gradient-to-br dark:from-[#0a0806] dark:to-[#1a1510]
      py-24 sm:py-32
      border-y border-neutral-200 dark:border-white/5
    ">
      <div className="mx-auto max-w-5xl px-6 sm:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* ── Left Column (Text) ────────────────────────────────────────── */}
          <div className="
            text-center lg:text-left
            flex flex-col items-center lg:items-start
          ">
            {/* Premium Badge */}
            <div className="
              inline-flex items-center gap-2
              px-4 py-1.5
              rounded-full
              border border-amber-500/30
              bg-amber-500/10
              text-amber-700 dark:text-amber-400
              font-bold tracking-[0.2em]
              text-xs sm:text-sm
              mb-6 lg:mb-8
            ">
              <span className="text-lg leading-none">✦</span>
              OY KITOBI
            </div>

            {/* Pull Quote */}
            <blockquote className="
              text-3xl sm:text-4xl lg:text-5xl
              font-serif italic
              text-neutral-900 dark:text-white/90
              leading-tight
              mb-8
            ">
              "Sizni sevaman, biroq qalbim sizga tegishli emas."
            </blockquote>

            {/* Author & Title */}
            <p className="
              text-amber-900/80 dark:text-amber-200/60
              font-serif text-xl
              mb-10
            ">
              {spotlightBook?.author ?? "Fedor Dostoevskiy"} — {spotlightBook?.title ?? "Telba"}
            </p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="
                inline-flex items-center gap-2
                rounded-xl
                border-2 border-amber-500/50
                px-8 py-3
                text-sm font-semibold
                text-amber-900 dark:text-amber-100
                hover:bg-amber-500/10
                transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
                mx-auto lg:mx-0
              "
              aria-label="Asarni kashf etish — kitobni o'qish"
            >
              <span>Asarni kashf etish</span>
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>

          {/* ── Right Column (Floating 3D Book) ───────────────────────────── */}
          <div className="flex items-center justify-center lg:justify-end">
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* 3D Book cover */}
              <div
                style={{ perspective: "1000px" }}
                className="mx-auto lg:mx-0"
              >
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={spotlightBook?.title ?? "Book of the Month"}
                    className="
                      w-64 md:w-80
                      aspect-[2/3]
                      object-cover
                      rounded-md
                      border-l-4 border-black/20
                      shadow-[20px_20px_30px_rgba(0,0,0,0.5)]
                      dark:shadow-[20px_20px_40px_rgba(0,0,0,0.8)]
                    "
                    style={{
                      transform: "rotateY(-15deg) rotateX(5deg)",
                    }}
                  />
                ) : (
                  // Fallback placeholder if no image
                  <div className="
                    w-64 md:w-80
                    aspect-[2/3]
                    bg-amber-900/20
                    border border-white/10
                    rounded-md
                  " />
                )}
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default BookOfTheMonth;