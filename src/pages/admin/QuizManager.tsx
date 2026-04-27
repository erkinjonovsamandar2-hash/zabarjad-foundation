import { useState } from "react";
import { useData, QuizConfig, EditableQuestion } from "@/context/DataContext";
import { Save, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

// ── Default question texts (mirrors QUESTIONS in MatchmakerQuiz.tsx) ──────────
const QUESTION_DEFAULTS: EditableQuestion[] = [
  {
    question: "Kechqurun bo'sh vaqtingizni qanday o'tkazasiz?",
    aunt: "Avval o'zingizni taniysizmi?.. ☕",
    options: [
      { label: "Choy va kitob",              sublabel: "Sokin kech, chuqur fikrlar" },
      { label: "Podcast yoki hujjatli film", sublabel: "Yangi bilim, yangi nuqtai nazar" },
      { label: "Detektiv yoki triller",      sublabel: "Jumboqni oxirigacha yechmasam tincholmayman" },
      { label: "Do'stlar bilan gap-so'z",    sublabel: "Insonlardan kuch olaman" },
    ],
  },
  {
    question: "Kitobdagi qaysi lahza sizni o'ziga ko'proq tortadi?",
    aunt: "Ko'nglingiz qayerda to'xtaydi? 📖",
    options: [
      { label: "Chuqur suhbat va falsafa",    sublabel: "Hayotning ma'nosi qiziqtiradi" },
      { label: "Yangi olam va sarguzasht",    sublabel: "Kashfiyot zavqi" },
      { label: "Kutilmagan burilish",          sublabel: "Sir ochildi — nafas tutiladi!" },
      { label: "Yurakni siquvchi hissiy sahna", sublabel: "Hissiyotga to'la, esdan ketmaydi" },
    ],
  },
  {
    question: "Yangi kitob qo'lingizga qanday tushadi?",
    aunt: "Kitob do'koniga kirsangiz nima bo'ladi? 🏛️",
    options: [
      { label: "Muallif ismini tanib qolaman",      sublabel: "Tanish qalam — ishonch uyg'otadi" },
      { label: "Muqova diqqatimni jalb qiladi",     sublabel: "Ko'z — birinchi tanlov" },
      { label: "Annotatsiyani sinchiklab o'qiyman", sublabel: "Sir bor-yo'qligini tekshiraman" },
      { label: "Kimdir tavsiya qilgan",             sublabel: "Ishonchli odam — ishonchli tavsiya" },
    ],
  },
  {
    question: "Kitob tugagach nima qilasiz?",
    aunt: "Oxirgi sahifa yopildi — keyin nima? ✨",
    options: [
      { label: "Jim o'tirib, his-tuyg'ular bilan qolaman", sublabel: "Bu lahzani shoshmasdan his etaman" },
      { label: "Darhol yangi asar boshlayman",             sublabel: "To'xtashni bilmayman" },
      { label: "Barcha tafsilotlarni qayta tahlil qilaman", sublabel: "Sirni yana bir bor o'ylayman" },
      { label: "Kimgadir tavsiya qilaman",                 sublabel: "Bu hisni yolg'iz turolmayman" },
    ],
  },
  {
    question: "Qaysi qahramon sizga ko'proq yaqin?",
    aunt: "O'sha sahifalarda siz bo'lganingizda... 🤔",
    options: [
      { label: "Kamgap, chuqur o'ylovchi", sublabel: "Teran fikrlaydi, so'zini o'lchaб gapiradi" },
      { label: "Jasur sarguzashtchi",       sublabel: "Ortga qaytishni bilmaydi" },
      { label: "Ziyrak, sirli zehn",        sublabel: "Har narsaning izini topadi" },
      { label: "Yumshoq, mehr-oqibatli inson", sublabel: "Hamma uchun qayg'uradi" },
    ],
  },
  {
    question: "O'qiyotganda ichingizda nima ko'proq bo'ladi?",
    aunt: "Eng muhim savol — ichingizda nima? 💫",
    options: [
      { label: "Chuqur o'y va yangi savollar", sublabel: "Dunyoga yangicha qarayman" },
      { label: "Qo'zg'alish va ilhom",          sublabel: "Harakat qilgim kelib ketadi" },
      { label: "Hayajonli sabrsizlik",          sublabel: "Davomini o'qimasdan qo'yolmayman" },
      { label: "Qalb isishi va ba'zan yig'i",  sublabel: "His-tuyg'ular meni to'ldirib ketadi" },
    ],
  },
];

// ── Archetype definitions (labels + accent colours for the admin UI) ──────────
const ARCHETYPES = [
  { key: "faylasuf", label: "Kechgi Faylasuf", sub: "The Midnight Philosopher", color: "#C9A227" },
  { key: "kashfiyotchi", label: "Botir Kashfiyotchi", sub: "The Brave Explorer", color: "#10B981" },
  { key: "ovchi", label: "Sir Ovchisi", sub: "The Mystery Hunter", color: "#6366F1" },
  { key: "doktor", label: "Qalb Doktori", sub: "The Heart Healer", color: "#F43F5E" },
] as const;

// Default cert statement texts (mirrors certStatement in MatchmakerQuiz.tsx)
const CERT_STATEMENT_DEFAULTS: Record<string, [string, string]> = {
  faylasuf:     ["Bu shaxs kitobni yopsa ham, fikrlar ketmaydi.", "Bitta jumla uni soatlar bo'yi o'yga toldiradi."],
  kashfiyotchi: ["Kitob tugashi bilan keyingisi allaqachon qo'lida.", "Yangi olam, yangi imkoniyat — bu uning qonida."],
  ovchi:        ["Qotilni oxirgi sahifadan oldin topadi. Har safar.", "Eng kichik ipuçni ham ko'zdan qochirmaydi."],
  doktor:       ["Kitob qahramonlari bilan birga yig'laydi. Bu kuch.", "Ba'zi sahifadan keyin jim o'tirib qoladi. Bu normal."],
};

// Per-archetype form state: 2 books + 2 hook texts
interface ArchRow {
  bookId1: string;
  hook1: string;
  bookId2: string;
  hook2: string;
}

type ArchKey = typeof ARCHETYPES[number]["key"];

// Extract arch rows from quizConfig.paths
// Convention: path.key === archetypeKey → book 1; path.key === archetypeKey+"_2" → book 2
function extractRows(paths: QuizConfig["paths"], books: { id: string }[]): Record<ArchKey, ArchRow> {
  const fallback = books[0]?.id ?? "";
  const row = (key: ArchKey): ArchRow => {
    const p1 = paths.find(p => p.key === key);
    const p2 = paths.find(p => p.key === `${key}_2`);
    return {
      bookId1: p1?.bookId ?? fallback,
      hook1: p1?.reason ?? "",
      bookId2: p2?.bookId ?? fallback,
      hook2: p2?.reason ?? "",
    };
  };
  return {
    faylasuf: row("faylasuf"),
    kashfiyotchi: row("kashfiyotchi"),
    ovchi: row("ovchi"),
    doktor: row("doktor"),
  };
}

// Rebuild paths array from arch rows (preserving any unrelated paths)
function buildPaths(rows: Record<ArchKey, ArchRow>, existing: QuizConfig["paths"]) {
  // Remove archetype-managed paths, keep any others
  const other = existing.filter(p => !ARCHETYPES.some(a => p.key === a.key || p.key === `${a.key}_2`));
  const arch: QuizConfig["paths"] = [];
  for (const a of ARCHETYPES) {
    const r = rows[a.key];
    if (r.bookId1) arch.push({ key: a.key, bookId: r.bookId1, reason: r.hook1 });
    if (r.bookId2) arch.push({ key: `${a.key}_2`, bookId: r.bookId2, reason: r.hook2 });
  }
  return [...arch, ...other];
}

const QuizManager = () => {
  const { quizConfig, updateQuizConfig, books } = useData();

  const [rows, setRows] = useState<Record<ArchKey, ArchRow>>(
    () => extractRows(quizConfig.paths, books)
  );
  const [questions, setQuestions] = useState<EditableQuestion[]>(
    () => quizConfig.questions?.length === QUESTION_DEFAULTS.length
      ? quizConfig.questions
      : QUESTION_DEFAULTS.map(q => ({ ...q, options: q.options.map(o => ({ ...o })) }))
  );
  const [certStatements, setCertStatements] = useState<Record<string, [string, string]>>(() => {
    const saved = quizConfig.certStatements;
    const out: Record<string, [string, string]> = {};
    for (const a of ARCHETYPES) {
      out[a.key] = [
        saved?.[a.key]?.[0] || CERT_STATEMENT_DEFAULTS[a.key][0],
        saved?.[a.key]?.[1] || CERT_STATEMENT_DEFAULTS[a.key][1],
      ];
    }
    return out;
  });
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const update = (key: ArchKey, field: keyof ArchRow, value: string) =>
    setRows(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  const updateCert = (key: ArchKey, idx: 0 | 1, value: string) =>
    setCertStatements(prev => ({
      ...prev,
      [key]: [idx === 0 ? value : prev[key][0], idx === 1 ? value : prev[key][1]] as [string, string],
    }));

  const updateQ = (qi: number, field: "question" | "aunt", value: string) =>
    setQuestions(prev => prev.map((q, i) => i === qi ? { ...q, [field]: value } : q));

  const updateOpt = (qi: number, oi: number, field: "label" | "sublabel", value: string) =>
    setQuestions(prev => prev.map((q, i) => i === qi
      ? { ...q, options: q.options.map((o, j) => j === oi ? { ...o, [field]: value } : o) }
      : q
    ));

  const handleSave = async () => {
    setSaving(true);
    try {
      const newConfig: QuizConfig = {
        ...quizConfig,
        paths: buildPaths(rows, quizConfig.paths),
        questions,
        certStatements,
      };
      await updateQuizConfig(newConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
      toast.success("Quiz sozlamalari saqlandi!");
    } catch (err) {
      toast.error("Saqlashda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kitob Sovchilari — Sozlamalar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Savollar, javoblar va har bir kitobxon turi uchun tavsiyalarni tahrirlang.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saqlanmoqda..." : saved ? "Saqlandi ✓" : "Saqlash"}
        </button>
      </div>

      {/* ── Section 1: Questions ─────────────────────────────────────────────── */}
      <h2 className="text-base font-bold text-foreground mb-3">Savollar va javoblar</h2>
      <div className="space-y-3 mb-8">
        {questions.map((q, qi) => {
          const isOpen = openQ === qi;
          return (
            <div key={qi} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Accordion header */}
              <button
                type="button"
                onClick={() => setOpenQ(isOpen ? null : qi)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                    {qi + 1}
                  </span>
                  <span className="text-sm font-semibold text-foreground truncate">{q.question}</span>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                  {/* Question text */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Savol matni</label>
                      <input value={q.question} onChange={e => updateQ(qi, "question", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Kichik izoh (aunt)</label>
                      <input value={q.aunt} onChange={e => updateQ(qi, "aunt", e.target.value)} className={inputCls} placeholder="Masalan: Avval o'zingizni taniysizmi?.. ☕" />
                    </div>
                  </div>

                  {/* Options */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Javob variantlari</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <span className="shrink-0 w-5 h-5 rounded bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <input
                            value={opt.label}
                            onChange={e => updateOpt(qi, oi, "label", e.target.value)}
                            placeholder="Javob matni"
                            className={`${inputCls} flex-1`}
                          />
                          <input
                            value={opt.sublabel}
                            onChange={e => updateOpt(qi, oi, "sublabel", e.target.value)}
                            placeholder="Kichik tavsif"
                            className={`${inputCls} flex-1`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Section 2: Cert statements ──────────────────────────────────────── */}
      <h2 className="text-base font-bold text-foreground mb-1">Guvohnoma iboralari</h2>
      <p className="text-xs text-muted-foreground mb-3">Har bir arxetip uchun guvohnomada chiqadigan 2 ta ibora.</p>
      <div className="space-y-3 mb-8">
        {ARCHETYPES.map((a) => {
          const cs = certStatements[a.key];
          return (
            <div key={a.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100"
                style={{ borderLeftWidth: 4, borderLeftColor: a.color, borderLeftStyle: "solid" }}>
                <div>
                  <p className="text-sm font-bold text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.sub}</p>
                </div>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    1-ibora — qalin, asosiy da'vo
                  </label>
                  <input
                    value={cs[0]}
                    onChange={e => updateCert(a.key, 0, e.target.value)}
                    placeholder={CERT_STATEMENT_DEFAULTS[a.key][0]}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    2-ibora — kursiv, qo'shimcha
                  </label>
                  <input
                    value={cs[1]}
                    onChange={e => updateCert(a.key, 1, e.target.value)}
                    placeholder={CERT_STATEMENT_DEFAULTS[a.key][1]}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Section 3: Book recommendations ─────────────────────────────────── */}
      <h2 className="text-base font-bold text-foreground mb-3">Kitob tavsiyalari</h2>
      <div className="space-y-5">
        {ARCHETYPES.map((a) => {
          const r = rows[a.key];
          return (
            <div key={a.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100"
                style={{ borderLeftWidth: 4, borderLeftColor: a.color, borderLeftStyle: "solid" }}>
                <div>
                  <p className="text-sm font-bold text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.sub}</p>
                </div>
              </div>

              <div className="px-5 pt-4 pb-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">1-tavsiya</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select value={r.bookId1} onChange={e => update(a.key, "bookId1", e.target.value)}
                    className="w-full sm:w-56 rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none">
                    <option value="">— Kitob tanlang —</option>
                    {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                  </select>
                  <input value={r.hook1} onChange={e => update(a.key, "hook1", e.target.value)}
                    placeholder="Kitobni qiziqtiruvchi ibora..."
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
                </div>
              </div>

              <div className="px-5 pt-3 pb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">2-tavsiya</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select value={r.bookId2} onChange={e => update(a.key, "bookId2", e.target.value)}
                    className="w-full sm:w-56 rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none">
                    <option value="">— Kitob tanlang —</option>
                    {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                  </select>
                  <input value={r.hook2} onChange={e => update(a.key, "hook2", e.target.value)}
                    placeholder="Ikkinchi kitob uchun ibora..."
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 px-5 py-4">
        <p className="text-xs font-semibold text-amber-800 mb-1">Eslatma</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          Savol va javob matnlari o'zgartirilsa, test sahifasida darhol aks etadi.
          Javob variantlari tartibini o'zgartirmang — ular ichki hisob-kitob bilan bog'liq.
        </p>
      </div>
    </div>
  );
};

export default QuizManager;
