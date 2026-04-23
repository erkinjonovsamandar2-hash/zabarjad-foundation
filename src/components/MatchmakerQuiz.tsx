// @refresh reset
import { useState, useEffect } from "react";
import BookCover from "@/components/BookCover";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Download, Copy, Check, ArrowRight, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useLang, locField } from "@/context/LanguageContext";

import teaImg from "@/assets/quiz/tea.webp";
import bookImg from "@/assets/quiz/book.webp";
import compassImg from "@/assets/quiz/compass.webp";
import keyImg from "@/assets/quiz/key.webp";
import quizBg from "@/assets/hero/hero-bg8.webp";

import faylasufImg from "@/assets/quiz/archetypes/faylasuf.webp";
import kashfiyotchiImg from "@/assets/quiz/archetypes/kashfiyotchi.webp";
import ovchiImg from "@/assets/quiz/archetypes/ovchi.webp";
import doktorImg from "@/assets/quiz/archetypes/doktor.webp";

// ── Types ──────────────────────────────────────────────────────────────────────
type ArchetypeKey = "faylasuf" | "kashfiyotchi" | "ovchi" | "doktor";
type QuizPhase = "start" | "quiz" | "result" | "books";

interface Scores {
  faylasuf: number; kashfiyotchi: number; ovchi: number; doktor: number;
}
interface QuizOption { label: string; sublabel: string; img: string; scores: Scores; }
interface QuizStep { question: string; aunt: string; options: QuizOption[]; }
interface ArchetypeData {
  name: string; nameEn: string; tagline: string; desc: string;
  certLines: string[];
  img: string; primaryColor: string; accentColor: string; certBg: string; certBorder: string;
  genreKeys: string[];
}

// ── Archetypes ─────────────────────────────────────────────────────────────────
const ARCHETYPES: Record<ArchetypeKey, ArchetypeData> = {
  faylasuf: {
    name: "Kechgi Faylasuf", nameEn: "The Midnight Philosopher",
    tagline: '"So\'zlar tugasa ham, fikrlar ketmaydi..."',
    desc: "Siz teran fikrlovchi, ichki dunyosi boy kitobxonsiz. Har bir satrda yashirin ma'no qidirasiz — bitta jumla sizni soatlab sukunatga cho'ktirishi mumkin.",
    certLines: [
      "Kechasi o'qiysiz, tongda mulohaza qilasiz.",
      "Oddiy satrlar sizga ko'pchilik ko'rmagan narsani ko'rsatadi.",
      "Bir ibora sizni soatlab o'yga toldiradi.",
      "Kitobni yopsangiz ham, u sizdan ketmaydi.",
    ],
    img: faylasufImg, primaryColor: "#7A5C10", accentColor: "#C9A227",
    certBg: "#FDF6E3", certBorder: "#5C3D0A",
    genreKeys: ["falsafa", "falsafiy", "drama", "hikoya", "jahon", "klassik", "roman", "classic", "adabiyot"],
  },
  kashfiyotchi: {
    name: "Botir Kashfiyotchi", nameEn: "The Brave Explorer",
    tagline: '"Har kitob — yopiq eshikning kaliti..."',
    desc: "Siz sarguzasht va kashfiyot izlovchi kitobxonsiz. Bir asar tugamay, keyingisi allaqachon kutib turibdi. 'To'xtash' so'zi sizning lug'atingizda yo'q.",
    certLines: [
      "Sarguzasht sizning qoningizda oqadi.",
      "Bir kitob tugamay, keyingisi qo'lingizda.",
      "Yangi olam — yangi imkoniyat. Bu sizning yo'lingiz.",
      "Chegaralar siz uchun to'siq emas, taklif xolos.",
    ],
    img: kashfiyotchiImg, primaryColor: "#0B4F3F", accentColor: "#10B981",
    certBg: "#F0FDF8", certBorder: "#0B4F3F",
    genreKeys: ["sarguzasht", "fantastika", "fantasy", "qissa", "ilm", "biznes", "adventure", "tarix"],
  },
  ovchi: {
    name: "Sir Ovchisi", nameEn: "The Mystery Hunter",
    tagline: '"Har jumboq yechimini kutadi — sabr qilmasam ham..."',
    desc: "Siz zehn va mantiq egasisiz. Kitobdagi eng mayda tafsilotni ko'zdan qochirmaysiz, qotilni boshqalardan oldin topasiz va sirni oxirgi sahifaga qadar ichingizda saqlaysiz.",
    certLines: [
      "Har bir tafsilot sizga muhim ipuç.",
      "Qotilni boshqalar bilmasdan oldin topasiz.",
      "Yechilmagan jumboq sizni tinch qo'ymaydi.",
      "Mantiq — sizning eng ishonchli quroliz.",
    ],
    img: ovchiImg, primaryColor: "#27265C", accentColor: "#6366F1",
    certBg: "#F5F3FF", certBorder: "#1E1D5C",
    genreKeys: ["detektiv", "triller", "kriminal", "mystery", "fantastika", "psixologiya"],
  },
  doktor: {
    name: "Qalb Doktori", nameEn: "The Heart Healer",
    tagline: '"Ba\'zi kitoblar yig\'latadi — bu zaiflik emas, chuqurlik..."',
    desc: "Siz hissiyotga boy, empatik kitobxonsiz. Kitob qahramonlari sizga chin do'st bo'lib qoladi — ularning quvonchi va dardi sizning quvonching va dardingizga aylanadi.",
    certLines: [
      "Kitob qahramonlari sizning chin do'stlaringiz.",
      "Ularning dardi ham, quvonchi ham sizniki.",
      "Ba'zan ko'zingiz yoshlanadi — bu kuchning belgisi.",
      "Siz dunyoni aql bilan emas, yurak bilan his qilasiz.",
    ],
    img: doktorImg, primaryColor: "#6B1A2B", accentColor: "#F43F5E",
    certBg: "#FFF1F2", certBorder: "#6B1A2B",
    genreKeys: ["motivatsiya", "shaxsiy rivojlanish", "self-help", "adabiyot", "roman", "classic", "she'riyat"],
  },
};

