import { motion } from "framer-motion";
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
// Fills the entire card area with a role-tinted editorial design:
// layered radial + halftone-style background, oversized serif initial,
// concentric rings, and a diagonal stripe sweep identical to the photo cards.
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
// A rich gradient disc with a serif italic initial + inner ring,
// sized to match real portrait circles in the marquee.
const NoPhotoCircle = ({ name, role }: { name: string; role: "MUALLIF" | "TARJIMON" }) => {
    const isAuthor = role === "MUALLIF";
    const [from, to] = isAuthor
        ? ["hsl(35 70% 28%)", "hsl(45 80% 48%)"]
        : ["hsl(230 50% 28%)", "hsl(250 60% 52%)"];
    const ringColor = isAuthor ? "rgba(255,220,120,0.35)" : "rgba(160,160,255,0.35)";
    const initial = name.charAt(0).toUpperCase();
    return (
        <div
            className="relative flex-shrink-0 flex items-center justify-center rounded-full"
            style={{
                width: "104px", height: "104px",
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
                    fontSize: "2.6rem",
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

export default function TeamPage() {
    const { teamMembers, authorSpotlights, teamLoading, authorsLoading } = useData();

    // Sort by sort_order — lowest sort_order = big featured card.
    // Never show fallback images: while loading → skeletons, after → real DB data.
    const sorted = [...teamMembers].sort((a, b) => a.sort_order - b.sort_order);
    const founder = sorted[0];
    const rest = sorted.slice(1);
    const authors = authorSpotlights;

    // Wait only for team-specific fetches — not for books/articles/etc.
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
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

            <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">

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
                                <em className="not-italic font-normal text-foreground/40">Jamoa</em>
                            </h1>
                            <p className="font-serif italic text-foreground/55 text-base md:text-lg leading-relaxed max-w-sm border-l border-border/40 pl-4">
                                Orqamizda turgan ijodkorlar va mutaxassislar.
                                Har bir sahifa ularning mehnatidan tug'iladi.
                            </p>
                        </div>

                        <div className="mt-8 w-full h-px"
                            style={{ background: "linear-gradient(to right, hsl(45 66% 52% / 0.3), hsl(var(--border) / 0.5), transparent)" }} />
                    </motion.div>

                    {/* ── Asymmetric layout ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">

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
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                                            aspectRatio: "3/4",
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

                                        {/* Top accent glow */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full pointer-events-none"
                                            style={{ background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)` }} />

                                        {/* Photo or premium no-photo fill */}
                                        {member.image_url ? (
                                            <img
                                                src={member.image_url}
                                                alt={member.name}
                                                className="absolute inset-0 w-full h-full object-cover object-top opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
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
                    <div className="mt-20 flex items-center gap-4">
                        <div className="flex-1 h-px bg-border/30" />
                        <span className="font-mono text-[9px] text-foreground/20 tracking-[0.2em] uppercase">
                            {new Date().getFullYear()} &mdash; Booktopia
                        </span>
                        <div className="flex-1 h-px bg-border/30" />
                    </div>

                </div>
            </main>

            {/* ── Mualliflar va Tarjimonlar marquee ──────────────────────────────── */}
            <section className="relative w-full py-24 md:py-32 overflow-hidden border-y border-border/50 bg-background">

                {/* Background glow */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-15">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full pointer-events-none"
                        style={{ backgroundImage: "radial-gradient(circle at center, hsl(var(--primary) / 0.4) 0%, transparent 60%)" }} />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none"
                        style={{ backgroundImage: "radial-gradient(circle at center, hsl(var(--accent) / 0.3) 0%, transparent 60%)" }} />
                </div>

                <div className="relative z-10 w-full flex flex-col items-center">
                    <h2 className="font-heading font-bold text-4xl md:text-5xl leading-[1.05] tracking-wide text-foreground mb-16 text-center drop-shadow-sm">
                        Muallif va Tarjimonlarimiz
                    </h2>

                    {/* Marquee row */}
                    <div className="w-full relative flex overflow-x-hidden group">
                        {/* Edge fades */}
                        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                        <motion.div
                            className="flex items-center gap-12 sm:gap-16 lg:gap-24 whitespace-nowrap pl-12 sm:pl-16 lg:pl-24 will-change-transform"
                            animate={{ x: ["0%", "-33.333333%"] }}
                            transition={{ duration: 35, ease: "linear", repeat: Infinity }}
                        >
                            {[...authors, ...authors, ...authors].map((author, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-5 transition-transform duration-500 ease-out cursor-pointer group/card"
                                >
                                    {author.image_url ? (
                                        <img
                                            src={author.image_url}
                                            alt={author.name}
                                            loading="lazy"
                                            className="w-[104px] h-[104px] md:w-[150px] md:h-[150px] rounded-full object-cover border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                                        />
                                    ) : (
                                        <NoPhotoCircle name={author.name} role={author.role as "MUALLIF" | "TARJIMON"} />
                                    )}
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="font-heading text-2xl text-foreground group-hover/card:text-gold transition-colors duration-500">
                                            {author.name}
                                        </span>
                                        <span className={`font-sans font-bold text-[0.65rem] tracking-[0.2em] uppercase ${author.role === "MUALLIF" ? "text-primary" : "text-gold"}`}>
                                            {author.role}
                                        </span>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-gold/40 block ml-8 md:ml-16" />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
