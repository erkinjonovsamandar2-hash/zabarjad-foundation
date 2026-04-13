import { useState } from "react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import type { TeamMember, AuthorSpotlightItem } from "@/context/DataContext";
import { Plus, Pencil, Trash2, X, Users, UserCheck, Eye, ArrowUp, ArrowDown } from "lucide-react";
import ImageCropper from "@/components/admin/ImageCropper";

// ── Role accent lookup (mirror of TeamPage) ────────────────────────────────────
const ROLE_ACCENT: Record<string, string> = {
    "Muharrir": "#c8973a", "Musahhih": "#c8973a",
    "Badiiy muharrir": "#4a9ab5", "Muqova Dizayneri": "#b5724a",
    "Sahifalovchi": "#4ab580", "Tarjimon": "#8b6ab5",
};
const getRoleAccent = (role: string) => ROLE_ACCENT[role] ?? "#c8973a";

// ── Admin preview: card (portrait) ────────────────────────────────────────────
const DefaultCardPreview = ({ name, role }: { name: string; role: string }) => {
    const accent = getRoleAccent(role);
    const bg = "#f5efe2";
    const initial = (name || "?").charAt(0).toUpperCase();
    return (
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
                <Eye className="h-3.5 w-3.5 text-amber-600/70" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700/70">
                    Rasm yuklanmasa shu ko'rinishda bo'ladi
                </span>
            </div>
            {/* Mini card preview */}
            <div className="relative overflow-hidden mx-auto" style={{ width: 80, height: 107, background: bg }}>
                {/* Diagonal stripe */}
                <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(-45deg, ${accent}16 0px, ${accent}16 1px, transparent 1px, transparent 14px)` }} />
                {/* Radial halo */}
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 70% at 50% 40%, ${accent}28 0%, transparent 70%)` }} />
                {/* Dot grid */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle, ${accent} 1px, transparent 1px)`, backgroundSize: "12px 12px" }} />
                {/* Rings + initial */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: "18%" }}>
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-14 h-14 rounded-full" style={{ border: `1px solid ${accent}30` }} />
                        <div className="absolute w-9 h-9 rounded-full" style={{ border: `1px solid ${accent}50` }} />
                        <div style={{
                            fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: "1.7rem", lineHeight: 1,
                            background: `linear-gradient(135deg, ${accent} 0%, ${accent}aa 60%, ${accent}55 100%)`,
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            filter: `drop-shadow(0 0 8px ${accent}60)`,
                        }}>{initial}</div>
                    </div>
                </div>
                {/* Bottom gradient + text */}
                <div className="absolute inset-x-0 bottom-0 h-[42%]" style={{ background: "linear-gradient(to top, rgba(18,12,4,0.8) 0%, rgba(18,12,4,0.4) 50%, transparent 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-1.5">
                    <div className="h-px mb-1" style={{ width: 10, background: "hsl(45 66% 62%)" }} />
                    <p className="text-[5px] font-bold uppercase tracking-[0.2em] text-white/60 mb-0.5">{role || "Lavozim"}</p>
                    <p className="text-[6px] font-bold leading-tight text-white/85">{name || "Ism"}</p>
                </div>
                {/* Inset border */}
                <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 0 1px ${accent}25` }} />
            </div>
        </div>
    );
};

// ── Admin preview: circle (marquee) ────────────────────────────────────────────
const DefaultCirclePreview = ({ name, role }: { name: string; role: "MUALLIF" | "TARJIMON" }) => {
    const isAuthor = role === "MUALLIF";
    const [from, to] = isAuthor ? ["hsl(35 70% 28%)", "hsl(45 80% 48%)"] : ["hsl(230 50% 28%)", "hsl(250 60% 52%)"];
    const ringColor = isAuthor ? "rgba(255,220,120,0.35)" : "rgba(160,160,255,0.35)";
    const initial = (name || "?").charAt(0).toUpperCase();
    return (
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
                <Eye className="h-3.5 w-3.5 text-amber-600/70" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700/70">
                    Rasm yuklanmasa shu ko'rinishda bo'ladi
                </span>
            </div>
            <div className="flex items-center gap-3">
                {/* Mini circle */}
                <div className="relative flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{ width: 52, height: 52, background: `radial-gradient(circle at 38% 35%, ${from}, ${to})`, boxShadow: `0 4px 14px rgba(0,0,0,0.18), inset 0 0 0 1.5px ${ringColor}` }}>
                    <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 40% 30%, rgba(255,255,255,0.18) 0%, transparent 65%)" }} />
                    <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: "1.3rem", color: "rgba(255,255,255,0.92)", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{initial}</span>
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">{name || "Ism Familiya"}</p>
                    <span className={`text-[9px] font-bold uppercase tracking-[0.18em] ${isAuthor ? "text-primary" : "text-amber-600"}`}>{role}</span>
                </div>
            </div>
        </div>
    );
};

