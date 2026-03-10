import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Clock, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Review {
  id:         string;
  name:       string;
  role:       string | null;
  city:       string | null;
  text:       string;
  stars:      number;
  status:     "pending" | "published" | "rejected";
  created_at: string;
}

type FilterStatus = "pending" | "published" | "rejected" | "all";

const FILTER_LABELS: Record<FilterStatus, string> = {
  pending:   "Kutilmoqda",
  published: "Nashr etilgan",
  rejected:  "Rad etilgan",
  all:       "Barchasi",
};

// ── Stars ─────────────────────────────────────────────────────────────────────
const Stars = ({ count }: { count: number }) => (
  <span className="text-sm text-accent">
    {"★".repeat(count)}
    <span className="text-gray-300">{"★".repeat(5 - count)}</span>
  </span>
);

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: Review["status"] }) => {
  const styles = {
    pending:   "bg-primary/10 text-primary/90",
    published: "bg-green-100 text-green-700",
    rejected:  "bg-red-100  text-red-700",
  };
  const icons = {
    pending:   <Clock className="h-3 w-3" />,
    published: <Check className="h-3 w-3" />,
    rejected:  <X     className="h-3 w-3" />,
  };
  const labels = {
    pending:   "Kutilmoqda",
    published: "Nashr etilgan",
    rejected:  "Rad etilgan",
  };

  return (
    <span className={`
      inline-flex items-center gap-1
      rounded-full px-2.5 py-0.5
      text-[11px] font-semibold font-sans
      ${styles[status]}
    `}>
      {icons[status]}
      {labels[status]}
    </span>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const AdminReviews = () => {
  const [reviews,   setReviews]   = useState<Review[]>([]);
  const [filter,    setFilter]    = useState<FilterStatus>("pending");
  const [loading,   setLoading]   = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchReviews = async () => {
    setLoading(true);

    let query = (supabase as any)
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[AdminReviews] fetch error:", error.message);
    } else if (data) {
      setReviews(data as Review[]);
    }

    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  // ── Approve / Reject ───────────────────────────────────────────────────────
  const updateStatus = async (
    id: string,
    status: "published" | "rejected"
  ) => {
    setActioning(id);

    const { error } = await (supabase as any)
      .from("reviews")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("[AdminReviews] updateStatus error:", error.message);
    } else {
      // Optimistic update — remove from list if it no longer matches filter
      setReviews((prev) =>
        filter === "all"
          ? prev.map((r) => r.id === id ? { ...r, status } : r)
          : prev.filter((r) => r.id !== id)
      );
    }

    setActioning(null);
  };

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading font-black tracking-tight">
            Sharhlar boshqaruvi
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Foydalanuvchi sharhlarini ko'rib chiqish va tasdiqlash
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Pending badge */}
          {pendingCount > 0 && filter !== "pending" && (
            <span className="rounded-full bg-primary text-white text-xs font-bold px-2.5 py-1">
              {pendingCount} kutilmoqda
            </span>
          )}

          {/* Refresh */}
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            onClick={fetchReviews}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-muted-foreground hover:text-foreground/80 transition-colors"
            aria-label="Yangilash"
          >
            <RefreshCw className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* ── Filter tabs ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABELS) as FilterStatus[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              rounded-lg px-4 py-2 text-sm font-medium transition-colors
              ${filter === f
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-foreground/70 hover:bg-gray-50"
              }
            `}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      {loading ? (
        // Skeleton
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>

      ) : reviews.length === 0 ? (
        // Empty state
        <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-4">📭</p>
          <p className="font-serif text-lg text-muted-foreground">
            Bu toifada sharhlar yo'q
          </p>
          <p className="text-sm text-muted-foreground/80 mt-1">
            {filter === "pending"
              ? "Yangi sharhlar tushganda bu yerda ko'rinadi"
              : "Hech narsa topilmadi"
            }
          </p>
        </div>

      ) : (
        // Review cards
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1    }}
                exit={{   opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="
                  rounded-xl p-5 flex flex-col gap-3
                  bg-white border border-gray-200 shadow-sm
                "
              >
                {/* Top row — name + status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif font-semibold text-foreground leading-tight truncate">
                      {review.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground/80 font-sans mt-0.5">
                      {[review.role, review.city].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <StatusBadge status={review.status} />
                </div>

                {/* Stars */}
                <Stars count={review.stars} />

                {/* Review text */}
                <p className="font-serif text-sm italic text-foreground/70 leading-relaxed line-clamp-4">
                  "{review.text}"
                </p>

                {/* Date */}
                <p className="text-[10px] text-muted-foreground/80 font-sans">
                  {new Date(review.created_at).toLocaleDateString("uz-UZ", {
                    day:    "numeric",
                    month:  "long",
                    year:   "numeric",
                    hour:   "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {/* Action buttons — pending only */}
                {review.status === "pending" && (
                  <div className="flex gap-2 pt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={actioning === review.id}
                      onClick={() => updateStatus(review.id, "published")}
                      className="
                        flex-1 inline-flex items-center justify-center gap-2
                        rounded-lg py-2.5 text-sm font-semibold
                        bg-green-600 hover:bg-green-700 text-white
                        disabled:opacity-50 transition-colors
                      "
                    >
                      <Check className="h-4 w-4" />
                      Tasdiqlash
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={actioning === review.id}
                      onClick={() => updateStatus(review.id, "rejected")}
                      className="
                        flex-1 inline-flex items-center justify-center gap-2
                        rounded-lg py-2.5 text-sm font-semibold
                        bg-red-600 hover:bg-red-700 text-white
                        disabled:opacity-50 transition-colors
                      "
                    >
                      <X className="h-4 w-4" />
                      Rad etish
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;