import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_QUIZ_CONFIG, DEFAULT_SITE_SETTINGS } from "@/lib/mockData";
import type { Book, Article } from "@/types/database";

// Re-export so all consumers can import from DataContext as before
export type { Book, Article };

// ── Review type ───────────────────────────────────────────────────────────────
export interface Review {
  id:         string;
  name:       string;
  role:       string | null;
  city:       string | null;
  text:       string;
  stars:      number;
  status:     "pending" | "published" | "rejected";
  created_at: string;
}

// ── Types not yet in the DB ───────────────────────────────────────────────────
export interface QuizStep {
  question: string;
  options: { label: string; value: string }[];
}

export interface QuizPath {
  key:    string;
  bookId: string;
  reason: string;
}

export interface QuizConfig {
  steps:         QuizStep[];
  paths:         QuizPath[];
  defaultBookId: string;
  defaultReason: string;
}

export interface SiteSettings {
  hero:   { motto: string; subtitle: string; cta_text: string };
  footer: { phone: string; email: string; address: string; telegram: string; instagram: string };
  map:    { enabled: boolean; embed_url: string; title: string };
}

// ── Context shape ─────────────────────────────────────────────────────────────
interface DataContextType {
  books:        Book[];
  articles:     Article[];
  reviews:      Review[];
  quizConfig:   QuizConfig;
  siteSettings: SiteSettings;
  loading:      boolean;
  addBook:            (book: Omit<Book, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateBook:         (id: string, data: Partial<Book>) => Promise<void>;
  deleteBook:         (id: string) => Promise<void>;
  addArticle:         (article: Omit<Article, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateArticle:      (id: string, data: Partial<Article>) => Promise<void>;
  deleteArticle:      (id: string) => Promise<void>;
  updateQuizConfig:   (config: QuizConfig) => Promise<void>;
  updateSiteSettings: (settings: SiteSettings) => Promise<void>;
  refreshBooks:       () => Promise<void>;
  refreshArticles:    () => Promise<void>;
  submitReview: (
    payload: Omit<Review, "id" | "status" | "created_at">
  ) => Promise<{ error: string | null }>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [books,        setBooks]        = useState<Book[]>([]);
  const [articles,     setArticles]     = useState<Article[]>([]);
  const [reviews,      setReviews]      = useState<Review[]>([]);
  const [quizConfig,   setQuizConfig]   = useState<QuizConfig>(DEFAULT_QUIZ_CONFIG);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading,      setLoading]      = useState(true);

  // ── Fetchers ──────────────────────────────────────────────────────────────

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { console.error("[DataContext] fetchBooks error:", error.message); return; }
    if (data) setBooks(data as Book[]);
  };

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false });
    if (error) { console.error("[DataContext] fetchArticles error:", error.message); return; }
    if (data) setArticles(data as Article[]);
  };

  // ── NEW: fetch published reviews only ─────────────────────────────────────
  const fetchReviews = async () => {
    const { data, error } = await (supabase as any)
      .from("reviews")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (error) { console.error("[DataContext] fetchReviews error:", error.message); return; }
    if (data) setReviews(data as Review[]);
  };

  const fetchQuiz = async () => {
    const { data, error } = await supabase
      .from("quiz_config")
      .select("*")
      .limit(1)
      .single();
    if (error && error.code !== "PGRST116") {
      console.error("[DataContext] fetchQuiz error:", error.message);
      return;
    }
    if (data?.config) setQuizConfig(data.config as unknown as QuizConfig);
  };

  const fetchSiteSettings = async () => {
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) { console.error("[DataContext] fetchSiteSettings error:", error.message); return; }
    if (data && data.length > 0) {
      const settings: Record<string, unknown> = {};
      data.forEach((row: { key: string; value: unknown }) => {
        settings[row.key] = row.value;
      });
      setSiteSettings({ ...DEFAULT_SITE_SETTINGS, ...settings } as unknown as SiteSettings);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchBooks(),
      fetchArticles(),
      fetchReviews(),       // ← added
      fetchQuiz(),
      fetchSiteSettings(),
    ]).finally(() => setLoading(false));
  }, []);

  // ── NEW: submitReview — inserts pending row ───────────────────────────────
  const submitReview = async (
    payload: Omit<Review, "id" | "status" | "created_at">
  ): Promise<{ error: string | null }> => {
    const { error } = await (supabase as any)
      .from("reviews")
      .insert({ ...payload, status: "pending" });
    return { error: error?.message ?? null };
  };

  // ── Mutators — Books ──────────────────────────────────────────────────────

  const addBook = async (book: Omit<Book, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("books").insert({
      title:          book.title,
      title_en:       book.title_en,
      title_ru:       book.title_ru,
      author:         book.author,
      author_en:      book.author_en,
      author_ru:      book.author_ru,
      description:    book.description,
      description_en: book.description_en,
      description_ru: book.description_ru,
      cover_url:      book.cover_url,
      bg_color:       book.bg_color,
      category:       book.category,
      price:          book.price,
      enable_3d_flip: book.enable_3d_flip,
      featured:       book.featured,
      sort_order:     book.sort_order,
    });
    if (error) console.error("[DataContext] addBook error:", error.message);
    await fetchBooks();
  };

  const updateBook = async (id: string, data: Partial<Book>) => {
    const payload: Record<string, unknown> = {};
    if (data.title          !== undefined) payload.title          = data.title;
    if (data.title_en       !== undefined) payload.title_en       = data.title_en;
    if (data.title_ru       !== undefined) payload.title_ru       = data.title_ru;
    if (data.author         !== undefined) payload.author         = data.author;
    if (data.author_en      !== undefined) payload.author_en      = data.author_en;
    if (data.author_ru      !== undefined) payload.author_ru      = data.author_ru;
    if (data.description    !== undefined) payload.description    = data.description;
    if (data.description_en !== undefined) payload.description_en = data.description_en;
    if (data.description_ru !== undefined) payload.description_ru = data.description_ru;
    if (data.cover_url      !== undefined) payload.cover_url      = data.cover_url;
    if (data.bg_color       !== undefined) payload.bg_color       = data.bg_color;
    if (data.category       !== undefined) payload.category       = data.category;
    if (data.price          !== undefined) payload.price          = data.price;
    if (data.enable_3d_flip !== undefined) payload.enable_3d_flip = data.enable_3d_flip;
    if (data.featured       !== undefined) payload.featured       = data.featured;
    if (data.sort_order     !== undefined) payload.sort_order     = data.sort_order;
    const { error } = await supabase.from("books").update(payload).eq("id", id);
    if (error) console.error("[DataContext] updateBook error:", error.message);
    await fetchBooks();
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) console.error("[DataContext] deleteBook error:", error.message);
    await fetchBooks();
  };

  // ── Mutators — Articles ───────────────────────────────────────────────────

  const addArticle = async (article: Omit<Article, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("articles").insert({
      title:       article.title,
      title_en:    article.title_en,
      title_ru:    article.title_ru,
      excerpt:     article.excerpt,
      excerpt_en:  article.excerpt_en,
      excerpt_ru:  article.excerpt_ru,
      content:     article.content,
      content_en:  article.content_en,
      content_ru:  article.content_ru,
      cover_url:   article.cover_url,
      date:        article.date,
      published:   article.published,
    });
    if (error) console.error("[DataContext] addArticle error:", error.message);
    await fetchArticles();
  };

  const updateArticle = async (id: string, data: Partial<Article>) => {
    const payload: Record<string, unknown> = {};
    if (data.title      !== undefined) payload.title      = data.title;
    if (data.title_en   !== undefined) payload.title_en   = data.title_en;
    if (data.title_ru   !== undefined) payload.title_ru   = data.title_ru;
    if (data.excerpt    !== undefined) payload.excerpt    = data.excerpt;
    if (data.excerpt_en !== undefined) payload.excerpt_en = data.excerpt_en;
    if (data.excerpt_ru !== undefined) payload.excerpt_ru = data.excerpt_ru;
    if (data.content    !== undefined) payload.content    = data.content;
    if (data.content_en !== undefined) payload.content_en = data.content_en;
    if (data.content_ru !== undefined) payload.content_ru = data.content_ru;
    if (data.cover_url  !== undefined) payload.cover_url  = data.cover_url;
    if (data.date       !== undefined) payload.date       = data.date;
    if (data.published  !== undefined) payload.published  = data.published;
    const { error } = await supabase.from("articles").update(payload).eq("id", id);
    if (error) console.error("[DataContext] updateArticle error:", error.message);
    await fetchArticles();
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) console.error("[DataContext] deleteArticle error:", error.message);
    await fetchArticles();
  };

  // ── Mutators — Quiz & Settings ────────────────────────────────────────────

  const updateQuizConfig = async (config: QuizConfig) => {
    setQuizConfig(config);
    const { data: existing } = await supabase
      .from("quiz_config")
      .select("id")
      .limit(1)
      .single();
    const serialized = JSON.parse(JSON.stringify(config));
    if (existing) {
      await supabase.from("quiz_config").update({ config: serialized }).eq("id", existing.id);
    } else {
      await supabase.from("quiz_config").insert({ config: serialized });
    }
  };

  const updateSiteSettings = async (settings: SiteSettings) => {
    setSiteSettings(settings);
    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from("site_settings")
        .upsert({ key, value: JSON.parse(JSON.stringify(value)) }, { onConflict: "key" });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <DataContext.Provider
      value={{
        books, articles, reviews, quizConfig, siteSettings, loading,
        addBook, updateBook, deleteBook,
        addArticle, updateArticle, deleteArticle,
        updateQuizConfig, updateSiteSettings,
        refreshBooks:    fetchBooks,
        refreshArticles: fetchArticles,
        submitReview,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};