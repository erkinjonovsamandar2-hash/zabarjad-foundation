import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_QUIZ_CONFIG, DEFAULT_SITE_SETTINGS } from "@/lib/mockData";
import type { Book, NewBook, Article } from "@/types/database";

export type { Book, NewBook, Article };

// ── Review type ───────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  name: string;
  role: string | null;
  city: string | null;
  text: string;
  stars: number;
  status: "pending" | "published" | "rejected";
  created_at: string;
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface QuizStep {
  question: string;
  options: { label: string; value: string }[];
}

export interface QuizPath {
  key: string;
  bookId: string;
  reason: string;
}

export interface QuizConfig {
  steps: QuizStep[];
  paths: QuizPath[];
  defaultBookId: string;
  defaultReason: string;
}

export interface SiteSettings {
  hero: { motto: string; subtitle: string; cta_text: string };
  footer: { phone: string; email: string; address: string; telegram: string; instagram: string };
  map: { enabled: boolean; embed_url: string; title: string };
}

// ── Context shape ─────────────────────────────────────────────────────────────
interface DataContextType {
  books: Book[];
  newBooks: NewBook[];
  articles: Article[];
  reviews: Review[];
  quizConfig: QuizConfig;
  siteSettings: SiteSettings;
  loading: boolean;
  booksError: boolean;
  articlesError: boolean;
  addBook: (book: Omit<Book, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateBook: (id: string, data: Partial<Book>) => Promise<void>;
  deleteBook: (id: string, coverUrl?: string | null) => Promise<void>;
  addNewBook: (book: Omit<NewBook, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateNewBook: (id: string, data: Partial<NewBook>) => Promise<void>;
  deleteNewBook: (id: string, coverUrl?: string | null) => Promise<void>;
  addArticle: (article: Omit<Article, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateArticle: (id: string, data: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string, coverUrl?: string | null) => Promise<void>;
  updateQuizConfig: (config: QuizConfig) => Promise<void>;
  updateSiteSettings: (settings: SiteSettings) => Promise<void>;
  refreshBooks: () => Promise<void>;
  refreshNewBooks: () => Promise<void>;
  refreshArticles: () => Promise<void>;
  submitReview: (payload: Omit<Review, "id" | "status" | "created_at">) => Promise<{ error: string | null }>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

// ── Supabase error codes ──────────────────────────────────────────────────────
// 42P01  = table does not exist (PostgreSQL)
// PGRST116 = no rows returned (PostgREST)
const TABLE_NOT_FOUND = "42P01";
const NO_ROWS = "PGRST116";

// ── Storage helper ────────────────────────────────────────────────────────────
// Extracts the object path within a bucket from a full Supabase public URL.
// Returns null if the URL doesn't belong to the given bucket.
const extractStoragePath = (url: string | null | undefined, bucket: string): string | null => {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBooks, setNewBooks] = useState<NewBook[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quizConfig, setQuizConfig] = useState<QuizConfig>(DEFAULT_QUIZ_CONFIG);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [booksError, setBooksError] = useState(false);
  const [articlesError, setArticlesError] = useState(false);

  // ── Fetchers ──────────────────────────────────────────────────────────────

  // FIX: Wrapped in try/catch to match all other fetchers.
  // FIX: Removed .setHeader("x-client-info", ...) — this method does NOT exist
  //      on the Supabase JS v2 query builder. It was throwing a synchronous
  //      TypeError before the await resolved, which could propagate outside
  //      Promise.allSettled and cause the loading state to hang forever.
  const fetchBooks = useCallback(async () => {
    try {
      console.log("[DataContext] Attempting to fetch books...");
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("sort_order", { ascending: true, nullsFirst: false });

      if (error) {
        console.error("[DataContext] FAILED to fetch books:", error);
        if (error.code === TABLE_NOT_FOUND) {
          console.warn("[DataContext] fetchBooks: books table not found");
          return;
        }
        setBooksError(true);
        return;
      }

      console.log(`[DataContext] Successfully fetched ${data?.length || 0} books.`);
      if (data) {
        setBooks(data as Book[]);
        setBooksError(false);
      }
    } catch (err) {
      console.error("[DataContext] fetchBooks threw unexpected error:", err);
      setBooksError(true);
    }
  }, []);

  const fetchNewBooks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("new_books")
        .select("*")
        .order("sort_order", { ascending: true, nullsFirst: false });
      if (error) {
        if (error.code === TABLE_NOT_FOUND) return;
        console.warn("[DataContext] fetchNewBooks:", error.message);
        return;
      }
      if (data) setNewBooks(data as NewBook[]);
    } catch (err) {
      console.warn("[DataContext] fetchNewBooks unexpected:", err);
    }
  }, []);

