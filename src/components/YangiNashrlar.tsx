import { useLang, locField } from "@/context/LanguageContext";
import { useData } from "@/context/DataContext";
import type { Book } from "@/types/database";

// Fallback mock array if admin hasn't added any upcoming books yet
const UPCOMING_BOOKS_MOCK: Book[] = [
    {
        id: "upcoming-1",
        title: "Alvido, qurol!", title_ru: "Прощай, оружие!", title_en: "A Farewell to Arms",
        author: "Ernest Xeminguey", author_ru: "Эрнест Хемингуэй", author_en: "Ernest Hemingway",
        description: null, description_ru: null, description_en: null,
        cover_url: null, bg_color: "12 76% 61%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 1, created_at: "", updated_at: ""
    },
    {
        id: "upcoming-2",
        title: "Kichkina shahzoda", title_ru: "Маленький принц", title_en: "The Little Prince",
        author: "Antuan de Sent-Ekzyuperi", author_ru: "Антуан де Сент-Экзюпери", author_en: "Antoine de Saint-Exupéry",
        description: null, description_ru: null, description_en: null,
        cover_url: null, bg_color: "45 66% 52%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 2, created_at: "", updated_at: ""
    },
    {
        id: "upcoming-3",
        title: "Qora tuynuklar va chaqaloq koinotlar", title_ru: "Черные дыры...", title_en: "Black Holes and Baby Universes",
        author: "Stiven Xoking", author_ru: "Стивен Хокинг", author_en: "Stephen Hawking",
        description: null, description_ru: null, description_en: null,
        cover_url: null, bg_color: "216 65% 11%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 3, created_at: "", updated_at: ""
    },
    {
        id: "upcoming-4",
        title: "Aql va tuyg'u", title_ru: "Разум и чувства", title_en: "Sense and Sensibility",
        author: "Jeyn Ostin", author_ru: "Джейн Остин", author_en: "Jane Austen",
        description: null, description_ru: null, description_en: null,
        cover_url: null, bg_color: "340 60% 50%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 4, created_at: "", updated_at: ""
    }
];

const resolveImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = import.meta.env.VITE_SUPABASE_URL as string;
    return `${base}/storage/v1/object/public/${url}`;
};

const YangiNashrlar = () => {
    const { lang } = useLang();
    const { books } = useData();

    // Pull live books categorized as "Tez Kunda" (Coming Soon)
    const liveUpcoming = books.filter(b => b.category === "soon");
    const baseBooks = liveUpcoming.length > 0 ? liveUpcoming : UPCOMING_BOOKS_MOCK;

    // Secure the marquee by enforcing a minimum item threshold for seamless looping (e.g. 15 items min)
    let stripItems = [...baseBooks];
    while (stripItems.length < 15) {
        stripItems = [...stripItems, ...baseBooks];
    }

    return (
        <section className="py-24 lg:py-32 bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center border-y border-white/5">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b from-black/80 to-transparent" />
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full -z-10 opacity-50 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, hsl(var(--primary) / 0.3) 0%, transparent 60%)" }} />
            </div>

            {/* HEADER */}
            <div className="relative z-10 text-center px-6 mb-16 sm:mb-20">
                <p className="font-sans text-[0.7rem] tracking-[0.35em] uppercase text-gold font-bold mb-4 drop-shadow-sm">
                    TEZ ORADA
                </p>
                <h2 className="font-heading text-6xl sm:text-7xl lg:text-[5.5rem] tracking-tight text-white mb-6 drop-shadow-lg">
                    Yangi Nashrlar
                </h2>
                <p className="font-serif italic text-white/60 text-xl sm:text-2xl max-w-2xl mx-auto drop-shadow">
                    Kutib turing — eng yaxshi asarlar yo'lda
                </p>
            </div>

            {/* MARQUEE STRIP */}
            <div className="w-full relative z-10 overflow-hidden" style={{ "--book-count": baseBooks.length } as React.CSSProperties}>
                <div className="marquee-track flex gap-8 sm:gap-12 px-4 py-8">
                    {stripItems.map((book, i) => {
                        const coverSrc = resolveImageUrl(book.cover_url);
                        const fallbackColor = book.bg_color ? `hsl(${book.bg_color})` : "hsl(var(--accent))";

                        return (
                            <div
                                key={`${book.id}-${i}`}
                                className="group relative w-[140px] sm:w-[170px] lg:w-[200px] shrink-0 aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer"
                                style={{
                                    backgroundColor: fallbackColor,
                                    WebkitBoxReflect: "below 4px linear-gradient(transparent 70%, rgba(255,255,255,0.25))",
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)"
                                }}
                            >
                                {coverSrc && (
                                    <img
                                        src={coverSrc}
                                        alt={locField(book, "title", lang)}
                                        loading="lazy"
                                        className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                    />
                                )}

                                {/* Scrim on hover */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex flex-col items-center justify-center p-6 text-center">
                                    <h3 className="text-white font-serif text-xl sm:text-2xl leading-snug drop-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        {locField(book, "title", lang)}
                                    </h3>
                                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[0.6rem] uppercase tracking-[0.15em] px-2.5 py-1.5 rounded-[3px] font-bold shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75 ease-out">
                                        TEZDA
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* BELOW STRIP */}
            <div className="relative z-10 mt-20 px-6 text-center">
                <p className="font-sans text-[0.75rem] tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors duration-300 cursor-pointer">
                    Barcha yangi nashrlardan xabardor bo'lish uchun obuna bo'ling <span className="text-gold ml-1">&rarr;</span>
                </p>
            </div>
        </section>
    );
};

export default YangiNashrlar;
