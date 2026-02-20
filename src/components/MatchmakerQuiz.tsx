import { useState } from "react";
import { Compass, Wand2, Flame, Mail, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { useLang } from "@/context/LanguageContext";

const stepIcons = [Compass, Wand2, Flame];

const MatchmakerQuiz = () => {
  const { quizConfig, books } = useData();
  const { t } = useLang();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (currentStep < quizConfig.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const getRecommendation = () => {
    const key = answers.join("-");
    const path = quizConfig.paths.find((p) => p.key === key);
    const bookId = path?.bookId || quizConfig.defaultBookId;
    const reason = path?.reason || quizConfig.defaultReason;
    const book = books.find((b) => b.id === bookId) || books[0];
    return { title: book?.title || "", author: book?.author || "", reason };
  };

  const handleReset = () => { setCurrentStep(0); setAnswers([]); setShowResult(false); setSubmitted(false); setEmail(""); };
  const handleSubmitEmail = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const rec = getRecommendation();
  const step = quizConfig.steps[currentStep];

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">{t.quiz.badge}</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">{t.quiz.title}</h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto">{t.quiz.desc}</p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {quizConfig.steps.map((_, i) => {
            const Icon = stepIcons[i] || Compass;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${i < answers.length ? "bg-primary text-primary-foreground" : i === currentStep && !showResult ? "bg-primary/20 text-primary ring-2 ring-primary/40" : "bg-secondary text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                {i < quizConfig.steps.length - 1 && <div className={`h-px w-8 transition-colors duration-300 ${i < answers.length ? "bg-primary" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-6">{step?.question}</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {step?.options.map((opt) => (
                  <button key={opt.value} onClick={() => handleAnswer(opt.value)} className="glass-card flex flex-col items-center gap-3 p-6 rounded-xl transition-all hover:border-primary/40 hover:bg-primary/5 group cursor-pointer">
                    <span className="text-sm font-sans font-semibold text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="glass-card rounded-xl p-8 md:p-10">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{t.quiz.result}</h3>
              <p className="text-3xl font-serif font-bold text-primary mb-1">{rec.title}</p>
              <p className="text-muted-foreground mb-2">{rec.author}</p>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">{rec.reason}</p>

              {!submitted ? (
                <form onSubmit={handleSubmitEmail} className="max-w-sm mx-auto">
                  <p className="text-xs font-sans font-semibold uppercase tracking-wider text-primary mb-3">{t.quiz.giftBadge}</p>
                  <p className="text-sm text-muted-foreground mb-4">{t.quiz.giftDesc}</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full rounded-lg border border-border bg-secondary pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    </div>
                    <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">{t.quiz.send}</button>
                  </div>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <p className="text-primary font-semibold mb-1">{t.quiz.thanks}</p>
                  <p className="text-sm text-muted-foreground">{t.quiz.giftSent}</p>
                </motion.div>
              )}

              <button onClick={handleReset} className="mt-6 text-xs text-muted-foreground hover:text-primary transition-colors underline">{t.quiz.restart}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MatchmakerQuiz;
