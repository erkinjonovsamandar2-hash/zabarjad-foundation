// @refresh reset
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useLang, locField } from "@/context/LanguageContext";

// ── Asset imports ─────────────────────────────────────────────────────────────
import teaImg     from "@/assets/quiz/tea.webp";
import bookImg    from "@/assets/quiz/book.webp";
import compassImg from "@/assets/quiz/compass.webp";
import keyImg     from "@/assets/quiz/key.png";

// Updated background image path to hero-bg8.png
let bgImg: string | undefined;
try { bgImg = new URL("@/assets/hero/hero-bg8.png", import.meta.url).href; } catch { bgImg = undefined; }

// ── Types ─────────────────────────────────────────────────────────────────────
interface QuizOption {
  label: string;
  sublabel: string;   
  value: string;      
  img: string;
}

interface QuizStep {
  question: string;
  aunt: string;       
  options: QuizOption[];
}

// ── MATCHMAKER SCRIPT (Short, Punchy, Funny) ──────────────────────────────────
const WISE_AUNT_QUESTIONS: QuizStep[] = [
  {
    question: "Kechqurun vaqtingizni qanday o'tkazasiz?",
    aunt:     "Oldin o'zingizni bilaylik-chi... ☕",
    options: [
      { label: "Choy va sokinlik", sublabel: "Tinchlikni sevaman", value: "classic", img: teaImg },
      { label: "Yangi narsa o'rganaman", sublabel: "Aql va mantiq", value: "nonfiction", img: bookImg },
      { label: "Sarguzasht yoki film", sublabel: "Zerikishga toqatim yo'q", value: "adventure", img: compassImg },
    ],
  },
  {
    question: "Sizga qanday qahramonlar yoqadi?",
    aunt:     "Qanday xarakterlar sizni o'ziga tortadi? 🤫",
    options: [
      { label: "O'ychan va dono", sublabel: "Ichki dunyosi boy", value: "philosophical", img: teaImg },
      { label: "Sirli va kutilmagan", sublabel: "Hayratda qoldirsin", value: "mystery", img: keyImg },
      { label: "Kuchli va dadil", sublabel: "Ilhomlantiruvchi", value: "motivational", img: bookImg },
    ],
  },
  {
    question: "Kitobdan nima kutyapsiz?",
    aunt:     "Eng muhim savol. Qalbingiz nima istaydi? ✨",
    options: [
      { label: "Shirin xotiralar", sublabel: "Qalbimni isitsin", value: "classic", img: teaImg },
      { label: "Hayotiy haqiqatlar", sublabel: "Foydali bilim", value: "nonfiction", img: compassImg },
      { label: "Kuchli hayajon", sublabel: "Kutilmagan burilishlar", value: "adventure", img: keyImg },
    ],
  },
];

// ── Expanded Recommendation Engine ────────────────────────────────────────────
const GENRE_KEYWORDS: Record<string, string[]> = {
  classic:       ["classic", "philosophical", "motivational"],
  nonfiction:    ["nonfiction"],
  adventure:     ["adventure", "mystery"],
  mystery:       ["mystery"],
  philosophical: ["philosophical", "classic"],
  motivational:  ["motivational", "nonfiction"],
};

const DB_MATCH_KEYWORDS: Record<string, string[]> = {
  classic:       ["jahon", "klassik", "roman", "adabiyot", "classic"],
  nonfiction:    ["biznes", "psixologiya", "motivatsiya", "ilm", "nonfiction"],
  adventure:     ["sarguzasht", "fantastika", "fantasy", "qissa"],
  mystery:       ["detektiv", "triller", "kriminal", "mystery"],
  philosophical: ["falsafa", "falsafiy", "drama", "hikoya"],
  motivational:  ["shaxsiy rivojlanish", "self-help", "motivatsiya"],
};

