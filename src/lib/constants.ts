/**
 * Static UI constants for the Zabarjad Media application.
 *
 * These values are permanent UI configuration — not mock data —
 * and are safe to import after mockData.ts is eventually deleted.
 */

// ── Library category filter mapping ───────────────────────────────────────────
export const LIBRARY_FILTER_KEYS = ["new", "soon", "gold"] as const;

export type LibraryFilterKey = (typeof LIBRARY_FILTER_KEYS)[number];

export const LIBRARY_FILTER_MAP: Record<LibraryFilterKey, string> = {
  new:  "Yangi Nashrlar",
  soon: "Tez Kunda",
  gold: "Oltin Kolleksiya",
};

// ── EpicSpotlight – map hotspot positions ─────────────────────────────────────
export const HOTSPOT_IDS = ["winterfell", "kings-landing", "wall"] as const;

export const HOTSPOT_POSITIONS: Record<string, { x: number; y: number }> = {
  winterfell:      { x: 35, y: 25 },
  "kings-landing": { x: 55, y: 65 },
  wall:            { x: 40, y: 8  },
};