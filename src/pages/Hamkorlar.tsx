import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Phone, ArrowUpRight, Navigation } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useData } from "@/context/DataContext";
import type { Partner, PartnerMapEntry, PartnerWebsiteEntry } from "@/context/DataContext";

// ── Static fallback (shown when partners table empty / not yet migrated) ──────
const STATIC_PARTNERS: Omit<Partner, "id" | "created_at">[] = [
  {
    name: "Golden Books", type: "Rasmiy hamkor",
    bio: "Toshkentning eng yirik kitob tarmog'i. Bolalar va kattalar adabiyotining keng assortimenti.",
    location: "Toshkent shahri", branches: 12, phone: null, website: null, websites: [],
    maps_url: null, maps_urls: [], image_url: null, accent_color: "#c8973a", sort_order: 1,
  },
  {
    name: "Bookmark", type: "Rasmiy hamkor",
    bio: "Zamonaviy kitobsevarlar uchun maxsus tanlangan kolleksiya. Premium xizmat va atmosfera.",
    location: "Toshkent shahri", branches: 3, phone: null, website: null, websites: [],
    maps_url: null, maps_urls: [], image_url: null, accent_color: "#3a567a", sort_order: 2,
  },
  {
    name: "Kitob House", type: "Rasmiy hamkor",
    bio: "Bolalar va yoshlar adabiyotiga ixtisoslashgan do'kon tarmog'i. Sifatli kitob — yorqin kelajak.",
    location: "Toshkent, Chirchiq", branches: 5, phone: null, website: null, websites: [],
    maps_url: null, maps_urls: [], image_url: null, accent_color: "#1a6fba", sort_order: 3,
  },
  {
    name: "Plato Books", type: "Rasmiy hamkor",
    bio: "Falsafa, ilm-fan va badiiy adabiyot bo'yicha O'zbekistondagi eng yirik ixtisoslashgan do'kon.",
    location: "Toshkent shahri", branches: 2, phone: null, website: null, websites: [],
    maps_url: null, maps_urls: [], image_url: null, accent_color: "#4a9a4a", sort_order: 4,
  },
  {
    name: "Asaxiy", type: "Onlayn hamkor",
    bio: "O'zbekistonning eng yirik onlayn savdo platformasi. Kitoblarimiz butun mamlakat bo'ylab yetkazib beriladi.",
    location: "Online — butun O'zbekiston", branches: null, phone: null, website: "asaxiy.uz", websites: [],
    maps_url: null, maps_urls: [], image_url: null, accent_color: "#c8973a", sort_order: 5,
  },
  {
    name: "Qamar", type: "Rasmiy hamkor",
    bio: "Adabiy va badiiy kitoblarga ixtisoslashgan premium do'kon. Kitobsevarlar uchun maxsus muhit.",
    location: "Toshkent shahri", branches: 1, phone: null, website: null, websites: [],
    maps_url: null, maps_urls: [], image_url: null, accent_color: "#8a3a8a", sort_order: 6,
  },
];

