"use client";

import { motion } from "framer-motion";

const AUTHORS = [
    "Abdulla Qodiriy",
    "Mixail Bulgakov",
    "Jek London",
    "Entoni Byorjess",
    "Fyodor Dostoyevskiy",
    "Genki Kavamura",
    "Aleksandr Dyuma"
];

export default function AuthorSpotlight() {
    return (
        <section className="relative w-full py-24 md:py-32 overflow-hidden border-y border-border/50">


            <div className="relative z-10 w-full flex flex-col items-center">
                <h2 className="font-heading font-bold text-4xl md:text-5xl leading-[1.05] tracking-wide text-foreground mb-16 text-center drop-shadow-sm">
                    Muallif va Tarjimonlarimiz
                </h2>

                {/* Marquee Row */}
                <div className="w-full relative flex overflow-x-hidden group">
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
                                className="flex items-center gap-4 text-2xl md:text-3xl font-heading font-bold tracking-wide leading-tight text-foreground/90 hover:text-primary transition-colors duration-500 ease-out cursor-pointer"
                            >
                                <span>{author}</span>
                                <span className="w-2 h-2 rounded-full bg-primary/40 block ml-8 md:ml-16" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
