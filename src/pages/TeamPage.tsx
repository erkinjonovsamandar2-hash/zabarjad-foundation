import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { X, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useData } from "@/context/DataContext";
import type { TeamMember, AuthorSpotlightItem } from "@/context/DataContext";

// ── Hardcoded accent colours per role (used if no DB accent exists) ────────────
const ROLE_ACCENT: Record<string, string> = {
    "Muharrir": "#c8973a",
    "Musahhih": "#c8973a",
    "Badiiy muharrir": "#4a9ab5",
    "Muqova Dizayneri": "#b5724a",
    "Sahifalovchi": "#4ab580",
    "Tarjimon": "#8b6ab5",
};

const ROLE_BG: Record<string, string> = {
    "Musahhih": "#f5efe2",
    "Badiiy muharrir": "#eef0f4",
    "Muqova Dizayneri": "#f4ede6",
    "Sahifalovchi": "#edf4ef",
    "Tarjimon": "#f0edf5",
};


const getAccent = (role: string) => ROLE_ACCENT[role] ?? "#c8973a";
const getBg = (role: string) => ROLE_BG[role] ?? "#f5efe2";
const getGlyph = (role: string) => {
    const map: Record<string, string> = {
        "Musahhih": "М", "Badiiy muharrir": "Б",
        "Muqova Dizayneri": "Д", "Sahifalovchi": "С", "Tarjimon": "Т",
    };
    return map[role] ?? role.charAt(0).toUpperCase();
};

