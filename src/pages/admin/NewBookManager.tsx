import { useState, useRef } from "react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import type { NewBook } from "@/types/database";
import { Plus, Pencil, Trash2, X, BookOpen, Monitor, Smartphone, ArrowUp, ArrowDown } from "lucide-react";
import ImageCropper from "@/components/admin/ImageCropper";

// ── helpers ───────────────────────────────────────────────────────────────────
// Local paths ("/upcoming/...") and full http(s) URLs pass through unchanged.
// Only bare storage-object paths (e.g. "books/abc.jpg") get the Supabase prefix.
const resolveImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) return url;
  return `${import.meta.env.VITE_SUPABASE_URL as string}/storage/v1/object/public/${url}`;
};

const bgColorOptions = [
  { label: "Ko'k (qorong'u)",  value: "210 60% 15%" },
  { label: "Yashil (qorong'u)", value: "120 40% 12%" },
  { label: "Qizil (qorong'u)",  value: "0 30% 14%"   },
  { label: "Sariq (qorong'u)",  value: "35 50% 13%"  },
  { label: "Binafsha",          value: "270 40% 14%"  },
  { label: "Zangori",           value: "180 30% 12%"  },
  { label: "Moviy (to'q)",      value: "220 50% 12%"  },
  { label: "Jigarrang",         value: "45 30% 12%"   },
];

// ── Dual focal-point picker ───────────────────────────────────────────────────
interface FocalPointPickerProps {
  imageUrl: string | null;
  x: number; y: number;
  onChange: (x: number, y: number) => void;
  aspectRatio: string;
  label: string;
  icon: React.ReactNode;
}

const FocalPointPicker = ({ imageUrl, x, y, onChange, aspectRatio, label, icon }: FocalPointPickerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onChange(
      Math.round(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))),
      Math.round(Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100))),
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
        {icon}
        <span>{label}</span>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {x}% · {y}%
        </span>
      </div>
      <div
        ref={ref}
        onClick={handleClick}
        className="relative overflow-hidden rounded-lg border border-gray-200 bg-muted cursor-crosshair select-none"
        style={{ aspectRatio }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            draggable={false}
            className="w-full h-full object-cover pointer-events-none"
            style={{ objectPosition: `${x}% ${y}%` }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs">
            Avval rasm yuklang
          </div>
        )}
        {imageUrl && (
          <>
            <div className="absolute left-0 right-0 h-px bg-white/60 pointer-events-none" style={{ top: `${y}%` }} />
            <div className="absolute top-0 bottom-0 w-px bg-white/60 pointer-events-none" style={{ left: `${x}%` }} />
            <div
              className="absolute w-5 h-5 rounded-full border-2 border-white bg-primary/80 shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
            <div
              className="absolute w-8 h-8 rounded-full border border-white/40 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          </>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground/60">Rasmga bosib diqqat markazini belgilang</p>
    </div>
  );
};

// ── Field helper ──────────────────────────────────────────────────────────────
const Field = ({
  label, value, onChange, textarea, placeholder,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  textarea?: boolean; placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-foreground/80 mb-1">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none resize-none"
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
      />
    )}
  </div>
);

// ── Empty form ────────────────────────────────────────────────────────────────
const emptyBook: Omit<NewBook, "id" | "created_at" | "updated_at"> = {
  title: "", title_en: null, title_ru: null,
  author: "", author_en: null, author_ru: null,
  description: null, description_en: null, description_ru: null,
  cover_url: null, bg_color: "210 60% 15%",
  category: "soon", price: null,
  enable_3d_flip: false, featured: false, sort_order: 0,
  img_focus_x: 50, img_focus_y: 20,
  focus_desktop_x: 50, focus_desktop_y: 50,
  focus_mobile_x: 50, focus_mobile_y: 50,
};