// ── Animated counting number ──────────────────────────────────────────────────
function AnimatedNumber({ value, duration = 1600 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(eased * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

// ── Partner photo / initial fallback ─────────────────────────────────────────
function PartnerPhoto({
  partner,
  size,
}: {
  partner: Pick<Partner, "name" | "image_url" | "accent_color">;
  size: number;
}) {
  const accent = partner.accent_color || "#c8973a";
  const initial = partner.name.charAt(0).toUpperCase();
  return (
    <div
      className="flex-shrink-0 overflow-hidden rounded-xl"
      style={{
        width: size,
        height: size,
        border: `1px solid ${accent}30`,
        background: `${accent}12`,
      }}
    >
      {partner.image_url ? (
        <img
          src={partner.image_url}
          alt={partner.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center select-none"
          style={{ background: `${accent}18` }}
        >
          <span
            className="font-heading"
            style={{
              fontSize: size * 0.42,
              lineHeight: 1,
              color: accent,
              fontStyle: "italic",
              filter: `drop-shadow(0 0 ${size * 0.1}px ${accent}55)`,
            }}
          >
            {initial}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Smart website label parser ────────────────────────────────────────────────
function parseWebsite(raw: string): { href: string; label: string } {
  const href = raw.startsWith("http") ? raw : `https://${raw}`;
  try {
    const host = new URL(href).hostname.replace("www.", "");
    if (host.includes("instagram.com")) return { href, label: "Instagram" };
    if (host.includes("t.me") || host.includes("telegram")) return { href, label: "Telegram" };
    if (host.includes("facebook.com")) return { href, label: "Facebook" };
    if (host.includes("youtube.com")) return { href, label: "YouTube" };
    return { href, label: host };
  } catch {
    return { href, label: raw };
  }
}

// ── Shared meta column content ────────────────────────────────────────────────
function MetaItems({
  partner,
  accent,
}: {
  partner: Pick<Partner, "location" | "maps_url" | "maps_urls" | "branches" | "website" | "websites" | "phone">;
  accent: string;
}) {
  const mapLinks: PartnerMapEntry[] =
    partner.maps_urls?.length > 0
      ? partner.maps_urls
      : partner.maps_url
      ? [{ label: "Xaritada ko'rish", url: partner.maps_url }]
      : [];

  return (
    <>
      {/* Location */}
      {partner.location && (
        <div>
          <p className="font-sans text-[0.55rem] tracking-[0.2em] uppercase text-foreground/30 mb-1">
            Manzil
          </p>
          <p className="font-sans text-sm font-medium text-foreground/75 leading-snug mb-1.5">
            {partner.location}
          </p>
          {mapLinks.length > 0 && (
            <div className="flex flex-col gap-1">
              {mapLinks.map((entry, i) => (
                <a
                  key={i}
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-primary/60 hover:text-primary transition-colors duration-200 group/map"
                >
                  <Navigation size={10} className="group-hover/map:translate-x-0.5 group-hover/map:-translate-y-0.5 transition-transform duration-200" />
                  {entry.label || "Xaritada ko'rish"}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Branches — editorial stat */}
      {partner.branches !== null && (
        <div>
          <span
            className="font-heading block leading-none"
            style={{ fontSize: "2rem", color: accent }}
          >
            {partner.branches}
          </span>
          <span className="font-sans text-[0.55rem] tracking-[0.2em] uppercase text-foreground/30 mt-1 block">
            Ta filial
          </span>
        </div>
      )}

      {/* Websites — multiple social/web links */}
      {(() => {
        const webLinks: PartnerWebsiteEntry[] =
          partner.websites?.length > 0
            ? partner.websites
            : partner.website
            ? [{ label: partner.website, url: partner.website }]
            : [];
        if (webLinks.length === 0) return null;
        return (
          <div>
            <p className="font-sans text-[0.55rem] tracking-[0.2em] uppercase text-foreground/30 mb-1.5">
              Ijtimoiy tarmoq
            </p>
            <div className="flex flex-col gap-1.5">
              {webLinks.map((entry, i) => {
                const { href, label } = parseWebsite(entry.url);
                return (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-sans text-xs font-semibold text-primary border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/8 transition-colors duration-200"
                  >
                    <Globe size={11} />
                    {entry.label || label}
                  </a>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Phone */}
      {partner.phone && (
        <div>
          <p className="font-sans text-[0.55rem] tracking-[0.2em] uppercase text-foreground/30 mb-1.5">
            Telefon
          </p>
          <a
            href={`tel:${partner.phone}`}
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
          >
            <Phone size={12} className="text-primary/50" />
            {partner.phone}
          </a>
        </div>
      )}
    </>
  );
}

// ── Single catalog entry ──────────────────────────────────────────────────────
function PartnerEntry({
  partner,
  index,
}: {
  partner: Partner | Omit<Partner, "id" | "created_at">;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const ordinal = String(index + 1).padStart(2, "0");
  const accent = partner.accent_color || "#c8973a";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      <div className="h-px bg-border/40" />

      {/* ── MOBILE layout ── */}
      <div className="lg:hidden py-8 pl-5 pr-0">
        {/* Row: photo + type/ordinal */}
        <div className="flex items-center gap-3 mb-4">
          <PartnerPhoto partner={partner} size={56} />
          <div className="flex flex-col gap-1.5">
            <span className="font-sans text-[0.55rem] tracking-[0.22em] uppercase text-foreground/25">
              — {ordinal} —
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block w-1 h-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: accent }}
              />
              <span className="font-sans text-[0.56rem] tracking-[0.18em] uppercase text-foreground/38">
                {partner.type}
              </span>
            </span>
          </div>
        </div>

        {/* Name */}
        <h2
          className="font-heading text-foreground leading-none tracking-tight mb-3"
          style={{ fontSize: "clamp(1.6rem, 6vw, 2rem)" }}
        >
          {partner.name}
        </h2>

        {/* Accent rule */}
        <div
          className="h-px mb-4 transition-all duration-500 ease-out group-hover:w-10"
          style={{ width: "1.25rem", backgroundColor: accent }}
        />

        {/* Bio */}
        <p className="font-serif text-xl leading-relaxed text-foreground/52 mb-4">
          {partner.bio}
        </p>

        {/* Meta */}
        <div className="flex flex-col gap-5 pt-2 border-t border-border/30 mt-2">
          <MetaItems partner={partner} accent={accent} />
        </div>
      </div>

      {/* ── DESKTOP layout ── */}
      <div className="hidden lg:grid grid-cols-[68px_88px_1fr_230px] gap-10 py-14">

        {/* Ghost ordinal */}
        <div className="select-none pointer-events-none">
          <span
            className="font-heading block"
            style={{ fontSize: "4.75rem", lineHeight: 0.95, color: "hsl(var(--foreground) / 0.055)" }}
          >
            {ordinal}
          </span>
        </div>

        {/* Photo */}
        <div className="flex items-start pt-[0.35rem]">
          <PartnerPhoto partner={partner} size={88} />
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: accent }}
              />
              <span className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-foreground/38">
                {partner.type}
              </span>
            </span>
          </div>

          <h2
            className="font-heading text-foreground leading-none tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 2.75rem)" }}
          >
            {partner.name}
          </h2>

          <div
            className="h-px mb-5 transition-all duration-500 ease-out group-hover:w-12"
            style={{ width: "1.5rem", backgroundColor: accent }}
          />

          <p className="font-serif text-xl leading-relaxed text-foreground/52 max-w-md">
            {partner.bio}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-5 self-end">
          <MetaItems partner={partner} accent={accent} />
        </div>
      </div>

      {/* Hover left accent bar */}
      <div
        className="absolute left-0 top-px bottom-0 w-[2px] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"
        style={{ backgroundColor: accent }}
      />
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Hamkorlar() {
  const { partners, partnersLoading } = useData();

  // Use DB data if available, else static fallback (table not yet created)
  const list = partners.length > 0
    ? partners
    : (partnersLoading ? [] : STATIC_PARTNERS as unknown as Partner[]);

  const totalBranches = list.reduce((s, p) => s + (p.branches ?? 0), 0);

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-500">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ backgroundColor: "#0a1128" }}>
          {/* Noise */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              opacity: 0.035,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px",
            }}
          />
          {/* Gold glow */}
          <div
            className="absolute pointer-events-none z-0"
            style={{
              top: 0, right: 0, width: "55vw", height: "70%",
              background: "radial-gradient(ellipse at 85% 20%, rgba(200,151,58,0.09) 0%, transparent 65%)",
            }}
          />
          {/* Vertical side label */}
          <div
            className="hidden lg:block absolute right-8 bottom-24 pointer-events-none select-none z-0"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          >
            <span
              className="font-sans font-bold uppercase tracking-[0.45em]"
              style={{ fontSize: "0.48rem", color: "rgba(255,255,255,0.07)" }}
            >
              KATALOG — 2025
            </span>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-40 pb-20">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="w-8 h-px" style={{ backgroundColor: "#c8973a" }} />
              <span className="font-sans uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.32em", color: "#c8973a" }}>
                Booktopia — Rasmiy Hamkorlar
              </span>
            </motion.div>

            {(["Hamkor", "Do'konlar"] as const).map((word, i) => (
              <div key={word} className="overflow-hidden pt-3 -mt-3">
                <motion.div
                  initial={{ y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span
                    className="font-heading block leading-[0.88] tracking-[-0.025em]"
                    style={{
                      fontSize: "clamp(4.5rem, 11vw, 8.5rem)",
                      color: i === 0 ? "#ffffff" : "#c8973a",
                    }}
                  >
                    {word}
                  </span>
                </motion.div>
              </div>
            ))}

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="origin-left mt-8 mb-8 h-px"
              style={{ maxWidth: "380px", backgroundColor: "rgba(200,151,58,0.3)" }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="flex flex-col sm:flex-row sm:items-end gap-10 sm:gap-16"
            >
              <p
                className="font-serif italic text-lg leading-relaxed"
                style={{ color: "rgba(255,255,255,0.4)", maxWidth: "320px" }}
              >
                O'zbekiston bo'ylab rasmiy hamkor do'konlarimizda topishingiz mumkin.
              </p>
              <div className="flex gap-12">
                {[
                  { value: list.length, label: "Hamkor do'kon" },
                  { value: totalBranches, label: "Jami filial" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="font-heading" style={{ fontSize: "3.25rem", color: "#c8973a", lineHeight: 1 }}>
                      <AnimatedNumber value={value} />
                    </div>
                    <div
                      className="font-sans uppercase mt-2"
                      style={{ fontSize: "0.55rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.28)" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="h-px" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
        </section>

        {/* ── SECTION DIVIDER ──────────────────────────────────────────────── */}
        <div
          className="bg-background flex items-center gap-5 px-6 lg:px-12 py-5"
          style={{ borderBottom: "0.5px solid hsl(var(--border) / 0.45)" }}
        >
          <div className="flex-1 h-px bg-border/30" />
          <span className="font-sans text-[0.52rem] tracking-[0.38em] uppercase text-foreground/22 whitespace-nowrap">
            — {list.length} ta hamkor do'kon —
          </span>
          <div className="flex-1 h-px bg-border/30" />
        </div>

        {/* ── CATALOG ──────────────────────────────────────────────────────── */}
        <section className="bg-background">
          <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-4">
            {partnersLoading && partners.length === 0 ? (
              <div className="py-20 text-center font-serif italic text-foreground/30 text-sm">
                Yuklanmoqda…
              </div>
            ) : list.length === 0 ? (
              <div className="py-20 text-center font-serif italic text-foreground/30 text-sm">
                Hamkorlar hali qo'shilmagan.
              </div>
            ) : (
              list.map((partner, i) => (
                <PartnerEntry key={(partner as Partner).id ?? partner.name} partner={partner} index={i} />
              ))
            )}
            <div className="h-px bg-border/40" />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: "#0a1128", borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(200,151,58,0.9) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <div>
              <p
                className="font-sans uppercase mb-3"
                style={{ fontSize: "0.58rem", letterSpacing: "0.3em", color: "rgba(200,151,58,0.65)" }}
              >
                Hamkorlik dasturi
              </p>
              <h2
                className="font-heading text-white mb-2"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
              >
                Hamkor bo'lmoqchimisiz?
              </h2>
              <p className="font-serif italic text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
                Hamkorlik dasturimiz haqida batafsil ma'lumot oling.
              </p>
            </div>
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
              className="group/cta inline-flex items-center gap-3 flex-shrink-0 font-sans font-bold uppercase text-[0.65rem] tracking-[0.2em] px-6 py-3 border transition-colors duration-200 hover:bg-[#c8973a]/10"
              style={{ borderColor: "rgba(200,151,58,0.35)", color: "#c8973a" }}
            >
              Murojaat qilish
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
              />
            </button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
