import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const QUOTES = [
  "Har bir kitob — yangi dunyoga ochilgan eshikdir.",
  "Mutolaa — qalbning nurli ozuqasi.",
  "Booktopia: Qalbingizga yaqin sahifalar...",
  "Yaxshi kitob — eng sodiq do'st.",
  "Bilim — najot yo'lidir.",
  "Kitoblar — vaqt dengizida sayohat qiluvchi kemalardir."
];

const LoadingSplash = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Select a random quote on mount to keep the experience fresh for returning users
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden"
    >
      {/* ── Background Abstract Rings ── */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="w-[800px] h-[800px] rounded-full border border-accent/30 border-dashed"
        />
      </div>

      {/* ── Centerpiece: Animated Logo ── */}
      <div className="relative mb-12 flex flex-col items-center">
        {/* Soft pulsing aura behind logo text */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[-40px] bg-accent blur-[50px] rounded-full"
        />

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex flex-col items-center"
        >
          {/* Brand Name */}
          <h1 className="mt-6 font-sans text-5xl sm:text-6xl font-black tracking-tight text-foreground relative z-30">
            Booktopia <span className="text-primary">.</span>
          </h1>
        </motion.div>
      </div>

      {/* ── Literary Quote & Progress Bar ── */}
      <div className="text-center px-8 max-w-lg relative z-10">
        <motion.p
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="font-serif italic text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed"
        >
          "{quote}"
        </motion.p>

        {/* Sleek Progress Line */}
        <div className="mt-8 relative w-48 sm:w-64 h-[2px] bg-neutral-200 dark:bg-neutral-800 mx-auto rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.5, ease: "circOut" }}
          />
        </div>
      </div>

      {/* ── Est. Year ── */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="font-sans text-[10px] uppercase tracking-[0.5em] text-foreground/40 font-bold"
        >
          Nashriyot · Est. 2018
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingSplash;