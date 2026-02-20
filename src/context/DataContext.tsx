import React, { createContext, useContext, useState, ReactNode } from "react";

// ── Types ──
export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  price: number;
  category: "Yangi Nashrlar" | "Tez Kunda" | "Oltin Kolleksiya" | "Bestseller";
  bgColor: string; // HSL string e.g. "210 60% 15%"
  enable3DFlip: boolean;
  featured: boolean; // show in hero carousel
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  published: boolean;
}

export interface QuizStep {
  question: string;
  options: { label: string; value: string }[];
}

export interface QuizPath {
  key: string; // e.g. "fantasy-high-dark"
  bookId: string;
  reason: string;
}

export interface QuizConfig {
  steps: QuizStep[];
  paths: QuizPath[];
  defaultBookId: string;
  defaultReason: string;
}

// ── Initial Data ──
const initialBooks: Book[] = [
  { id: "1", title: "Muz va Olov Qo'shig'i", author: "Jorj R.R. Martin", coverUrl: "", description: "Epik fantezi seriyasi", price: 89000, category: "Yangi Nashrlar", bgColor: "210 60% 15%", enable3DFlip: true, featured: true },
  { id: "2", title: "Hobbit", author: "J.R.R. Tolkien", coverUrl: "", description: "Klassik fantezi sarguzasht", price: 65000, category: "Oltin Kolleksiya", bgColor: "120 40% 12%", enable3DFlip: true, featured: true },
  { id: "3", title: "1984", author: "Jorj Oruell", coverUrl: "", description: "Distopik roman", price: 55000, category: "Oltin Kolleksiya", bgColor: "0 30% 14%", enable3DFlip: true, featured: true },
  { id: "4", title: "Duna", author: "Frank Herbert", coverUrl: "", description: "Ilmiy-fantastika shoh asari", price: 95000, category: "Tez Kunda", bgColor: "35 50% 13%", enable3DFlip: true, featured: true },
  { id: "5", title: "Xarri Potter", author: "J.K. Rouling", coverUrl: "", description: "Sehr va sarguzasht dunyosi", price: 75000, category: "Yangi Nashrlar", bgColor: "270 40% 14%", enable3DFlip: true, featured: true },
  { id: "6", title: "Narnia Kundaliklari", author: "K.S. Lyuis", coverUrl: "", description: "Bolalar uchun fantezi", price: 60000, category: "Tez Kunda", bgColor: "180 30% 12%", enable3DFlip: false, featured: false },
  { id: "7", title: "Ender O'yini", author: "Orson Skott Kard", coverUrl: "", description: "Kosmik strategiya", price: 70000, category: "Yangi Nashrlar", bgColor: "200 40% 14%", enable3DFlip: false, featured: false },
  { id: "8", title: "Witcher", author: "Andrzej Sapkovski", coverUrl: "", description: "Qorong'u fantezi", price: 85000, category: "Oltin Kolleksiya", bgColor: "150 30% 10%", enable3DFlip: true, featured: false },
  { id: "9", title: "Yulduzlar Urushi", author: "Timothy Zan", coverUrl: "", description: "Kosmik opera", price: 78000, category: "Tez Kunda", bgColor: "220 50% 12%", enable3DFlip: false, featured: false },
  { id: "10", title: "Asoslar", author: "Ayzek Azimov", coverUrl: "", description: "Ilmiy-fantastika klassikasi", price: 72000, category: "Oltin Kolleksiya", bgColor: "45 30% 12%", enable3DFlip: true, featured: false },
];

const initialArticles: Article[] = [
  { id: "1", title: "Fantastika janrining kelajagi", excerpt: "O'zbek adabiyotida fantastika qanday rivojlanmoqda?", content: "", date: "2026-02-15", published: true },
  { id: "2", title: "Martin va uning olami", excerpt: "Muz va Olov Qo'shig'i seriyasining yaratilish tarixi.", content: "", date: "2026-02-10", published: true },
  { id: "3", title: "Tarjima san'ati", excerpt: "Zabarjad Media tarjima jarayoniga qanday yondashadi.", content: "", date: "2026-02-05", published: true },
  { id: "4", title: "Eng ko'p o'qilgan 5 kitob", excerpt: "2026-yil yanvar oyida eng mashhur kitoblar ro'yxati.", content: "", date: "2026-01-28", published: true },
  { id: "5", title: "Fantastik dunyo yaratish", excerpt: "Yozuvchilar qanday qilib o'z olamlarini qurishadi?", content: "", date: "2026-01-20", published: true },
  { id: "6", title: "Kitobxonlar uchun tavsiyalar", excerpt: "Qish oqshomlari uchun eng yaxshi kitoblar tanlovi.", content: "", date: "2026-01-15", published: true },
];

const initialQuizConfig: QuizConfig = {
  steps: [
    { question: "Qaysi janr sizga yoqadi?", options: [{ label: "Fantastika", value: "fantasy" }, { label: "Ilmiy-fantastika", value: "scifi" }, { label: "Klassik adabiyot", value: "classic" }] },
    { question: "Fantastik yoki real?", options: [{ label: "To'liq sehrli olam", value: "high" }, { label: "Bir oz sehr", value: "low" }, { label: "Butunlay real", value: "none" }] },
    { question: "Qorong'u yoki yorqin?", options: [{ label: "Qorong'u va dramatik", value: "dark" }, { label: "Sarguzashtli va quvnoq", value: "light" }, { label: "Aralash", value: "mixed" }] },
  ],
  paths: [
    { key: "fantasy-high-dark", bookId: "1", reason: "Qorong'u fantezi olamining shoh asari." },
    { key: "fantasy-low-light", bookId: "2", reason: "Sarguzashtga to'la sehrli sayohat!" },
    { key: "scifi-none-dark", bookId: "3", reason: "Kelajak haqidagi eng kuchli ogohlantirish." },
    { key: "scifi-high-mixed", bookId: "4", reason: "Ilm-fan va siyosatning ajoyib uyg'unligi." },
    { key: "classic-none-light", bookId: "6", reason: "Klassik sarguzasht va sehrli dunyo." },
  ],
  defaultBookId: "1",
  defaultReason: "Epik fantezi sevuvchilar uchun eng yaxshi tanlov!",
};

// ── Context ──
interface DataContextType {
  books: Book[];
  articles: Article[];
  quizConfig: QuizConfig;
  addBook: (book: Omit<Book, "id">) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addArticle: (article: Omit<Article, "id">) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  updateQuizConfig: (config: QuizConfig) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [quizConfig, setQuizConfig] = useState<QuizConfig>(initialQuizConfig);

  const addBook = (book: Omit<Book, "id">) => {
    setBooks((prev) => [...prev, { ...book, id: Date.now().toString() }]);
  };
  const updateBook = (id: string, data: Partial<Book>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
  };
  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };
  const addArticle = (article: Omit<Article, "id">) => {
    setArticles((prev) => [...prev, { ...article, id: Date.now().toString() }]);
  };
  const updateArticle = (id: string, data: Partial<Article>) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
  };
  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <DataContext.Provider value={{ books, articles, quizConfig, addBook, updateBook, deleteBook, addArticle, updateArticle, deleteArticle, updateQuizConfig: setQuizConfig }}>
      {children}
    </DataContext.Provider>
  );
};
