import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, ShieldCheck } from "lucide-react";

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
}

const AdminUsersManager = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAdmins = async () => {
    const { data } = await supabase.from("user_roles").select("id, user_id, role").eq("role", "admin");
    if (!data) return;

    // Get emails for each admin from auth metadata
    const adminList: AdminUser[] = [];
    for (const role of data) {
      // We'll show user_id as fallback since we can't query auth.users from client
      adminList.push({ id: role.id, user_id: role.user_id, email: role.user_id });
    }
    setAdmins(adminList);
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleAdd = async () => {
    if (!newEmail.trim()) return;
    setLoading(true);
    setError("");

    try {
      // Look up user by email via edge function or direct query
      // Since we can't query auth.users from client, we need the user to sign up first
      // For now, we'll ask for user_id directly or use a workaround
      setError("Foydalanuvchi avval ro'yxatdan o'tishi kerak. Keyin user ID orqali qo'shiladi.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Bu adminni o'chirmoqchimisiz?")) return;
    await supabase.from("user_roles").delete().eq("id", id);
    await fetchAdmins();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Foydalanuvchilar</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <p className="text-sm text-gray-500 mb-4">
          Yangi admin qo'shish uchun foydalanuvchi avval saytda ro'yxatdan o'tishi kerak. Keyin email yoki ID orqali admin roli beriladi.
        </p>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="flex gap-2">
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Foydalanuvchi email..."
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-4 w-4" /> Qo'shish
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-400 font-mono">{admin.user_id.slice(0, 8)}...</p>
                </div>
              </div>
              <button onClick={() => handleRemove(admin.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {admins.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Adminlar topilmadi</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersManager;
