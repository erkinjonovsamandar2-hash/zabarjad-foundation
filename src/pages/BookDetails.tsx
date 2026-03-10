import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLang, locField } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import type { Book } from "@/context/DataContext";
import { motion, useScroll, useSpring } from "framer-motion";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-primary origin-left z-50 shadow-[0_0_10px_rgba(var(--primary),0.6)]"
      style={{ scaleX }}
    />
  );
}

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();

  // Fetch book from Supabase
  const { data: book, isLoading, error } = useQuery<Book>({
    queryKey: ["book", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Book;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="section-padding pt-32 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground font-medium">Yuklanmoqda...</p>
            </div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (error || !book) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="section-padding pt-32 flex flex-col items-center justify-center gap-6">
            <h1 className="text-3xl font-heading font-black tracking-tight font-bold text-foreground">Kitob topilmadi</h1>
            <p className="text-muted-foreground">Ushbu kitob mavjud emas yoki o'chirilgan.</p>
            <button
              onClick={() => navigate("/library")}
              className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:scale-105 transition-transform"
            >
              Kutubxonaga qaytish
            </button>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  // Dynamic shadow based on theme_color from DB
  const dynamicShadow = book.bg_color
    ? `20px 20px 60px hsl(${book.bg_color} / 0.4), -10px -10px 40px hsl(${book.bg_color} / 0.2)`
    : "20px 20px 50px rgba(0,0,0,0.5)";

  return (
    <PageTransition>
      <ScrollProgress />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="section-padding pt-32 pb-16 bg-charcoal relative">
          <div className="mx-auto max-w-7xl">

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="relative z-10 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-500 ease-out mb-12 font-sans text-[11px] tracking-wider uppercase font-bold"
            >
              <span className="transform transition-transform group-hover:-translate-x-1">&larr;</span> Kutubxonaga qaytish
            </button>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">

              {/* Left: Book Cover Showcase */}
              <motion.div
                layoutId={`book-cover-${book.id}`}
                className="w-full max-w-md mx-auto aspect-[2/3] rounded-r-3xl rounded-l-sm border-l-8 border-[#2a2118] relative overflow-hidden transform md:hover:scale-105 transition-all duration-700"
                style={{ boxShadow: dynamicShadow }}
              >
                {book.cover_url && (
                  <img
                    src={book.cover_url}
                    alt={locField(book, "title", lang)}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black/60 via-white/20 to-transparent pointer-events-none" />
              </motion.div>

              {/* Right: Metadata & Actions */}
              <div className="flex flex-col pt-4">
                <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-wide text-foreground mb-4 drop-shadow-sm">
                  {locField(book, "title", lang)}
                </h1>
                <p className="font-sans text-[13px] font-bold tracking-[0.2em] uppercase text-primary dark:text-accent mb-8">
                  {locField(book, "author", lang)}
                </p>

                <div className="font-serif text-lg leading-loose text-muted-foreground mb-10 border-l-2 border-primary/30 pl-6">
                  {locField(book, "description", lang) ||
                    "Ushbu kitob haqida to'liq ma'lumot tez orada qo'shiladi. Booktopia kutubxonasini kuzatib boring."}
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 py-8 border-y border-border/50">
                  <div>
                    <p className="font-sans text-[10px] tracking-wider uppercase font-bold text-muted-foreground mb-2">
                      Muqova
                    </p>
                    <p className="font-serif text-lg text-foreground">Qattiq</p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] tracking-wider uppercase font-bold text-muted-foreground mb-2">
                      Kategoriya
                    </p>
                    <p className="font-serif text-lg text-foreground capitalize">
                      {book.category || "Nashr"}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] tracking-wider uppercase font-bold text-muted-foreground mb-2">
                      3D Format
                    </p>
                    <p className="font-serif text-lg text-foreground">
                      {book.enable_3d_flip ? "Mavjud" : "Yo'q"}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] tracking-wider uppercase font-bold text-muted-foreground mb-2">
                      Narx
                    </p>
                    <p className="font-heading font-bold text-xl text-primary">
                      {book.price ? `${book.price} so'm` : "Tez kunda"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <button className="px-10 py-5 bg-primary text-primary-foreground font-sans text-[11px] font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_10px_25px_-5px_rgba(0,205,254,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(0,205,254,0.5)] transform hover:scale-[1.02] transition-all duration-500 ease-out">
                    Xarid qilish
                  </button>
                  <button className="px-10 py-5 bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/60 dark:border-white/10 text-foreground font-sans text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:shadow-[0_8px_30px_rgba(38,89,153,0.12)] hover:text-primary transition-all duration-500 ease-out">
                    Parchani o'qish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default BookDetails;