// ── Component ─────────────────────────────────────────────────────────────────
const NewBookManager = () => {
  const { newBooks, addNewBook, updateNewBook, deleteNewBook, refreshNewBooks } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<NewBook, "id" | "created_at" | "updated_at">>(emptyBook);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState<string | null>(null);

  const reorder = async (book: NewBook, direction: "up" | "down") => {
    const sorted = [...newBooks].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    const idx = sorted.findIndex((b) => b.id === book.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swapBook = sorted[swapIdx];
    setReordering(book.id);
    try {
      await Promise.all([
        updateNewBook(book.id, { sort_order: swapBook.sort_order ?? 0 }),
        updateNewBook(swapBook.id, { sort_order: book.sort_order ?? 0 }),
      ]);
      await refreshNewBooks();
    } catch (err: any) {
      toast.error("Tartiblashda xatolik: " + err.message);
    } finally {
      setReordering(null);
    }
  };

  const nextOrder = newBooks.length > 0
    ? Math.max(...newBooks.map((b) => b.sort_order ?? 0)) + 1
    : 1;

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyBook, sort_order: nextOrder });
    setModalOpen(true);
  };

  const openEdit = (book: NewBook) => {
    setEditId(book.id);
    const { id: _id, created_at: _c, updated_at: _u, ...rest } = book;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editId) await updateNewBook(editId, form);
      else await addNewBook(form);
      setModalOpen(false);
      toast.success(editId ? "Yangilandi!" : "Qo'shildi!");
      // Belt-and-suspenders: force a fresh fetch even if realtime fires late
      await refreshNewBooks();
    } catch (err: any) {
      // toast.error is non-blocking; alert() freezes the JS thread and delays
      // the finally block, making the UI appear locked.
      toast.error("Saqlashda xatolik: " + err.message);
      console.error("[NewBookManager] handleSave:", err);
    } finally {
      setSaving(false);
    }
  };

  const coverUrl = form.cover_url ? resolveImageUrl(form.cover_url) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Yangi Nashrlar</h1>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Yangi kitob
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-foreground/70">Muqova</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground/70">Nomi</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground/70 hidden sm:table-cell">Muallif</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground/70 hidden md:table-cell">Tartib</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground/70 hidden md:table-cell">Saralash</th>
                <th className="text-right px-4 py-3 font-semibold text-foreground/70">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {newBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {book.cover_url ? (
                      <img
                        src={resolveImageUrl(book.cover_url)}
                        alt={book.title}
                        className="h-12 w-8 rounded object-cover"
                        style={{
                          objectPosition: `${book.focus_desktop_x ?? 50}% ${book.focus_desktop_y ?? 50}%`,
                        }}
                      />
                    ) : (
                      <div
                        className="h-12 w-8 rounded flex items-center justify-center"
                        style={{ background: `hsl(${book.bg_color ?? "210 60% 15%"})` }}
                      >
                        <BookOpen className="h-3 w-3 text-white/60" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    <span className="truncate max-w-[150px] block">{book.title}</span>
                    <span className="text-xs text-muted-foreground/80 sm:hidden">{book.author}</span>
                  </td>
                  <td className="px-4 py-3 text-foreground/70 hidden sm:table-cell">{book.author}</td>
                  <td className="px-4 py-3 text-foreground/70 hidden md:table-cell">{book.sort_order ?? 0}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => reorder(book, "up")}
                        disabled={!!reordering}
                        className="p-0.5 rounded text-muted-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
                        title="Yuqoriga"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => reorder(book, "down")}
                        disabled={!!reordering}
                        className="p-0.5 rounded text-muted-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
                        title="Pastga"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => openEdit(book)}
                        className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
                            try { await deleteNewBook(book.id, book.cover_url); }
                            catch (err: any) { toast.error("O'chirishda xatolik: " + err.message); }
                          }
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {newBooks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Hozircha yangi nashrlar yo'q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-foreground">
                {editId ? "Kitobni tahrirlash" : "Yangi kitob qo'shish"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5 text-muted-foreground/80" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Cover upload */}
              <ImageCropper
                currentUrl={form.cover_url ?? ""}
                onImageSaved={(url) => setForm({ ...form, cover_url: url })}
                aspectRatio={2 / 3}
                label="Muqova rasmi (2:3)"
                bucket="books"
              />

              {/* Dual focal-point editors */}
              <div>
                <p className="text-sm font-semibold text-foreground/80 mb-3">
                  Diqqat markazi — qurilmaga qarab kadr sozlash
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FocalPointPicker
                    imageUrl={coverUrl}
                    x={form.focus_desktop_x ?? 50}
                    y={form.focus_desktop_y ?? 50}
                    onChange={(x, y) => setForm({ ...form, focus_desktop_x: x, focus_desktop_y: y })}
                    aspectRatio="16/9"
                    label="Noutbuk / Desktop (16:9)"
                    icon={<Monitor className="h-3.5 w-3.5 text-primary" />}
                  />
                  <FocalPointPicker
                    imageUrl={coverUrl}
                    x={form.focus_mobile_x ?? 50}
                    y={form.focus_mobile_y ?? 50}
                    onChange={(x, y) => setForm({ ...form, focus_mobile_x: x, focus_mobile_y: y })}
                    aspectRatio="3/4"
                    label="Telefon / Mobile (3:4)"
                    icon={<Smartphone className="h-3.5 w-3.5 text-primary" />}
                  />
                </div>
              </div>

              {/* Text fields */}
              <Field label="Nomi (UZ)" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <Field label="Nomi (EN)" value={form.title_en ?? ""} onChange={(v) => setForm({ ...form, title_en: v || null })} />
              <Field label="Nomi (RU)" value={form.title_ru ?? ""} onChange={(v) => setForm({ ...form, title_ru: v || null })} />
              <Field label="Muallif (UZ)" value={form.author} onChange={(v) => setForm({ ...form, author: v })} />
              <Field label="Muallif (EN)" value={form.author_en ?? ""} onChange={(v) => setForm({ ...form, author_en: v || null })} />
              <Field label="Muallif (RU)" value={form.author_ru ?? ""} onChange={(v) => setForm({ ...form, author_ru: v || null })} />
              <Field label="Tavsif (UZ)" value={form.description ?? ""} onChange={(v) => setForm({ ...form, description: v || null })} textarea />
              <Field label="Tavsif (EN)" value={form.description_en ?? ""} onChange={(v) => setForm({ ...form, description_en: v || null })} textarea />
              <Field label="Tavsif (RU)" value={form.description_ru ?? ""} onChange={(v) => setForm({ ...form, description_ru: v || null })} textarea />

              {/* BG color */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Fon rangi</label>
                <select
                  value={form.bg_color ?? "210 60% 15%"}
                  onChange={(e) => setForm({ ...form, bg_color: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none bg-white"
                >
                  {bgColorOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort order */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Tartib raqami</label>
                <input
                  type="number"
                  value={form.sort_order ?? 0}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-lg transition-colors"
              >
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewBookManager;