// ── Fallback hooks (shown when QuizManager hasn't been configured) ──────────────
const FALLBACK_HOOKS: Record<ArchetypeKey, [string, string]> = {
  faylasuf: [
    "Bu kitobning bitta jumlasi sizni soatlab sukunatga cho'ktiradi.",
    "Oxirgi sahifani yopsangiz ham, fikrlar sizni tark etmaydi.",
  ],
  kashfiyotchi: [
    "Birinchi bobdan so'ng kitobni qo'yib bo'lmaydi.",
    "Bu olam sizni to'liq o'z ichiga tortib ketadi.",
  ],
  ovchi: [
    "Oxirgi sahifagacha qotilni aniqlay olmaysiz — so'z beramiz.",
    "Har bir jumla yangi ipuç. Zehn sinovi boshlanadi.",
  ],
  doktor: [
    "Bu kitobni o'qiyotib, hayotingizda kimnidir ko'z oldingizga keltirasiz.",
    "Oxirgi sahifada ko'zingiz yoshlanishi tayin.",
  ],
};

// ── Questions ──────────────────────────────────────────────────────────────────
const QUESTIONS: QuizStep[] = [
  {
    question: "Kechqurun bo'sh vaqtingizni qanday o'tkazasiz?",
    aunt: "Avval o'zingizni taniysizmi?.. ☕",
    options: [
      { label: "Choy va kitob", sublabel: "Sokin kech, chuqur fikrlar", img: teaImg, scores: { faylasuf: 3, kashfiyotchi: 0, ovchi: 0, doktor: 1 } },
      { label: "Podcast yoki hujjatli film", sublabel: "Yangi bilim, yangi nuqtai nazar", img: compassImg, scores: { faylasuf: 0, kashfiyotchi: 3, ovchi: 1, doktor: 0 } },
      { label: "Detektiv yoki triller", sublabel: "Sirlar meni o'ziga tortadi", img: keyImg, scores: { faylasuf: 0, kashfiyotchi: 1, ovchi: 3, doktor: 0 } },
      { label: "Do'stlar bilan gap-so'z", sublabel: "Insonlardan kuch olaman", img: bookImg, scores: { faylasuf: 1, kashfiyotchi: 0, ovchi: 0, doktor: 3 } },
    ],
  },
  {
    question: "Kitobdagi qaysi lahza sizni o'ziga ko'proq tortadi?",
    aunt: "Ko'nglingiz qayerda to'xtaydi? 📖",
    options: [
      { label: "Chuqur suhbat va falsafa", sublabel: "Hayotning ma'nosi qiziqtiradi", img: teaImg, scores: { faylasuf: 3, kashfiyotchi: 0, ovchi: 1, doktor: 1 } },
      { label: "Yangi olam va sarguzasht", sublabel: "Kashfiyot zavqi", img: compassImg, scores: { faylasuf: 0, kashfiyotchi: 3, ovchi: 1, doktor: 0 } },
      { label: "Kutilmagan burilish", sublabel: "Sir ochildi — nafas tutiladi!", img: keyImg, scores: { faylasuf: 1, kashfiyotchi: 0, ovchi: 3, doktor: 0 } },
      { label: "Yuraksizituvchan sahna", sublabel: "Hissiyotga to'la, esdan ketmas", img: bookImg, scores: { faylasuf: 1, kashfiyotchi: 0, ovchi: 0, doktor: 3 } },
    ],
  },
  {
    question: "Yangi kitob qo'lingizga qanday tushadi?",
    aunt: "Kitob do'koniga kirsangiz nima bo'ladi? 🏛️",
    options: [
      { label: "Muallif ismini tanib qolaman", sublabel: "Tanish qalam — ishonch uyg'otadi", img: teaImg, scores: { faylasuf: 3, kashfiyotchi: 0, ovchi: 1, doktor: 1 } },
      { label: "Muqova diqqatimni jalb qiladi", sublabel: "Ko'z — birinchi tanlov", img: compassImg, scores: { faylasuf: 0, kashfiyotchi: 3, ovchi: 1, doktor: 0 } },
      { label: "Annotatsiyani sinchiklab o'qiyman", sublabel: "Sir bor-yo'qligini tekshiraman", img: keyImg, scores: { faylasuf: 1, kashfiyotchi: 1, ovchi: 3, doktor: 0 } },
      { label: "Kimdir tavsiya qilgan", sublabel: "Ishonchli odam — ishonchli tavsiya", img: bookImg, scores: { faylasuf: 0, kashfiyotchi: 1, ovchi: 0, doktor: 3 } },
    ],
  },
  {
    question: "Kitob tugagach nima qilasiz?",
    aunt: "Oxirgi sahifa yopildi — keyin nima? ✨",
    options: [
      { label: "O'tirib, his-tuyg'ularni hazm qilaman", sublabel: "Sukunatda qolaman", img: teaImg, scores: { faylasuf: 3, kashfiyotchi: 0, ovchi: 0, doktor: 2 } },
      { label: "Darhol yangi asar boshlayman", sublabel: "To'xtashni bilmayman", img: compassImg, scores: { faylasuf: 0, kashfiyotchi: 3, ovchi: 1, doktor: 0 } },
      { label: "Barcha tafsilotlarni qayta tahlil qilaman", sublabel: "Sirni yana bir bor o'ylayman", img: keyImg, scores: { faylasuf: 1, kashfiyotchi: 0, ovchi: 3, doktor: 0 } },
      { label: "Kimgadir tavsiya qilaman", sublabel: "Bu hisni yolg'iz turolmayman", img: bookImg, scores: { faylasuf: 0, kashfiyotchi: 1, ovchi: 0, doktor: 3 } },
    ],
  },
  {
    question: "Qaysi qahramon sizga ko'proq yaqin?",
    aunt: "O'sha sahifalarda siz bo'lganingizda... 🤔",
    options: [
      { label: "Donishmand, yolg'iz ruh", sublabel: "Teran o'ylaydi, kamdan-kam so'zlaydi", img: teaImg, scores: { faylasuf: 3, kashfiyotchi: 0, ovchi: 1, doktor: 1 } },
      { label: "Jasur sarguzashtchi", sublabel: "Ortga qaytishni bilmaydi", img: compassImg, scores: { faylasuf: 0, kashfiyotchi: 3, ovchi: 1, doktor: 0 } },
      { label: "Ziyrak, sirli zehn", sublabel: "Har narsaning izini topadi", img: keyImg, scores: { faylasuf: 1, kashfiyotchi: 0, ovchi: 3, doktor: 0 } },
      { label: "Yumshoq, mehr-oqibatli inson", sublabel: "Hamma uchun qayg'uradi", img: bookImg, scores: { faylasuf: 1, kashfiyotchi: 0, ovchi: 0, doktor: 3 } },
    ],
  },
  {
    question: "O'qiyotganda ichingizda nima ko'proq bo'ladi?",
    aunt: "Eng muhim savol — ichingizda nima? 💫",
    options: [
      { label: "Chuqur o'y va yangi savollar", sublabel: "Dunyoga yangicha qarayman", img: teaImg, scores: { faylasuf: 3, kashfiyotchi: 0, ovchi: 1, doktor: 0 } },
      { label: "Qo'zg'alish va ilhom", sublabel: "Harakat qilgim kelib ketadi", img: compassImg, scores: { faylasuf: 0, kashfiyotchi: 3, ovchi: 0, doktor: 1 } },
      { label: "Shiddatli sabrsizlik", sublabel: "Keyinida nima bo'lishini bilgim keladi", img: keyImg, scores: { faylasuf: 0, kashfiyotchi: 1, ovchi: 3, doktor: 0 } },
      { label: "Qalb isishi va ba'zan yig'i", sublabel: "His-tuyg'ular meni to'ldirib ketadi", img: bookImg, scores: { faylasuf: 1, kashfiyotchi: 0, ovchi: 0, doktor: 3 } },
    ],
  },
];

