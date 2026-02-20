/**
 * Centralized mock / default data for the Zabarjad Media application.
 *
 * All hardcoded content lives here so it can be easily swapped
 * with real API responses or a CMS later.
 */

import type { QuizConfig, SiteSettings } from "@/context/DataContext";

// ── Book‑flip modal sample pages ──
export const BOOK_PREVIEW_PAGES = [
  "Bu kitobning birinchi sahifasi. Qorong'u va sirli bir kecha edi. Shamol daraxtlarning shoxlarini silkitardi va osmon yulduzlarsiz qolgan edi...",
  "Ikkinchi sahifa davomi. Qahramonimiz yo'lga chiqdi. Uning oldida noma'lum bir sayohat kutayotgan edi. Har bir qadam yangi sirlarni ochardi...",
  "Uchinchi sahifa. Qadimiy qal'a devorlarida yashirin xat topildi. Bu xat butun mamlakatning taqdirini o'zgartirishi mumkin edi...",
] as const;

// ── EpicSpotlight – Westeros map hotspot positions ──
export const HOTSPOT_IDS = ["winterfell", "kings-landing", "wall"] as const;

export const HOTSPOT_POSITIONS: Record<string, { x: number; y: number }> = {
  winterfell: { x: 35, y: 25 },
  "kings-landing": { x: 55, y: 65 },
  wall: { x: 40, y: 8 },
};

// ── Library category filter mapping (DB category → filter key) ──
export const LIBRARY_FILTER_KEYS = ["new", "soon", "gold"] as const;

export const LIBRARY_FILTER_MAP: Record<string, string> = {
  new: "Yangi Nashrlar",
  soon: "Tez Kunda",
  gold: "Oltin Kolleksiya",
};

// ── Default quiz configuration (used when DB has no quiz_config row) ──
export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  steps: [
    {
      question: "Qaysi janr sizga yoqadi?",
      options: [
        { label: "Fantastika", value: "fantasy" },
        { label: "Ilmiy-fantastika", value: "scifi" },
        { label: "Klassik adabiyot", value: "classic" },
      ],
    },
    {
      question: "Fantastik yoki real?",
      options: [
        { label: "To'liq sehrli olam", value: "high" },
        { label: "Bir oz sehr", value: "low" },
        { label: "Butunlay real", value: "none" },
      ],
    },
    {
      question: "Qorong'u yoki yorqin?",
      options: [
        { label: "Qorong'u va dramatik", value: "dark" },
        { label: "Sarguzashtli va quvnoq", value: "light" },
        { label: "Aralash", value: "mixed" },
      ],
    },
  ],
  paths: [
    { key: "fantasy-high-dark", bookId: "", reason: "Qorong'u fantezi olamining shoh asari." },
    { key: "fantasy-low-light", bookId: "", reason: "Sarguzashtga to'la sehrli sayohat!" },
    { key: "scifi-none-dark", bookId: "", reason: "Kelajak haqidagi eng kuchli ogohlantirish." },
    { key: "scifi-high-mixed", bookId: "", reason: "Ilm-fan va siyosatning ajoyib uyg'unligi." },
    { key: "classic-none-light", bookId: "", reason: "Klassik sarguzasht va sehrli dunyo." },
  ],
  defaultBookId: "",
  defaultReason: "Epik fantezi sevuvchilar uchun eng yaxshi tanlov!",
};

// ── Default site settings (used when DB has no site_settings rows) ──
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  hero: {
    motto: "Eng Yaxshisini Ilinamiz",
    subtitle: "Zabarjad Media — dunyoning eng yaxshi fantastik asarlarini o'zbek tilida taqdim etadi",
    cta_text: "Kitoblarni ko'rish",
  },
  footer: {
    phone: "+998 90 123 45 67",
    email: "info@zabarjad.uz",
    address: "Toshkent, O'zbekiston",
    telegram: "https://t.me/zabarjad",
    instagram: "https://instagram.com/zabarjad",
  },
  map: { enabled: true, embed_url: "", title: "Bizning manzil" },
};