  // fetchBlogPosts — dedicated fetch for the blog_posts table
  const fetchBlogPosts = useCallback(async () => {
    try {
      console.log("[DataContext] Attempting to fetch blog posts...");
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) {
        if (error.code === TABLE_NOT_FOUND) {
          console.warn("[DataContext] fetchBlogPosts: blog_posts table not found");
          return;
        }
        console.error("[DataContext] FAILED to fetch blog posts:", error);
        setArticlesError(true);
        return;
      }

      console.log("[DataContext] Successfully fetched", data?.length ?? 0, "blog posts.");
      if (data) {
        setArticles(data as Article[]);
        setArticlesError(false);
      }
    } catch (err) {
      console.error("[DataContext] fetchBlogPosts threw unexpected error:", err);
      setArticlesError(true);
    }
  }, []);

  // fetchReviews — silently handles missing table (42P01)
  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("reviews")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === TABLE_NOT_FOUND) return;
        console.warn("[DataContext] fetchReviews:", error.message);
        return;
      }
      if (data) setReviews(data as Review[]);
    } catch (err) {
      console.warn("[DataContext] fetchReviews unexpected:", err);
    }
  }, []);

  // fetchQuiz — silently handles missing table (42P01) and no rows (PGRST116)
  const fetchQuiz = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_config")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        if (error.code === TABLE_NOT_FOUND || error.code === NO_ROWS) return;
        console.warn("[DataContext] fetchQuiz:", error.message);
        return;
      }
      if (data?.config) setQuizConfig(data.config as unknown as QuizConfig);
    } catch (err) {
      console.warn("[DataContext] fetchQuiz unexpected:", err);
    }
  }, []);

  // fetchSiteSettings — silently handles missing table (42P01)
  const fetchSiteSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) {
        if (error.code === TABLE_NOT_FOUND) return;
        console.warn("[DataContext] fetchSiteSettings:", error.message);
        return;
      }
      if (data && data.length > 0) {
        const settings: Record<string, unknown> = {};
        data.forEach((row: { key: string; value: unknown }) => {
          settings[row.key] = row.value;
        });
        setSiteSettings({
          ...DEFAULT_SITE_SETTINGS,
          ...settings,
        } as unknown as SiteSettings);
      }
    } catch (err) {
      console.warn("[DataContext] fetchSiteSettings unexpected:", err);
    }
  }, []);

  // ── Initial parallel data load ────────────────────────────────────────────
  // Promise.allSettled — one failing fetch never blocks others.
  // Each fetcher has its own try/catch so allSettled never sees a rejection.
  // The finally block GUARANTEES setLoading(false) runs no matter what.
  useEffect(() => {
    const init = async () => {
      try {
        console.log("[DataContext] Fetching data...");
        const fetchAllPromise = Promise.allSettled([
          fetchBooks(),
          fetchNewBooks(),
          fetchBlogPosts(),
          fetchReviews(),
          fetchQuiz(),
          fetchSiteSettings(),
        ]);

        let timer: ReturnType<typeof setTimeout>;
        const timeoutPromise = new Promise((resolve) => {
          timer = setTimeout(() => {
            console.warn("[DataContext] Fetch loop timed out after 5s! Resolving early to prevent deadlock.");
            resolve(null);
          }, 5000);
        });

        await Promise.race([fetchAllPromise, timeoutPromise]);
        clearTimeout(timer!);
      } catch (err) {
        // Outermost safety net — Promise.allSettled itself never rejects,
        // but this catches any synchronous error in the orchestration layer.
        console.warn("[DataContext] init unexpected:", err);
      } finally {
        // CRITICAL: This MUST be in finally — it runs even if catch fires.
        // This is the single source of truth that resolves the loading splash.
        console.log("[DataContext] Resolving initial load state... setLoading(false)");
        setLoading(false);
      }
    };

    init();
  }, [fetchBooks, fetchNewBooks, fetchBlogPosts, fetchReviews, fetchQuiz, fetchSiteSettings]);

  // ── Realtime subscription — new_books ────────────────────────────────────
  // Any INSERT / UPDATE / DELETE on new_books triggers a re-fetch so the live
  // site reflects admin changes without requiring a manual page reload.
  useEffect(() => {
    const channel = supabase
      .channel("new_books_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "new_books" },
        () => { fetchNewBooks(); }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("[DataContext] new_books realtime subscription error — falling back to poll-on-demand.");
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [fetchNewBooks]);

  // ── submitReview ──────────────────────────────────────────────────────────
  const submitReview = useCallback(async (
    payload: Omit<Review, "id" | "status" | "created_at">
  ): Promise<{ error: string | null }> => {
    try {
      const { error } = await (supabase as any)
        .from("reviews")
        .insert({ ...payload, status: "pending" });

      if (error?.code === TABLE_NOT_FOUND) {
        return { error: "Sharh xizmati hozircha mavjud emas." };
      }
      return { error: error?.message ?? null };
    } catch (err) {
      return { error: "Kutilmagan xato yuz berdi." };
    }
  }, []);

  // ── Mutators — Books ──────────────────────────────────────────────────────

  const addBook = useCallback(async (
    book: Omit<Book, "id" | "created_at" | "updated_at">
  ) => {
    const { error } = await supabase.from("books").insert({
      title: book.title,
      title_en: book.title_en,
      title_ru: book.title_ru,
      author: book.author,
      author_en: book.author_en,
      author_ru: book.author_ru,
      description: book.description,
      description_en: book.description_en,
      description_ru: book.description_ru,
      cover_url: book.cover_url,
      bg_color: book.bg_color,
      category: book.category,
      price: book.price,
      enable_3d_flip: book.enable_3d_flip,
      featured: book.featured,
      sort_order: book.sort_order,
    });
    if (error) {
      console.warn("[DataContext] addBook:", error.message);
      throw new Error(error.message);
    }
    await fetchBooks();
  }, [fetchBooks]);

  const updateBook = useCallback(async (id: string, data: Partial<Book>) => {
    const payload: Record<string, unknown> = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.title_en !== undefined) payload.title_en = data.title_en;
    if (data.title_ru !== undefined) payload.title_ru = data.title_ru;
    if (data.author !== undefined) payload.author = data.author;
    if (data.author_en !== undefined) payload.author_en = data.author_en;
    if (data.author_ru !== undefined) payload.author_ru = data.author_ru;
    if (data.description !== undefined) payload.description = data.description;
    if (data.description_en !== undefined) payload.description_en = data.description_en;
    if (data.description_ru !== undefined) payload.description_ru = data.description_ru;
    if (data.cover_url !== undefined) payload.cover_url = data.cover_url;
    if (data.bg_color !== undefined) payload.bg_color = data.bg_color;
    if (data.category !== undefined) payload.category = data.category;
    if (data.price !== undefined) payload.price = data.price;
    if (data.enable_3d_flip !== undefined) payload.enable_3d_flip = data.enable_3d_flip;
    if (data.featured !== undefined) payload.featured = data.featured;
    if (data.sort_order !== undefined) payload.sort_order = data.sort_order;

    const { error } = await supabase.from("books").update(payload).eq("id", id);
    if (error) {
      console.warn("[DataContext] updateBook:", error.message);
      throw new Error(error.message);
    }
    // Optimistic update — reflect immediately
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...payload } : b)));
    // Re-fetch to ensure remote sync
    await fetchBooks();
  }, [fetchBooks]);

  const deleteBook = useCallback(async (id: string, coverUrl?: string | null) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) {
      console.warn("[DataContext] deleteBook:", error.message);
      throw new Error(error.message);
    }
    if (coverUrl) {
      const path = extractStoragePath(coverUrl, "books");
      if (path) {
        const { error: storageErr } = await supabase.storage.from("books").remove([path]);
        if (storageErr) console.warn("[DataContext] deleteBook storage cleanup:", storageErr.message);
      }
    }
    await fetchBooks();
  }, [fetchBooks]);

  // ── Mutators — New Books ─────────────────────────────────────────────────

  // Coerce empty-string cover_url → null so the DB never stores "" (falsy),
  // which would make every {book.cover_url ? <img/> : fallback} render the fallback.
  const sanitizeCoverUrl = (url: string | null | undefined): string | null =>
    url && url.trim() !== "" ? url : null;

  const addNewBook = useCallback(async (
    book: Omit<NewBook, "id" | "created_at" | "updated_at">
  ) => {
    const { error } = await supabase.from("new_books").insert({
      title: book.title, title_en: book.title_en, title_ru: book.title_ru,
      author: book.author, author_en: book.author_en, author_ru: book.author_ru,
      description: book.description, description_en: book.description_en, description_ru: book.description_ru,
      cover_url: sanitizeCoverUrl(book.cover_url),
      bg_color: book.bg_color, category: book.category,
      price: book.price, enable_3d_flip: book.enable_3d_flip, featured: book.featured,
      sort_order: book.sort_order,
      img_focus_x: book.img_focus_x, img_focus_y: book.img_focus_y,
      focus_desktop_x: book.focus_desktop_x, focus_desktop_y: book.focus_desktop_y,
      focus_mobile_x: book.focus_mobile_x, focus_mobile_y: book.focus_mobile_y,
    });
    if (error) { console.warn("[DataContext] addNewBook:", error.message); throw new Error(error.message); }
    await fetchNewBooks();
  }, [fetchNewBooks]);

  const updateNewBook = useCallback(async (id: string, data: Partial<NewBook>) => {
    const p: Record<string, unknown> = {};
    const fields: (keyof NewBook)[] = [
      "title","title_en","title_ru","author","author_en","author_ru",
      "description","description_en","description_ru","cover_url","bg_color",
      "category","price","enable_3d_flip","featured","sort_order",
      "img_focus_x","img_focus_y",
      "focus_desktop_x","focus_desktop_y","focus_mobile_x","focus_mobile_y",
    ];
    for (const f of fields) if (data[f] !== undefined) p[f] = data[f];
    // Sanitize cover_url: "" → null to prevent falsy cover rendering
    if ("cover_url" in p) p.cover_url = sanitizeCoverUrl(p.cover_url as string | null);
    const { error } = await supabase.from("new_books").update(p).eq("id", id);
    if (error) { console.warn("[DataContext] updateNewBook:", error.message); throw new Error(error.message); }
    // Optimistic update — mirror sanitized payload so table re-renders immediately
    setNewBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...p } : b)));
    await fetchNewBooks();
  }, [fetchNewBooks]);

  const deleteNewBook = useCallback(async (id: string, coverUrl?: string | null) => {
    const { error } = await supabase.from("new_books").delete().eq("id", id);
    if (error) { console.warn("[DataContext] deleteNewBook:", error.message); throw new Error(error.message); }
    if (coverUrl) {
      const path = extractStoragePath(coverUrl, "books");
      if (path) {
        const { error: se } = await supabase.storage.from("books").remove([path]);
        if (se) console.warn("[DataContext] deleteNewBook storage:", se.message);
      }
    }
    await fetchNewBooks();
  }, [fetchNewBooks]);

  // ── Mutators — Articles ───────────────────────────────────────────────────

  const addArticle = useCallback(async (
    article: Omit<Article, "id" | "created_at" | "updated_at">
  ) => {
    const { error } = await supabase.from("blog_posts").insert({
      title: article.title,
      title_en: article.title_en,
      title_ru: article.title_ru,
      excerpt: article.excerpt,
      excerpt_en: article.excerpt_en,
      excerpt_ru: article.excerpt_ru,
      content: article.content,
      content_en: article.content_en,
      content_ru: article.content_ru,
      image_url: article.image_url,
      published_at: article.published_at,
      published: article.published,
      category: article.category,
      reading_time: article.reading_time,
      focus_desktop_x: article.focus_desktop_x,
      focus_desktop_y: article.focus_desktop_y,
      focus_mobile_x: article.focus_mobile_x,
      focus_mobile_y: article.focus_mobile_y,
    });
    if (error) {
      console.warn("[DataContext] addArticle:", error.message);
      throw new Error(error.message);
    }
    await fetchBlogPosts();
  }, [fetchBlogPosts]);

  const updateArticle = useCallback(async (id: string, data: Partial<Article>) => {
    const payload: Record<string, unknown> = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.title_en !== undefined) payload.title_en = data.title_en;
    if (data.title_ru !== undefined) payload.title_ru = data.title_ru;
    if (data.excerpt !== undefined) payload.excerpt = data.excerpt;
    if (data.excerpt_en !== undefined) payload.excerpt_en = data.excerpt_en;
    if (data.excerpt_ru !== undefined) payload.excerpt_ru = data.excerpt_ru;
    if (data.content !== undefined) payload.content = data.content;
    if (data.content_en !== undefined) payload.content_en = data.content_en;
    if (data.content_ru !== undefined) payload.content_ru = data.content_ru;
    if (data.image_url !== undefined) payload.image_url = data.image_url;
    if (data.published_at !== undefined) payload.published_at = data.published_at;
    if (data.published !== undefined) payload.published = data.published;
    if (data.category !== undefined) payload.category = data.category;
    if (data.reading_time !== undefined) payload.reading_time = data.reading_time;
    if (data.focus_desktop_x !== undefined) payload.focus_desktop_x = data.focus_desktop_x;
    if (data.focus_desktop_y !== undefined) payload.focus_desktop_y = data.focus_desktop_y;
    if (data.focus_mobile_x !== undefined) payload.focus_mobile_x = data.focus_mobile_x;
    if (data.focus_mobile_y !== undefined) payload.focus_mobile_y = data.focus_mobile_y;

    const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
    if (error) {
      console.warn("[DataContext] updateArticle:", error.message);
      throw new Error(error.message);
    }
    await fetchBlogPosts();
  }, [fetchBlogPosts]);

  const deleteArticle = useCallback(async (id: string, coverUrl?: string | null) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      console.warn("[DataContext] deleteArticle:", error.message);
      throw new Error(error.message);
    }
    if (coverUrl) {
      const path = extractStoragePath(coverUrl, "books");
      if (path) {
        const { error: storageErr } = await supabase.storage.from("books").remove([path]);
        if (storageErr) console.warn("[DataContext] deleteArticle storage cleanup:", storageErr.message);
      }
    }
    await fetchBlogPosts();
  }, [fetchBlogPosts]);

  // ── Mutators — Quiz & Settings ────────────────────────────────────────────

  const updateQuizConfig = useCallback(async (config: QuizConfig) => {
    setQuizConfig(config);
    const { data: existing } = await supabase
      .from("quiz_config")
      .select("id")
      .limit(1)
      .single();
    const serialized = JSON.parse(JSON.stringify(config));
    if (existing) {
      const { error } = await supabase
        .from("quiz_config")
        .update({ config: serialized })
        .eq("id", existing.id);
      if (error) {
        console.warn("[DataContext] updateQuizConfig:", error.message);
        throw new Error(error.message);
      }
    } else {
      const { error } = await supabase
        .from("quiz_config")
        .insert({ config: serialized });
      if (error) {
        console.warn("[DataContext] updateQuizConfig:", error.message);
        throw new Error(error.message);
      }
    }
  }, []);

  const updateSiteSettings = useCallback(async (settings: SiteSettings) => {
    setSiteSettings(settings);
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await supabase
        .from("site_settings")
        .upsert(
          { key, value: JSON.parse(JSON.stringify(value)) },
          { onConflict: "key" }
        );
      if (error) {
        console.warn("[DataContext] updateSiteSettings:", error.message);
        throw new Error(error.message);
      }
    }
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DataContext.Provider
      value={{
        books, newBooks, articles, reviews, quizConfig, siteSettings, loading, booksError, articlesError,
        addBook, updateBook, deleteBook,
        addNewBook, updateNewBook, deleteNewBook,
        addArticle, updateArticle, deleteArticle,
        updateQuizConfig, updateSiteSettings,
        refreshBooks: fetchBooks,
        refreshNewBooks: fetchNewBooks,
        refreshArticles: fetchBlogPosts,
        submitReview,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};