// ── Premium no-photo card fill (portrait cards) ───────────────────────────────
const NoPhotoCard = ({ name, role, isFounder = false }: { name: string; role: string; isFounder?: boolean }) => {
    const accent = getAccent(role);
    const initial = name.charAt(0).toUpperCase();
    return (
        <>
            {/* Radial gradient halo */}
            <div className="absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse 80% 70% at 50% 40%, ${accent}28 0%, transparent 70%)`,
                }} />

            {/* Subtle halftone-style dot grid */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `radial-gradient(circle, ${accent} 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                }} />

            {/* Two concentric rings centred slightly above midpoint */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: "18%" }}>
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-36 h-36 rounded-full"
                        style={{ border: `1px solid ${accent}30` }} />
                    <div className="absolute w-24 h-24 rounded-full"
                        style={{ border: `1px solid ${accent}50` }} />

                    {/* Glowing serif initial */}
                    <div
                        className="relative z-10 select-none"
                        style={{
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            fontStyle: "italic",
                            fontWeight: 700,
                            fontSize: isFounder ? "5.5rem" : "3.8rem",
                            lineHeight: 1,
                            background: `linear-gradient(135deg, ${accent} 0%, ${accent}aa 60%, ${accent}55 100%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: `drop-shadow(0 0 18px ${accent}60)`,
                        }}
                    >
                        {initial}
                    </div>
                </div>
            </div>

            {/* Four corner micro-marks */}
            {["top-3 left-3", "top-3 right-3", "bottom-14 left-3", "bottom-14 right-3"].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-3 h-3 pointer-events-none`}
                    style={{
                        borderTop: i < 2 ? `1px solid ${accent}50` : "none",
                        borderBottom: i >= 2 ? `1px solid ${accent}50` : "none",
                        borderLeft: (i === 0 || i === 2) ? `1px solid ${accent}50` : "none",
                        borderRight: (i === 1 || i === 3) ? `1px solid ${accent}50` : "none",
                    }} />
            ))}
        </>
    );
};

// ── Premium no-photo circle (marquee) ─────────────────────────────────────────
const NoPhotoCircle = ({
    name,
    role,
    size = 160,
}: {
    name: string;
    role: "MUALLIF" | "TARJIMON";
    size?: number;
}) => {
    const isAuthor = role === "MUALLIF";
    const [from, to] = isAuthor
        ? ["hsl(35 70% 28%)", "hsl(45 80% 48%)"]
        : ["hsl(230 50% 28%)", "hsl(250 60% 52%)"];
    const ringColor = isAuthor ? "rgba(255,220,120,0.35)" : "rgba(160,160,255,0.35)";
    const initial = name.charAt(0).toUpperCase();
    const fontSize = size * 0.4;
    return (
        <div
            className="relative flex-shrink-0 flex items-center justify-center rounded-full"
            style={{
                width: size, height: size,
                background: `radial-gradient(circle at 38% 35%, ${from}, ${to})`,
                boxShadow: `0 8px 30px rgba(0,0,0,0.18), inset 0 0 0 1.5px ${ringColor}`,
            }}
        >
            {/* Inner soft glow */}
            <div className="absolute inset-0 rounded-full"
                style={{ background: `radial-gradient(circle at 40% 30%, rgba(255,255,255,0.18) 0%, transparent 65%)` }} />
            {/* Serif initial */}
            <span
                className="relative z-10 select-none"
                style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontStyle: "italic",
                    fontWeight: 700,
                    fontSize,
                    lineHeight: 1,
                    color: "rgba(255,255,255,0.92)",
                    textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                }}
            >
                {initial}
            </span>
        </div>
    );
};

// ── Skeleton card — shown while DB fetch is in progress ───────────────────────
const SkeletonCard = ({ className = "" }: { className?: string }) => (
    <div
        className={`relative overflow-hidden bg-foreground/6 animate-pulse ${className}`}
        style={{ aspectRatio: "3/4" }}
    />
);

// ── Author popup ──────────────────────────────────────────────────────────────
const AuthorPopup = ({
    author,
    onClose,
}: {
    author: AuthorSpotlightItem;
    onClose: () => void;
}) => {
    const isAuthor = author.role === "MUALLIF";
    const accentColor = isAuthor ? "hsl(45 66% 52%)" : "hsl(250 60% 65%)";
    const books = author.books
        ? author.books.split("\n").map(b => b.trim()).filter(Boolean)
        : [];

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <motion.div
            key="popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
            style={{ background: "rgba(8,6,4,0.8)", backdropFilter: "blur(10px)" }}
            onClick={onClose}
        >
            <motion.div
                key="popup-panel"
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 36 }}
                className="relative w-full sm:max-w-[32rem] max-h-[80dvh] sm:max-h-[90dvh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
                style={{
                    background: "hsl(var(--background))",
                    boxShadow: `0 -8px 60px rgba(0,0,0,0.45), 0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px ${accentColor}22`,
                }}

                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag handle pill */}
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                    <div className="w-10 h-1 rounded-full" style={{ background: `${accentColor}40` }} />
                </div>

                {/* ── Header Backdrop ── */}
                <div className="relative w-full flex-shrink-0 overflow-hidden h-[120px] sm:h-[140px]">
                    {/* Diagonal stripe bg */}
                    <div className="absolute inset-0" style={{
                        background: isAuthor ? "hsl(35 40% 14%)" : "hsl(240 35% 14%)",
                        backgroundImage: `repeating-linear-gradient(-45deg, ${accentColor}12 0px, ${accentColor}12 1px, transparent 1px, transparent 22px)`,
                    }} />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110"
                        style={{
                            background: "rgba(0,0,0,0.5)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(255,255,255,0.15)",
                        }}
                    >
                        <X className="w-4 h-4 text-white/80" />
                    </button>

                    {/* Role badge */}
                    <div className="absolute top-3 left-3 z-20">
                        <span
                            className="inline-block font-sans font-bold text-[9px] tracking-[0.22em] uppercase px-2.5 py-1 rounded-full"
                            style={{
                                background: `${accentColor}22`,
                                border: `1px solid ${accentColor}55`,
                                color: accentColor,
                                backdropFilter: "blur(4px)",
                            }}
                        >
                            {author.role}
                        </span>
                    </div>
                </div>

                {/* ── Circular Avatar Overlap ── */}
                <div className="relative flex justify-center -mt-16 sm:-mt-20 z-10 pointer-events-none">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[5px] shadow-xl overflow-hidden pointer-events-auto"
                        style={{ borderColor: "hsl(var(--background))", backgroundColor: "hsl(var(--background))" }}>
                        {author.image_url ? (
                            <img
                                src={author.image_url}
                                alt={author.name}
                                className="w-full h-full object-cover object-top"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <NoPhotoCircle name={author.name} role={author.role} size={150} />
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Text content — scrollable ── */}
                <div className="min-h-0 px-6 pt-4 overflow-y-auto flex-1 text-center sm:text-left overscroll-contain" style={{ scrollbarWidth: "none" }}>
                    {/* Gold rule */}
                    <div className="w-8 h-px mb-4 mx-auto sm:mx-0" style={{ background: accentColor }} />

                    {/* Name */}
                    <h3 className="font-heading font-bold leading-tight text-foreground mb-4"
                        style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>
                        {author.name}
                    </h3>

                    {/* Description */}
                    {author.description && (
                        <p className="font-serif text-sm leading-relaxed text-foreground/70 mb-5 whitespace-pre-line">
                            {author.description}
                        </p>
                    )}

                    {/* Books list */}
                    {books.length > 0 && (
                        <div className="text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 mt-6">
                                <BookOpen className="w-3.5 h-3.5" style={{ color: accentColor }} />
                                <span className="font-sans font-bold text-[9px] tracking-[0.22em] uppercase"
                                    style={{ color: accentColor }}>
                                    {isAuthor ? "Muallif kitoblari" : "Tarjimon kitoblari"}
                                </span>
                            </div>
                            <ul className="space-y-1.5">
                                {books.map((book, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: accentColor }} />
                                        <span className="font-serif text-sm text-foreground/80 leading-snug">{book}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Empty state */}
                    {!author.description && books.length === 0 && (
                        <p className="font-serif text-sm text-foreground/40 italic">
                            Ma'lumot hali qo'shilmagan.
                        </p>
                    )}

                    {/* Bulletproof scroll spacer for Safari/Mobile navbars */}
                    <div className="w-full h-16 sm:h-10 shrink-0" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
                </div>

                {/* Corner decorative marks */}
                {[
                    "bottom-4 left-4",
                    "bottom-4 right-4",
                ].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-3 h-3 pointer-events-none`}
                        style={{
                            borderBottom: `1px solid ${accentColor}40`,
                            borderLeft: i === 0 ? `1px solid ${accentColor}40` : "none",
                            borderRight: i === 1 ? `1px solid ${accentColor}40` : "none",
                        }} />
                ))}
            </motion.div>
        </motion.div>
    );
};