const RESULT_REASONS: Record<string, string> = {
  classic:       "Siz o'ychan va teran insonsiz. Klassik adabiyot sizning ichki dunyongizga eng mos tushadi.",
  nonfiction:    "Ajoyib tanlov! Sizga aqlli va foydali asar kerak. Bu kitob eng yaqin sirdoshingizga aylanadi.",
  adventure:     "Tayyor turing! Sizga xotirjamlik emas, olov kerak. Bu asar yuragingizni tezroq urishiga majbur qiladi!",
  mystery:       "Sirlarni sevasizmi? Bu kitob sizni oxirgi sahifasigacha ushlab turadi. Ko'z uzolmaysiz!",
  philosophical: "Sizning qalbingiz teran ekan. Bu asar siz bilan soatlab dildan 'suhbatlashishga' tayyor.",
  motivational:  "Sizga doimiy o'sish va harakat kerak. Bu kitob sizni faqat oldinga undaydi!",
};

function getTopGenre(answers: string[]): string {
  const score: Record<string, number> = {};
  for (const ans of answers) {
    const related = GENRE_KEYWORDS[ans] ?? [ans];
    for (const g of related) {
      score[g] = (score[g] ?? 0) + 1;
    }
  }
  return Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "classic";
}

// ── Progress pip ──────────────────────────────────────────────────────────────
const Pip = ({ state }: { state: "done" | "active" | "idle" }) => (
  <div
    className={`h-1.5 rounded-full transition-all duration-500 ${
      state === "done" ? "w-6 bg-amber-600" : state === "active" ? "w-4 bg-amber-500" : "w-1.5 bg-amber-700/30 dark:bg-amber-400/30"
    }`}
  />
);

