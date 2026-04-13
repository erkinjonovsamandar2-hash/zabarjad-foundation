import { useState, useEffect, useRef } from "react";
import { GripVertical, Save, Star, Check, Plus, Minus, LayoutList, BookOpen } from "lucide-react";
import { useData } from "@/context/DataContext";
import { locField } from "@/context/LanguageContext";
import type { Book } from "@/types/database";

const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base}/storage/v1/object/public/${url}`;
};

// ── Cover thumbnail ────────────────────────────────────────────────────────────
const CoverThumb = ({ url, title, size = "sm" }: { url: string; title: string; size?: "sm" | "md" }) => {
  const cls = size === "md"
    ? "shrink-0 w-12 h-[72px] rounded-[3px_6px_6px_3px] overflow-hidden bg-gray-100 shadow-sm"
    : "shrink-0 w-9 h-[54px] rounded-[3px_5px_5px_3px] overflow-hidden bg-gray-100";
  return (
    <div className={cls}>
      {url
        ? <img src={url} alt={title} className="w-full h-full object-contain" />
        : <div className="w-full h-full bg-gray-200" />
      }
    </div>
  );
};

const HeroOrderManager = () => {
  const { books, updateBook } = useData();

  // ── State: ordered featured list + saving flags ────────────────────────────
  const [ordered, setOrdered] = useState<Book[]>([]);
  const [toggling, setToggling] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Drag refs
  const dragIdx = useRef<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);

  // ── Sync when books change ──────────────────────────────────────────────────
  useEffect(() => {
    const featured = books
      .filter((b) => b.featured)
      .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
    setOrdered(featured);
  }, [books]);

  const nonFeatured = books
    .filter((b) => !b.featured)
    .sort((a, b) => (locField(a, "title", "uz") || a.title || "").localeCompare(locField(b, "title", "uz") || b.title || ""));

  // ── Drag handlers ───────────────────────────────────────────────────────────
  const onDragStart = (i: number) => { dragIdx.current = i; };

  const onDragEnter = (i: number) => {
    if (dragIdx.current === null || dragIdx.current === i) return;
    dragOverIdx.current = i;
    setOrdered((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx.current!, 1);
      next.splice(i, 0, moved);
      dragIdx.current = i;
      return next;
    });
  };

  const onDragEnd = () => {
    dragIdx.current = null;
    dragOverIdx.current = null;
  };

  // ── Toggle featured ─────────────────────────────────────────────────────────
  const toggleFeatured = async (book: Book) => {
    setToggling((s) => new Set(s).add(book.id));
    try {
      const newFeatured = !book.featured;
      let newSortOrder = book.sort_order;
      if (newFeatured) {
        // assign next position when adding
        newSortOrder = (ordered.length > 0 ? Math.max(...ordered.map((b) => b.sort_order ?? 0)) : 0) + 1;
      }
      await updateBook(book.id, { featured: newFeatured, sort_order: newSortOrder });
    } finally {
      setToggling((s) => { const n = new Set(s); n.delete(book.id); return n; });
    }
  };

  // ── Save order ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        ordered.map((book, i) => updateBook(book.id, { sort_order: i + 1 }))
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* ── Section 1: Featured order ──────────────────────────────────────── */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <LayoutList className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Hero Tartibi</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Slayderdagi kitoblar tartibini sudrab o'zgartiring (drag &amp; drop).
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || ordered.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${saved
                ? "bg-green-500 text-white"
                : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
              }`}
          >
            {saved ? (
              <><Check className="h-4 w-4" /> Saqlandi</>
            ) : saving ? (
              <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Saqlanmoqda…</>
            ) : (
              <><Save className="h-4 w-4" /> Tartibni Saqlash</>
            )}
          </button>
        </div>

        {/* Empty state */}
        {ordered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl bg-gray-50">
            <Star className="h-8 w-8 mx-auto mb-2 text-amber-400/60" />
            Hech qanday kitob "Featured" qilinmagan.<br />Quyidagi ro'yxatdan qo'shing.
          </div>
        )}

        {/* Drag list */}
        <div className="space-y-2">
          {ordered.map((book, i) => {
            const imgSrc = getImageUrl(book.cover_url);
            const title = locField(book, "title", "uz") || book.title;
            const author = locField(book, "author", "uz") || book.author;
            const isBusy = toggling.has(book.id);

            return (
              <div
                key={book.id}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragEnter={() => onDragEnter(i)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm cursor-grab active:cursor-grabbing active:shadow-md active:scale-[1.01] transition-all duration-150 select-none group"
              >
                {/* Position badge */}
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>

                {/* Cover */}
                <CoverThumb url={imgSrc} title={title} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{title}</p>
                  <p className="text-xs text-muted-foreground truncate uppercase tracking-wide">{author}</p>
                </div>

                {/* Remove from hero */}
                <button
                  onClick={() => toggleFeatured(book)}
                  disabled={isBusy}
                  title="Hero'dan olib tashlash"
                  className="shrink-0 p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40 opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  {isBusy
                    ? <span className="h-4 w-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin inline-block" />
                    : <Minus className="h-4 w-4" />
                  }
                </button>

                {/* Drag handle */}
                <GripVertical className="shrink-0 h-5 w-5 text-gray-300 cursor-grab" />
              </div>
            );
          })}
        </div>

        {ordered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            {ordered.length} ta kitob · Tartibni o'zgartirgach "Tartibni Saqlash" ni bosing
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-200" />

      {/* ── Section 2: All non-featured books ─────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">Qo'shish mumkin</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Quyidagi kitoblarni hero slaydiga qo'shish uchun <span className="font-semibold text-foreground">+</span> ni bosing.
        </p>

        {nonFeatured.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl bg-gray-50">
            Barcha kitoblar hero'ga qo'shilgan.
          </div>
        ) : (
          <div className="space-y-2">
            {nonFeatured.map((book) => {
              const imgSrc = getImageUrl(book.cover_url);
              const title = locField(book, "title", "uz") || book.title;
              const author = locField(book, "author", "uz") || book.author;
              const isBusy = toggling.has(book.id);

              return (
                <div
                  key={book.id}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm transition-all duration-150 group hover:border-primary/30 hover:shadow-md"
                >
                  {/* Cover */}
                  <CoverThumb url={imgSrc} title={title} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{title}</p>
                    <p className="text-xs text-muted-foreground truncate uppercase tracking-wide">{author}</p>
                  </div>

                  {/* Add to hero */}
                  <button
                    onClick={() => toggleFeatured(book)}
                    disabled={isBusy}
                    title="Hero'ga qo'shish"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all disabled:opacity-40"
                  >
                    {isBusy ? (
                      <span className="h-3.5 w-3.5 border-2 border-primary/40 border-t-primary rounded-full animate-spin inline-block" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    Qo'shish
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroOrderManager;