// ── Shared Field component ─────────────────────────────────────────────────────
const Field = ({
    label, value, onChange, type = "text", placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
}) => (
    <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
        />
    </div>
);

// ── accent helper (delegates to top-level getRoleAccent) ──────────────────────
const accent = (role: string) => getRoleAccent(role);

// ─────────────────────────────────────────────────────────────────────────────
// ── Tab 1: Jamoa ──────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const emptyMember: Omit<TeamMember, "id" | "created_at"> = {
    name: "",
    role: "",
    image_url: null,
    is_founder: false,
    sort_order: 0,
};

function JamoaTab() {
    const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useData();
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<Omit<TeamMember, "id" | "created_at">>(emptyMember);
    const [saving, setSaving] = useState(false);

    const nextSort = teamMembers.length > 0
        ? Math.max(...teamMembers.map((m) => m.sort_order)) + 1
        : 1;

    const openAdd = () => {
        setEditId(null);
        setForm({ ...emptyMember, sort_order: nextSort });
        setModalOpen(true);
    };

    const openEdit = (m: TeamMember) => {
        setEditId(m.id);
        const { id: _id, created_at: _c, ...rest } = m;
        setForm(rest);
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.role.trim()) {
            toast.error("Ism va lavozim majburiy!");
            return;
        }
        setSaving(true);
        try {
            if (editId) {
                await updateTeamMember(editId, form);
                toast.success("A'zo yangilandi!");
            } else {
                await addTeamMember(form);
                toast.success("A'zo qo'shildi!");
            }
            setModalOpen(false);
        } catch (err: any) {
            toast.error("Xatolik: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (m: TeamMember) => {
        if (!window.confirm(`"${m.name}" ni o'chirmoqchimisiz?`)) return;
        try {
            await deleteTeamMember(m.id);
            toast.success("O'chirildi.");
        } catch (err: any) {
            toast.error("Xatolik: " + err.message);
        }
    };

    const handleMove = async (m: TeamMember, direction: "up" | "down") => {
        const currentIndex = teamMembers.findIndex(x => x.id === m.id);
        if (direction === "up" && currentIndex === 0) return;
        if (direction === "down" && currentIndex === teamMembers.length - 1) return;

        const newArray = [...teamMembers];
        const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        // Swap elements based on visual display
        [newArray[currentIndex], newArray[targetIndex]] = [newArray[targetIndex], newArray[currentIndex]];

        // Sequentially assign the new correct order 1,2,3..
        const promises = newArray.map((item, index) => {
            const newSortOrder = index + 1;
            if (item.sort_order !== newSortOrder) {
                return updateTeamMember(item.id, { sort_order: newSortOrder });
            }
            return Promise.resolve();
        });

        toast.promise(Promise.all(promises), {
            loading: "Tartib o'zgartirilmoqda...",
            success: "Tartib saqlandi",
            error: (err: any) => `Xatolik: ${err.message}`
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">Jamoa sahifasida ko'rinadigan barcha a'zolar</p>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Yangi a'zo
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-foreground/70">Rasm</th>
                                <th className="text-left px-4 py-3 font-semibold text-foreground/70">Ism</th>
                                <th className="text-left px-4 py-3 font-semibold text-foreground/70 hidden sm:table-cell">Lavozim</th>
                                <th className="text-left px-4 py-3 font-semibold text-foreground/70 hidden md:table-cell">Tartib</th>
                                <th className="text-left px-4 py-3 font-semibold text-foreground/70 hidden md:table-cell">Holat</th>
                                <th className="text-right px-4 py-3 font-semibold text-foreground/70">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {teamMembers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">
                                        Hozircha a'zo yo'q. Yangi a'zo qo'shing.
                                    </td>
                                </tr>
                            )}
                            {teamMembers.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        {m.image_url ? (
                                            <img src={m.image_url} alt={m.name} className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                style={{ background: accent(m.role) }}>
                                                {m.name.charAt(0)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        <span className="truncate max-w-[140px] block">{m.name}</span>
                                        <span className="text-xs text-muted-foreground/80 sm:hidden">{m.role}</span>
                                    </td>
                                    <td className="px-4 py-3 text-foreground/70 hidden sm:table-cell">{m.role}</td>
                                    <td className="px-4 py-3 text-foreground/60 hidden md:table-cell font-mono text-xs">{m.sort_order}</td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        {m.is_founder && (
                                            <span className="inline-block rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                                                Asoschisi
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                onClick={() => handleMove(m, "up")}
                                                disabled={teamMembers.findIndex(x => x.id === m.id) === 0}
                                                className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-30"
                                                title="Yuqoriga"
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleMove(m, "down")}
                                                disabled={teamMembers.findIndex(x => x.id === m.id) === teamMembers.length - 1}
                                                className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-30"
                                                title="Pastga"
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </button>
                                            <span className="w-px h-4 bg-gray-200 mx-1"></span>
                                            <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(m)} className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Modal ─────────────────────────────────────────────────────────────── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-foreground">
                                {editId ? "A'zoni tahrirlash" : "Yangi a'zo"}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                                <X className="h-5 w-5 text-muted-foreground/80" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <ImageCropper
                                currentUrl={form.image_url ?? ""}
                                onImageSaved={(url) => setForm({ ...form, image_url: url || null })}
                                aspectRatio={1}
                                label="Profil rasmi (1:1)"
                                bucket="books"
                            />
                            {/* Show default design preview when no image is uploaded */}
                            {!form.image_url && (
                                <DefaultCardPreview name={form.name} role={form.role} />
                            )}
                            <Field label="Ism Familiya" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                            <Field label="Lavozim" value={form.role} onChange={(v) => setForm({ ...form, role: v })} placeholder="Muharrir, Musahhih..." />

                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-1">Tartib raqami</label>
                                <input
                                    type="number"
                                    value={form.sort_order}
                                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                                />
                            </div>

                            <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_founder}
                                    onChange={(e) => setForm({ ...form, is_founder: e.target.checked })}
                                    className="rounded border-gray-300 text-accent focus:ring-amber-200"
                                />
                                Asoschisi (katta karta sifatida ko'rsatiladi)
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-gray-100 rounded-lg transition-colors">
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
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Tab 2: Mualliflar va Tarjimonlar ─────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const emptyAuthor: Omit<AuthorSpotlightItem, "id" | "created_at"> = {
    name: "",
    role: "MUALLIF",
    image_url: null,
    sort_order: 0,
};

function AuthorsTab() {
    const { authorSpotlights, addAuthorSpotlight, updateAuthorSpotlight, deleteAuthorSpotlight } = useData();
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<Omit<AuthorSpotlightItem, "id" | "created_at">>(emptyAuthor);
    const [saving, setSaving] = useState(false);

    const nextSort = authorSpotlights.length > 0
        ? Math.max(...authorSpotlights.map((a) => a.sort_order)) + 1
        : 1;

    const openAdd = () => {
        setEditId(null);
        setForm({ ...emptyAuthor, sort_order: nextSort });
        setModalOpen(true);
    };

    const openEdit = (a: AuthorSpotlightItem) => {
        setEditId(a.id);
        const { id: _id, created_at: _c, ...rest } = a;
        setForm(rest);
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            toast.error("Ism majburiy!");
            return;
        }
        setSaving(true);
        try {
            if (editId) {
                await updateAuthorSpotlight(editId, form);
                toast.success("Yangilandi!");
            } else {
                await addAuthorSpotlight(form);
                toast.success("Qo'shildi!");
            }
            setModalOpen(false);
        } catch (err: any) {
            toast.error("Xatolik: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (a: AuthorSpotlightItem) => {
        if (!window.confirm(`"${a.name}" ni o'chirmoqchimisiz?`)) return;
        try {
            await deleteAuthorSpotlight(a.id);
            toast.success("O'chirildi.");
        } catch (err: any) {
            toast.error("Xatolik: " + err.message);
        }
    };

    const handleMove = async (a: AuthorSpotlightItem, direction: "up" | "down") => {
        const currentIndex = authorSpotlights.findIndex(x => x.id === a.id);
        if (direction === "up" && currentIndex === 0) return;
        if (direction === "down" && currentIndex === authorSpotlights.length - 1) return;

        const newArray = [...authorSpotlights];
        const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        // Swap elements based on visual display
        [newArray[currentIndex], newArray[targetIndex]] = [newArray[targetIndex], newArray[currentIndex]];

        // Sequentially assign the new correct order 1,2,3..
        const promises = newArray.map((item, index) => {
            const newSortOrder = index + 1;
            if (item.sort_order !== newSortOrder) {
                return updateAuthorSpotlight(item.id, { sort_order: newSortOrder });
            }
            return Promise.resolve();
        });

        toast.promise(Promise.all(promises), {
            loading: "Tartib o'zgartirilmoqda...",
            success: "Tartib saqlandi",
            error: (err: any) => `Xatolik: ${err.message}`
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">Jamoa sahifasi pastida aylana shaklda ko'rinadigan muallif va tarjimonlar</p>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Yangi qo'shish
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-foreground/70">Rasm</th>
                                <th className="text-left px-4 py-3 font-semibold text-foreground/70">Ism</th>
                                <th className="text-left px-4 py-3 font-semibold text-foreground/70 hidden sm:table-cell">Tur</th>
                                <th className="text-left px-4 py-3 font-semibold text-foreground/70 hidden md:table-cell">Tartib</th>
                                <th className="text-right px-4 py-3 font-semibold text-foreground/70">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {authorSpotlights.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground text-sm">
                                        Hozircha muallif/tarjimon yo'q. Yangi qo'shing.
                                    </td>
                                </tr>
                            )}
                            {authorSpotlights.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        {a.image_url ? (
                                            <img src={a.image_url} alt={a.name} className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                style={{ background: a.role === "MUALLIF" ? "hsl(var(--primary))" : "#c8973a" }}>
                                                {a.name.charAt(0)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        <span className="truncate max-w-[140px] block">{a.name}</span>
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${a.role === "MUALLIF"
                                            ? "bg-primary/10 text-primary/90"
                                            : "bg-amber-100 text-amber-800"
                                            }`}>
                                            {a.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-foreground/60 hidden md:table-cell font-mono text-xs">{a.sort_order}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                onClick={() => handleMove(a, "up")}
                                                disabled={authorSpotlights.findIndex(x => x.id === a.id) === 0}
                                                className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-30"
                                                title="Yuqoriga"
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleMove(a, "down")}
                                                disabled={authorSpotlights.findIndex(x => x.id === a.id) === authorSpotlights.length - 1}
                                                className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-30"
                                                title="Pastga"
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </button>
                                            <span className="w-px h-4 bg-gray-200 mx-1"></span>
                                            <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(a)} className="p-1.5 rounded-lg text-muted-foreground/80 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Modal ─────────────────────────────────────────────────────────────── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-foreground">
                                {editId ? "Tahrirlash" : "Yangi muallif / tarjimon"}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                                <X className="h-5 w-5 text-muted-foreground/80" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <ImageCropper
                                currentUrl={form.image_url ?? ""}
                                onImageSaved={(url) => setForm({ ...form, image_url: url || null })}
                                aspectRatio={1}
                                label="Profil rasmi (1:1)"
                                bucket="books"
                            />
                            {/* Show default design preview when no image is uploaded */}
                            {!form.image_url && (
                                <DefaultCirclePreview name={form.name} role={form.role as "MUALLIF" | "TARJIMON"} />
                            )}
                            <Field label="Ism Familiya" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />

                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-1">Tur</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value as "MUALLIF" | "TARJIMON" })}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none bg-white"
                                >
                                    <option value="MUALLIF">MUALLIF</option>
                                    <option value="TARJIMON">TARJIMON</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-1">Tartib raqami</label>
                                <input
                                    type="number"
                                    value={form.sort_order}
                                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-gray-100 rounded-lg transition-colors">
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
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Main TeamManager page ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

type Tab = "jamoa" | "authors";

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "jamoa", label: "Jamoa", icon: Users },
    { id: "authors", label: "Mualliflar va Tarjimonlar", icon: UserCheck },
];

const TeamManager = () => {
    const [activeTab, setActiveTab] = useState<Tab>("jamoa");

    return (
        <div>
            {/* ── Header ── */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Jamoa boshqaruvi</h1>
                <p className="text-sm text-muted-foreground mt-1">Team sahifasida ko'rinadigan ma'lumotlarni boshqaring</p>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                            ? "bg-white shadow-sm text-foreground"
                            : "text-foreground/60 hover:text-foreground"
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab content ── */}
            {activeTab === "jamoa" && <JamoaTab />}
            {activeTab === "authors" && <AuthorsTab />}
        </div>
    );
};

export default TeamManager;
