import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
}

const AdminUsersManager = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchAdmins = async () => {
    setFetchLoading(true);
    setFetchError("");
    try {
      const { data, error } = await supabase.rpc("get_admin_users");
      if (error) throw error;
      setAdmins((data as AdminUser[]) || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Noma'lum xatolik";
      setFetchError(`Adminlarni yuklashda xatolik: ${msg}`);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleAdd = async () => {
    const email = newEmail.trim();
    if (!email) return;
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      // Step 1: look up user by email
      const { data: lookupData, error: lookupError } = await supabase.rpc("lookup_user_by_email", { p_email: email });
      if (lookupError) throw lookupError;

      const rows = lookupData as { found_user_id: string; found_email: string }[] | null;
      if (!rows || rows.length === 0) {
        setActionError("Foydalanuvchi topilmadi. Avval saytda ro'yxatdan o'tishi kerak.");
        return;
      }

      // Step 2: grant admin role
      const { error: addError } = await supabase.rpc("add_admin_user", { p_user_id: rows[0].found_user_id });
      if (addError) throw addError;

      setActionSuccess(`${email} admin sifatida qo'shildi!`);
      setNewEmail("");
      await fetchAdmins();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Noma'lum xatolik";
      setActionError(`Xatolik: ${msg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Bu adminni o'chirmoqchimisiz?")) return;
    try {
      const { error } = await supabase.rpc("remove_admin_user", { p_id: id });
      if (error) throw error;
      await fetchAdmins();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Noma'lum xatolik";
      setActionError(`O'chirishda xatolik: ${msg}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Admin Foydalanuvchilar</h1>
      </div>

      {/* Add Admin */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Yangi admin qo'shish uchun foydalanuvchi avval saytda ro'yxatdan o'tishi kerak.
        </p>

        {actionError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{actionError}</p>
          </div>
        )}
        {actionSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-3">
            <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
            <p className="text-sm text-green-700">{actionSuccess}</p>
          </div>
        )}

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
            disabled={actionLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {actionLoading ? "..." : "Qo'shish"}
          </button>
        </div>
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {fetchLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Yuklanmoqda...</span>
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center px-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <p className="text-sm text-red-600">{fetchError}</p>
            <button
              onClick={fetchAdmins}
              className="text-xs text-primary underline mt-1 hover:no-underline"
            >
              Qayta urinish
            </button>
          </div>
        ) : admins.length === 0 ? (
          <p className="text-sm text-muted-foreground/80 text-center py-8">
            Hozircha adminlar yo'q.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{admin.email}</p>
                    <p className="text-xs text-muted-foreground/80 font-mono">{admin.user_id.slice(0, 8)}...</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(admin.id)}
                  className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersManager;
