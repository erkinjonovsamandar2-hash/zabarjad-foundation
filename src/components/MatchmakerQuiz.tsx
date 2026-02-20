import { Compass, Wand2, Flame } from "lucide-react";

const steps = [
  { icon: Compass, label: "Sayohat turi", description: "Qaysi janr sizga yoqadi?" },
  { icon: Wand2, label: "Sehr darajasi", description: "Fantastik yoki real?" },
  { icon: Flame, label: "Kayfiyat", description: "Qorong'u yoki yorqin?" },
];

const MatchmakerQuiz = () => {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">
          Kitob Tanlash
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
          Bugun qaysi olamga sayohat qilamiz?
        </h2>
        <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
          3 ta oddiy savolga javob bering va sizga mos kitobni topamiz.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <button
              key={i}
              className="glass-card flex flex-col items-center gap-3 p-6 rounded-xl transition-all hover:border-primary/30 group cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <step.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-primary">
                {i + 1}-qadam
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground">{step.label}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MatchmakerQuiz;
