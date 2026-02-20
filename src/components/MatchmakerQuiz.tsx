import { useState } from "react";
import { Compass, Wand2, Flame, BookOpen, Mail, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const quizSteps = [
  {
    icon: Compass,
    label: "Sayohat turi",
    question: "Qaysi janr sizga yoqadi?",
    options: [
      { label: "Fantastika", value: "fantasy" },
      { label: "Ilmiy-fantastika", value: "scifi" },
      { label: "Klassik adabiyot", value: "classic" },
    ],
  },
  {
    icon: Wand2,
    label: "Sehr darajasi",
    question: "Fantastik yoki real?",
    options: [
      { label: "To'liq sehrli olam", value: "high" },
      { label: "Bir oz sehr", value: "low" },
      { label: "Butunlay real", value: "none" },
    ],
  },
  {
    icon: Flame,
    label: "Kayfiyat",
    question: "Qorong'u yoki yorqin?",
    options: [
      { label: "Qorong'u va dramatik", value: "dark" },
      { label: "Sarguzashtli va quvnoq", value: "light" },
      { label: "Aralash", value: "mixed" },
    ],
  },
];

const recommendations: Record<string, { title: string; author: string; reason: string }> = {
  default: { title: "Muz va Olov Qo'shig'i", author: "Jorj R.R. Martin", reason: "Epik fantezi sevuvchilar uchun eng yaxshi tanlov!" },
  "fantasy-high-dark": { title: "Muz va Olov Qo'shig'i", author: "Jorj R.R. Martin", reason: "Qorong'u fantezi olamining shoh asari." },
  "fantasy-low-light": { title: "Hobbit", author: "J.R.R. Tolkien", reason: "Sarguzashtga to'la sehrli sayohat!" },
  "scifi-none-dark": { title: "1984", author: "Jorj Oruell", reason: "Kelajak haqidagi eng kuchli ogohlantirish." },
  "scifi-high-mixed": { title: "Duna", author: "Frank Herbert", reason: "Ilm-fan va siyosatning ajoyib uyg'unligi." },
  "classic-none-light": { title: "Narnia Kundaliklari", author: "K.S. Lyuis", reason: "Klassik sarguzasht va sehrli dunyo." },
};

const MatchmakerQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const getRecommendation = () => {
    const key = answers.join("-");
    return recommendations[key] || recommendations.default;
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResult(false);
    setSubmitted(false);
    setEmail("");
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const rec = getRecommendation();

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">
            Kitob Tanlash
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Bugun qaysi olamga sayohat qilamiz?
          </h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
            3 ta oddiy savolga javob bering va sizga mos kitobni topamiz.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {quizSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  i < answers.length
                    ? "bg-primary text-primary-foreground"
                    : i === currentStep && !showResult
                    ? "bg-primary/20 text-primary ring-2 ring-primary/40"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <step.icon className="h-4 w-4" />
              </div>
              {i < 2 && (
                <div
                  className={`h-px w-8 transition-colors duration-300 ${
                    i < answers.length ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
                {quizSteps[currentStep].question}
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {quizSteps[currentStep].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="glass-card flex flex-col items-center gap-3 p-6 rounded-xl transition-all hover:border-primary/40 hover:bg-primary/5 group cursor-pointer"
                  >
                    <span className="text-sm font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="glass-card rounded-xl p-8 md:p-10"
            >
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                Sizga tavsiyamiz:
              </h3>
              <p className="text-3xl font-serif font-bold text-primary mb-1">{rec.title}</p>
              <p className="text-muted-foreground mb-2">{rec.author}</p>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">{rec.reason}</p>

              {!submitted ? (
                <form onSubmit={handleSubmitEmail} className="max-w-sm mx-auto">
                  <p className="text-xs font-sans font-semibold uppercase tracking-wider text-primary mb-3">
                    Bepul sovg'a oling!
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Email manzilingizni qoldiring va bepul raqamli soundtrack + HD wallpaper oling.
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full rounded-lg border border-border bg-secondary pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Yuborish
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-primary font-semibold mb-1">Rahmat! 🎉</p>
                  <p className="text-sm text-muted-foreground">
                    Sovg'a emailingizga yuborildi.
                  </p>
                </motion.div>
              )}

              <button
                onClick={handleReset}
                className="mt-6 text-xs text-muted-foreground hover:text-primary transition-colors underline"
              >
                Qaytadan boshlash
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MatchmakerQuiz;
