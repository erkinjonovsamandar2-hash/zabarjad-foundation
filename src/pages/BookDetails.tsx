import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLang, locField } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import type { Book } from "@/context/DataContext";

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
            <h1 className="text-3xl font-serif font-bold text-foreground">Kitob topilmadi</h1>
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="section-padding pt-32 pb-16 bg-charcoal relative">
          <div className="mx-auto max-w-7xl">
            
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="relative z-10 flex items-center gap-2 text-muted-foreground hover:text-amber-500 transition-colors mb-12 font-medium"
            >
              <span>&larr;</span> Kutubxonaga qaytish
            </button>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
              
              {/* Left: Book Cover Showcase */}
              <div
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
              </div>

              {/* Right: Metadata & Actions */}
              <div className="flex flex-col pt-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight mb-4 drop-shadow-sm">
                  {locField(book, "title", lang)}
                </h1>
                <p className="text-xl text-amber-600 dark:text-amber-500 font-bold tracking-widest uppercase mb-8">
                  {locField(book, "author", lang)}
                </p>

                <div className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-amber-500/30 pl-6">
                  {locField(book, "description", lang) ||
                    "Ushbu kitob haqida to'liq ma'lumot tez orada qo'shiladi. Zabarjad Media kutubxonasini kuzatib boring."}
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 py-8 border-y border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                      Muqova
                    </p>
                    <p className="font-medium text-foreground">Qattiq</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                      Kategoriya
                    </p>
                    <p className="font-medium text-foreground capitalize">
                      {book.category || "Nashr"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                      3D Format
                    </p>
                    <p className="font-medium text-foreground">
                      {book.enable_3d_flip ? "Mavjud" : "Yo'q"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                      Narx
                    </p>
                    <p className="font-bold text-amber-500 text-lg">
                      {book.price ? `${book.price} so'm` : "Tez kunda"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <button className="px-10 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 hover:shadow-xl transition-all text-base md:text-lg">
                    Xarid qilish
                  </button>
                  <button className="px-10 py-4 border border-border/80 bg-background/50 backdrop-blur-sm text-foreground font-bold rounded-full hover:border-amber-500 hover:text-amber-500 transition-all text-base md:text-lg">
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