// @refresh reset
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Replaced old logo with text-based lockup

// ── Reveal wrapper ────────────────────────────────────────────────────────────
const Reveal = ({
  children, delay = 0, className = "", from = "bottom",
}: {
  children: React.ReactNode; delay?: number; className?: string; from?: "bottom" | "left" | "right";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const initial =
    from === "left" ? { opacity: 0, x: -28 } :
      from === "right" ? { opacity: 0, x: 28 } :
        { opacity: 0, y: 22 };
  return (
    <motion.div ref={ref} className={className}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ── Amber diamond divider ─────────────────────────────────────────────────────
const Divider = () => (
  <div className="flex items-center gap-4 my-4" aria-hidden>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
    <div className="w-2 h-2 rotate-45 shrink-0 bg-gold shadow-[0_0_8px_rgba(213,173,54,0.4)]" />
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
  </div>
);

// ── Section heading ───────────────────────────────────────────────────────────
const SectionLabel = ({ label, title }: { label: string; title: string }) => (
  <div className="text-center mb-12">
    <div className="inline-flex items-center gap-3 mb-3">
      <div className="h-px w-8 bg-gold/40" />
      <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.45em] text-gold font-black">{label}</span>
      <div className="h-px w-8 bg-gold/40" />
    </div>
    <h2 className="font-heading font-black tracking-tight font-extrabold text-foreground drop-shadow-sm" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
      {title}
    </h2>
  </div>
);

// ── Process steps ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01", uz: "Tanlov", en: "Curation",
    desc: "Dunyo adabiyotining eng sara asarlari — klassikdan zamonaviyga. Har bir kitob o'zbek o'quvchisi uchun haqiqiy xazina sifatida tanlanadi.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
        <path d="M13 20l5 5 9-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "02", uz: "Huquqlar", en: "Rights",
    desc: "Xalqaro nashriyotlar bilan rasmiy hamkorlik. Tarjima huquqlari olish — sifat kafolati va muallif hurmatining ifodasi.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <rect x="8" y="10" width="24" height="22" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 17h12M14 22h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M27 6v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "03", uz: "Tarjima San'ati", en: "Translation",
    desc: "Matn emas — ruh ko'chiriladi. Eng yaxshi tarjimonlar har bir jumlada asl asarning nafasini saqlab qoladi.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <path d="M7 13h12M13 9v4M9 13c1 4 5 7 9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 22l9 11M22 33l9-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="20" x2="33" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" />
      </svg>
    ),
  },
  {
    num: "04", uz: "Nashr", en: "Premium Print",
    desc: "Yuqori sifatli qog'oz, professional muqova, mukammal bosma. Kitob — qo'lingizdagi san'at asari.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
        <rect x="9" y="7" width="14" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="17" y="9" width="14" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="21" x2="28" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="26" x2="25" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

// ══════════════════════════════════════════════════════════════════════════════
const About = () => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}
    className="min-h-screen bg-[#faf9f5] dark:bg-[#080808] relative"
  >
    <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none" />

    <Navbar />

    {/* ╔══════════════════════════════════════════════════════════════╗
        ║  §1 — HERO: Logo card + headline + name meaning              ║
        ╚══════════════════════════════════════════════════════════════╝ */}
    <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-16">
      {/* Changed to items-center on lg so the card's height is natural and not over-stretched */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16 xl:gap-20">

        {/* ── Identity card ────────────────────────────────────────── */}
        <Reveal from="left" className="w-full max-w-[360px] lg:w-[350px] xl:w-[380px] shrink-0">
          <div
            className="relative w-full rounded-[2rem] overflow-hidden flex flex-col border border-amber-500/20"
            style={{
              background: "linear-gradient(160deg, #38250f 0%, #1a1205 55%, #0f0a02 100%)",
              boxShadow: "0 40px 90px -20px rgba(245,158,11,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Decorative rings */}
            <svg viewBox="0 0 340 440" fill="none" aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <circle cx="170" cy="200" r="90" stroke="hsl(var(--gold))" strokeWidth="1" strokeDasharray="3 8" />
              <circle cx="170" cy="200" r="130" stroke="hsl(var(--gold))" strokeWidth="0.5" strokeDasharray="2 12" />
              <circle cx="170" cy="200" r="168" stroke="hsl(var(--gold))" strokeWidth="0.3" strokeDasharray="1 16" />
              <path d="M50 440 Q170 100 290 440" stroke="hsl(var(--gold))" strokeWidth="1" fill="none" />
            </svg>

            {/* Nashriyot label - UPDATED TO 2018 */}
            <div className="relative z-10 pt-8 pb-2 flex justify-center">
              <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-gold/80 font-black">
                Nashriyot · Est. 2018
              </span>
            </div>

            {/* ── BIG logo — hero of the card ── */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-7 px-8 py-8">
              <motion.div
                className="relative flex items-center justify-center"
                initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Ambient glow halo */}
                <div className="absolute inset-[-30px] pointer-events-none bg-gold/25 blur-[35px] rounded-full" />

                {/* THE NEW LOGO FRAME: Parchment background blends seamlessly with text */}
                <div
                  className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] bg-background"
                  style={{ border: "3px solid rgba(245, 158, 11, 0.2)" }}
                >
                  <span className="font-heading font-black tracking-tight text-3xl sm:text-4xl text-foreground text-center px-4">
                    Booktopia<br />
                    <span className="text-gold text-5xl leading-none">.</span>
                  </span>
                </div>
              </motion.div>

              {/* Name below logo */}
              <div className="text-center mt-2 mb-2">
                <h2 className="font-heading font-black tracking-tight font-bold leading-none tracking-tight text-amber-50 text-4xl sm:text-[2.75rem] drop-shadow-md">
                  Booktopia
                </h2>
                {/* UPGRADED "MEDIA" TEXT */}
                <p className="font-sans uppercase mt-4 text-[14px] tracking-[0.55em] text-gold font-black drop-shadow-sm">
                  Media
                </p>
              </div>
            </div>

            {/* ── Stats bar ── */}
            <div className="relative z-10 mt-auto w-full flex bg-background/90 backdrop-blur-md border-t border-border/50">
              {[
                { value: "20+", label: "Sara kitob" },
                { value: "2", label: "Yillik tajriba" },
                { value: "3", label: "Til" },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-1.5 py-5" style={{ borderRight: i < 2 ? "1px solid hsl(var(--border) / 0.5)" : undefined }}>
                  <span className="font-heading font-bold text-2xl text-gold">{value}</span>
                  <span className="font-sans uppercase text-[8px] tracking-[0.3em] text-gold/70 font-black">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Right column ─────────────────────────────────────────── */}
        <div className="flex flex-col justify-center flex-1 gap-6 sm:gap-8 pt-4 lg:pt-8">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-3">
              <div className="h-px w-8 bg-gold/50" />
              <span className="font-sans text-[11px] uppercase tracking-[0.4em] text-gold font-black">Bizning hikoya</span>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <h1 className="font-heading font-black tracking-tight font-extrabold text-foreground leading-[1.1] text-4xl sm:text-5xl lg:text-6xl drop-shadow-sm">
              Kitob sahifalaridan{" "}
              <em className="not-italic bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent">ko'ngilga</em>{" "}
              ko'chgan so'zlar.
            </h1>
          </Reveal>

          <Reveal delay={0.22}>
            <p className="font-serif text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-xl">
              Booktopia — dunyo adabiyotining eng sara asarlarini o'zbek tiliga
              professional tarjima qiladigan va yuqori sifatli kitoblar nashr etadigan
              zamonaviy nashriyot.
            </p>
          </Reveal>

          {/* "Nega Booktopia?" Glass Box */}
          <Reveal delay={0.3}>
            <div className="relative rounded-2xl overflow-hidden bg-background/40 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg mt-4">
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 via-amber-600 to-amber-400" />

              <div className="pl-7 pr-6 py-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-gold font-black mb-2">
                  Nega aynan "Booktopia"?
                </p>
                <p className="font-serif text-xl font-bold text-foreground leading-snug mb-3">
                  Arabcha — <span className="text-gold">asl, bebaho.</span>
                </p>
                <p className="font-sans text-sm text-foreground/70 leading-relaxed">
                  Nashriyot o'z oldiga kitobxonlar uchun asl va bebaho sanalib kelingan
                  kitoblarni nashr etishni maqsad qilib qo'ygan. Maqsadimiz —
                  kitob bozorida haqiqiy sifat inqilobini amalga oshirish.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    {/* Divider */}
    <div className="relative z-10 max-w-5xl mx-auto px-8"><Divider /></div>

    {/* ╔══════════════════════════════════════════════════════════════╗
        ║  §2 — PROCESS: 4-step timeline                               ║
        ╚══════════════════════════════════════════════════════════════╝ */}
    <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
      <Reveal><SectionLabel label="Jarayon" title="Kitob qanday yaratiladi?" /></Reveal>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Horizontal connector line — desktop */}
        <div aria-hidden className="hidden lg:block absolute top-[36px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

        {STEPS.map((step, i) => (
          <Reveal key={step.num} delay={i * 0.1}>
            <div className="relative flex flex-col gap-5 p-6 rounded-2xl h-full group cursor-default transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-amber-500/50 bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-neutral-200/80 dark:border-white/10 shadow-lg overflow-hidden">

              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Icon + Number */}
              <div className="flex items-center justify-between">
                <div className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-900/10 border border-amber-300 dark:border-amber-700/50 text-primary/90 dark:text-accent shadow-inner">
                  {step.icon}
                </div>
                <span className="font-serif font-black leading-none select-none text-5xl text-neutral-200 dark:text-white/5 group-hover:text-accent/10 transition-colors duration-300">
                  {step.num}
                </span>
              </div>

              <div className="relative z-10 mt-2">
                <h3 className="font-heading font-black tracking-tight text-xl font-bold text-foreground leading-tight mb-1">{step.uz}</h3>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary dark:text-accent font-bold mb-3">{step.en}</p>
                <p className="font-sans text-sm text-foreground/70 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Divider */}
    <div className="relative z-10 max-w-5xl mx-auto px-8"><Divider /></div>

    {/* ╔══════════════════════════════════════════════════════════════╗
        ║  §3 — CLOSING MANIFESTO                                      ║
        ╚══════════════════════════════════════════════════════════════╝ */}
    <section className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
      <Reveal>
        <div
          className="relative rounded-[2.5rem] px-8 sm:px-14 md:px-20 py-16 sm:py-20 text-center overflow-hidden border border-amber-500/20"
          style={{
            background: "linear-gradient(160deg, #38250f 0%, #1a1205 100%)",
            boxShadow: "0 32px 80px -16px rgba(245,158,11,0.25)",
          }}
        >
          {/* Background rings */}
          <svg viewBox="0 0 560 240" fill="none" aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <circle cx="280" cy="120" r="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 8" />
            <circle cx="280" cy="120" r="148" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2 12" />
            <path d="M80 240 Q280 20 480 240" stroke="#f59e0b" strokeWidth="1" fill="none" />
          </svg>

          {/* Big decorative quote */}
          <span aria-hidden className="absolute top-0 left-6 font-serif leading-none select-none pointer-events-none text-9xl text-accent/10">
            "
          </span>

          <div className="relative z-10">
            <blockquote className="font-serif font-extrabold leading-snug mb-8 text-amber-50 drop-shadow-md" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}>
              Har bir kitob — yangi dunyoning eshigi.
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Biz o'sha eshiklarni yaratamiz.</span>
            </blockquote>

            <div className="flex items-center justify-center gap-5">
              <div className="h-px w-12 bg-primary/90/60" />
              <span className="font-sans uppercase text-[11px] tracking-[0.5em] text-accent font-bold">
                Booktopia
              </span>
              <div className="h-px w-12 bg-primary/90/60" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>

    <Footer />
  </motion.div>
);

export default About;