// ── Scoring ────────────────────────────────────────────────────────────────────
function computeResult(all: Scores[]): { key: ArchetypeKey; matchPct: number } {
  const total: Scores = { faylasuf: 0, kashfiyotchi: 0, ovchi: 0, doktor: 0 };
  for (const s of all) (Object.keys(s) as ArchetypeKey[]).forEach(k => { total[k] += s[k]; });
  const maxPossible = all.length * 3;
  const sorted = (Object.entries(total) as [ArchetypeKey, number][]).sort((a, b) => b[1] - a[1]);
  const [topKey, topScore] = sorted[0];
  return { key: topKey, matchPct: Math.min(99, Math.round((topScore / maxPossible) * 100) + 18) };
}

// ── SVG Certificate ────────────────────────────────────────────────────────────
async function imgToBase64(src: string): Promise<string> {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth || 200; c.height = img.naturalHeight || 200;
      try { c.getContext("2d")!.drawImage(img, 0, 0); resolve(c.toDataURL("image/png")); }
      catch { resolve(""); }
    };
    img.onerror = () => resolve("");
    img.src = src;
  });
}

async function generateCertPng(arch: ArchetypeData, matchPct: number): Promise<string> {
  const base64 = await imgToBase64(arch.img);
  const serial = `BT-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
  const _now = new Date();
  const _months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
  const date = `${_now.getDate()} ${_months[_now.getMonth()]} ${_now.getFullYear()}-yil`;
  const W = 600, H = 760;

  const imgEl = base64
    ? `<image href="${base64}" x="205" y="166" width="190" height="190" clip-path="url(#circ)" preserveAspectRatio="xMidYMid slice"/>`
    : `<circle cx="300" cy="261" r="95" fill="${arch.primaryColor}" opacity="0.15"/>`;

  const descTspans = arch.certLines
    .map((line, i) => `<tspan x="300" dy="${i === 0 ? 0 : 18}">${line}</tspan>`)
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}">
  <defs><clipPath id="circ"><circle cx="300" cy="261" r="95"/></clipPath></defs>
  <rect width="${W}" height="${H}" fill="${arch.certBg}"/>
  <rect x="0" y="0" width="${W}" height="7" fill="${arch.accentColor}" opacity="0.85"/>
  <rect x="0" y="${H - 7}" width="${W}" height="7" fill="${arch.accentColor}" opacity="0.85"/>
  <rect x="18" y="18" width="${W - 36}" height="${H - 36}" fill="none" stroke="${arch.certBorder}" stroke-width="2.5"/>
  <rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke="${arch.certBorder}" stroke-width="0.7" opacity="0.35"/>
  <text x="22" y="55" font-size="20" fill="${arch.accentColor}" font-family="serif" opacity="0.75">✦</text>
  <text x="${W - 42}" y="55" font-size="20" fill="${arch.accentColor}" font-family="serif" opacity="0.75">✦</text>
  <text x="22" y="${H - 22}" font-size="20" fill="${arch.accentColor}" font-family="serif" opacity="0.75">✦</text>
  <text x="${W - 42}" y="${H - 22}" font-size="20" fill="${arch.accentColor}" font-family="serif" opacity="0.75">✦</text>
  <text x="${W / 2}" y="62" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="5" fill="${arch.certBorder}" font-weight="bold" opacity="0.8">BOOKTOPIA NASHRIYOTI</text>
  <line x1="70" y1="72" x2="${W - 70}" y2="72" stroke="${arch.certBorder}" stroke-width="0.5" opacity="0.3"/>
  <text x="${W / 2}" y="98" text-anchor="middle" font-family="Georgia,serif" font-size="23" letter-spacing="2" fill="${arch.certBorder}" font-weight="bold">KITOBXON GUVOHNOMASI</text>
  <text x="${W / 2}" y="117" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" letter-spacing="4" fill="${arch.primaryColor}" opacity="0.7">READER IDENTITY CERTIFICATE</text>
  <line x1="70" y1="128" x2="${W - 70}" y2="128" stroke="${arch.certBorder}" stroke-width="0.5" opacity="0.3"/>
  <text x="${W / 2}" y="152" text-anchor="middle" font-family="Georgia,serif" font-size="11.5" fill="${arch.certBorder}" opacity="0.6" font-style="italic">Ushbu guvohnoma rasmiy tasdiqlaydi:</text>
  ${imgEl}
  <circle cx="300" cy="261" r="95" fill="none" stroke="${arch.accentColor}" stroke-width="3.5"/>
  <circle cx="300" cy="261" r="101" fill="none" stroke="${arch.certBorder}" stroke-width="0.6" opacity="0.2"/>
  <rect x="70" y="384" width="${W - 140}" height="62" fill="${arch.certBorder}" rx="3"/>
  <text x="${W / 2}" y="408" text-anchor="middle" font-family="Georgia,serif" font-size="21" letter-spacing="1" fill="${arch.certBg}" font-weight="bold">${arch.name}</text>
  <text x="${W / 2}" y="430" text-anchor="middle" font-family="Georgia,serif" font-size="9" letter-spacing="3.5" fill="${arch.accentColor}">${arch.nameEn.toUpperCase()}</text>
  <text x="${W / 2}" y="466" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="${arch.certBorder}" font-style="italic" opacity="0.82">${arch.tagline}</text>
  <line x1="90" y1="480" x2="${W - 90}" y2="480" stroke="${arch.certBorder}" stroke-width="0.5" opacity="0.2"/>
  <text x="${W / 2}" y="500" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="${arch.certBorder}" opacity="0.65">${descTspans}</text>
  <text x="${W / 2}" y="572" text-anchor="middle" font-family="serif" font-size="13" fill="${arch.accentColor}" opacity="0.6">· · ✦ · ·</text>
  <text x="${W / 2}" y="598" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="${arch.certBorder}" opacity="0.5" letter-spacing="2">MOSLIK DARAJASI: ${matchPct}%</text>
  <rect x="130" y="607" width="340" height="3" fill="${arch.certBorder}" opacity="0.1" rx="1.5"/>
  <rect x="130" y="607" width="${Math.round(340 * matchPct / 100)}" height="3" fill="${arch.accentColor}" opacity="0.75" rx="1.5"/>
  <line x1="70" y1="628" x2="${W - 70}" y2="628" stroke="${arch.certBorder}" stroke-width="0.5" opacity="0.25"/>
  <text x="78" y="648" font-family="Georgia,serif" font-size="9" fill="${arch.certBorder}" opacity="0.5">${date}</text>
  <text x="${W / 2}" y="648" text-anchor="middle" font-family="Georgia,serif" font-size="9" fill="${arch.certBorder}" opacity="0.5">Raqam: ${serial}</text>
  <text x="${W - 78}" y="648" text-anchor="end" font-family="Georgia,serif" font-size="9" fill="${arch.certBorder}" opacity="0.5">booktopia.uz/quiz</text>
  <text x="${W / 2}" y="670" text-anchor="middle" font-family="Georgia,serif" font-size="8.5" fill="${arch.certBorder}" opacity="0.3" font-style="italic">Kitob — eng yaxshi do\'st.</text>
</svg>`;

  return new Promise<string>((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = W * 2; canvas.height = H * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const im = new Image();
    im.onload = () => { ctx.drawImage(im, 0, 0, W, H); URL.revokeObjectURL(url); resolve(canvas.toDataURL("image/png", 1.0)); };
    im.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    im.src = url;
  });
}

