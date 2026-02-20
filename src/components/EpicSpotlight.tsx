import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const hotspots = [
  {
    id: "winterfell",
    label: "Winterfell",
    x: 35,
    y: 25,
    lore: "Shimolning eng qadimiy qal'asi. Stark oilasining uy-joyi. Minglab yillardan beri muzlik devorning janubida turgan bu qal'a haqiqiy kuch va sadoqat ramzidir.",
  },
  {
    id: "kings-landing",
    label: "King's Landing",
    x: 55,
    y: 65,
    lore: "Yetti Qirollikning poytaxti. Temir Taxt shu yerda joylashgan. Siyosiy fitna va hokimiyat uchun kurash markazida turgan shahar.",
  },
  {
    id: "wall",
    label: "The Wall",
    x: 40,
    y: 8,
    lore: "700 fut balandlikdagi muzdan qurilgan devor. Tungi Qo'riqchilar uni 8000 yildan beri qo'riqlaydi. Devor ortida esa noma'lum xavflar yashiringan.",
  },
];

const EpicSpotlight = () => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section id="spotlight" className="relative section-padding bg-charcoal overflow-hidden">
      {/* Cinematic glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">
            Taxtlar O'yini
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Muz va Olov Qo'shig'i
          </h2>
          <p className="max-w-xl text-muted-foreground mb-10">
            Jorj R.R. Martinning epik fantezi olami — endi o'zbek tilida.
            Vesteros xaritasini kashf eting.
          </p>
        </motion.div>

        {/* Interactive Map */}
        <motion.div
          className="glass-card relative rounded-xl overflow-hidden"
          style={{ height: "clamp(300px, 50vw, 500px)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Map background */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 30%, hsl(120 20% 8%) 0%, transparent 50%),
                radial-gradient(ellipse at 60% 70%, hsl(30 20% 8%) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, hsl(210 15% 6%) 0%, hsl(var(--charcoal)) 100%)
              `,
            }}
          >
            {/* Stylized coastline SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M20 0 Q25 20 22 40 Q18 55 25 70 Q30 80 28 100" stroke="hsl(var(--primary))" strokeWidth="0.3" fill="none" />
              <path d="M45 0 Q50 15 48 30 Q42 50 50 65 Q55 80 52 100" stroke="hsl(var(--primary))" strokeWidth="0.2" fill="none" opacity="0.6" />
              <path d="M70 10 Q65 30 68 50 Q72 70 65 90" stroke="hsl(var(--primary))" strokeWidth="0.2" fill="none" opacity="0.4" />
              {/* Landmass shapes */}
              <path d="M15 5 Q30 8 45 5 Q55 8 60 20 Q55 35 45 40 Q35 38 25 42 Q18 35 15 20 Z" fill="hsl(var(--primary))" opacity="0.06" />
              <path d="M30 55 Q50 50 65 55 Q70 65 65 78 Q50 82 35 78 Q28 70 30 55 Z" fill="hsl(var(--primary))" opacity="0.04" />
            </svg>

            {/* Grid lines */}
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          {/* Hotspots */}
          {hotspots.map((spot) => (
            <div
              key={spot.id}
              className="absolute group"
              style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <button
                className="relative z-10"
                onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                onMouseEnter={() => setActiveHotspot(spot.id)}
              >
                {/* Pulse rings */}
                <span className="absolute inset-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 animate-ping" />
                <span className="absolute inset-0 h-8 w-8 -translate-x-[calc(50%+4px)] -translate-y-[calc(50%+4px)] rounded-full bg-primary/10 animate-pulse" />
                {/* Dot */}
                <span className="relative block h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgba(247,181,0,0.6)]" />
              </button>

              {/* Label */}
              <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-sans font-semibold text-primary opacity-80">
                {spot.label}
              </span>

              {/* Tooltip */}
              <AnimatePresence>
                {activeHotspot === spot.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute left-1/2 -translate-x-1/2 top-8 z-20 w-64 glass-card rounded-lg p-4"
                    onMouseLeave={() => setActiveHotspot(null)}
                  >
                    <h4 className="font-serif font-bold text-foreground text-sm mb-2">{spot.label}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{spot.lore}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Map title overlay */}
          <div className="absolute bottom-4 right-4 text-xs font-sans text-muted-foreground/50 uppercase tracking-widest">
            Vesteros Xaritasi
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EpicSpotlight;
