/**
 * Static UI constants for the Booktopia application.
 *
 * These values are permanent UI configuration — not mock data —
 * and are safe to import after mockData.ts is eventually deleted.
 */

// ── Library category filter mapping ───────────────────────────────────────────
export const LIBRARY_FILTER_KEYS = ["jahon", "ilmiy", "new", "amir-temur", "erkin-millat"] as const;

export type LibraryFilterKey = (typeof LIBRARY_FILTER_KEYS)[number];

export const LIBRARY_FILTER_MAP: Record<LibraryFilterKey, string> = {
  "jahon":        "Jahon adabiyoti durdonalari",
  "ilmiy":        "Ilmiy-ommabop",
  "new":          "Yangi nashrlar",
  "amir-temur":   "Tarixiy",
  "erkin-millat": "Ijtimoiy-siyosiy",
};

// ── EpicSpotlight – map hotspot positions ─────────────────────────────────────
export const HOTSPOT_IDS = ["winterfell", "kings-landing", "wall"] as const;

export const HOTSPOT_POSITIONS: Record<string, { x: number; y: number }> = {
  winterfell:      { x: 35, y: 25 },
  "kings-landing": { x: 55, y: 65 },
  wall:            { x: 40, y: 8  },
};