// ── Component ──────────────────────────────────────────────────────────────────
const MatchmakerQuiz = () => {
  const { books, quizConfig } = useData();
  const { lang } = useLang();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<QuizPhase>("start");
  const [step, setStep] = useState(0);
  const [answerScores, setAnswerScores] = useState<Scores[]>([]);
  const [result, setResult] = useState<{ key: ArchetypeKey; matchPct: number } | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bgReady, setBgReady] = useState(false);

  // Lazy-load background after first paint so it never blocks quiz render
  useEffect(() => {
    const img = new Image();
    img.onload = () => setBgReady(true);
    img.src = quizBg;
  }, []);

  const totalSteps = QUESTIONS.length;
  const current = QUESTIONS[step];

  const getImgUrl = (url?: string | null): string | null => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${import.meta.env.VITE_SUPABASE_URL as string}/storage/v1/object/public/${url}`;
  };

  const handleAnswer = (scores: Scores) => {
    const next = [...answerScores, scores];
    setAnswerScores(next);
    if (step < totalSteps - 1) setStep(step + 1);
    else { setResult(computeResult(next)); setPhase("result"); }
  };

  const handleReset = () => {
    setPhase("start"); setStep(0); setAnswerScores([]);
    setResult(null); setDownloading(false); setCopied(false);
  };

  const handleDownload = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const png = await generateCertPng(ARCHETYPES[result.key], result.matchPct);
      const a = document.createElement("a");
      a.href = png; a.download = `kitobxon-guvohnoma-${result.key}.png`; a.click();
    } catch (e) { console.error("cert gen failed", e); }
    finally { setDownloading(false); }
  };

  const handleCopy = () => {
    if (!result) return;
    const a = ARCHETYPES[result.key];
    navigator.clipboard.writeText(
      `Men — ${a.name}man! Moslik: ${result.matchPct}%.\n${a.tagline}\n\nO'z kitobxon turingizni toping:\nbooktopia.uz/quiz`
    ).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  // ── Book resolution via quizConfig paths ──────────────────────────────────────
  // Admin sets paths with key = archetype key (e.g. "faylasuf") and key+"_2" for second book.
  // Falls back to category search, then any available book.
  const resolveBooks = (key: ArchetypeKey) => {
    const arch = ARCHETYPES[key];

    const path1 = quizConfig.paths.find(p => p.key === key);
    const path2 = quizConfig.paths.find(p => p.key === `${key}_2`);

    const bkById = (id?: string) => id ? books.find(b => b.id === id) ?? null : null;
    const bkByGenre = (exclude?: string) => books.find(b => {
      if (b.id === exclude) return false;
      const cat = ((b as any).category || "").toLowerCase();
      return arch.genreKeys.some(k => cat.includes(k));
    }) ?? null;
    const anyBook = (exclude?: string) => books.find(b => b.id !== exclude) ?? books[0] ?? null;

    const book1 = bkById(path1?.bookId) ?? bkByGenre() ?? anyBook();
    const book2 = bkById(path2?.bookId) ?? bkByGenre(book1?.id) ?? anyBook(book1?.id);

    const hook1 = path1?.reason?.trim() || FALLBACK_HOOKS[key][0];
    const hook2 = path2?.reason?.trim() || FALLBACK_HOOKS[key][1];

    return { book1, book2, hook1, hook2 };
  };

  // Books for browse phase — up to 6
  const archetypeBooks = result ? (() => {
    const keys = ARCHETYPES[result.key].genreKeys;
    const matched = books.filter(bk =>
      keys.some(k => ((bk as any).category || "").toLowerCase().includes(k))
    ).slice(0, 6);
    if (matched.length >= 3) return matched;
    const others = books.filter(b => !matched.includes(b));
    return [...matched, ...others.slice(0, 6 - matched.length)];
  })() : [];

  const arch = result ? ARCHETYPES[result.key] : null;
  const resolved = result ? resolveBooks(result.key) : null;

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Instant gradient fallback — shows before bg image loads */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted" />
        {/* Background image fades in once loaded — never blocks first paint */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{ backgroundImage: bgReady ? `url(${quizBg})` : "none", opacity: bgReady ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-background/65" />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center py-24 sm:py-32 px-4 sm:px-6">
        <div className="w-full max-w-2xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ── START ─────────────────────────────────────────────────────── */}
            {phase === "start" && (
              <motion.div key="start"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center">

                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 mb-6 shadow-[0_4px_15px_rgba(236,72,153,0.12)]">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-pink-600 dark:text-pink-400">Kitob sovchilari</span>
                </div>

                <div className="flex justify-center gap-3 mb-8">
                  {(Object.entries(ARCHETYPES) as [ArchetypeKey, ArchetypeData][]).map(([key, a], i) => (
                    <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.15, duration: 0.5 }}>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-lg"
                        style={{ border: `3px solid ${a.accentColor}` }}>
                        <img src={a.img} alt={a.name} width={64} height={64} loading="eager" decoding="async" className="w-full h-full object-cover" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground leading-[1.05] tracking-wide mb-4 drop-shadow-sm">
                  Siz qanday<br />kitobxonsiz?
                </h1>
                <p className="font-lora text-base sm:text-lg text-muted-foreground mb-2 max-w-sm mx-auto leading-relaxed">
                  Oltita savol — hayot, kitoblar va o'zingiz haqida.
                </p>
                <p className="font-sans text-sm text-muted-foreground/55 mb-8 tracking-wide">
                  4 ta noyob kitobxon turi · taxminan 2 daqiqa
                </p>

                <motion.button onClick={() => setPhase("quiz")}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-heading font-bold text-lg tracking-wide bg-foreground text-background shadow-xl hover:shadow-2xl transition-all duration-300">
                  <Sparkles className="w-5 h-5" />
                  O'zimni kashf etaman
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}

            {/* ── QUIZ ──────────────────────────────────────────────────────── */}
            {phase === "quiz" && (
              <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

                <div className="mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="font-sans text-[11px] font-bold text-muted-foreground/55 uppercase tracking-widest">
                      {step + 1} / {totalSteps} savol
                    </span>
                    <span className="font-sans text-[11px] font-bold text-muted-foreground/55 uppercase tracking-widest">
                      {Math.round((step / totalSteps) * 100)}% bajarildi
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div className="h-full rounded-full bg-foreground"
                      animate={{ width: `${(step / totalSteps) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }} />
                  </div>
                </div>

                <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <AnimatePresence mode="wait">
                    <motion.div key={`q-${step}`}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>

                      <p className="font-lora italic text-sm text-accent font-medium mb-2 text-center">
                        {current.aunt}
                      </p>
                      <h2 className="font-heading text-xl sm:text-2xl font-black text-foreground text-center mb-6 leading-tight tracking-wide">
                        {current.question}
                      </h2>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {current.options.map((opt, i) => (
                          <motion.button key={i} onClick={() => handleAnswer(opt.scores)}
                            whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="group flex flex-col items-center text-center rounded-2xl p-4 cursor-pointer
                              bg-white/50 dark:bg-black/25 border border-white/60 dark:border-white/10
                              hover:border-foreground/30 shadow-sm hover:shadow-lg
                              transition-[border-color,box-shadow] duration-200 will-change-transform">
                            <div className="w-14 h-14 mb-3 rounded-full overflow-hidden bg-background/80 flex items-center justify-center shrink-0
                              border-2 border-border/50 group-hover:border-foreground/30 transition-[border-color] duration-200">
                              <img src={opt.img} alt={opt.label} width={36} height={36} loading="lazy" decoding="async" className="w-9 h-9 object-contain" draggable={false} />
                            </div>
                            <p className="font-heading text-[14px] sm:text-[15px] font-bold leading-tight mb-1
                              text-foreground group-hover:text-accent transition-colors duration-300 tracking-wide">
                              {opt.label}
                            </p>
                            <p className="font-sans text-[12px] text-muted-foreground leading-relaxed">
                              {opt.sublabel}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ── RESULT ────────────────────────────────────────────────────── */}
            {phase === "result" && result && arch && resolved && (
              <motion.div key="result"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}>

                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20"
                  style={{ background: arch.certBg }}>

                  {/* Archetype identity */}
                  <div className="p-8 sm:p-10 text-center">
                    <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.65, type: "spring", stiffness: 180, damping: 18 }}
                      className="relative inline-block mb-6">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mx-auto shadow-2xl"
                        style={{ border: `4px solid ${arch.accentColor}` }}>
                        <img src={arch.img} alt={arch.name} width={160} height={160} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 rounded-full -z-10 blur-2xl opacity-20"
                        style={{ background: arch.accentColor, transform: "scale(1.5)" }} />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}>
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
                        style={{ color: arch.primaryColor }}>Sizning kitobxon siymongiz</p>
                      <h2 className="font-heading text-3xl sm:text-4xl font-black tracking-wide mb-1 leading-tight"
                        style={{ color: arch.certBorder }}>{arch.name}</h2>
                      <p className="font-sans text-xs font-bold tracking-[0.18em] mb-4 uppercase opacity-50"
                        style={{ color: arch.primaryColor }}>{arch.nameEn}</p>
                      <p className="font-lora italic text-base leading-relaxed max-w-sm mx-auto mb-5"
                        style={{ color: arch.certBorder, opacity: 0.8 }}>{arch.tagline}</p>

                      {/* Match meter */}
                      <div className="max-w-xs mx-auto mb-5">
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-40"
                            style={{ color: arch.certBorder }}>Mos kelish darajasi</span>
                          <span className="font-heading text-xl font-black" style={{ color: arch.accentColor }}>
                            {result.matchPct}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: `${arch.certBorder}18` }}>
                          <motion.div className="h-full rounded-full"
                            initial={{ width: "0%" }} animate={{ width: `${result.matchPct}%` }}
                            transition={{ delay: 0.65, duration: 1, ease: "easeOut" }}
                            style={{ background: arch.accentColor }} />
                        </div>
                      </div>

                      <p className="font-lora text-sm leading-relaxed max-w-sm mx-auto"
                        style={{ color: arch.certBorder, opacity: 0.65 }}>{arch.desc}</p>
                    </motion.div>
                  </div>

                  <div className="h-px mx-8" style={{ background: `${arch.certBorder}15` }} />

                  {/* Two book recommendations */}
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.45 }}
                    className="p-6 sm:p-8 space-y-4">

                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: arch.primaryColor }}>Sizga maxsus tanlov</p>

                    {[
                      { book: resolved.book1, hook: resolved.hook1, label: "Birinchi asar" },
                      { book: resolved.book2, hook: resolved.hook2, label: "Ikkinchi asar" },
                    ].map(({ book, hook, label }, idx) => book ? (
                      <div key={idx}
                        className="flex items-start gap-4 rounded-2xl p-4 transition-all duration-200 cursor-pointer group hover:opacity-90"
                        style={{ background: `${arch.certBorder}08`, border: `1px solid ${arch.certBorder}18` }}
                        onClick={() => navigate(`/book/${(book as any).id}`)}>

                        {/* Book cover */}
                        <div className="shrink-0 w-14 sm:w-16">
                          <BookCover
                            src={getImgUrl((book as any).cover_url)}
                            alt={locField(book, "title", lang)}
                            className="w-full"
                            hover={false}
                            loading="lazy"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] mb-0.5 opacity-40"
                            style={{ color: arch.certBorder }}>{label}</p>
                          <h4 className="font-heading text-base font-black text-foreground leading-tight mb-0.5 tracking-wide line-clamp-2">
                            {locField(book, "title", lang)}
                          </h4>
                          <p className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-2">
                            {locField(book, "author", lang)}
                          </p>
                          {/* Hook / interesting fact */}
                          <p className="font-lora italic text-[13px] leading-snug"
                            style={{ color: arch.certBorder, opacity: 0.72 }}>
                            "{hook}"
                          </p>
                        </div>

                        <ArrowRight className="w-4 h-4 shrink-0 opacity-25 group-hover:opacity-60 transition-opacity mt-1"
                          style={{ color: arch.certBorder }} />
                      </div>
                    ) : null)}
                  </motion.div>

                  <div className="h-px mx-8" style={{ background: `${arch.certBorder}15` }} />

                  {/* Actions */}
                  <div className="px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-center gap-3 flex-wrap">
                    <motion.button onClick={() => setPhase("books")}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
                        font-heading font-bold text-sm tracking-wide shadow-md transition-all duration-300"
                      style={{ background: arch.accentColor, color: "#fff" }}>
                      <Library className="w-4 h-4" />
                      Ko'proq asarlar
                    </motion.button>

                    <motion.button onClick={handleDownload} disabled={downloading}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
                        font-heading font-bold text-sm tracking-wide border-2 transition-all duration-300 disabled:opacity-60"
                      style={{ borderColor: arch.certBorder, color: arch.certBorder, background: "transparent" }}>
                      <Download className="w-4 h-4" />
                      {downloading ? "Tayyorlanmoqda..." : "Guvohnomani yuklab olish"}
                    </motion.button>

                    <motion.button onClick={handleCopy}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl
                        font-heading font-bold text-sm tracking-wide border-2 transition-all duration-300"
                      style={{ borderColor: `${arch.certBorder}55`, color: arch.primaryColor, background: "transparent" }}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Nusxalandi!" : "Ulashish (Telegram)"}
                    </motion.button>

                    <button onClick={handleReset}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground
                        hover:text-foreground transition-colors px-3 py-2 opacity-45 hover:opacity-100">
                      <RotateCcw className="h-3 w-3" /> Qaytadan
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── BOOKS PHASE ───────────────────────────────────────────────── */}
            {phase === "books" && result && arch && (
              <motion.div key="books"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease: "easeOut" }}>

                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl"
                      style={{ border: `3px solid ${arch.accentColor}` }}>
                      <img src={arch.img} alt={arch.name} width={64} height={64} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] mb-1"
                    style={{ color: arch.primaryColor }}>{arch.name} uchun maxsus</p>
                  <h2 className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-wide">
                    Sizga mo'ljallangan asarlar
                  </h2>
                  <p className="font-lora text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                    Kitobxon siymonzingizga mos, tetik va qiziqarli asarlar
                  </p>
                </div>

                {archetypeBooks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {archetypeBooks.map((bk, i) => (
                      <motion.div key={(bk as any).id ?? i}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        className="group bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10
                          rounded-2xl p-3 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        onClick={() => navigate(`/book/${(bk as any).id}`)}>
                        <BookCover
                          src={getImgUrl((bk as any).cover_url)}
                          alt={locField(bk, "title", lang)}
                          className="w-full mb-3"
                          hover={true}
                          loading="lazy"
                        />
                        <h4 className="font-heading text-sm font-bold text-foreground leading-tight mb-0.5 line-clamp-2 tracking-wide">
                          {locField(bk, "title", lang)}
                        </h4>
                        <p className="font-sans text-[11px] text-muted-foreground font-bold uppercase tracking-wide truncate">
                          {locField(bk, "author", lang)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden bg-white/30 dark:bg-black/15 border border-white/40 dark:border-white/10 p-3">
                        <div className="skeleton-shimmer w-full aspect-[2/3] rounded-lg mb-3" />
                        <div className="skeleton-shimmer h-3.5 rounded w-3/4 mb-1.5" />
                        <div className="skeleton-shimmer h-3 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 mt-8">
                  <button onClick={() => setPhase("result")}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground
                      hover:text-foreground transition-colors opacity-60 hover:opacity-100">
                    ← Natijaga qaytish
                  </button>
                  <button onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground
                      hover:text-foreground transition-colors px-3 py-2 opacity-45 hover:opacity-100">
                    <RotateCcw className="h-3.5 w-3.5" /> Testni yangilash
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section >
  );
};

export default MatchmakerQuiz;
