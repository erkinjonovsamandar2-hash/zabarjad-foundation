"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";

import akbarImg from "../assets/team/akbar.png";

// ─── Data ──────────────────────────────────────────────────────────────────────
const TEAM_MEMBERS = [
    { id: 1, name: "Akbar Toshtemirov", role: "Muharrir", image: akbarImg },
    { id: 2, name: "Jamoa A'zosi", role: "Musahhih", image: "https://pngimg.com/d/businessman_PNG6565.png" },
    { id: 3, name: "Jamoa A'zosi", role: "Badiiy muharrir", image: "https://pngimg.com/d/businessman_PNG6571.png" },
    { id: 4, name: "Jamoa A'zosi", role: "Muqova Dizayneri", image: "https://pngimg.com/d/businessman_PNG6576.png" },
    { id: 5, name: "Jamoa A'zosi", role: "Sahifalovchi", image: "https://pngimg.com/d/businessman_PNG6565.png" },
    { id: 6, name: "Jamoa A'zosi", role: "Tarjimon", image: "https://pngimg.com/d/businessman_PNG6571.png" },
];

const N = TEAM_MEMBERS.length;
const VISIBLE = 3;
const RENDERED = VISIBLE + 2;   // 1 staged left + 3 visible + 1 staged right

const PCT_NEUTRAL = -(100 / RENDERED);   // -20%
const PCT_FORWARD = -(200 / RENDERED);   // -40%

const SLIDE_MS = 600;
const SLIDE_EASE = "cubic-bezier(0.77, 0, 0.175, 1)";
const AUTO_MS = 4500;

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Team() {
    /* Desktop carousel state */
    const [leftIdx, setLeftIdx] = useState(0);
    const [live, setLive] = useState(false);
    const [pct, setPct] = useState(PCT_NEUTRAL);
    const busy = useRef<boolean>(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /* Mobile slideshow state */
    const [mobileIdx, setMobileIdx] = useState(0);
    const [mobileFade, setMobileFade] = useState(true);   // true = visible
    const mobileTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    const queue = useMemo(() => {
        const stagedLeft = (leftIdx - 1 + N) % N;
        return Array.from({ length: RENDERED }, (_, i) => TEAM_MEMBERS[(stagedLeft + i) % N]);
    }, [leftIdx]);

    // ── Desktop slide ──────────────────────────────────────────────────────────
    const slide = useCallback((dir: number) => {
        if (busy.current) return;
        busy.current = true;
        setLive(true);
        setPct(dir > 0 ? PCT_FORWARD : 0);
        setTimeout(() => {
            setLive(false);
            setLeftIdx((prev) => (prev + dir + N) % N);
            setPct(PCT_NEUTRAL);
            requestAnimationFrame(() => requestAnimationFrame(() => { busy.current = false; }));
        }, SLIDE_MS + 16);
    }, []);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => slide(1), AUTO_MS);
    }, [slide]);

    useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [startTimer]);

    const handleArrow = (dir: number) => {
        if (timerRef.current) clearInterval(timerRef.current);
        slide(dir);
        timerRef.current = setInterval(() => slide(1), AUTO_MS);
    };

    // ── Mobile auto-slideshow (cross-fade) ────────────────────────────────────
    useEffect(() => {
        mobileTimer.current = setInterval(() => {
            setMobileFade(false);                       // fade out
            setTimeout(() => {
                setMobileIdx((i) => (i + 1) % N);
                setMobileFade(true);                    // fade in
            }, 350);
        }, AUTO_MS);
        return () => { if (mobileTimer.current) clearInterval(mobileTimer.current); };
    }, []);

    const trackStyle: CSSProperties = {
        width: `${(RENDERED / VISIBLE) * 100}%`,
        transform: `translateZ(0) translateX(${pct}%)`,
        transition: live ? `transform ${SLIDE_MS}ms ${SLIDE_EASE}` : "none",
        willChange: "transform",
        backfaceVisibility: "hidden",
    };

    return (
        <section
            id="team"
            className="relative w-full overflow-hidden py-24 md:py-32 bg-background border-t border-border/50"
        >
            <div className="relative z-10 container mx-auto px-6 lg:px-16">

                {/* ── Headline ── */}
                <motion.div
                    className="mb-12 md:mb-20 text-center"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                        Booktopia
                    </p>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] tracking-wide text-foreground mb-3">
                        Bizning Jamoa
                    </h2>
                    <p className="font-serif text-lg md:text-xl italic text-foreground/80 leading-loose">
                        sohaning eng ilg&apos;or mutaxassislari bilan
                    </p>
                    <div className="mx-auto mt-8 w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                </motion.div>

                {/* ── Mobile: single-card auto-slideshow (< md) ── */}
                <div className="md:hidden flex flex-col items-center gap-6">
                    <div
                        className="w-full max-w-[320px] h-[380px] transition-opacity duration-300"
                        style={{ opacity: mobileFade ? 1 : 0 }}
                    >
                        <Card member={TEAM_MEMBERS[mobileIdx]} />
                    </div>

                    {/* Dot indicators and Controls */}
                    <div className="flex justify-center items-center gap-6 w-full px-4 mt-6">
                        <button
                            aria-label="Previous Team Member"
                            onClick={() => {
                                if (mobileTimer.current) clearInterval(mobileTimer.current);
                                setMobileFade(false);
                                setTimeout(() => { setMobileIdx((prev) => (prev - 1 + N) % N); setMobileFade(true); }, 350);
                            }}
                            className="p-2 text-primary hover:text-primary/70 hover:scale-110 transition-transform"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>

                        <div className="flex justify-center items-center gap-3">
                            {TEAM_MEMBERS.map((_, i) => (
                                <button
                                    key={i}
                                    aria-label={`Slide ${i + 1}`}
                                    onClick={() => {
                                        if (mobileTimer.current) clearInterval(mobileTimer.current);
                                        setMobileFade(false);
                                        setTimeout(() => { setMobileIdx(i); setMobileFade(true); }, 350);
                                        mobileTimer.current = setInterval(() => {
                                            setMobileFade(false);
                                            setTimeout(() => {
                                                setMobileIdx((idx) => (idx + 1) % N);
                                                setMobileFade(true);
                                            }, 350);
                                        }, AUTO_MS);
                                    }}
                                    className="rounded-full transition-all duration-400"
                                    style={{
                                        width: i === mobileIdx ? "26px" : "8px",
                                        height: "8px",
                                        background: i === mobileIdx
                                            ? "var(--primary)"
                                            : "rgba(var(--foreground), 0.15)",
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            aria-label="Next Team Member"
                            onClick={() => {
                                if (mobileTimer.current) clearInterval(mobileTimer.current);
                                setMobileFade(false);
                                setTimeout(() => { setMobileIdx((prev) => (prev + 1) % N); setMobileFade(true); }, 350);
                            }}
                            className="p-2 text-primary hover:text-primary/70 hover:scale-110 transition-transform"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </div>
                </div>

                {/* ── Desktop: 3-card carousel (md+) ── */}
                <div className="relative hidden md:block">

                    {/* Left arrow */}
                    <button
                        onClick={() => handleArrow(-1)}
                        aria-label="Previous"
                        className="group absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 z-20 w-11 h-11 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-500 ease-out bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_30px_-5px_rgba(0,205,254,0.5)]"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-foreground/50 group-hover:text-primary transition-colors duration-500 ease-out">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    {/* Right arrow */}
                    <button
                        onClick={() => handleArrow(1)}
                        aria-label="Next"
                        className="group absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 z-20 w-11 h-11 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-500 ease-out bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_30px_-5px_rgba(0,205,254,0.5)]"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-foreground/50 group-hover:text-primary transition-colors duration-500 ease-out">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    {/* Sliding track */}
                    <div className="overflow-hidden p-6 -m-6">
                        <div
                            className="flex"
                            style={{ ...trackStyle, height: "clamp(280px, 45vw, 420px)" }}
                        >
                            {queue.map((member, i) => (
                                <div
                                    key={`${member.id}-${i}`}
                                    className="flex-shrink-0"
                                    style={{ width: `${100 / RENDERED}%`, padding: "0 12px" }}
                                >
                                    <Card member={member} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center items-center gap-2.5 mt-10">
                        {TEAM_MEMBERS.map((_, i) => {
                            const active = i === leftIdx;
                            return (
                                <div
                                    key={i}
                                    className="rounded-full transition-all duration-500"
                                    style={{
                                        width: active ? "32px" : "8px",
                                        height: "8px",
                                        background: active
                                            ? "var(--primary)"
                                            : "rgba(var(--foreground), 0.15)",
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}

// ─── Card ──────────────────────────────────────────────────────────────────────
function Card({ member }: { member: any }) {
    return (
        <div
            className="group relative w-full h-full rounded-3xl overflow-hidden bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        >
            <div className="absolute inset-0 z-10 flex items-end justify-center pt-8">
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-contain object-bottom transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 pt-20 pb-6 px-6 bg-gradient-to-t from-background via-background/80 to-transparent flex flex-col justify-end">
                <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground leading-[1.05] tracking-wide mb-1">
                    {member.name}
                </h3>
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                    {member.role}
                </p>
            </div>
        </div>
    );
}
