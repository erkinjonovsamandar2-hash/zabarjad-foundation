import { useState } from "react";
import { useData, QuizConfig } from "@/context/DataContext";
import { Save } from "lucide-react";

// Archetype definitions (labels + accent colours for the admin UI)
const ARCHETYPES = [
  { key: "faylasuf",     label: "Kechgi Faylasuf",   sub: "The Midnight Philosopher", color: "#C9A227" },
  { key: "kashfiyotchi", label: "Botir Kashfiyotchi", sub: "The Brave Explorer",       color: "#10B981" },
  { key: "ovchi",        label: "Sir Ovchisi",        sub: "The Mystery Hunter",       color: "#6366F1" },
  { key: "doktor",       label: "Qalb Doktori",       sub: "The Heart Healer",         color: "#F43F5E" },
] as const;

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
      hook1:   p1?.reason  ?? "",
      bookId2: p2?.bookId ?? fallback,
      hook2:   p2?.reason  ?? "",
    };
  };
  return {
    faylasuf:     row("faylasuf"),
    kashfiyotchi: row("kashfiyotchi"),
    ovchi:        row("ovchi"),
    doktor:       row("doktor"),
  };
}

// Rebuild paths array from arch rows (preserving any unrelated paths)
function buildPaths(rows: Record<ArchKey, ArchRow>, existing: QuizConfig["paths"]) {
  // Remove archetype-managed paths, keep any others
  const other = existing.filter(p => !ARCHETYPES.some(a => p.key === a.key || p.key === `${a.key}_2`));
  const arch: QuizConfig["paths"] = [];
  for (const a of ARCHETYPES) {
    const r = rows[a.key];
    if (r.bookId1) arch.push({ key: a.key,          bookId: r.bookId1, reason: r.hook1 });
    if (r.bookId2) arch.push({ key: `${a.key}_2`,   bookId: r.bookId2, reason: r.hook2 });
  }
  return [...arch, ...other];
}

const QuizManager = () => {
  const { quizConfig, updateQuizConfig, books } = useData();

  const [rows, setRows] = useState<Record<ArchKey, ArchRow>>(
    () => extractRows(quizConfig.paths, books)
  );
  const [saved, setSaved] = useState(false);

  const update = (key: ArchKey, field: keyof ArchRow, value: string) =>
    setRows(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  const handleSave = () => {
    const newConfig: QuizConfig = {
      ...quizConfig,
      paths: buildPaths(rows, quizConfig.paths),
    };
    updateQuizConfig(newConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kitob Sovchilari — Sozlamalar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Har bir kitobxon turi uchun 2 ta kitob va ularni qiziqtiruvchi izoh belgilang.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Save className="h-4 w-4" />
          {saved ? "Saqlandi ✓" : "Saqlash"}
        </button>
      </div>

      {/* Archetype rows */}
      <div className="space-y-5">
        {ARCHETYPES.map((a) => {
          const r = rows[a.key];
          return (
            <div key={a.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Row header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100"
                style={{ borderLeftWidth: 4, borderLeftColor: a.color, borderLeftStyle: "solid" }}>
                <div>
                  <p className="text-sm font-bold text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.sub}</p>
                </div>
              </div>

              {/* Book 1 */}
              <div className="px-5 pt-4 pb-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  1-tavsiya
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={r.bookId1}
                    onChange={e => update(a.key, "bookId1", e.target.value)}
                    className="w-full sm:w-56 rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                  >
                    <option value="">— Kitob tanlang —</option>
                    {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                  </select>
                  <input
                    value={r.hook1}
                    onChange={e => update(a.key, "hook1", e.target.value)}
                    placeholder='Kitobni qiziqtiruvchi ibora — "Bu kitobni o\'qib..."'
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Book 2 */}
              <div className="px-5 pt-3 pb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  2-tavsiya
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={r.bookId2}
                    onChange={e => update(a.key, "bookId2", e.target.value)}
                    className="w-full sm:w-56 rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                  >
                    <option value="">— Kitob tanlang —</option>
                    {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                  </select>
                  <input
                    value={r.hook2}
                    onChange={e => update(a.key, "hook2", e.target.value)}
                    placeholder='Ikkinchi kitob uchun ibora...'
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help note */}
      <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 px-5 py-4">
        <p className="text-xs font-semibold text-amber-800 mb-1">Eslatma</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          Ibora maydoni kitob sahifasida ko'rsatiladigan qiziqtiruvchi gap yoki fakt.
          Masalan: <em>"Bu kitobni o'qib, uzoq vaqt o'y surasiz."</em>
          Bo'sh qoldirilsa, standart matn ishlatiladi.
        </p>
      </div>
    </div>
  );
};

export default QuizManager;
