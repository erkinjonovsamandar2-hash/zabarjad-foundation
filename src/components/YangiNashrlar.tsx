import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useLang, locField } from "@/context/LanguageContext";
import { useData } from "@/context/DataContext";
import type { NewBook } from "@/types/database";

const UPCOMING_BOOKS_MOCK: NewBook[] = [
    {
        id: "upcoming-1",
        title: "Murvatli Apelsin", title_ru: "Заводной апельсин", title_en: "A Clockwork Orange",
        author: "Entoni Byorjess", author_ru: "Энтони Бёрджесс", author_en: "Anthony Burgess",
        description: "37 mamlakatda taqiqlangan. 100 mamlakatda nashr etilgan.",
        description_ru: "Запрещена в 37 странах. Издана в 100.",
        description_en: "Banned in 37 countries. Published in 100.",
        cover_url: "/upcoming/apelsin.png",
        bg_color: "25 90% 50%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 1,
        img_focus_x: null, img_focus_y: null,
        focus_desktop_x: null, focus_desktop_y: null,
        focus_mobile_x: null, focus_mobile_y: null,
        created_at: "", updated_at: ""
    },
    {
        id: "upcoming-3",
        title: "Ijarachi", title_ru: "Квартирантка", title_en: "The Tenant of Wildfell Hall",
        author: "Enn Bronte", author_ru: "Энн Бронте", author_en: "Anne Brontë",
        description: "Singillar qo'lyozmani yoqib yuborishga urinishdi. Lekin baribir nashr ettirildi.",
        description_ru: "Сёстры пытались сжечь рукопись. Но она всё равно была издана.",
        description_en: "Her sisters tried to burn the manuscript. It was published anyway.",
        cover_url: "/upcoming/ijarachi.png",
        bg_color: "210 30% 20%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 2,
        img_focus_x: null, img_focus_y: null,
        focus_desktop_x: null, focus_desktop_y: null,
        focus_mobile_x: null, focus_mobile_y: null,
        created_at: "", updated_at: ""
    },
    {
        id: "upcoming-4",
        title: "Mayoq sari", title_ru: "На маяк", title_en: "To the Lighthouse",
        author: "Virdjiniya Vulf", author_ru: "Вирджиния Вулф", author_en: "Virginia Woolf",
        description: "Bir yoz faslida yozildi. Biroq bir asrdan beri o'qitiladi.",
        description_ru: "Написана за одно лето. Изучается уже столетие.",
        description_en: "Written in one summer. Studied for a century.",
        cover_url: "/upcoming/mayoq.png",
        bg_color: "180 40% 25%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 3,
        img_focus_x: null, img_focus_y: null,
        focus_desktop_x: null, focus_desktop_y: null,
        focus_mobile_x: null, focus_mobile_y: null,
        created_at: "", updated_at: ""
    },
    {
        id: "upcoming-2",
        title: "Askanio", title_ru: "Асканио", title_en: "Ascanio",
        author: "Aleksandr Dyuma", author_ru: "Александр Дюма", author_en: "Alexandre Dumas",
        description: "Renessans davridagi Italiya: bir usta, bir sevgi, bir sir.",
        description_ru: "Челлини был реальным. Остальное придумал Дюма.",
        description_en: "Cellini was real. The rest is Dumas.",
        cover_url: "/upcoming/askanio.png",
        bg_color: "120 20% 30%", category: "soon", price: null,
        enable_3d_flip: false, featured: false, sort_order: 4,
        img_focus_x: null, img_focus_y: null,
        focus_desktop_x: null, focus_desktop_y: null,
        focus_mobile_x: null, focus_mobile_y: null,
        created_at: "", updated_at: ""
    }
];

const resolveImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) return url;
    const base = import.meta.env.VITE_SUPABASE_URL as string;
    return `${base}/storage/v1/object/public/${url}`;
};

