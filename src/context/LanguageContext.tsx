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
      cta: "Kutubxonani ko'zdan kechirish",
    },
    spotlight: {
      badge: "Taxtlar o'yini",
      title: "Muz va Olov Qo'shig'i",
      desc: "Jorj R.R. Martinning epik fantaziya olami — o'zbek tilida. Vesteros xaritasiga qadam bosing va voqealar markaziga tushing.",
      mapLabel: "Vesteros xaritasi",
      hotspots: {
        winterfell: { label: "Winterfell", lore: "Shimolning qadimiy qal'asi. Stark sulolasining beshigi. Ming yillardan buyon muzlik devorning janubida tik turgan bu istehkom kuch va sadoqatning tirik ramzidir." },
        "kings-landing": { label: "King's Landing", lore: "Yetti Qirollikning poytaxti — Temir Taxt taxtgohining o'zi. Siyosiy fitna va qonli kurashlar markazida joylashgan bu shahar hokimiyatning eng qoq qalbiga tortadi." },
        wall: { label: "The Wall", lore: "700 fut balandlikdagi muzdan tiklangan devor. Tungi Qo'riqchilar uni 8000 yildan buyon qo'riqlaydi. Devor nariyog'ida esa nominomi noma'lum va shu bilan qo'rqinchli xavflar poylab turadi." },
      },
    },
    library: {
      badge: "Kutubxona",
      title: "Tanlangan asarlar",
      filters: { new: "Yangi nashrlar", soon: "Tez orada", gold: "Oltin to'plam" },
      peekInside: "Sahifalarga nazar tashla →",
    },
    quiz: {
      badge: "Kitob tanlash",
      title: "Bugun qaysi olamga sayohat qilamiz?",
      desc: "Oltita savol — o'zingiz haqingizda, kitoblar haqida. Javoblar sizga mos asarni ko'rsatadi.",
      result: "Sizga tavsiyamiz:",
      giftBadge: "Bepul sovg'angiz tayyor!",
      giftDesc: "Elektron manzilingizni qoldiring — raqamli soundtrack va HD fon rasmini birgalikda yuboramiz.",
      send: "Yuborish",
      thanks: "Rahmat! 🎉",
      giftSent: "Sovg'a elektron pochtangizga jo'natildi.",
      restart: "Qaytadan urinib ko'rish",
    },
    blog: {
      badge: "Booktopia kundaligi",
      title: "So'nggi maqolalar",
    },
    footer: {
      heading: "Booktopia oilasiga qo'shiling.",
      desc: "Yangi nashrlar, maxsus takliflar va adabiyot dunyosidagi yangiliklar — barchasi bir joyda.",
      address: "Manzil",
      contact: "Aloqa",
      rights: "Barcha huquqlar himoyalangan.",
      mapTitle: "Bizning manzil",
      activityHeading: "Faoliyat",
      publisherHeading: "Nashriyot",
      legalHeading: "Huquqiy",
      allBooks: "Barcha kitoblar",
      newReleases: "Yangi nashrlar",
      authorsTranslators: "Mualliflar va tarjimonlar",
      aboutUs: "Biz haqimizda",
      diary: "Booktopia kundaligi",
      contactCollab: "Aloqa va hamkorlik",
      publicOffer: "Ommaviy oferta",
      privacyPolicy: "Maxfiylik siyosati",
      termsOfUse: "Foydalanish shartlari",
      delivery: "Yetkazib berish",
      brandDesc: "Jahon va o'zbek adabiyotining eng sara durdonalarini — sifatli tarjima va zamonaviy chop etish bilan — o'z xondoniga yetkazuvchi premium nashriyot.",
      madeWithLove: "MEHR BILAN YARATILDI",
    },
    search: {
      placeholder: "Kitob yoki muallif nomini kiriting...",
      startTyping: "Izlash uchun yozishni boshlang...",
      notFound: "Hech narsa topilmadi",
      notFoundDesc: "so'ziga mos kitob topilmadi.",
      label: "Booktopia qidiruvi",
      close: "ESC — Yopish",
    },
    seeAll: "Barchasini ko'rish",
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
      activityHeading: "Деятельность",
      publisherHeading: "Издательство",
      legalHeading: "Правовое",
      allBooks: "Все книги",
      newReleases: "Новые издания",
      authorsTranslators: "Авторы и Переводчики",
      aboutUs: "О нас",
      diary: "Дневник Забарджада",
      contactCollab: "Контакт и Сотрудничество",
      publicOffer: "Публичная оферта",
      privacyPolicy: "Политика конфиденциальности",
      termsOfUse: "Условия использования",
      delivery: "Доставка",
      brandDesc: "Премиальное издательство, представляющее лучшие произведения мировой и узбекской литературы в качественном переводе и исполнении.",
      madeWithLove: "СДЕЛАНО С ЛЮБОВЬЮ",
    },
    search: {
      placeholder: "Введите название книги или автора...",
      startTyping: "Начните вводить для поиска...",
      notFound: "Ничего не найдено",
      notFoundDesc: "— по этому запросу книг не найдено.",
      label: "Поиск Забарджад",
      close: "ESC — Закрыть",
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
      badge: "Booktopia Diary",
      title: "Latest Articles",
    },
    footer: {
      heading: "Join the Booktopia family.",
      desc: "Stay updated on new releases, exclusive offers, and news from the world of literature.",
      address: "Address",
      contact: "Contact",
      rights: "All rights reserved.",
      mapTitle: "Our location",
      activityHeading: "Catalog",
      publisherHeading: "Publisher",
      legalHeading: "Legal",
      allBooks: "All Books",
      newReleases: "New Releases",
      authorsTranslators: "Authors & Translators",
      aboutUs: "About Us",
      diary: "Booktopia Diary",
      contactCollab: "Contact & Collaboration",
      publicOffer: "Public Offer",
      privacyPolicy: "Privacy Policy",
      termsOfUse: "Terms of Use",
      delivery: "Delivery",
      brandDesc: "A premium publisher presenting the finest works of world and Uzbek literature in quality translation and print.",
      madeWithLove: "MADE WITH LOVE",
    },
    search: {
      placeholder: "Type a book or author name...",
      startTyping: "Start typing to search...",
      notFound: "Nothing found",
      notFoundDesc: "— no books matched your search.",
      label: "Booktopia Search",
      close: "ESC — Close",
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
      return (localStorage.getItem("booktopia-lang") as Lang) || "uz";
    }
    return "uz";
  });

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("booktopia-lang", newLang);
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
