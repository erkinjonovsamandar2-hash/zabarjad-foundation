import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center section-padding pt-24">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <p className="mb-4 text-sm font-sans font-medium uppercase tracking-[0.3em] text-primary">
          Premium nashriyot
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold leading-tight text-foreground mb-6">
          Eng Yaxshisini <span className="text-gold-gradient">Ilinamiz.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Dunyo adabiyotining eng sara namunalarini o'zbek tilida taqdim etamiz.
        </p>
        <a
          href="#library"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Kutubxonani ko'rish <ChevronRight className="h-4 w-4" />
        </a>
      </div>

      {/* 3D Carousel placeholder */}
      <div className="relative z-10 mt-16 w-full max-w-5xl">
        <div className="glass-card flex items-center justify-center h-48 md:h-64 rounded-xl">
          <p className="text-muted-foreground text-sm font-sans">
            [ 3D Kitob Karuseli – placeholder ]
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
