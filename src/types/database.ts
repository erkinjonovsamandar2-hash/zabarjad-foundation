// ── Auto-synced to live Supabase schema ───────────────────────────────────────
// Source of truth: the generated types.ts from Supabase CLI.
// Do NOT invent column names here. Every field must exist in the real DB.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // ── books ───────────────────────────────────────────────────────────────
      books: {
        Row: {
          id: string;
          title: string;
          title_en: string | null;
          title_ru: string | null;
          author: string;
          author_en: string | null;
          author_ru: string | null;
          description: string | null;
          description_en: string | null;
          description_ru: string | null;
          cover_url: string | null;
          /** HSL string e.g. "210 60% 15%" — drives dynamic background glows. */
          bg_color: string | null;
          category: string;
          price: number | null;
          enable_3d_flip: boolean | null;
          featured: boolean | null;
          sort_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_en?: string | null;
          title_ru?: string | null;
          author: string;
          author_en?: string | null;
          author_ru?: string | null;
          description?: string | null;
          description_en?: string | null;
          description_ru?: string | null;
          cover_url?: string | null;
          bg_color?: string | null;
          category?: string;
          price?: number | null;
          enable_3d_flip?: boolean | null;
          featured?: boolean | null;
          sort_order?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_en?: string | null;
          title_ru?: string | null;
          author?: string;
          author_en?: string | null;
          author_ru?: string | null;
          description?: string | null;
          description_en?: string | null;
          description_ru?: string | null;
          cover_url?: string | null;
          bg_color?: string | null;
          category?: string;
          price?: number | null;
          enable_3d_flip?: boolean | null;
          featured?: boolean | null;
          sort_order?: number | null;
          updated_at?: string;
        };
      };

      // ── articles ────────────────────────────────────────────────────────────
      articles: {
        Row: {
          id: string;
          title: string;
          title_en: string | null;
          title_ru: string | null;
          excerpt: string | null;
          excerpt_en: string | null;
          excerpt_ru: string | null;
          content: string | null;
          content_en: string | null;
          content_ru: string | null;
          cover_url: string | null;
          date: string;
          published: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_en?: string | null;
          title_ru?: string | null;
          excerpt?: string | null;
          excerpt_en?: string | null;
          excerpt_ru?: string | null;
          content?: string | null;
          content_en?: string | null;
          content_ru?: string | null;
          cover_url?: string | null;
          date?: string;
          published?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_en?: string | null;
          title_ru?: string | null;
          excerpt?: string | null;
          excerpt_en?: string | null;
          excerpt_ru?: string | null;
          content?: string | null;
          content_en?: string | null;
          content_ru?: string | null;
          cover_url?: string | null;
          date?: string;
          published?: boolean | null;
          updated_at?: string;
        };
      };

      // ── quiz_config ─────────────────────────────────────────────────────────
      quiz_config: {
        Row: { id: string; config: Json; updated_at: string };
        Insert: { id?: string; config?: Json; updated_at?: string };
        Update: { id?: string; config?: Json; updated_at?: string };
      };

      // ── site_settings ───────────────────────────────────────────────────────
      site_settings: {
        Row: { key: string; value: Json; updated_at: string };
        Insert: { key: string; value?: Json; updated_at?: string };
        Update: { key?: string; value?: Json; updated_at?: string };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: "admin" | "user";
    };
  };
}

// ── Convenience row-type aliases ──────────────────────────────────────────────
export type Book    = Database["public"]["Tables"]["books"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];

// ── Convenience insert/update aliases ────────────────────────────────────────
export type BookInsert    = Database["public"]["Tables"]["books"]["Insert"];
export type BookUpdate    = Database["public"]["Tables"]["books"]["Update"];
export type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
export type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];