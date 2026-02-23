import React, { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "uz" | "ru" | "en";

const translations = {
  uz: {
    nav: {
      home: "Bosh sahifa",
      spotlight: "Taxtlar o'yini",
      library: "Kutubxona",
      blog: "Blog",
      quiz: "Kitob sovchilari",
      contact: "Aloqa",
    },
    hero: {
      badge: "Premium nashriyot",
      cta: "Kitoblarni ko'rish",
    },
    spotlight: {
      badge: "Taxtlar o'yini",
      title: "Muz va olov qo'shig'i",
      desc: "Jorj R.R. Martinning epik fantaziya olami — endi o'zbek tilida. Vesteros xaritasini kashf eting.",
      mapLabel: "Vesteros xaritasi",
      hotspots: {
        winterfell: { label: "Winterfell", lore: "Shimolning eng qadimgi qal'asi. Stark oilasining uyi. Minglab yillardan beri muzlik devorning janubida turgan bu qal'a haqiqiy kuch va sadoqat ramzidir." },
        "kings-landing": { label: "King's Landing", lore: "Yetti Qirollikning poytaxti. Temir Taxt shu yerda joylashgan. Siyosiy fitna va hokimiyat uchun kurash markazida turgan shahar." },
        wall: { label: "The Wall", lore: "700 fut balandlikdagi muzdan qurilgan devor. Tungi Qo'riqchilar uni 8000 yildan beri qo'riqlaydi. Devor ortida esa noma'lum xavflar yashiringan." },
      },
    },
    library: {
      badge: "Kutubxona",
      title: "Tanlangan kitoblar",
      filters: { new: "Yangi nashrlar", soon: "Tez kunda", gold: "Oltin kolleksiya" },
      peekInside: "Ichiga qarang →",
    },
    quiz: {
      badge: "Kitob tanlash",
      title: "Bugun qaysi olamga sayohat qilamiz?",
      desc: "3 ta oddiy savolga javob bering va sizga mos kitobni topamiz.",
      result: "Sizga tavsiyamiz:",
      giftBadge: "Bepul sovg'a oling!",
      giftDesc: "Elektron pochta manzilingizni qoldiring va bepul raqamli soundtrack + HD fon rasmi oling.",
      send: "Yuborish",
      thanks: "Rahmat! 🎉",
      giftSent: "Sovg'a elektron pochtangizga yuborildi.",
      restart: "Qaytadan boshlash",
    },
    blog: {
      badge: "Zabarjad kundaligi",
      title: "So'nggi maqolalar",
    },
    footer: {
      heading: "Zabarjad oilasiga qo'shiling.",
      desc: "Yangi nashrlar, maxsus takliflar va adabiyot dunyosidan xabarlar olish uchun bizga qo'shiling.",
      address: "Manzil",
      contact: "Aloqa",
      rights: "Barcha huquqlar himoyalangan.",
      mapTitle: "Bizning manzil",
    },
    seeAll: "Hammasini ko'rish",
  },
  ru: {
    nav: {
      home: "Главная",
      spotlight: "Игра престолов",
      library: "Библиотека",
      blog: "Блог",
      quiz: "Книжная сваха",
      contact: "Контакт",
    },
    hero: {
      badge: "Премиум издательство",
      cta: "Смотреть книги",
    },
    spotlight: {
      badge: "Игра престолов",
      title: "Песнь Льда и Огня",
      desc: "Эпический фэнтези мир Джорджа Р.Р. Мартина — теперь на узбекском языке. Исследуйте карту Вестероса.",
      mapLabel: "Карта Вестероса",
      hotspots: {
        winterfell: { label: "Винтерфелл", lore: "Древнейший замок Севера. Дом семьи Старков. Тысячелетиями стоит у южной стороны Ледяной Стены — символ силы и верности." },
        "kings-landing": { label: "Королевская Гавань", lore: "Столица Семи Королевств. Здесь находится Железный Трон. Город политических интриг и борьбы за власть." },
        wall: { label: "Стена", lore: "Ледяная стена высотой 700 футов. Ночной Дозор охраняет её уже 8000 лет. За стеной скрываются неведомые опасности." },
      },
    },
    library: {
      badge: "Библиотека",
      title: "Избранные книги",
      filters: { new: "Новые издания", soon: "Скоро", gold: "Золотая коллекция" },
      peekInside: "Заглянуть внутрь →",
    },
    quiz: {
      badge: "Подбор книги",
      title: "В какой мир отправимся сегодня?",
      desc: "Ответьте на 3 простых вопроса и мы подберём для вас книгу.",
      result: "Наша рекомендация:",
      giftBadge: "Получите бесплатный подарок!",
      giftDesc: "Оставьте email и получите бесплатный цифровой саундтрек + HD обои.",
      send: "Отправить",
      thanks: "Спасибо! 🎉",
      giftSent: "Подарок отправлен на вашу почту.",
      restart: "Начать заново",
    },
    blog: {
      badge: "Дневник Забарджада",
      title: "Последние статьи",
    },
    footer: {
      heading: "Присоединяйтесь к семье Забарджад.",
      desc: "Получайте новости о новых изданиях, специальных предложениях и событиях из мира литературы.",
      address: "Адрес",
      contact: "Контакт",
      rights: "Все права защищены.",
      mapTitle: "Наш адрес",
    },
    seeAll: "Показать все",
  },
  en: {
    nav: {
      home: "Home",
      spotlight: "Game of Thrones",
      library: "Library",
      blog: "Blog",
      quiz: "Book Matchmaker",
      contact: "Contact",
    },
    hero: {
      badge: "Premium publishing",
      cta: "Browse books",
    },
    spotlight: {
      badge: "Game of Thrones",
      title: "A Song of Ice and Fire",
      desc: "George R.R. Martin's epic fantasy world — now in Uzbek. Explore the map of Westeros.",
      mapLabel: "Map of Westeros",
      hotspots: {
        winterfell: { label: "Winterfell", lore: "The oldest fortress of the North. Home of House Stark. For thousands of years it has stood south of the Ice Wall — a true symbol of strength and loyalty." },
        "kings-landing": { label: "King's Landing", lore: "Capital of the Seven Kingdoms. The Iron Throne resides here. A city at the center of political intrigue and the struggle for power." },
        wall: { label: "The Wall", lore: "A 700-foot-tall wall made of ice. The Night's Watch has guarded it for 8,000 years. Beyond the wall lie unknown dangers." },
      },
    },
    library: {
      badge: "Library",
      title: "Curated Books",
      filters: { new: "New Releases", soon: "Coming Soon", gold: "Gold Collection" },
      peekInside: "Peek inside →",
    },
    quiz: {
      badge: "Book Finder",
      title: "Which world shall we explore today?",
      desc: "Answer 3 simple questions and we'll find the perfect book for you.",
      result: "Our recommendation:",
      giftBadge: "Get a free gift!",
      giftDesc: "Leave your email and receive a free digital soundtrack + HD wallpaper.",
      send: "Submit",
      thanks: "Thank you! 🎉",
      giftSent: "Your gift has been sent to your email.",
      restart: "Start over",
    },
    blog: {
      badge: "Zabarjad Diary",
      title: "Latest Articles",
    },
    footer: {
      heading: "Join the Zabarjad family.",
      desc: "Stay updated on new releases, exclusive offers, and news from the world of literature.",
      address: "Address",
      contact: "Contact",
      rights: "All rights reserved.",
      mapTitle: "Our location",
    },
    seeAll: "See all",
  },
} as const;

export type Translations = typeof translations["uz"] | typeof translations["ru"] | typeof translations["en"];

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("zabarjad-lang") as Lang) || "uz";
    }
    return "uz";
  });

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("zabarjad-lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Helper to get localized field from DB objects
export const locField = (obj: Record<string, any>, field: string, lang: Lang): string => {
  if (lang === "uz") return obj[field] || "";
  const localized = obj[`${field}_${lang}`];
  return localized || obj[field] || "";
};
