import { useLang, locField } from "@/context/LanguageContext";
import { useData } from "@/context/DataContext";
import type { Book } from "@/types/database";

const UPCOMING_BOOKS_MOCK: Book[] = [
    {
        id: "upcoming-1",
        title: "Murvatli Apelsin", title_ru: "Заводной апельсин", title_en: "A Clockwork Orange",
        author: "Entoni Byorjess", author_ru: "Энтони Бёрджесс", author_en: "Anthony Burgess",
        description: null, description_ru: null, description_en: null,
        cover_url: "/upcoming/apelsin.png",
        bg_color: "25 90% 50%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 1, created_at: "", updated_at: ""
    },
    {
        id: "upcoming-3",
        title: "Ijarachi", title_ru: "Квартирантка", title_en: "The Tenant of Wildfell Hall",
        author: "Enn Bronte", author_ru: "Энн Бронте", author_en: "Anne Brontë",
        description: null, description_ru: null, description_en: null,
        cover_url: "/upcoming/ijarachi.png",
        bg_color: "210 30% 20%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 2, created_at: "", updated_at: ""
    },
    {
        id: "upcoming-4",
        title: "Mayoq sari", title_ru: "На маяк", title_en: "To the Lighthouse",
        author: "Virdjiniya Vulf", author_ru: "Вирджиния Вулф", author_en: "Virginia Woolf",
        description: null, description_ru: null, description_en: null,
        cover_url: "/upcoming/mayoq.png",
        bg_color: "180 40% 25%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 3, created_at: "", updated_at: ""
    },
    {
        id: "upcoming-2",
        title: "Askanio", title_ru: "Асканио", title_en: "Ascanio",
        author: "Aleksandr Dyuma", author_ru: "Александр Дюма", author_en: "Alexandre Dumas",
        description: null, description_ru: null, description_en: null,
        cover_url: "/upcoming/askanio.png",
        bg_color: "120 20% 30%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 4, created_at: "", updated_at: ""
    }
];

const resolveImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) return url;
    const base = import.meta.env.VITE_SUPABASE_URL as string;
    return `${base}/storage/v1/object/public/${url}`;
};

const YangiNashrlar = () => {
    const { lang } = useLang();
    const { books } = useData();

    // FORCING THE MOCK DATA TO SHOW OUR PERFECT PNGs
    const baseBooks = UPCOMING_BOOKS_MOCK;

    const displayBooks =
        baseBooks.length >= 4
            ? baseBooks
            : [
                ...baseBooks,
                ...UPCOMING_BOOKS_MOCK
                    .filter(m => !baseBooks.some(b => b.id === m.id))
                    .slice(0, 4 - baseBooks.length),
            ];

    // Explicitly grab our 3 sections
    const heroBook = displayBooks[0];
    const middleBooks = [displayBooks[1], displayBooks[2]];
    const footerBook = displayBooks[3];

    // A clean helper function to render a book card
    const renderCard = (
        book: Book,
        aspectClass: string,
        objectPosition: string = "center"
    ) => {
        const coverSrc = resolveImageUrl(book.cover_url);
        const fallbackColor = book.bg_color ? `hsl(${book.bg_color})` : "hsl(var(--accent))";
        const title = locField(book, "title", lang);
        const author = locField(book, "author", lang);

        return (
            <div
                key={book.id}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer ring-1 ring-transparent hover:ring-white/20 transition-[box-shadow] duration-300 shadow-2xl w-full ${aspectClass}`}
                style={{ backgroundColor: fallbackColor }}
            >
                {coverSrc ? (
                    <>
                        <img
                            src={coverSrc}
                            alt={title}
                            loading="lazy"
                            style={{ objectPosition }}
                            className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        {/* Base subtle gradient — always present */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                        {/* Hover overlay — rich gradient with sliding text */}
                        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                            {/* Gradient layer */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            {/* Text content */}
                            <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                <p className="font-sans text-[0.65rem] tracking-widest uppercase text-gold mb-1.5">
                                    {author}
                                </p>
                                <h3 className="font-heading text-2xl text-white leading-tight">
                                    {title}
                                </h3>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40 pointer-events-none" />
                        <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1">
                            <span className="font-sans text-[0.55rem] tracking-[0.2em] uppercase text-white/80 font-bold">TEZDA</span>
                        </div>
                        {/* Hover overlay for fallback cards */}
                        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                <p className="font-sans text-[0.65rem] tracking-widest uppercase text-gold mb-1.5">
                                    {author}
                                </p>
                                <h3 className="font-heading text-2xl text-white leading-tight">
                                    {title}
                                </h3>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <section className="py-24 lg:py-32 bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center border-y border-white/5">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b from-black/80 to-transparent" />
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full -z-10 opacity-50 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, hsl(var(--primary) / 0.3) 0%, transparent 60%)" }} />
            </div>

            {/* HEADER */}
            <div className="relative z-10 text-center px-6 mb-12 sm:mb-16">
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

            {/* CUSTOM COMPACT LAYOUT */}
            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8">

                {/* 1. TOP HERO (Apelsin) — responsive aspect ratio */}
                <div className="aspect-[4/3] md:aspect-[16/9]">
                    {renderCard(heroBook, "h-full", "center")}
                </div>

                {/* 2. MIDDLE BOOKS (Ijarachi & Mayoq) — constrained with max-w to remain visually smaller without breaking alignment */}
                <div className="max-w-2xl mx-auto w-full">
                    <div className="grid grid-cols-2 gap-6 sm:gap-10">
                        {middleBooks.map(book => (
                            <div key={book.id} className="aspect-[2/3]">
                                {renderCard(book, "h-full")}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. BOTTOM FOOTER (Askanio) — responsive aspect ratio */}
                <div className="aspect-video md:aspect-[3/1]">
                    {renderCard(footerBook, "h-full", "center")}
                </div>

            </div>

            {/* BELOW LAYOUT */}
            <div className="relative z-10 mt-16 px-6 text-center">
                <p className="font-sans text-[0.75rem] tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors duration-300 cursor-pointer">
                    Barcha yangi nashrlardan xabardor bo'lish uchun obuna bo'ling <span className="text-gold ml-1">&rarr;</span>
                </p>
            </div>
        </section>
    );
};

export default YangiNashrlar;