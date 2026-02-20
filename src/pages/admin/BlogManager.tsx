import { useState } from "react";
import { useData, Article } from "@/context/DataContext";
import { Plus, Pencil, Trash2, X, Eye, EyeOff, CalendarDays } from "lucide-react";

const emptyArticle: Omit<Article, "id"> = {
  title: "", excerpt: "", content: "", date: new Date().toISOString().slice(0, 10), published: false,
};

const BlogManager = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Article, "id">>(emptyArticle);

  const openAdd = () => { setEditId(null); setForm(emptyArticle); setModalOpen(true); };
  const openEdit = (a: Article) => { setEditId(a.id); setForm(a); setModalOpen(true); };
  const handleSave = () => {
    if (editId) updateArticle(editId, form);
    else addArticle(form);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Maqolalari</h1>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors">
          <Plus className="h-4 w-4" /> Yangi maqola
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">{a.title}</h3>
              <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${a.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {a.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {a.published ? "Nashr" : "Qoralama"}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{a.excerpt}</p>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1 text-xs text-gray-400"><CalendarDays className="h-3 w-3" />{a.date}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => deleteArticle(a.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editId ? "Maqolani tahrirlash" : "Yangi maqola"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sarlavha</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qisqacha</label>
                <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sana</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matn (Rich Text Placeholder)</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                    {["B", "I", "U", "H1", "H2", "Link", "Img"].map((btn) => (
                      <button key={btn} className="px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-200 rounded transition-colors">{btn}</button>
                    ))}
                  </div>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} placeholder="Maqola matnini yozing..." className="w-full px-3 py-3 text-sm outline-none resize-none" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-300 text-amber-500 focus:ring-amber-200" />
                Nashr qilish
              </label>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Bekor qilish</button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors">Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
