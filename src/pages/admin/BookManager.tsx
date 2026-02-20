import { useState } from "react";
import { useData, Book } from "@/context/DataContext";
import { Plus, Pencil, Trash2, X, BookOpen } from "lucide-react";

const emptyBook: Omit<Book, "id"> = {
  title: "", author: "", coverUrl: "", description: "", price: 0,
  category: "Yangi Nashrlar", bgColor: "210 60% 15%", enable3DFlip: false, featured: false,
};

const BookManager = () => {
  const { books, addBook, updateBook, deleteBook } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Book, "id">>(emptyBook);

  const openAdd = () => { setEditId(null); setForm(emptyBook); setModalOpen(true); };
  const openEdit = (book: Book) => { setEditId(book.id); setForm(book); setModalOpen(true); };
  const handleSave = () => {
    if (editId) updateBook(editId, form);
    else addBook(form);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kitoblar</h1>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors">
          <Plus className="h-4 w-4" /> Yangi kitob
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nomi</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Muallif</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Kategoriya</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Narxi</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">3D Flip</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Featured</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-6 rounded flex items-center justify-center shrink-0" style={{ background: `hsl(${book.bgColor})` }}>
                        <BookOpen className="h-3 w-3 text-white/60" />
                      </div>
                      <span className="truncate max-w-[150px]">{book.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{book.author}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">{book.category}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{book.price.toLocaleString()} so'm</td>
                  <td className="px-4 py-3 hidden lg:table-cell">{book.enable3DFlip ? "✓" : "—"}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">{book.featured ? "⭐" : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => openEdit(book)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => deleteBook(book.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editId ? "Kitobni tahrirlash" : "Yangi kitob"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <Field label="Nomi" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <Field label="Muallif" value={form.author} onChange={(v) => setForm({ ...form, author: v })} />
              <Field label="Muqova URL" value={form.coverUrl} onChange={(v) => setForm({ ...form, coverUrl: v })} />
              <Field label="Tavsif" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
              <Field label="Narxi (so'm)" value={form.price.toString()} onChange={(v) => setForm({ ...form, price: Number(v) || 0 })} type="number" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Book["category"] })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none">
                  <option>Yangi Nashrlar</option>
                  <option>Tez Kunda</option>
                  <option>Oltin Kolleksiya</option>
                  <option>Bestseller</option>
                </select>
              </div>
              <Field label="Fon rangi (HSL)" value={form.bgColor} onChange={(v) => setForm({ ...form, bgColor: v })} placeholder="210 60% 15%" />
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.enable3DFlip} onChange={(e) => setForm({ ...form, enable3DFlip: e.target.checked })} className="rounded border-gray-300 text-amber-500 focus:ring-amber-200" />
                  3D Page-Flip
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-300 text-amber-500 focus:ring-amber-200" />
                  Hero karuselda ko'rsatish
                </label>
              </div>
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

const Field = ({ label, value, onChange, type = "text", textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean; placeholder?: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none resize-none" />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
    )}
  </div>
);

export default BookManager;
