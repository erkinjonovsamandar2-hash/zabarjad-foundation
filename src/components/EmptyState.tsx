import { motion } from "framer-motion";
import { Feather } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title = "Sahifalar hozircha bo'sh...",
  description = "Bu bo'limga tez orada yangi va sara asarlar qo'shiladi. Biz nashrga tayyorgarlik ko'rmoqdamiz.",
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full py-16 px-6 flex flex-col items-center justify-center text-center rounded-[2rem] border border-amber-500/10 bg-white/40 dark:bg-[#0a0806]/40 backdrop-blur-md shadow-sm relative overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 bg-primary/5 dark:bg-primary/10 blur-[80px] rounded-full" />
      </div>

      {/* Floating Feather Icon */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-primary/5 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 shadow-inner"
      >
        <Feather className="w-8 h-8 text-primary dark:text-accent opacity-80" strokeWidth={1.5} />
      </motion.div>

      {/* Text Content */}
      <div className="relative z-10 max-w-md">
        <h3 className="font-heading font-black tracking-tight text-2xl font-bold text-foreground mb-3 drop-shadow-sm">
          {title}
        </h3>
        <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
          {description}
        </p>

        {/* Optional Button (e.g., "Barcha kitoblarga qaytish") */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold bg-primary/10 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors focus:outline-none"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;