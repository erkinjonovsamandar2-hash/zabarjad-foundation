import { Map } from "lucide-react";

const EpicSpotlight = () => {
  return (
    <section id="spotlight" className="relative section-padding bg-charcoal">
      {/* Cinematic glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/3 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">
          Taxtlar O'yini
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
          Muz va Olov Qo'shig'i
        </h2>
        <p className="max-w-xl text-muted-foreground mb-10">
          Jорж Р.Р. Мартиннинг эпик фэнтези олами — энди ўзбек тилида.
          Вестерос харитасини кашф этинг.
        </p>

        {/* Interactive map placeholder */}
        <div className="glass-card flex flex-col items-center justify-center h-64 md:h-96 rounded-xl gap-4">
          <Map className="h-12 w-12 text-primary/60" />
          <p className="text-muted-foreground text-sm font-sans">
            [ Interaktiv Xarita – placeholder ]
          </p>
        </div>
      </div>
    </section>
  );
};

export default EpicSpotlight;
