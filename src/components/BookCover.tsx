import { BookOpen } from "lucide-react";

interface BookCoverProps {
  src: string | null | undefined;
  alt: string;
  className?: string;       // applied to the outer wrapper (sizing, cursor, etc.)
  hover?: boolean;          // enable tilt/lift hover animation (default true)
  loading?: "lazy" | "eager";
}

/**
 * Reusable hardcover book component.
 * Spine crease (white highlight → dark fold) + inset shadows + drop shadow.
 * Use this everywhere a book cover is displayed so the effect stays consistent.
 *
 * Caller is responsible for sizing — pass a className like "w-40" or "w-full".
 * The component maintains aspect-[2/3] internally.
 */
const BookCover = ({ src, alt, className = "", hover = true, loading = "lazy" }: BookCoverProps) => {
  return (
    <div
      className={[
        "relative aspect-[2/3] overflow-hidden bg-muted",
        "rounded-[3px_8px_8px_3px]",
        hover
          ? "transition-all duration-500 [@media(hover:hover)]:group-hover:-translate-y-3 [@media(hover:hover)]:group-hover:-rotate-1"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        boxShadow: [
          "inset 2px 0 5px rgba(255,255,255,0.15)",
          "inset -3px 0 8px rgba(0,0,0,0.45)",
          "-6px 0 16px rgba(0,0,0,0.55)",
          hover ? "10px 14px 28px rgba(0,0,0,0.30)" : "8px 10px 20px rgba(0,0,0,0.25)",
        ].join(", "),
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          className="img-fade w-full h-full object-cover"
          onLoad={(e) => e.currentTarget.classList.add("loaded")}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary">
          <BookOpen className="w-8 h-8 text-primary/30" />
        </div>
      )}

      {/* Spine crease: white highlight → dark fold, matching AmirTemurSection */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[10px] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 1px, rgba(0,0,0,0.28) 3px, rgba(0,0,0,0.65) 6px, transparent 10px)",
        }}
      />

    </div>
  );
};

export default BookCover;