export default function TeamPage() {
    const { teamMembers, authorSpotlights, teamLoading, authorsLoading } = useData();
    const [selectedAuthor, setSelectedAuthor] = useState<AuthorSpotlightItem | null>(null);

    // ── Marquee drag + auto-scroll ─────────────────────────────────────────────
    const marqueeX = useMotionValue(0);
    const marqueeTrackRef = useRef<HTMLDivElement>(null);
    const marqueeAnimRef = useRef<ReturnType<typeof animate> | null>(null);
    const launchRef = useRef<(() => void) | null>(null);
    const wasDraggingRef = useRef(false);

    // Mount: start auto-scroll loop
    useEffect(() => {
        let stopped = false;

        function launch() {
            if (stopped || !marqueeTrackRef.current) return;
            const oneSet = marqueeTrackRef.current.scrollWidth / 3;
            if (oneSet < 10) return;

            // Normalize current x into (-oneSet, 0]
            let cur = marqueeX.get();
            cur = cur - Math.ceil(cur / oneSet) * oneSet; // wrap to <= 0
            while (cur <= -oneSet) cur += oneSet;
            marqueeX.set(cur);

            const fraction = Math.abs(cur) / oneSet;          // 0 = start, 1 = end
            const duration = Math.max((1 - fraction) * 110, 1);

            marqueeAnimRef.current = animate(marqueeX, -oneSet, {
                duration,
                ease: "linear",
                onComplete: () => {
                    if (stopped) return;
                    marqueeX.set(0);
                    launch();
                },
            });
        }

        launchRef.current = launch;
        const t = setTimeout(launch, 150);

        return () => {
            stopped = true;
            clearTimeout(t);
            marqueeAnimRef.current?.stop();
            launchRef.current = null;
        };
    }, [marqueeX]);

    // Handle mouse wheel scrolling for the marquee
    const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleWheel = (e: React.WheelEvent) => {
        // Stop any running auto-animation
        if (marqueeAnimRef.current) {
            marqueeAnimRef.current.stop();
        }

        // Prevent default vertical scrolling if we're actively scrolling the marquee
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || Math.abs(e.deltaY) > 5) {
            e.preventDefault();
        }

        // Apply scroll delta (prefer X if trackpad sideways, otherwise Y for mousewheel)
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        const currentX = marqueeX.get();
        marqueeX.set(currentX - delta);

        // Restart auto-scroll after user stops wheeling
        if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
        wheelTimeoutRef.current = setTimeout(() => {
            if (!selectedAuthor) launchRef.current?.();
        }, 150);
    };

    // Pause while popup is open, resume on close
    useEffect(() => {
        if (selectedAuthor) {
            marqueeAnimRef.current?.stop();
        } else {
            launchRef.current?.();
        }
    }, [selectedAuthor]);

    const openPopup = (author: AuthorSpotlightItem) => setSelectedAuthor(author);
    const closePopup = () => setSelectedAuthor(null);

    // Sort by sort_order — lowest sort_order = big featured card.
    const sorted = [...teamMembers].sort((a, b) => a.sort_order - b.sort_order);
    const founder = sorted[0];
    const rest = sorted.slice(1);
    const authors = authorSpotlights;

    if (teamLoading || authorsLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <ScrollToTop />
                <Navbar />
                <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-10">
                    <div className="max-w-6xl mx-auto w-full">
                        <div className="mb-16 space-y-3">
                            <div className="h-2.5 w-24 rounded bg-foreground/10 animate-pulse" />
                            <div className="h-9 w-56 rounded bg-foreground/10 animate-pulse" />
                            <div className="h-2.5 w-80 rounded bg-foreground/8 animate-pulse" />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                            <SkeletonCard className="w-full lg:w-[340px] flex-shrink-0" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 flex-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col transition-colors duration-500">
            <ScrollToTop />
            <Navbar />

            <main className="flex-1 pt-28 pb-10 px-4 sm:px-6 lg:px-10 relative overflow-hidden">

                {/* ── Grain texture ── */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.07] z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        backgroundSize: "200px",
                    }}
                />

                {/* ── Ambient glows ── */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[5%] left-[-5%] w-[50vw] h-[50vw] rounded-full blur-[130px]"
                        style={{ background: "hsl(45 66% 52% / 0.05)" }} />
                    <div className="absolute bottom-[0%] right-[-5%] w-[40vw] h-[40vw] rounded-full blur-[100px]"
                        style={{ background: "hsl(210 60% 40% / 0.06)" }} />
                </div>

                <div className="max-w-6xl mx-auto w-full relative z-10">

                    {/* ── Editorial masthead ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="mb-16 md:mb-20"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="block w-10 h-px" style={{ background: "hsl(45 66% 52% / 0.5)" }} />
                            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
                                style={{ color: "hsl(45 66% 52% / 0.8)" }}>
                                Booktopia &mdash; Nashriyot guruhi
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <h1 className="font-heading font-bold leading-[0.92] tracking-tight text-foreground"
                                style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}>
                                Bizning
                                <br />
                                <em className="not-italic font-normal" style={{ color: "hsl(45 66% 52%)" }}>Jamoa</em>
                            </h1>
                            <p className="font-serif text-foreground/80 text-lg md:text-xl leading-relaxed max-w-lg border-l border-border/40 pl-4">
                                <b>Booktopia</b> — dunyo tafakkurining eng muhim asarlarini o‘zbek tilida taqdim etish orqali bilim va mutolaa madaniyatini rivojlantirishni o‘z oldiga maqsad qilgan nashriyotdir. Biz shu g‘oya atrofida birlashgan jamoa sifatida sifatli kitoblar yaratish va ularni kitobxonlarga yetkazish yo‘lida birgalikda ishlaymiz.
                            </p>
                        </div>

                        <div className="mt-8 w-full h-px"
                            style={{ background: "linear-gradient(to right, hsl(45 66% 52% / 0.3), hsl(var(--border) / 0.5), transparent)" }} />
                    </motion.div>

                    {/* ── Asymmetric layout ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,300px)_1fr] gap-6 lg:gap-8 items-start">

                        {/* ── Founder — dominant left column ── */}
                        {founder && (
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                className="group relative overflow-hidden"
                                style={{
                                    aspectRatio: "3/4",
                                    background: "#f7f0e4",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 8px 32px rgba(0,0,0,0.05)",
                                }}
                            >
                                {/* Diagonal stripe */}
                                <div className="absolute inset-0 pointer-events-none"
                                    style={{ backgroundImage: "repeating-linear-gradient(-45deg, rgba(200,151,58,0.12) 0px, rgba(200,151,58,0.12) 1px, transparent 1px, transparent 20px)" }} />

                                {/* Photo or premium no-photo fill */}
                                {founder.image_url ? (
                                    <img
                                        src={founder.image_url}
                                        alt={founder.name}
                                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <NoPhotoCard name={founder.name} role={founder.role} isFounder />
                                )}

                                {/* Bottom gradient */}
                                <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none"
                                    style={{ background: "linear-gradient(to top, rgba(18,12,4,0.82) 0%, rgba(18,12,4,0.5) 45%, transparent 100%)" }} />


                                {/* № label */}
                                <div className="absolute top-5 left-5 z-10">
                                    <span className="font-mono text-[9px] tracking-[0.2em]"
                                        style={{ color: "hsl(45 66% 42% / 0.6)" }}>№ 01</span>
                                </div>

                                {/* Text block */}
                                <div className="absolute bottom-0 left-0 right-0 z-10 p-7">
                                    <div className="w-10 h-px mb-4"
                                        style={{ background: "hsl(45 66% 62%)", boxShadow: "0 0 8px hsl(45 66% 52% / 0.5)" }} />
                                    <p className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] mb-2 text-white/60">
                                        {founder.role}
                                    </p>
                                    <h2 className="font-heading font-bold text-white/90 leading-[0.95] tracking-tight"
                                        style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                                        {founder.name.split(" ")[0]}
                                        <br />
                                        <span className="font-normal italic">{founder.name.split(" ").slice(1).join(" ")}</span>
                                    </h2>
                                </div>

                                {/* Inset gold border */}
                                <div className="absolute inset-0 pointer-events-none"
                                    style={{ boxShadow: "inset 0 0 0 1px rgba(200,151,58,0.3)" }} />
                            </motion.div>
                        )}

                        {/* ── Team grid — right column ── */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                            {rest.map((member, i) => {
                                const accent = getAccent(member.role);
                                const bg = getBg(member.role);
                                const glyph = getGlyph(member.role);

                                return (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease: "easeOut" }}
                                        className="group relative overflow-hidden"
                                        style={{
                                            aspectRatio: "4/5",
                                            background: bg,
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 8px 32px rgba(0,0,0,0.05)",
                                        }}
                                    >
                                        {/* Diagonal stripe */}
                                        <div className="absolute inset-0 pointer-events-none"
                                            style={{ backgroundImage: `repeating-linear-gradient(-45deg, ${accent}16 0px, ${accent}16 1px, transparent 1px, transparent 20px)` }} />

                                        {/* Large decorative glyph */}
                                        <div className="absolute inset-0 flex items-end justify-end pr-4 pb-20 select-none pointer-events-none overflow-hidden"
                                            style={{ fontSize: "6rem", fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 700, color: `${accent}22`, lineHeight: 1 }}>
                                            {glyph}
                                        </div>

                                        {/* Photo or premium no-photo fill */}
                                        {member.image_url ? (
                                            <img
                                                src={member.image_url}
                                                alt={member.name}
                                                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                                            />
                                        ) : (
                                            <NoPhotoCard name={member.name} role={member.role} />
                                        )}

                                        {/* Bottom gradient */}
                                        <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none"
                                            style={{ background: "linear-gradient(to top, rgba(18,12,4,0.72) 0%, rgba(18,12,4,0.45) 45%, transparent 100%)" }} />

                                        {/* Bottom text */}
                                        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                                            <div className="h-px mb-2.5 transition-all duration-500 group-hover:w-8"
                                                style={{ width: "16px", background: "hsl(45 66% 62%)", opacity: 0.7 }} />
                                            <p className="font-sans text-[8px] font-bold uppercase tracking-[0.26em] mb-1 text-white/60">
                                                {member.role}
                                            </p>
                                            <h3 className="font-heading text-sm font-bold leading-tight text-white/85 group-hover:text-white transition-colors duration-300">
                                                {member.name}
                                            </h3>
                                        </div>

                                        {/* Inset border */}
                                        <div className="absolute inset-0 pointer-events-none"
                                            style={{ boxShadow: `inset 0 0 0 1px ${accent}25` }} />
                                    </motion.div>
                                );
                            })}
                        </div>

                    </div>

                    {/* ── Bottom rule ── */}
                    <div className="mt-10 flex items-center gap-4">
                        <div className="flex-1 h-px bg-border/30" />
                        <span className="font-mono text-[9px] text-foreground/20 tracking-[0.2em] uppercase">
                            {new Date().getFullYear()} &mdash; Booktopia
                        </span>
                        <div className="flex-1 h-px bg-border/30" />
                    </div>

                </div>
            </main>

            {/* ── Mualliflar va Tarjimonlar marquee ──────────────────────────────── */}
            <section className="relative w-full py-16 md:py-20 overflow-hidden border-y border-border/50 bg-background">

                <style>{`.author-card:active { transform: scale(0.98); }`}</style>

                {/* Background glow */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-15">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full pointer-events-none"
                        style={{ backgroundImage: "radial-gradient(circle at center, hsl(var(--primary) / 0.4) 0%, transparent 60%)" }} />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none"
                        style={{ backgroundImage: "radial-gradient(circle at center, hsl(var(--accent) / 0.3) 0%, transparent 60%)" }} />
                </div>

                <div className="relative z-10 w-full flex flex-col items-center">
                    <div className="flex flex-col items-center gap-4 mb-12">
                        <div className="inline-flex items-center gap-4">
                            <span className="w-8 h-px" style={{ background: "hsl(45 66% 52% / 0.5)" }} />
                            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
                                style={{ color: "hsl(45 66% 52% / 0.8)" }}>
                                Booktopia Hamkorlari
                            </p>
                            <span className="w-8 h-px" style={{ background: "hsl(45 66% 52% / 0.5)" }} />
                        </div>
                        <h2 className="font-heading font-bold text-4xl md:text-5xl leading-[1.05] tracking-wide text-foreground text-center drop-shadow-sm">
                            Muallif va Tarjimonlarimiz
                        </h2>

                    </div>

                    {/* Single marquee row — drag left/right to browse */}
                    <div
                        className="w-full relative flex overflow-x-hidden cursor-grab active:cursor-grabbing select-none"
                        onWheel={handleWheel}
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                        <motion.div
                            ref={marqueeTrackRef}
                            className="flex items-center gap-10 sm:gap-14 lg:gap-20 whitespace-nowrap pl-10 sm:pl-14 lg:pl-20 will-change-transform"
                            style={{ x: marqueeX }}
                            drag="x"
                            dragMomentum={false}
                            dragElastic={0}
                            onDragStart={() => {
                                wasDraggingRef.current = false;
                                marqueeAnimRef.current?.stop();
                            }}
                            onDrag={() => { wasDraggingRef.current = true; }}
                            onDragEnd={() => {
                                // Small timeout to prevent the immediate subsequent click event from firing right after a drag ends
                                setTimeout(() => {
                                    wasDraggingRef.current = false;
                                }, 50);
                                if (!selectedAuthor) launchRef.current?.();
                            }}
                        >
                            {[...authors, ...authors, ...authors].map((author, index) => {
                                const isAuthorRole = author.role === "MUALLIF";
                                const ringColor = isAuthorRole ? "rgba(200,151,58,0.45)" : "rgba(140,120,220,0.45)";
                                return (
                                    <button
                                        key={index}
                                        className="author-card group/card flex items-center gap-5 cursor-pointer flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                        style={{ ["--tw-ring-color" as string]: isAuthorRole ? "#c8973a" : "#8b6ab5" }}
                                        onClick={(e) => {
                                            // Only open popup if we didn't drag the marquee
                                            if (!wasDraggingRef.current) openPopup(author);
                                        }}
                                        title={`${author.name} haqida ko'proq`}
                                    >
                                        {/* Circle photo — gold tint on hover, no scale */}
                                        <div
                                            className="relative flex-shrink-0 overflow-hidden rounded-full"
                                            style={{
                                                width: "clamp(130px, 13vw, 196px)",
                                                height: "clamp(130px, 13vw, 196px)",
                                                boxShadow: `0 8px 32px rgba(0,0,0,0.18), 0 0 0 2.5px ${ringColor}`,
                                                transition: "box-shadow 0.3s ease",
                                            }}
                                        >
                                            {author.image_url ? (
                                                <img
                                                    src={author.image_url}
                                                    alt={author.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <NoPhotoCircle
                                                    name={author.name}
                                                    role={author.role as "MUALLIF" | "TARJIMON"}
                                                    size={196}
                                                />
                                            )}
                                            {/* Gold tint overlay on hover */}
                                            <div
                                                className="absolute inset-0 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                style={{
                                                    background: isAuthorRole
                                                        ? "radial-gradient(circle, rgba(200,151,58,0.22) 0%, rgba(200,151,58,0.08) 70%, transparent 100%)"
                                                        : "radial-gradient(circle, rgba(139,106,181,0.22) 0%, rgba(139,106,181,0.08) 70%, transparent 100%)",
                                                }}
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col items-start gap-1.5">
                                            <span
                                                className="font-heading leading-tight text-foreground transition-colors duration-300 group-hover/card:text-[#c8973a]"
                                                style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.65rem)" }}
                                            >
                                                {author.name}
                                            </span>
                                            <span
                                                className="font-sans font-bold text-[0.6rem] tracking-[0.22em] uppercase px-2 py-0.5 rounded-full"
                                                style={isAuthorRole
                                                    ? { color: "#c8973a", background: "rgba(200,151,58,0.12)", border: "1px solid rgba(200,151,58,0.3)" }
                                                    : { color: "#8b6ab5", background: "rgba(139,106,181,0.12)", border: "1px solid rgba(139,106,181,0.3)" }
                                                }
                                            >
                                                {author.role}
                                            </span>
                                            {/* Batafsil button — always visible, lights up on hover */}
                                            <span
                                                className="mt-0.5 inline-flex items-center gap-1 font-sans font-bold text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full transition-all duration-250 pointer-events-none"
                                                style={{
                                                    color: isAuthorRole ? "#c8973a" : "#8b6ab5",
                                                    border: `1px solid ${isAuthorRole ? "rgba(200,151,58,0.35)" : "rgba(139,106,181,0.35)"}`,
                                                    background: "transparent",
                                                }}
                                            >
                                                Batafsil
                                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ display: "inline", marginLeft: 2 }}>
                                                    <path d="M1.5 4H6.5M6.5 4L4 1.5M6.5 4L4 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </div>

                                        {/* Divider dot */}
                                        <span
                                            className="flex-shrink-0 w-1.5 h-1.5 rounded-full ml-6 lg:ml-10"
                                            style={{ background: "hsl(45 66% 52% / 0.3)" }}
                                        />
                                    </button>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Author popup ── */}
            <AnimatePresence>
                {selectedAuthor && (
                    <AuthorPopup author={selectedAuthor} onClose={closePopup} />
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
