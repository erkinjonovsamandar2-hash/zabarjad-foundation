import { useState, useMemo, startTransition, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { LIBRARY_FILTER_MAP } from "@/lib/constants";
import { BookOpen, Pencil, Trash2, ExternalLink, Plus, GripVertical, Save, Check, Info } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "@/context/DataContext";

const CATEGORIES = ["all", "jahon", "ilmiy", "new", "amir-temur", "erkin-millat"] as const;

const CATEGORY_LABELS: Record<string, string> = {
  all: "Barchasi",
  jahon: "Jahon adabiyoti",
  ilmiy: "Ilmiy-ommabop",
  new: "Yangi nashrlar",
  "amir-temur": "Tarixiy",
  "erkin-millat": "Ijtimoiy-siyosiy",
};

const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base}/storage/v1/object/public/${url}`;
};

const CuratedLibraryManager = () => {
  const { books, updateBook, deleteBook } = useData();
  const [active, setActive] = useState("all");
  const [ordered, setOrdered] = useState<Book[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const dragIdx = useRef<number | null>(null);

  // Sync ordered list when books or active filter changes
  useEffect(() => {
    const sorted = (active === "all" ? books : books.filter((b) => b.category === active))
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    setOrdered(sorted);
    setIsDirty(false);
  }, [books, active]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: books.length };
    for (const b of books) {
      c[b.category] = (c[b.category] ?? 0) + 1;
    }
    return c;
  }, [books]);

  // ── Drag handlers ────────────────────────────────────────────────────────────
  const onDragStart = (i: number) => { dragIdx.current = i; };

  const onDragEnter = (i: number) => {
    if (dragIdx.current === null || dragIdx.current === i) return;
    setOrdered((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx.current!, 1);
      next.splice(i, 0, moved);
      dragIdx.current = i;
      return next;
    });
    setIsDirty(true);
  };

  const onDragEnd = () => { dragIdx.current = null; };

  // ── Save order ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      if (active === "all") {
        // Global reorder: assign sequential sort_order to all books
        await Promise.all(ordered.map((book, i) => updateBook(book.id, { sort_order: i + 1 })));
      } else {
        // Category reorder: find global positions and interleave safely
        // Get other-category books sorted by their current sort_order
        const others = books
          .filter((b) => b.category !== active)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

        // Assign new positions: spread the category books among all positions
        // by rebuilding the full global order
        const allSorted = books.slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        const categoryPositions: number[] = [];
        let catCount = 0;
        allSorted.forEach((b, idx) => {
          if (b.category === active) categoryPositions.push(idx);
        });

        const updates: { id: string; sort_order: number }[] = [];
        // Rebuild global list: slot reordered category books into the original positions
        const globalOrdered: Book[] = [];
        let catIdx = 0;
        let otherIdx = 0;
        for (let pos = 0; pos < allSorted.length; pos++) {
          if (categoryPositions.includes(pos)) {
            globalOrdered.push(ordered[catIdx++]);
          } else {
            globalOrdered.push(others[otherIdx++]);
          }
        }
        globalOrdered.forEach((b, i) => {
          updates.push({ id: b.id, sort_order: i + 1 });
        });
        await Promise.all(updates.map(({ id, sort_order }) => updateBook(id, { sort_order })));
      }
      setSaved(true);
      setIsDirty(false);
      setTimeout(() => setSaved(false), 2200);
    } catch (err: any) {
      toast.error("Saqlashda xatolik: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, coverUrl: string | null | undefined, title: string) => {
    if (!window.confirm(`"${title}" kitobini o'chirmoqchimisiz?`)) return;
    try {
      await deleteBook(id, coverUrl);
      toast.success("Kitob o'chirildi");
    } catch (err: any) {
      toast.error("O'chirishda xatolik: " + err.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tanlangan kitoblar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kutubxona sahifasida ko'rinadigan kitoblar tartibi
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
              }`}
            >
              {saved ? (
                <><Check className="h-4 w-4" /> Saqlandi</>
              ) : saving ? (
                <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Saqlanmoqda…</>
              ) : (
                <><Save className="h-4 w-4" /> Tartibni saqlash</>
              )}
            </button>
          )}
          <a
            href="/library"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Saytda ko'rish
          </a>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Kitob qo'shish
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {CATEGORIES.map((key) => (
          <div
            key={key}
            className={`rounded-xl border p-3 text-center cursor-pointer transition-colors ${
              active === key
                ? "border-primary/40 bg-primary/5"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
            onClick={() => startTransition(() => setActive(key))}
          >
            <p className={`text-2xl font-bold ${active === key ? "text-primary" : "text-foreground"}`}>
              {counts[key] ?? 0}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{CATEGORY_LABELS[key]}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((key) => (
          <button
            key={key}
            onClick={() => startTransition(() => setActive(key))}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
              active === key
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-foreground/70 hover:bg-gray-50"
            }`}
          >
            {CATEGORY_LABELS[key]}
            <span className={`ml-1.5 text-[10px] ${active === key ? "opacity-70" : "text-muted-foreground"}`}>
              {counts[key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Drag hint */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <Info className="h-3.5 w-3.5 shrink-0" />
        Kitoblarni sudrab (drag &amp; drop) tartibini o'zgartiring, so'ng <strong>Tartibni saqlash</strong> ni bosing.
      </div>

      {/* Grid */}
      {ordered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Bu kategoriyada kitoblar yo'q</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {ordered.map((book, i) => (
            <div
              key={book.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragEnter={() => onDragEnter(i)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:shadow-lg active:scale-[1.02] select-none"
            >
              {/* Position badge */}
              <div className="absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded-full bg-black/50 text-white text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </div>

              {/* Drag handle */}
              <div className="absolute top-1.5 right-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-white drop-shadow" />
              </div>

              {/* Cover */}
              <div
                className="relative aspect-[2/3] flex items-center justify-center overflow-hidden"
                style={{ background: `hsl(${book.bg_color ?? "210 60% 15%"})` }}
              >
                {book.cover_url ? (
                  <img
                    src={`${getImageUrl(book.cover_url)}?t=1`}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="h-8 w-8 text-white/30" />
                )}

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    to="/admin"
                    state={{ editBookId: book.id }}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    title="Tahrirlash"
                  >
                    <Pencil className="h-4 w-4 text-white" />
                  </Link>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(book.id, book.cover_url, book.title); }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-red-500/60 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
                  {book.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{book.author}</p>
                <span className="inline-block mt-1 text-[9px] font-medium bg-primary/5 text-primary/80 rounded px-1.5 py-0.5">
                  {LIBRARY_FILTER_MAP[book.category as keyof typeof LIBRARY_FILTER_MAP] ?? book.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save bar — sticky bottom when dirty */}
      {isDirty && (
        <div className="sticky bottom-4 mt-6 flex justify-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all ${
              saved
                ? "bg-green-500 text-white"
                : "bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            }`}
          >
            {saved ? (
              <><Check className="h-4 w-4" /> Saqlandi</>
            ) : saving ? (
              <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Saqlanmoqda…</>
            ) : (
              <><Save className="h-4 w-4" /> Tartibni saqlash ({ordered.length} ta kitob)</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CuratedLibraryManager;
