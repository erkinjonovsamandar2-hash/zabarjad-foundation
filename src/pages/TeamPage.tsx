import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import akbarImg from "@/assets/team/akbar.png";

const TEAM_MEMBERS = [
    { id: 1, name: "Akbar Toshtemirov", role: "Muharrir", image: akbarImg },
    { id: 2, name: "Jamoa A'zosi", role: "Musahhih", image: "https://pngimg.com/d/businessman_PNG6565.png" },
    { id: 3, name: "Jamoa A'zosi", role: "Badiiy muharrir", image: "https://pngimg.com/d/businessman_PNG6571.png" },
    { id: 4, name: "Jamoa A'zosi", role: "Muqova Dizayneri", image: "https://pngimg.com/d/businessman_PNG6576.png" },
    { id: 5, name: "Jamoa A'zosi", role: "Sahifalovchi", image: "https://pngimg.com/d/businessman_PNG6565.png" },
    { id: 6, name: "Jamoa A'zosi", role: "Tarjimon", image: "https://pngimg.com/d/businessman_PNG6571.png" },
];

const ROLE_ACCENT: Record<string, string> = {
    "Musahhih":         "#c8973a",
    "Badiiy muharrir":  "#4a9ab5",
    "Muqova Dizayneri": "#b5724a",
    "Sahifalovchi":     "#4ab580",
    "Tarjimon":         "#8b6ab5",
};

const ROLE_BG: Record<string, string> = {
    "Musahhih":         "#f5efe2",
    "Badiiy muharrir":  "#eef0f4",
    "Muqova Dizayneri": "#f4ede6",
    "Sahifalovchi":     "#edf4ef",
    "Tarjimon":         "#f0edf5",
};

const ROLE_GLYPH: Record<string, string> = {
    "Musahhih":         "М",
    "Badiiy muharrir":  "Б",
    "Muqova Dizayneri": "Д",
    "Sahifalovchi":     "С",
    "Tarjimon":         "Т",
};

export default function TeamPage() {
    const founder = TEAM_MEMBERS.find((m) => m.id === 1)!;
    const rest = TEAM_MEMBERS.filter((m) => m.id !== 1);

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
                            {/* Diagonal stripe — same as team cards */}
                            <div className="absolute inset-0 pointer-events-none"
                                style={{
                                    backgroundImage: "repeating-linear-gradient(-45deg, rgba(200,151,58,0.12) 0px, rgba(200,151,58,0.12) 1px, transparent 1px, transparent 20px)",
                                }} />

                            {/* Photo — PNG against paper bg, covers upper portion */}
                            <img
                                src={founder.image}
                                alt={founder.name}
                                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                            />

                            {/* Soft dark bottom gradient — same warm dark as team cards */}
                            <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none"
                                style={{
                                    background: "linear-gradient(to top, rgba(18,12,4,0.82) 0%, rgba(18,12,4,0.5) 45%, transparent 100%)",
                                }} />

                            {/* Badge */}
                            <div className="absolute top-5 right-5 z-10">
                                <span className="font-sans text-[8px] font-bold uppercase tracking-[0.35em] px-3 py-1.5"
                                    style={{ background: "hsl(45 66% 52%)", color: "#1a0e02" }}>
                                    Asoschisi
                                </span>
                            </div>

                            {/* № label */}
                            <div className="absolute top-5 left-5 z-10">
                                <span className="font-mono text-[9px] tracking-[0.2em]"
                                    style={{ color: "hsl(45 66% 42% / 0.6)" }}>№ 01</span>
                            </div>

                            {/* Text block — on gradient */}
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

                        {/* ── Team grid — right column ── */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {rest.map((member, i) => {
                                const accent = ROLE_ACCENT[member.role] ?? "#c8973a";
                                const bg = ROLE_BG[member.role] ?? "#0e0c09";
                                const glyph = ROLE_GLYPH[member.role] ?? member.role[0];

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
                                        {/* Diagonal stripe — visible on light bg */}
                                        <div className="absolute inset-0 pointer-events-none"
                                            style={{
                                                backgroundImage: `repeating-linear-gradient(-45deg, ${accent}16 0px, ${accent}16 1px, transparent 1px, transparent 20px)`,
                                            }} />

                                        {/* Large decorative glyph — darker tint for light bg */}
                                        <div className="absolute inset-0 flex items-end justify-end pr-4 pb-20 select-none pointer-events-none overflow-hidden"
                                            style={{
                                                fontSize: "6rem",
                                                fontFamily: "Georgia, serif",
                                                fontStyle: "italic",
                                                fontWeight: 700,
                                                color: `${accent}22`,
                                                lineHeight: 1,
                                            }}>
                                            {glyph}
                                        </div>

                                        {/* Top accent glow */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full pointer-events-none"
                                            style={{ background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)` }} />

                                        {/* Initials circle — gold ring, warm white fill */}
                                        <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: "26%" }}>
                                            <div
                                                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                                                style={{
                                                    border: `1.5px solid hsl(45 66% 52% / 0.55)`,
                                                    background: "rgba(255,250,240,0.85)",
                                                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                                                }}
                                            >
                                                <span className="font-heading text-lg font-bold"
                                                    style={{ color: "hsl(45 66% 42%)" }}>
                                                    {glyph}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bottom gradient — soft dark for text legibility */}
                                        <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none"
                                            style={{
                                                background: "linear-gradient(to top, rgba(18,12,4,0.72) 0%, rgba(18,12,4,0.45) 45%, transparent 100%)",
                                            }} />

                                        {/* Bottom text — sits on gradient, always legible */}
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

                                        {/* Inset border — light on paper */}
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

            <Footer />
        </div>
    );
}
