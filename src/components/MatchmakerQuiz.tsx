import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useLang } from "@/context/LanguageContext";

// ── Asset imports ─────────────────────────────────────────────────────────────
import teaImg     from "@/assets/quiz/tea.webp";
import bookImg    from "@/assets/quiz/book.webp";
import compassImg from "@/assets/quiz/compass.webp";
import keyImg     from "@/assets/quiz/key.png";

// ── Types ─────────────────────────────────────────────────────────────────────
interface QuizOption {
  label: string;
  sublabel: string;   // "Wise Aunt" flavour line
  value: string;      // genre tag used in recommendation logic
  img: string;
}

interface QuizStep {
  question: string;
  aunt: string;       // conversational aside from the "Wise Aunt"
  options: QuizOption[];
}

// ── Hardcoded questions — fully standalone, no DB ─────────────────────────────
const WISE_AUNT_QUESTIONS: QuizStep[] = [
  {
    question: "Kechqurun vaqtingiz bo'lsa nima qilasiz?",
    aunt:     "Shoshilmang, men sizni tanishim kerak! ☕",
    options: [
      {
        label:    "Choy ichib, o'yga tolaman",
        sublabel: "Tinchlik — mening kuchim",
        value:    "classic",
        img:      teaImg,
      },
      {
        label:    "Yangi narsalar o'rganaman",
        sublabel: "Bilim — mening yo'lim",
        value:    "nonfiction",
        img:      bookImg,
      },
      {
        label:    "Sarguzasht qidiraman",
        sublabel: "Hayajon — mening nafasim",
        value:    "adventure",
        img:      compassImg,
      },
    ],
  },
  {
    question: "Do'stlaringiz siz haqingizda nima deydi?",
    aunt:     "Rost ayting — men sir saqlashni bilaman! 🤫",
    options: [
      {
        label:    "Sokin va dono",
        sublabel: "Chuqur suv — sokin oqar",
        value:    "philosophical",
        img:      teaImg,
      },
      {
        label:    "Sirli inson",
        sublabel: "Hamma narsada jumboq ko'raman",
        value:    "mystery",
        img:      keyImg,
      },
      {
        label:    "Ilhomlantiruvchi",
        sublabel: "Atrofimdagilarga kuch beraman",
        value:    "motivational",
        img:      bookImg,
      },
    ],
  },
  {
    question: "Qaysi his sizga yaqin?",
    aunt:     "Ko'nglingizga quloq soling — u aldamaydi 🌿",
    options: [
      {
        label:    "Nostalgia — o'tgan kunlar sog'inchi",
        sublabel: "Eski xotiralar issiq bo'ladi",
        value:    "classic",
        img:      teaImg,
      },
      {
        label:    "Qiziquvchanlik — yangilikka chanqoq",
        sublabel: "Har bir savol yangi eshik ochadi",
        value:    "nonfiction",
        img:      compassImg,
      },
      {
        label:    "Dadillik — qo'rqmasdan oldinga",
        sublabel: "Yo'l yo'lda bilinadi",
        value:    "adventure",
        img:      keyImg,
      },
    ],
  },
];

// ── Recommendation engine — purely local ──────────────────────────────────────
// Counts which genre tag appeared most in the answers, picks the matching book.
// Falls back to books[0] if nothing matches.
const GENRE_KEYWORDS: Record<string, string[]> = {
  classic:       ["classic", "philosophical", "motivational"],
  nonfiction:    ["nonfiction"],
  adventure:     ["adventure", "mystery"],
  mystery:       ["mystery"],
  philosophical: ["philosophical", "classic"],
  motivational:  ["motivational", "nonfiction"],
};

const RESULT_REASONS: Record<string, string> = {
  classic:
    "Siz chuqur his-tuyg'uli, o'ychan odamsiz. Klassik adabiyot sizning ichki dunyongizga mos keladi.",
  nonfiction:
    "Siz doimo o'sishga intilasiz. Bilim va haqiqat sizning eng yaqin do'stingiz.",
  adventure:
    "Siz hayotni to'liq his qilishni xohlaysiz. Sarguzasht kitoblari sizning ruhingizdosh.",
  mystery:
    "Siz sir va jumboqlarni yaxshi ko'rasiz. Detektiv janr sizga moslashtirilgandek yozilgan.",
  philosophical:
    "Siz hayotning ma'nosini qidirasiz. Falsafiy asarlar sizga javob beradi.",
  motivational:
    "Siz odamlarga ilhom berishni sevadigan kuchli insonSiz. Motivatsion kitoblar sizniki.",
};

function getTopGenre(answers: string[]): string {
  const score: Record<string, number> = {};
  for (const ans of answers) {
    const related = GENRE_KEYWORDS[ans] ?? [ans];
    for (const g of related) {
      score[g] = (score[g] ?? 0) + 1;
    }
  }
  return (
    Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "classic"
  );
}

// ── Progress pip ──────────────────────────────────────────────────────────────
const Pip = ({ state }: { state: "done" | "active" | "idle" }) => (
  <div
    className={`h-2 rounded-full transition-all duration-500 ${
      state === "done"
        ? "w-8 bg-primary"
        : state === "active"
        ? "w-5 bg-primary/60"
        : "w-2 bg-border"
    }`}
  />
);

