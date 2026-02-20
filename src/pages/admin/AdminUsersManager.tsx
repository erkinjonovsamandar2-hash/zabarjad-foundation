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
  const [success, setSuccess] = useState("");

  const callEdge = async (body: Record<string, string>) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await supabase.functions.invoke("admin-users", {
      body,
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    return res;
  };

  const fetchAdmins = async () => {
    const { data } = await callEdge({ action: "list_admins" });
    if (data && Array.isArray(data)) setAdmins(data);
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleAdd = async () => {
    if (!newEmail.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");

    // Step 1: lookup user by email
    const { data: lookupData, error: lookupError } = await callEdge({ action: "lookup", email: newEmail.trim() });
    if (lookupError || !lookupData?.user_id) {
      setError(lookupData?.error || "Foydalanuvchi topilmadi. Avval ro'yxatdan o'tishi kerak.");
      setLoading(false);
      return;
    }

    // Step 2: add admin role
    const { data: addData } = await callEdge({ action: "add_admin", user_id: lookupData.user_id });
    if (addData?.error) {
      setError(addData.error);
    } else {
      setSuccess(`${newEmail} admin sifatida qo'shildi!`);
      setNewEmail("");
      await fetchAdmins();
    }
    setLoading(false);
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
          Yangi admin qo'shish uchun foydalanuvchi avval saytda ro'yxatdan o'tishi kerak. Keyin emailini kiriting.
        </p>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

        <div className="flex gap-2">
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Foydalanuvchi email..."
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-4 w-4" /> {loading ? "..." : "Qo'shish"}
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
                  <p className="text-sm font-medium text-gray-900">{admin.email}</p>
                  <p className="text-xs text-gray-400 font-mono">{admin.user_id.slice(0, 8)}...</p>
                </div>
              </div>
              <button onClick={() => handleRemove(admin.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {admins.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Yuklanmoqda...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersManager;
