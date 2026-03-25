"use client";

import { motion } from "framer-motion";

const AUTHORS = [
    { name: "Abdulla Qodiriy", role: "MUALLIF", image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Nurbek Alimov", role: "TARJIMON", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Mixail Bulgakov", role: "MUALLIF", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Sirojuddin To'laganov", role: "TARJIMON", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Fyodor Dostoyevskiy", role: "MUALLIF", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Genki Kavamura", role: "MUALLIF", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Aleksandr Dyuma", role: "MUALLIF", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
];

export default function AuthorSpotlight() {
    return (
        <section className="relative w-full py-24 md:py-32 overflow-hidden border-y border-border/50 bg-background">

            {/* Background: Sora-style painted background with very low opacity (10-15%) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-15">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] -z-10 rounded-full pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, hsl(var(--primary) / 0.4) 0%, transparent 60%)" }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] -z-10 rounded-full pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, hsl(var(--accent) / 0.3) 0%, transparent 60%)" }} />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
                <h2 className="font-heading font-bold text-4xl md:text-5xl leading-[1.05] tracking-wide text-foreground mb-16 text-center drop-shadow-sm">
                    Muallif va Tarjimonlarimiz
                </h2>

                {/* Marquee Row */}
                <div className="w-full relative flex overflow-x-hidden group">
                    {/* Fades for smooth entry/exit */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                    <motion.div
                        className="flex items-center gap-12 sm:gap-16 lg:gap-24 whitespace-nowrap pl-12 sm:pl-16 lg:pl-24 will-change-transform"
                        animate={{ x: ["0%", "-33.333333%"] }}
                        transition={{
                            duration: 35,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {[...AUTHORS, ...AUTHORS, ...AUTHORS, ...AUTHORS].map((author, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-5 transition-transform duration-500 ease-out cursor-pointer group/card"
                            >
                                <img
                                    src={author.image}
                                    alt={author.name}
                                    loading="lazy"
                                    className="w-[104px] h-[104px] md:w-[150px] md:h-[150px] rounded-full object-cover border border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                                />
                                <div className="flex flex-col items-start gap-1">
                                    <span className="font-heading text-2xl text-foreground group-hover/card:text-gold transition-colors duration-500">{author.name}</span>
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
    );
}