// ── Answer card ───────────────────────────────────────────────────────────────
const AnswerCard = ({
  opt,
  onSelect,
}: {
  opt: QuizOption;
  onSelect: () => void;
}) => (
  <motion.button
    onClick={onSelect}
    whileHover={{
      y: -8,
      boxShadow:
        "0 20px 40px -10px rgba(247,181,0,0.25), 0 4px 16px rgba(0,0,0,0.12)",
      transition: { duration: 0.22 },
    }}
    whileTap={{ scale: 0.97 }}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="
      group flex flex-col items-center text-center
      rounded-xl p-5 cursor-pointer
      bg-white dark:bg-neutral-900
      border border-amber-100 dark:border-amber-900/30
      shadow-md hover:border-primary/40
      transition-colors duration-200
      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
    "
  >
    {/* Image */}
    <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-amber-50 dark:bg-neutral-800 flex items-center justify-center shrink-0">
      <img
        src={opt.img}
        alt={opt.label}
        className="w-20 h-20 object-contain"
        draggable={false}
      />
    </div>

    {/* Label */}
    <p className="
      font-serif text-sm font-semibold leading-snug mb-1
      text-neutral-800 dark:text-neutral-100
      group-hover:text-primary transition-colors
    ">
      {opt.label}
    </p>

    {/* Sublabel */}
    <p className="font-sans text-[11px] italic text-neutral-400 dark:text-neutral-500 leading-snug">
      {opt.sublabel}
    </p>
  </motion.button>
);

// ── Main component ────────────────────────────────────────────────────────────
const MatchmakerQuiz = () => {
  const { books }   = useData();
  const { t }       = useLang();
  const navigate    = useNavigate();

  const [step,       setStep]      = useState(0);
  const [answers,    setAnswers]   = useState<string[]>([]);
  const [showResult, setResult]    = useState(false);
  const [email,      setEmail]     = useState("");
  const [submitted,  setSubmitted] = useState(false);

  const totalSteps = WISE_AUNT_QUESTIONS.length;
  const current    = WISE_AUNT_QUESTIONS[step];

  const handleAnswer = (value: string) => {
    const next = [...answers, value];
    setAnswers(next);
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setResult(true);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setResult(false);
    setSubmitted(false);
    setEmail("");
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Recommendation
  const topGenre   = getTopGenre(answers);
  const recBook    =
    books.find(
      (b) =>
        b.category?.toLowerCase().includes(topGenre) ||
        b.title?.toLowerCase().includes(topGenre)
    ) ?? books[0];
  const recReason  = RESULT_REASONS[topGenre] ?? RESULT_REASONS.classic;

  return (
    <section className="section-padding bg-background">
      <div className="mx-auto max-w-3xl text-center">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">
            {t.quiz.badge}
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            {t.quiz.title}
          </h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
            {t.quiz.desc}
          </p>
        </motion.div>

        {/* ── Progress pips ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {WISE_AUNT_QUESTIONS.map((_, i) => (
            <Pip
              key={i}
              state={
                i < answers.length
                  ? "done"
                  : i === step && !showResult
                  ? "active"
                  : "idle"
              }
            />
          ))}
        </div>

        {/* ── Quiz / Result ───────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {!showResult ? (
            // ── Question step ──────────────────────────────────────────────
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              {/* Aunt aside */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="font-sans text-sm italic text-muted-foreground/70 mb-3"
              >
                {current.aunt}
              </motion.p>

              {/* Question */}
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-8">
                {current.question}
              </h3>

              {/* Answer cards */}
              <motion.div
                className="grid gap-4 sm:grid-cols-3"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
                initial="hidden"
                animate="visible"
              >
                {current.options.map((opt) => (
                  <AnswerCard
                    key={opt.value}
                    opt={opt}
                    onSelect={() => handleAnswer(opt.value)}
                  />
                ))}
              </motion.div>
            </motion.div>

          ) : (
            // ── Result ────────────────────────────────────────────────────
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="
                rounded-2xl p-8 md:p-10
                bg-white dark:bg-neutral-900
                border border-amber-100 dark:border-amber-900/30
                shadow-xl
              "
            >
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />

              <p className="text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary mb-2">
                {t.quiz.result}
              </p>

              {recBook ? (
                <>
                  <p className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-1">
                    {recBook.title}
                  </p>
                  <p className="text-muted-foreground mb-3">
                    {recBook.author}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground mb-3">—</p>
              )}

              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                {recReason}
              </p>

              {/* View book CTA */}
              {recBook && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/book/${recBook.id}`)}
                  className="
                    inline-flex items-center gap-2 rounded-xl
                    bg-primary px-6 py-2.5 text-sm font-semibold
                    text-primary-foreground hover:opacity-90
                    transition-opacity mb-6
                  "
                >
                  Kitobni ko'rish →
                </motion.button>
              )}

              {/* Email gift */}
              {!submitted ? (
                <form
                  onSubmit={handleSubmitEmail}
                  className="max-w-sm mx-auto mt-2"
                >
                  <p className="text-xs font-sans font-semibold uppercase tracking-wider text-primary mb-2">
                    {t.quiz.giftBadge}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t.quiz.giftDesc}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="
                        flex-1 rounded-lg border border-border
                        bg-secondary px-4 py-2.5 text-sm text-foreground
                        placeholder:text-muted-foreground
                        focus:outline-none focus:ring-2 focus:ring-primary/40
                      "
                    />
                    <button
                      type="submit"
                      className="
                        rounded-lg bg-primary px-5 py-2.5 text-sm
                        font-semibold text-primary-foreground
                        hover:opacity-90 transition-opacity
                      "
                    >
                      {t.quiz.send}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center"
                >
                  <p className="text-primary font-semibold mb-1">
                    {t.quiz.thanks}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.quiz.giftSent}
                  </p>
                </motion.div>
              )}

              {/* Reset */}
              <button
                onClick={handleReset}
                className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                {t.quiz.restart}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MatchmakerQuiz;