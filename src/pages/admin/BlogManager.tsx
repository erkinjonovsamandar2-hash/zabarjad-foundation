import { useState, useRef } from "react";
import { toast } from "sonner";
import { useData, Article } from "@/context/DataContext";
import { Plus, Pencil, Trash2, X, Eye, EyeOff, CalendarDays, Monitor, Smartphone, Copy, Link2 } from "lucide-react";
import ImageCropper from "@/components/admin/ImageCropper";
import { slugify, postPath } from "@/lib/blog";

// ── Focal point picker ────────────────────────────────────────────────────────
interface FocalPointPickerProps {
  imageUrl: string | null;
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
  aspectRatio: string;   // CSS aspect-ratio value e.g. "16/9"
  label: string;
  icon: React.ReactNode;
}

const FocalPointPicker = ({ imageUrl, x, y, onChange, aspectRatio, label, icon }: FocalPointPickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointer = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = Math.round(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
    const py = Math.round(Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)));
    onChange(px, py);
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
        ref={containerRef}
        onClick={handlePointer}
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
            {/* Horizontal crosshair line */}
            <div
              className="absolute left-0 right-0 h-px bg-white/60 pointer-events-none"
              style={{ top: `${y}%` }}
            />
            {/* Vertical crosshair line */}
            <div
              className="absolute top-0 bottom-0 w-px bg-white/60 pointer-events-none"
              style={{ left: `${x}%` }}
            />
            {/* Focal dot */}
            <div
              className="absolute w-5 h-5 rounded-full border-2 border-white bg-primary/80 shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
            {/* Outer ring for visibility */}
            <div
              className="absolute w-8 h-8 rounded-full border border-white/40 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          </>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground/60">
        Rasmga bosib diqqat markazini belgilang
      </p>
    </div>
  );
};

// ── Empty form ────────────────────────────────────────────────────────────────
const emptyArticle: Omit<Article, "id"> = {
  slug: null,
  title: "", title_en: null, title_ru: null,
  excerpt: "", excerpt_en: null, excerpt_ru: null,
  content: "", content_en: null, content_ru: null,
  image_url: "",
  published_at: new Date().toISOString().slice(0, 10),
  published: false,
  category: null,
  reading_time: null,
  focus_desktop_x: 50,
  focus_desktop_y: 50,
  focus_mobile_x: 50,
  focus_mobile_y: 50,
  author_name: null,
  author_photo: null,
  author_link: null,
  created_at: "",
  updated_at: "",
};

// ── Main component ────────────────────────────────────────────────────────────
const BlogManager = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Article, "id">>({ ...emptyArticle });
  const [saving, setSaving] = useState(false);
  const [langTab, setLangTab] = useState<"uz" | "en" | "ru">("uz");

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyArticle });
    setLangTab("uz");
    setModalOpen(true);
  };

  const openEdit = (a: Article) => {
    setLangTab("uz");
    setEditId(a.id);
    setForm({
      slug: a.slug ?? null,
      title: a.title, title_en: a.title_en, title_ru: a.title_ru,
      excerpt: a.excerpt, excerpt_en: a.excerpt_en, excerpt_ru: a.excerpt_ru,
      content: a.content, content_en: a.content_en, content_ru: a.content_ru,
      image_url: a.image_url,
      published_at: a.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      published: a.published,
      category: a.category ?? null,
      reading_time: a.reading_time ?? null,
      focus_desktop_x: a.focus_desktop_x ?? 50,
      focus_desktop_y: a.focus_desktop_y ?? 50,
      focus_mobile_x: a.focus_mobile_x ?? 50,
      focus_mobile_y: a.focus_mobile_y ?? 50,
      author_name: a.author_name ?? null,
      author_photo: a.author_photo ?? null,
      author_link: a.author_link ?? null,
      created_at: a.created_at,
      updated_at: a.updated_at,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Sarlavha majburiy!");
      return;
    }
    const payload = {
      ...form,
      slug: form.slug?.trim() || null,
      image_url: form.image_url?.trim() || null,
      author_name: form.author_name?.trim() || null,
      author_link: form.author_link?.trim() || null,
      author_photo: form.author_photo?.trim() || null,
    };
    setSaving(true);
    try {
      if (editId) await updateArticle(editId, payload);
      else await addArticle(payload);
      setModalOpen(false);
      toast.success(editId ? "Maqola yangilandi!" : "Maqola qo'shildi!");
    } catch (err: any) {
      toast.error("Saqlashda xatolik: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickTogglePublish = async (a: Article) => {
    try {
      await updateArticle(a.id, { published: !a.published });
      toast.success(a.published ? "Qoralamaga o'tkazildi" : "Nashr qilindi!");
    } catch (err: any) {
      toast.error("Xatolik: " + err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Blog Maqolalari</h1>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Yangi maqola
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
            {a.image_url && (
              <img
                src={a.image_url}
                alt={a.title}
                className="w-full h-32 object-cover"
                style={{ objectPosition: `${a.focus_desktop_x ?? 50}% ${a.focus_desktop_y ?? 50}%` }}
              />
            )}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground text-sm leading-snug">{a.title}</h3>
                <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${a.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-muted-foreground"}`}>
                  {a.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {a.published ? "Nashr" : "Qoralama"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{a.excerpt}</p>
              {/* Slug URL row */}
              <div className="flex items-center gap-1.5 bg-gray-50 rounded-md px-2 py-1.5 border border-gray-100">
                <Link2 className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                <span className="font-mono text-[10px] text-muted-foreground truncate flex-1">
                  /blog/{a.slug || a.id}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`https://www.booktopia.uz/blog/${a.slug || a.id}`);
                    toast.success("Havola nusxalandi!");
                  }}
                  title="Havolani nusxalash"
                  className="shrink-0 p-0.5 rounded hover:bg-gray-200 transition-colors"
                >
                  <Copy className="h-3 w-3 text-muted-foreground/60" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                <span className="flex items-center gap-1 text-xs text-muted-foreground/80">
                  <CalendarDays className="h-3 w-3" />{a.published_at?.slice(0, 10)}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleQuickTogglePublish(a)}
                    title={a.published ? "Qoralamaga o'tkazish" : "Nashr qilish"}
                    className={`p-1.5 rounded-lg transition-colors ${a.published ? "text-green-600 hover:bg-green-50" : "text-muted-foreground/80 hover:text-green-600 hover:bg-green-50"}`}
                  >
                    {a.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => openEdit(a)}
                    className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm("Haqiqatan ham bu maqolani o'chirmoqchimisiz?")) {
                        try { await deleteArticle(a.id, a.image_url); toast.success("Maqola o'chirildi"); }
                        catch (err: any) { toast.error("O'chirishda xatolik: " + err.message); }
                      }
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-foreground">
                {editId ? "Maqolani tahrirlash" : "Yangi maqola"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5 text-muted-foreground/80" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Cover image */}
              <ImageCropper
                currentUrl={form.image_url}
                onImageSaved={(url) => setForm({ ...form, image_url: url })}
                aspectRatio={16 / 9}
                label="Muqova rasmi (16:9)"
                bucket="books"
              />

              {/* ── Dual focal-point editors ── */}
              <div>
                <p className="text-sm font-semibold text-foreground/80 mb-3">
                  Diqqat markazi — qurilmaga qarab kadr sozlash
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FocalPointPicker
                    imageUrl={form.image_url ?? null}
                    x={form.focus_desktop_x ?? 50}
                    y={form.focus_desktop_y ?? 50}
                    onChange={(x, y) => setForm({ ...form, focus_desktop_x: x, focus_desktop_y: y })}
                    aspectRatio="16/9"
                    label="Noutbuk / Desktop (16:9)"
                    icon={<Monitor className="h-3.5 w-3.5 text-primary" />}
                  />
                  <FocalPointPicker
                    imageUrl={form.image_url ?? null}
                    x={form.focus_mobile_x ?? 50}
                    y={form.focus_mobile_y ?? 50}
                    onChange={(x, y) => setForm({ ...form, focus_mobile_x: x, focus_mobile_y: y })}
                    aspectRatio="3/4"
                    label="Telefon / Mobile (3:4)"
                    icon={<Smartphone className="h-3.5 w-3.5 text-primary" />}
                  />
                </div>
              </div>

              {/* Language tabs */}
              <div>
                <div className="flex gap-1 mb-4 border-b border-gray-100">
                  {(["uz", "en", "ru"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLangTab(lang)}
                      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${langTab === lang ? "bg-primary/5 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {lang === "uz" ? "O'zbekcha" : lang === "en" ? "English" : "Русский"}
                    </button>
                  ))}
                </div>

                {/* UZ */}
                {langTab === "uz" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Sarlavha <span className="text-red-500">*</span></label>
                      <input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Qisqacha tavsif</label>
                      <input
                        value={form.excerpt ?? ""}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Matn</label>
                      <textarea
                        value={form.content ?? ""}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        rows={10}
                        placeholder="Maqola matnini yozing..."
                        className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* EN */}
                {langTab === "en" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Title</label>
                      <input
                        value={form.title_en ?? ""}
                        onChange={(e) => setForm({ ...form, title_en: e.target.value || null })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Excerpt</label>
                      <input
                        value={form.excerpt_en ?? ""}
                        onChange={(e) => setForm({ ...form, excerpt_en: e.target.value || null })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Content</label>
                      <textarea
                        value={form.content_en ?? ""}
                        onChange={(e) => setForm({ ...form, content_en: e.target.value || null })}
                        rows={10}
                        placeholder="Article content..."
                        className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* RU */}
                {langTab === "ru" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Заголовок</label>
                      <input
                        value={form.title_ru ?? ""}
                        onChange={(e) => setForm({ ...form, title_ru: e.target.value || null })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Краткое описание</label>
                      <input
                        value={form.excerpt_ru ?? ""}
                        onChange={(e) => setForm({ ...form, excerpt_ru: e.target.value || null })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Текст статьи</label>
                      <textarea
                        value={form.content_ru ?? ""}
                        onChange={(e) => setForm({ ...form, content_ru: e.target.value || null })}
                        rows={10}
                        placeholder="Текст статьи..."
                        className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  URL slug <span className="text-muted-foreground font-normal text-xs">(masalan: mening-kitobim-haqida)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    value={form.slug ?? ""}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || null })}
                    placeholder="avto-to'ldiriladi"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, slug: slugify(form.title) || null })}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors whitespace-nowrap"
                  >
                    Sarlavhadan
                  </button>
                </div>
                {form.slug && (
                  <p className="mt-1 text-[11px] text-muted-foreground font-mono">
                    /blog/{form.slug}
                  </p>
                )}
              </div>

              {/* Author */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground/80">Muallif (ixtiyoriy)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground/60 mb-1">To'liq ism</label>
                    <input
                      value={form.author_name ?? ""}
                      onChange={(e) => setForm({ ...form, author_name: e.target.value || null })}
                      placeholder="Kamola Yusupova"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground/60 mb-1">Havola (URL, ixtiyoriy)</label>
                    <input
                      value={form.author_link ?? ""}
                      onChange={(e) => setForm({ ...form, author_link: e.target.value || null })}
                      placeholder="https://instagram.com/..."
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/60 mb-2">Muallif rasmi (doira, ixtiyoriy)</label>
                  <ImageCropper
                    currentUrl={form.author_photo}
                    onImageSaved={(url) => setForm({ ...form, author_photo: url })}
                    aspectRatio={1}
                    label=""
                    bucket="books"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Kategoriya</label>
                <select
                  value={form.category ?? ""}
                  onChange={(e) => setForm({ ...form, category: e.target.value || null })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none bg-white"
                >
                  <option value="">— Tanlang —</option>
                  <option value="Tahlil">Tahlil</option>
                  <option value="Adabiy tahlil">Adabiy tahlil</option>
                  <option value="O'qish madaniyati">O'qish madaniyati</option>
                  <option value="Muallif haqida">Muallif haqida</option>
                  <option value="Yangiliklar">Yangiliklar</option>
                  <option value="Maqolalar">Maqolalar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">O'qish vaqti (masalan: 7 daqiqa)</label>
                <input
                  value={form.reading_time ?? ""}
                  onChange={(e) => setForm({ ...form, reading_time: e.target.value || null })}
                  placeholder="8 daqiqa"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Sana</label>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published ?? false}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded border-gray-300 text-accent focus:ring-amber-200"
                />
                Nashr qilish
              </label>
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

export default BlogManager;
