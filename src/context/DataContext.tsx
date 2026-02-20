import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// ── Types ──
export interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  description: string;
  price: number;
  category: string;
  bg_color: string;
  enable_3d_flip: boolean;
  featured: boolean;
  sort_order: number;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string;
  date: string;
  published: boolean;
}

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

const defaultSiteSettings: SiteSettings = {
  hero: { motto: "Eng Yaxshisini Ilinamiz", subtitle: "Zabarjad Media — dunyoning eng yaxshi fantastik asarlarini o'zbek tilida taqdim etadi", cta_text: "Kitoblarni ko'rish" },
  footer: { phone: "+998 90 123 45 67", email: "info@zabarjad.uz", address: "Toshkent, O'zbekiston", telegram: "https://t.me/zabarjad", instagram: "https://instagram.com/zabarjad" },
  map: { enabled: true, embed_url: "", title: "Bizning manzil" },
};

// ── Context ──
interface DataContextType {
  books: Book[];
  articles: Article[];
  quizConfig: QuizConfig;
  siteSettings: SiteSettings;
  loading: boolean;
  addBook: (book: Omit<Book, "id">) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addArticle: (article: Omit<Article, "id">) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  updateQuizConfig: (config: QuizConfig) => Promise<void>;
  updateSiteSettings: (settings: SiteSettings) => Promise<void>;
  refreshBooks: () => Promise<void>;
  refreshArticles: () => Promise<void>;
}

const defaultQuiz: QuizConfig = {
  steps: [
    { question: "Qaysi janr sizga yoqadi?", options: [{ label: "Fantastika", value: "fantasy" }, { label: "Ilmiy-fantastika", value: "scifi" }, { label: "Klassik adabiyot", value: "classic" }] },
    { question: "Fantastik yoki real?", options: [{ label: "To'liq sehrli olam", value: "high" }, { label: "Bir oz sehr", value: "low" }, { label: "Butunlay real", value: "none" }] },
    { question: "Qorong'u yoki yorqin?", options: [{ label: "Qorong'u va dramatik", value: "dark" }, { label: "Sarguzashtli va quvnoq", value: "light" }, { label: "Aralash", value: "mixed" }] },
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

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [quizConfig, setQuizConfig] = useState<QuizConfig>(defaultQuiz);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    const { data } = await supabase.from("books").select("*").order("sort_order");
    if (data) setBooks(data.map((b) => ({
      id: b.id, title: b.title, author: b.author,
      cover_url: b.cover_url || "", description: b.description || "",
      price: b.price || 0, category: b.category,
      bg_color: b.bg_color || "210 60% 15%",
      enable_3d_flip: b.enable_3d_flip || false,
      featured: b.featured || false,
      sort_order: b.sort_order || 0,
    })));
  };

  const fetchArticles = async () => {
    const { data } = await supabase.from("articles").select("*").order("date", { ascending: false });
    if (data) setArticles(data.map((a) => ({
      id: a.id, title: a.title, excerpt: a.excerpt || "",
      content: a.content || "", cover_url: a.cover_url || "",
      date: a.date, published: a.published || false,
    })));
  };

  const fetchQuiz = async () => {
    const { data } = await supabase.from("quiz_config").select("*").limit(1).single();
    if (data?.config) {
      setQuizConfig(data.config as unknown as QuizConfig);
    }
  };

  const fetchSiteSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    if (data && data.length > 0) {
      const settings: Record<string, unknown> = {};
      data.forEach((row: { key: string; value: unknown }) => { settings[row.key] = row.value; });
      setSiteSettings({ ...defaultSiteSettings, ...settings } as unknown as SiteSettings);
    }
  };

  useEffect(() => {
    Promise.all([fetchBooks(), fetchArticles(), fetchQuiz(), fetchSiteSettings()]).finally(() => setLoading(false));
  }, []);

  const addBook = async (book: Omit<Book, "id">) => {
    await supabase.from("books").insert({
      title: book.title, author: book.author, cover_url: book.cover_url,
      description: book.description, price: book.price, category: book.category,
      bg_color: book.bg_color, enable_3d_flip: book.enable_3d_flip,
      featured: book.featured, sort_order: book.sort_order,
    });
    await fetchBooks();
  };

  const updateBook = async (id: string, data: Partial<Book>) => {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.cover_url !== undefined) updateData.cover_url = data.cover_url;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.bg_color !== undefined) updateData.bg_color = data.bg_color;
    if (data.enable_3d_flip !== undefined) updateData.enable_3d_flip = data.enable_3d_flip;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.sort_order !== undefined) updateData.sort_order = data.sort_order;
    await supabase.from("books").update(updateData).eq("id", id);
    await fetchBooks();
  };

  const deleteBook = async (id: string) => {
    await supabase.from("books").delete().eq("id", id);
    await fetchBooks();
  };

  const addArticle = async (article: Omit<Article, "id">) => {
    await supabase.from("articles").insert({
      title: article.title, excerpt: article.excerpt, content: article.content,
      cover_url: article.cover_url, date: article.date, published: article.published,
    });
    await fetchArticles();
  };

  const updateArticle = async (id: string, data: Partial<Article>) => {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.cover_url !== undefined) updateData.cover_url = data.cover_url;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.published !== undefined) updateData.published = data.published;
    await supabase.from("articles").update(updateData).eq("id", id);
    await fetchArticles();
  };

  const deleteArticle = async (id: string) => {
    await supabase.from("articles").delete().eq("id", id);
    await fetchArticles();
  };

  const updateQuizConfigFn = async (config: QuizConfig) => {
    setQuizConfig(config);
    // Upsert — check if row exists
    const { data: existing } = await supabase.from("quiz_config").select("id").limit(1).single();
    if (existing) {
      await supabase.from("quiz_config").update({ config: JSON.parse(JSON.stringify(config)) }).eq("id", existing.id);
    } else {
      await supabase.from("quiz_config").insert({ config: JSON.parse(JSON.stringify(config)) });
    }
  };

  const updateSiteSettingsFn = async (settings: SiteSettings) => {
    setSiteSettings(settings);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from("site_settings").upsert({ key, value: JSON.parse(JSON.stringify(value)) }, { onConflict: "key" });
    }
  };

  return (
    <DataContext.Provider value={{
      books, articles, quizConfig, siteSettings, loading,
      addBook, updateBook, deleteBook,
      addArticle, updateArticle, deleteArticle,
      updateQuizConfig: updateQuizConfigFn,
      updateSiteSettings: updateSiteSettingsFn,
      refreshBooks: fetchBooks, refreshArticles: fetchArticles,
    }}>
      {children}
    </DataContext.Provider>
  );
};
