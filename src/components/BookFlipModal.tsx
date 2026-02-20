import { useState } from "react";
import { X, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BOOK_PREVIEW_PAGES } from "@/lib/mockData";

interface BookFlipModalProps {
  book: { title: string; author: string } | null;
  onClose: () => void;
}

const pages = BOOK_PREVIEW_PAGES;

const BookFlipModal = ({ book, onClose }: BookFlipModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  if (!book) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 glass-card p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center gap-8 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground text-center">
              {book.title}
            </h2>
            <p className="text-muted-foreground text-center mt-1">{book.author}</p>
          </motion.div>

          {/* Book 3D Container */}
          <div className="relative" style={{ perspective: "1500px" }}>
            <div
              className="relative w-64 md:w-80 transition-transform duration-700"
              style={{
                transformStyle: "preserve-3d",
                transform: isOpen ? "rotateY(-15deg)" : "rotateY(0deg)",
              }}
            >
              {/* Book cover (front) */}
              <motion.div
                className="relative rounded-lg overflow-hidden cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "left center",
                  transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isOpen ? "rotateY(-160deg)" : "rotateY(0deg)",
                  backfaceVisibility: "hidden",
                  zIndex: isOpen ? 1 : 5,
                }}
                onClick={() => setIsOpen(!isOpen)}
              >
                <div
                  className="flex flex-col items-center justify-center gap-4 p-8"
                  style={{
                    height: "380px",
                    background: "linear-gradient(145deg, hsl(var(--secondary)), hsl(var(--charcoal)))",
                    boxShadow: "4px 4px 20px rgba(0,0,0,0.6), inset -2px 0 8px rgba(247,181,0,0.1)",
                  }}
                >
                  <BookOpen className="h-12 w-12 text-primary/60" />
                  <span className="font-serif text-xl font-bold text-foreground text-center">
                    {book.title}
                  </span>
                  <span className="text-sm text-muted-foreground">{book.author}</span>
                  <span className="mt-4 text-xs text-primary font-sans uppercase tracking-wider">
                    {isOpen ? "Yopish uchun bosing" : "Ochish uchun bosing"}
                  </span>
                </div>
              </motion.div>

              {/* Pages inside */}
              {isOpen && (
                <motion.div
                  className="absolute top-0 left-0 w-full rounded-lg overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    height: "380px",
                    zIndex: 3,
                  }}
                >
                  <div
                    className="h-full p-6 md:p-8 flex flex-col"
                    style={{
                      background: "linear-gradient(135deg, hsl(40 20% 92%), hsl(40 15% 85%))",
                      boxShadow: "inset 4px 0 15px rgba(0,0,0,0.15), inset 0 0 30px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-sans text-neutral-500 uppercase tracking-wider">
                        Sahifa {currentPage + 1} / {pages.length}
                      </span>
                      <span className="font-serif text-xs text-neutral-400 italic">{book.title}</span>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.p
                        key={currentPage}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="text-sm md:text-base leading-relaxed text-neutral-800 font-serif flex-1"
                      >
                        {pages[currentPage]}
                      </motion.p>
                    </AnimatePresence>

                    <div className="flex items-center justify-between mt-4">
                      <button
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="p-1 text-neutral-500 disabled:opacity-30 hover:text-neutral-800 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                        disabled={currentPage === pages.length - 1}
                        className="p-1 text-neutral-500 disabled:opacity-30 hover:text-neutral-800 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Book spine shadow */}
              <div
                className="absolute top-0 left-0 w-3 h-full"
                style={{
                  background: "linear-gradient(90deg, rgba(0,0,0,0.4), transparent)",
                  zIndex: 6,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {!isOpen && (
            <motion.p
              className="text-sm text-muted-foreground font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Kitobni ochish uchun muqovaga bosing →
            </motion.p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookFlipModal;