// ── Main component ────────────────────────────────────────────────────────────
const MatchmakerQuiz = () => {
  const { books }   = useData();
  const { t, lang } = useLang();
  const navigate    = useNavigate();

  const [step,       setStep]      = useState(0);
  const [answers,    setAnswers]   = useState<string[]>([]);
  const [showResult, setResult]    = useState(false);

  const getImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = import.meta.env.VITE_SUPABASE_URL as string;
    return `${base}/storage/v1/object/public/${url}`;
  };

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
  };

  const topGenre   = getTopGenre(answers);
  const searchKeys = DB_MATCH_KEYWORDS[topGenre] || ["roman"];
  
  let recBook = books.find((b) => {
    const cat = ((b as any).category || (b as any).genre || "").toLowerCase();
    return searchKeys.some(k => cat.includes(k));
  });

  if (!recBook && books.length > 0) {
    const randomIndex = Math.floor(Math.random() * books.length);
    recBook = books[randomIndex];
  }

  const recReason = RESULT_REASONS[topGenre] ?? RESULT_REASONS.classic;
  const coverUrl = getImageUrl(recBook?.cover_url);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 border-y border-amber-200/60 dark:border-amber-800/30 z-10 flex items-center justify-center">
      
      {/* ── Background: Van Gogh Gold ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div aria-hidden className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: bgImg ? `url(${bgImg})` : undefined,
            backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
            opacity: 1, // Full opacity for the new bright image
          }}
        />
        {/* Removed backdrop-blur here so the image is crisp. Only a slight tint remain. */}
        <div className="absolute inset-0 bg-white/30 dark:bg-black/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 sm:px-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        {!showResult && (
          <motion.div
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            {/* PINK BADGE to match menu */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 mb-3 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
                Kitob Sovchilari
              </span>
            </div>
            
            {/* GOLD HEADLINE */}
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold mb-3 leading-tight
                           text-amber-700 dark:text-amber-300 drop-shadow-sm">
              Qalbingizga mos asarni topamizmi?
            </h2>
            {/* GOLD SUBTEXT */}
            <p className="text-amber-700/80 dark:text-amber-300/80 mb-5 max-w-md mx-auto font-medium text-sm sm:text-base drop-shadow-sm leading-relaxed">
              3 ta qisqa savolga javob bering, biz esa xarakteringizga eng mos kitobni topamiz.
            </p>

            <div className="flex items-center justify-center gap-1.5">
              {WISE_AUNT_QUESTIONS.map((_, i) => (
                <Pip key={i} state={ i < answers.length ? "done" : i === step ? "active" : "idle" } />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Main Glass Card ────────── */}
        {/* Increased opacity for better contrast against bright background */}
        <div className="bg-white/90 dark:bg-black/70 backdrop-blur-xl border border-amber-200/50 dark:border-amber-800/30 shadow-2xl rounded-3xl p-5 sm:p-8 min-h-[300px] flex flex-col justify-center relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                className="text-center relative z-10"
              >
                {/* GOLD AUNT'S NOTE */}
                <p className="font-sans text-sm sm:text-base italic text-amber-600 dark:text-amber-400 mb-2 font-bold drop-shadow-sm">
                  {current.aunt}
                </p>
                {/* GOLD QUESTION */}
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-800 dark:text-amber-200 mb-6 drop-shadow-sm leading-snug">
                  {current.question}
                </h3>

                <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                  {current.options.map((opt) => (
                    <motion.button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      whileHover={{ y: -3, boxShadow: "0 10px 25px -10px rgba(245,158,11,0.25)", scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      // Updated borders to gold styling
                      className="group flex flex-col items-center text-center rounded-2xl p-4 cursor-pointer bg-white/95 dark:bg-neutral-900/95 border-2 border-amber-100 dark:border-amber-800/30 shadow-sm hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-300"
                    >
                      <div className="w-14 h-14 mb-3 rounded-full overflow-hidden bg-amber-50 dark:bg-black/50 flex items-center justify-center shrink-0 border-2 border-amber-200 dark:border-amber-700/30 group-hover:scale-110 transition-transform duration-300">
                        <img src={opt.img} alt={opt.label} className="w-9 h-9 object-contain" draggable={false} />
                      </div>
                      {/* GOLD OPTION LABELS */}
                      <p className="font-serif text-[14px] font-bold leading-snug mb-1 text-amber-800 dark:text-amber-200 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                        {opt.label}
                      </p>
                      <p className="font-sans text-[11px] italic text-amber-700/70 dark:text-amber-300/70 font-medium leading-snug">
                        {opt.sublabel}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

            ) : (
              // ── Result Step ──────────────────────────────
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 text-center md:text-left relative z-10"
              >
                <div className="shrink-0 w-36 sm:w-44 perspective-1000 mt-1">
                  <div 
                    className="relative aspect-[2/3] rounded-md overflow-hidden border-l-[3px] border-white/20"
                    style={{ 
                      transform: "rotateY(-15deg) rotateX(5deg)",
                      boxShadow: `-15px 15px 30px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.2)` 
                    }}
                  >
                    {coverUrl ? (
                      <img src={coverUrl} alt={locField(recBook || {}, "title", lang)} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-neutral-800 flex items-center justify-center"><BookOpen className="text-white/20 w-8 h-8" /></div>
                    )}
                    <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.15] via-transparent to-black/40 pointer-events-none" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center h-full">
                  <div className="inline-flex items-center justify-center md:justify-start gap-1.5 mb-2">
                    <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <p className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                      Ideal "Nomzod" Topildi!
                    </p>
                  </div>

                  {recBook ? (
                    <>
                      {/* GOLD RESULT TITLE */}
                      <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-800 dark:text-amber-200 mb-1.5 drop-shadow-sm">
                        {locField(recBook, "title", lang)}
                      </h3>
                      <p className="font-sans text-xs uppercase tracking-widest text-amber-700/80 dark:text-amber-300/80 font-bold mb-4">
                        {locField(recBook, "author", lang)}
                      </p>
                    </>
                  ) : (
                    <p className="text-foreground/60 mb-2">—</p>
                  )}

                  {/* GOLD REASON BOX */}
                  <div className="bg-amber-50 dark:bg-neutral-900/50 border-2 border-amber-200/60 dark:border-amber-800/30 rounded-xl p-4 mb-6 shadow-sm">
                    <p className="font-serif text-sm sm:text-base text-amber-800 dark:text-amber-200 leading-relaxed italic font-bold">
                      "{recReason}"
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {recBook && (
                      <motion.button
                        whileHover={{ scale: 1.03, backgroundColor: "#d97706" }} whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(`/book/${recBook.id}`)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 text-white px-6 py-3 text-sm font-bold shadow-md transition-all focus:outline-none"
                      >
                        <BookOpen className="w-4 h-4" />
                        Batafsil
                      </motion.button>
                    )}
                    
                    <button
                      onClick={handleReset}
                      // GOLD RESTART BUTTON
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700/80 dark:text-amber-300/80 hover:text-amber-600 dark:hover:text-amber-400 transition-colors px-3 py-2"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Qaytadan tanlash
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
};

export default MatchmakerQuiz;