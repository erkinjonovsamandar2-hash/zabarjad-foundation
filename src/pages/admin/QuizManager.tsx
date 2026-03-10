import { useState } from "react";
import { useData, QuizConfig } from "@/context/DataContext";
import { Save, Plus, Trash2 } from "lucide-react";

const QuizManager = () => {
  const { quizConfig, updateQuizConfig, books } = useData();
  const [config, setConfig] = useState<QuizConfig>(quizConfig);
  const [saved, setSaved] = useState(false);

  const updateStep = (si: number, field: string, value: string) => {
    const steps = [...config.steps];
    steps[si] = { ...steps[si], [field]: value };
    setConfig({ ...config, steps });
  };

  const updateOption = (si: number, oi: number, field: string, value: string) => {
    const steps = [...config.steps];
    const options = [...steps[si].options];
    options[oi] = { ...options[oi], [field]: value };
    steps[si] = { ...steps[si], options };
    setConfig({ ...config, steps });
  };

  const addOption = (si: number) => {
    const steps = [...config.steps];
    steps[si] = { ...steps[si], options: [...steps[si].options, { label: "", value: "" }] };
    setConfig({ ...config, steps });
  };

  const removeOption = (si: number, oi: number) => {
    const steps = [...config.steps];
    steps[si] = { ...steps[si], options: steps[si].options.filter((_, i) => i !== oi) };
    setConfig({ ...config, steps });
  };

  const updatePath = (pi: number, field: string, value: string) => {
    const paths = [...config.paths];
    paths[pi] = { ...paths[pi], [field]: value };
    setConfig({ ...config, paths });
  };

  const addPath = () => {
    setConfig({ ...config, paths: [...config.paths, { key: "", bookId: books[0]?.id || "", reason: "" }] });
  };

  const removePath = (pi: number) => {
    setConfig({ ...config, paths: config.paths.filter((_, i) => i !== pi) });
  };

  const handleSave = () => {
    updateQuizConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Quiz Sozlamalari</h1>
        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
          <Save className="h-4 w-4" /> {saved ? "Saqlandi ✓" : "Saqlash"}
        </button>
      </div>

      {/* Steps */}
      <div className="space-y-6 mb-10">
        <h2 className="text-lg font-semibold text-foreground/90">Savollar</h2>
        {config.steps.map((step, si) => (
          <div key={si} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary/90 text-xs font-bold">{si + 1}</span>
              <input value={step.question} onChange={(e) => updateStep(si, "question", e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground font-medium focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" placeholder="Savol..." />
            </div>
            <div className="space-y-2 ml-10">
              {step.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input value={opt.label} onChange={(e) => updateOption(si, oi, "label", e.target.value)} placeholder="Label" className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
                  <input value={opt.value} onChange={(e) => updateOption(si, oi, "value", e.target.value)} placeholder="value" className="w-28 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
                  <button onClick={() => removeOption(si, oi)} className="p-1 text-muted-foreground/80 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              <button onClick={() => addOption(si)} className="text-xs text-primary hover:text-primary/90 font-medium mt-1">+ Variant qo'shish</button>
            </div>
          </div>
        ))}
      </div>

      {/* Paths */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground/90">Tavsiya Yo'llari</h2>
          <button onClick={addPath} className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/90 font-medium">
            <Plus className="h-3.5 w-3.5" /> Yo'l qo'shish
          </button>
        </div>
        {config.paths.map((path, pi) => (
          <div key={pi} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input value={path.key} onChange={(e) => updatePath(pi, "key", e.target.value)} placeholder="kalit (masalan: fantasy-high-dark)" className="w-full sm:w-48 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-foreground font-mono focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
            <select value={path.bookId} onChange={(e) => updatePath(pi, "bookId", e.target.value)} className="w-full sm:w-48 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-foreground bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none">
              {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
            <input value={path.reason} onChange={(e) => updatePath(pi, "reason", e.target.value)} placeholder="Sabab..." className="flex-1 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
            <button onClick={() => removePath(pi)} className="p-1.5 text-muted-foreground/80 hover:text-red-500 shrink-0"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}

        {/* Default */}
        <div className="bg-primary/5 rounded-xl border border-amber-200 p-4">
          <p className="text-xs font-semibold text-primary/90 mb-2 uppercase tracking-wider">Standart tavsiya (mos yo'l topilmaganda)</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={config.defaultBookId} onChange={(e) => setConfig({ ...config, defaultBookId: e.target.value })} className="w-full sm:w-48 rounded-lg border border-amber-200 px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-amber-200 outline-none bg-white">
              {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
            <input value={config.defaultReason} onChange={(e) => setConfig({ ...config, defaultReason: e.target.value })} className="flex-1 w-full rounded-lg border border-amber-200 px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-amber-200 outline-none bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizManager;