/**
 * objectPositionD  — desktop/tablet: where to anchor the background image
 * objectPositionM  — mobile: focal point (image fills portrait card, text overlays bottom)
 *
 * For 3:2 Sora images displayed in a 2:1 (desktop) or 4:5 (mobile) container:
 *   - Desktop: image is wider than container → position horizontally (left/center/right %)
 *              fine-tune vertically to keep the key subject visible
 *   - Mobile:  image is taller than container → position vertically to keep subject in upper half
 *              so the dark gradient + text at the bottom don't cover it
 */
const BOOK_META: Record<string, { objectPositionD: string; objectPositionM: string; tags: string[] }> = {
    "upcoming-1": {
        // Apelsin: warm city + book — keep book visible on right, city context on left
        objectPositionD: "60% 30%",
        objectPositionM: "60% 20%",
        tags: ["Distopiya", "Falsafa", "18+"],
    },
    "upcoming-3": {
        // Ijarachi: gothic/dark cover
        objectPositionD: "center 20%",
        objectPositionM: "center 15%",
        tags: ["Gotika", "Drama", "XIX asr"],
    },
    "upcoming-4": {
        // Mayoq sari: lighthouse scene — anchor right-center to keep lighthouse + book visible
        // The book cover sits on the right; lighthouse is center-right of the composition
        objectPositionD: "65% 35%",
        objectPositionM: "65% 15%",
        tags: ["Modernizm", "Psixologik", "Klassika"],
    },
    "upcoming-2": {
        // Askanio: Renaissance Italy
        objectPositionD: "center 20%",
        objectPositionM: "center 15%",
        tags: ["Tarixiy", "Sarguzasht", "Renessans"],
    },
};

const YangiNashrlar = () => {
    const { lang } = useLang();
    const { newBooks } = useData();

    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" && window.innerWidth < 640
    );
    const handleResize = useCallback(() => setIsMobile(window.innerWidth < 640), []);
    useEffect(() => {
        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    // Use dedicated new_books table; fall back to mocks when empty.
    const missingMocks = UPCOMING_BOOKS_MOCK.filter(
        m => !newBooks.some(b => b.id === m.id || b.title === m.title)
    );
    const displayBooks =
        newBooks.length >= 4
            ? newBooks.slice(0, 4)
            : [...newBooks, ...missingMocks].slice(0, 4);

    const goTo = (index: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveIndex(index);
        setTimeout(() => setIsAnimating(false), 400);
    };
    const prev = () => goTo((activeIndex - 1 + displayBooks.length) % displayBooks.length);
    const next = () => goTo((activeIndex + 1) % displayBooks.length);

    useEffect(() => {
        if (!isPlaying) return;
        const timer = setTimeout(() => {
            setIsAnimating(true);
            setActiveIndex(prev => (prev + 1) % displayBooks.length);
            setTimeout(() => setIsAnimating(false), 400);
        }, 4500);
        return () => clearTimeout(timer);
    }, [isPlaying, activeIndex, displayBooks.length]);

    const activeBook = displayBooks[activeIndex];
    const activeMeta = BOOK_META[activeBook.id] ?? { objectPositionD: "center 20%", objectPositionM: "center 15%", tags: [] };
    // Dual device: prefer explicit DB coords, fall back to BOOK_META strings
    const activeObjPos = isMobile
        ? (activeBook.focus_mobile_x != null && activeBook.focus_mobile_y != null
            ? `${activeBook.focus_mobile_x}% ${activeBook.focus_mobile_y}%`
            : activeMeta.objectPositionM)
        : (activeBook.focus_desktop_x != null && activeBook.focus_desktop_y != null
            ? `${activeBook.focus_desktop_x}% ${activeBook.focus_desktop_y}%`
            : activeMeta.objectPositionD);
    const activeCoverSrc = resolveImageUrl(activeBook.cover_url);
    const activeFallback = activeBook.bg_color ? `hsl(${activeBook.bg_color})` : "hsl(var(--accent))";
    const activeTitle = locField(activeBook, "title", lang);
    const activeAuthor = locField(activeBook, "author", lang);

    return (
        <section className="bg-[#0a0a0a] py-8 lg:py-10 relative overflow-hidden border-y border-white/5 flex flex-col items-center">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b from-black/80 to-transparent" />
                <div
                    className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full -z-10 opacity-50 pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle at center, hsl(var(--primary) / 0.3) 0%, transparent 60%)" }}
                />
            </div>

            {/* TOP BAR */}
            <div className="relative z-10 w-full flex items-end justify-between px-4 sm:px-8 lg:px-12 mb-6 max-w-[1440px] mx-auto">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 sm:w-12 h-[1px] bg-[#c8973a]/60" />
                        <span className="font-sans text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#c8973a]">
                            Yangi Nashrlar
                        </span>
                    </div>
                    <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-tight leading-none drop-shadow-lg">
                        Tez Orada
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prev}
                        className="w-9 h-9 rounded-full border border-white/15 text-white/35 flex items-center justify-center transition-colors duration-200 hover:border-white/30 hover:text-white/60"
                        aria-label="Previous book"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => setIsPlaying(p => !p)}
                        className="w-9 h-9 rounded-full border border-white/15 text-white/35 flex items-center justify-center transition-colors duration-200 hover:border-white/30 hover:text-white/60"
                        aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
                    >
                        {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                    </button>
                    <button
                        onClick={next}
                        className="w-9 h-9 rounded-full border border-[#c8973a]/40 bg-[#c8973a]/[0.08] text-[#c8973a] flex items-center justify-center transition-colors duration-200 hover:bg-[#c8973a]/[0.15]"
                        aria-label="Next book"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* MAIN PANEL */}
            <div className="relative z-10 w-full px-3 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
                {/*
                  Mobile:  flex-col — image on top (fixed height), text below on dark bg.
                           No text overlays the cover.
                  Desktop: single aspect-ratio block, text absolutely overlaid on left.
                */}
                <div
                    className="relative rounded-2xl sm:rounded-xl overflow-hidden w-full transition-opacity duration-400 shadow-2xl ring-1 ring-white/10
                               flex flex-col sm:block sm:aspect-[16/9] lg:aspect-[2/1]"
                    style={{ opacity: isAnimating ? 0.6 : 1 }}
                >
                    {/* ── Image ─────────────────────────────────────────────── */}
                    <div
                        className="relative h-64 shrink-0 sm:h-auto sm:absolute sm:inset-0"
                        style={{ backgroundColor: activeFallback }}
                    >
                        {activeCoverSrc && (
                            <img
                                key={`img-${activeIndex}`}
                                src={activeCoverSrc}
                                alt={activeTitle}
                                loading="eager"
                                fetchpriority="high"
                                decoding="async"
                                className="img-fade absolute inset-0 object-cover w-full h-full"
                                style={{ objectPosition: activeObjPos }}
                                onLoad={(e) => e.currentTarget.classList.add("loaded")}
                            />
                        )}
                        {/* Mobile: subtle top vignette only — no bottom overlay */}
                        <div className="sm:hidden absolute inset-0 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                        {/* Desktop/Tablet: left gradient for text legibility */}
                        <div className="hidden sm:block absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(10,10,10,0.80) 0%, rgba(10,10,10,0.60) 35%, rgba(10,10,10,0.15) 65%, transparent 100%)" }} />
                        <div className="hidden sm:block absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a0a]/35 via-transparent to-transparent" />
                    </div>

                    {/* ── Text block ─────────────────────────────────────────
                        Mobile:  static, below the image, dark background.
                        Desktop: absolute overlay on the left half.
                    ─────────────────────────────────────────────────────── */}
                    <div
                        key={activeIndex}
                        className="ticker-text-enter
                                   bg-[#111] px-5 py-5 pb-7
                                   sm:bg-transparent sm:absolute sm:inset-0 sm:right-auto
                                   sm:flex sm:flex-col sm:justify-center
                                   sm:px-0 sm:py-0 sm:pl-12 lg:pl-16
                                   sm:max-w-[55%] lg:max-w-[50%]"
                    >
                        <p className="font-sans text-[0.65rem] sm:text-[0.7rem] lg:text-[0.85rem] tracking-[0.22em] uppercase text-[#c8973a] mb-2">
                            {activeAuthor}
                        </p>
                        <h2 className="font-heading text-[1.75rem] sm:text-4xl lg:text-5xl text-white leading-[1.05] tracking-tight mb-3 sm:mb-4">
                            {activeTitle}
                        </h2>
                        <div className="w-8 h-[2px] bg-[#c8973a] mb-3 sm:mb-4 shadow-[0_0_10px_rgba(200,151,58,0.5)]" />

                        {activeMeta.tags.length > 0 && (
                            <div key={`tags-${activeIndex}`} className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                                {activeMeta.tags.map((tag, i) => (
                                    <span
                                        key={tag}
                                        className={`font-sans text-[0.6rem] sm:text-[0.65rem] lg:text-[0.75rem] tracking-[0.14em] uppercase px-2 py-1 rounded-[2px] shadow-sm ${i === 0
                                            ? "bg-[#c8973a]/90 text-black font-bold"
                                            : "bg-black/40 text-white/80 border border-white/20 backdrop-blur-md"
                                            }`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {locField(activeBook, "description", lang) && (
                            <p
                                key={`desc-${activeIndex}`}
                                className="font-serif text-[0.85rem] sm:text-[1rem] lg:text-[1.2rem] leading-relaxed text-white/80 sm:text-white/95 mb-4 sm:mb-5 max-w-[95%] sm:max-w-[90%]"
                            >
                                {locField(activeBook, "description", lang)}
                            </p>
                        )}

                        <p className="font-sans text-[0.6rem] sm:text-[0.65rem] tracking-[0.16em] uppercase text-white/40 sm:text-white/50 font-bold">
                            Tez chiqadi
                        </p>
                    </div>

                    {/* TEZDA badge — absolute over image on both breakpoints */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-auto sm:right-6 bg-[#c8973a] text-black font-sans text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-[2px] shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                        TEZDA
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/[0.08]">
                        {isPlaying ? (
                            <div
                                key={`${activeIndex}-playing`}
                                className="h-full bg-[#c8973a] ticker-countdown shadow-[0_0_10px_rgba(200,151,58,0.8)]"
                            />
                        ) : (
                            <div
                                className="h-full bg-[#c8973a] transition-all duration-400 ease-out shadow-[0_0_10px_rgba(200,151,58,0.8)]"
                                style={{ width: `${((activeIndex + 1) / displayBooks.length) * 100}%` }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* THUMBNAIL STRIP */}
            <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 mt-2 flex gap-1.5">
                {displayBooks.map((book, index) => {
                    const thumbSrc = resolveImageUrl(book.cover_url);
                    const thumbColor = book.bg_color ? `hsl(${book.bg_color})` : "hsl(var(--accent))";
                    const thumbMeta = BOOK_META[book.id] ?? { objectPositionD: "center 20%", objectPositionM: "center 15%", tags: [] };
                    const thumbObjPos = book.focus_desktop_x != null && book.focus_desktop_y != null
                        ? `${book.focus_desktop_x}% ${book.focus_desktop_y}%`
                        : thumbMeta.objectPositionD;
                    const isActive = index === activeIndex;
                    return (
                        <div
                            key={book.id}
                            onClick={() => goTo(index)}
                            className={`flex-1 h-8 sm:h-10 lg:h-12 rounded-md overflow-hidden cursor-pointer relative transition-all duration-200 ${isActive
                                ? "ring-1 ring-[#c8973a]/60 opacity-100"
                                : "opacity-40 hover:opacity-65"
                                }`}
                            style={{ backgroundColor: thumbColor }}
                        >
                            {thumbSrc && (
                                <img
                                    src={thumbSrc}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="img-fade object-cover w-full h-full"
                                    style={{ objectPosition: thumbObjPos }}
                                    onLoad={(e) => e.currentTarget.classList.add("loaded")}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* CTA */}
            <p className="relative z-10 mt-8 px-4 text-center font-sans text-[0.7rem] tracking-[0.1em] uppercase text-white/30 hover:text-white/60 transition-colors duration-300 cursor-pointer">
                Barcha yangi nashrlardan xabardor bo'lish uchun obuna bo'ling →
            </p>
        </section>
    );
};

export default YangiNashrlar;