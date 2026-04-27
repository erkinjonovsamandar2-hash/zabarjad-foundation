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
      partners: "Hamkorlar",
      team: "Jamoa",
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
    terms: {
      title: "Foydalanish shartlari",
      preface: "Ushbu Foydalanish shartlari \"Booktopia\" nashriyoti va platformasi (keyingi o'rinlarda — \"Nashriyot\") tomonidan taqdim etiladigan barcha raqamli resurslar, veb-sayt, brending materiallari hamda nashr etilgan kitoblar va ularning parchalaridan foydalanish qoidalarini belgilaydi. Platformamizdan foydalanish ushbu shartlarga to'liq roziligingizni bildiradi.",
      sections: [
        {
          title: "Intellektual mulk huquqlari",
          content: "Nashriyot platformasida e'lon qilingan barcha matnlar, kitoblar, dizaynlar, logotiplar va media materiallar mualliflik huquqi bilan himoyalangan. Ularni Nashriyotning yozma ruxsatisiz ko'chirish, tarqatish yoki tijorat maqsadlarida foydalanish qat'iyan taqiqlanadi."
        },
        {
          title: "Kitoblar va iqtiboslardan foydalanish",
          content: "Nashr etilgan asarlar va ulardagi parchalar faqat shaxsiy, ma'rifiy va notijorat maqsadlarda ishlatilishi mumkin. Har qanday iqtibos keltirilganda muallif, asar nomi va \"Booktopia\" nashriyoti aniq ko'rsatilishi shart."
        },
        {
          title: "Elektron resurslar va xavfsizlik",
          content: "Veb-saytimizdan foydalanishda qonuniy va axloqiy me'yorlarga rioya etilishi shart. Sayt faoliyatiga xalaqit beruvchi, ma'lumotlarni noqonuniy ko'chirib oluvchi (scraping) har qanday texnik harakatlar man etiladi."
        },
        {
          title: "Brending va vizual o'ziga xoslik",
          content: "\"Booktopia\" nomi, logotipi va korporativ dizayni intellektual mulk hisoblanadi. Ulardan uchinchi shaxslar tomonidan ruxsatsiz foydalanilishi mumkin emas."
        },
        {
          title: "Javobgarlikni cheklash",
          content: "Nashriyot taqdim etilgan ma'lumotlarni qo'llash natijasida kelib chiqishi mumkin bo'lgan bevosita yoki bilvosita zararlar uchun yuridik javobgar emas."
        },
        {
          title: "Shartlarni o'zgartirish huquqi",
          content: "Booktopia ushbu qoidalarga istalgan vaqtda o'zgartirish kiritish huquqini o'zida saqlab qoladi. Yangilanishlar saytda e'lon qilingan vaqtdan boshlab kuchga kiradi."
        },
        {
          title: "Qonunchilik va nizolarni hal etish",
          content: "Ushbu shartlar O'zbekiston Respublikasi qonunchiligi asosida tartibga solinadi.\nBooktopia — bilimga mas'uliyat, mualliflik huquqiga hurmat va intellektual halollik tarafdori."
        }
      ]
    },
    privacy: {
      title: "Maxfiylik siyosati",
      preface: "Ushbu Maxfiylik siyosati \"Booktopia\" platformasi (keyingi o'rinlarda — \"Nashriyot\") orqali olinadigan ma'lumotlarning maxfiyligini ta'minlash tartibini belgilaydi. Nashriyot foydalanuvchilarning shaxsiy ma'lumotlariga mas'uliyat bilan yondashadi hamda ularni amaldagi qonunchilikka muvofiq himoya qiladi.",
      sections: [
        {
          title: "Yig'iladigan ma'lumotlar",
          content: "Nashriyot quyidagi turdagi ma'lumotlarni yig'ishi va qayta ishlashi mumkin: foydalanuvchi tomonidan ixtiyoriy ravishda taqdim etilgan shaxsiy ma'lumotlar (ism, elektron pochta, aloqa ma'lumotlari); veb-sayt va elektron platformalardan foydalanish jarayonida avtomatik tarzda olinadigan texnik ma'lumotlar (masalan, cookie-fayllar)."
        },
        {
          title: "Ma'lumotlardan foydalanish maqsadi",
          content: "Yig'ilgan ma'lumotlar quyidagi maqsadlarda ishlatiladi: nashriyot xizmatlarini ko'rsatish va takomillashtirish; platforma ichida moslashtirilgan tavsiyalar (\"Kitob sovchilari\" kabi) berish; foydalanuvchilar bilan aloqa o'rnatish; huquqiy va tashkiliy majburiyatlarni bajarish."
        },
        {
          title: "Ma'lumotlarni oshkor etish",
          content: "Foydalanuvchilarga oid ma'lumotlar uchinchi shaxslarga berilmaydi, qonunchilikda belgilangan holatlar yoki foydalanuvchining yozma roziligi mavjud bo'lgan holatlar bundan mustasno. Hamkor tashkilotlarga ma'lumotlar faqat shartnomaviy majburiyatlarni bajarish doirasidagina taqdim etiladi."
        },
        {
          title: "Ma'lumotlarni himoyalash",
          content: "Nashriyot ma'lumotlarning yo'qolishi, noqonuniy kirish, o'zgartirilishi yoki oshkor etilishining oldini olish uchun tashkiliy, texnik va huquqiy choralarni ko'radi. Ma'lumotlarga faqat vakolatli shaxslar kirish huquqiga ega."
        },
        {
          title: "Foydalanuvchi huquqlari",
          content: "Foydalanuvchilar o'z shaxsiy ma'lumotlari haqida axborot olish, ularni yangilash, tuzatish yoki qonun doirasida o'chirishni talab qilish huquqiga ega."
        },
        {
          title: "Siyosatga o'zgartirishlar",
          content: "Booktopia ushbu Maxfiylik siyosatini istalgan vaqtda o'zgartirish yoki yangilash huquqini o'zida saqlab qoladi. O'zgartirishlar e'lon qilingan paytdan boshlab kuchga kiradi."
        },
        {
          title: "Amaldagi qonunchilik",
          content: "Ushbu Maxfiylik siyosati O'zbekiston Respublikasi qonunchiligiga muvofiq tartibga solinadi.\nBooktopia ma'lumotlar maxfiyligini professional mas'uliyat va huquqiy majburiyat sifatida qabul qiladi."
        }
      ]
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
      partners: "Партнеры",
      team: "Команда",
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
    terms: {
      title: "Условия использования",
      preface: "Настоящие Условия использования определяют правила использования всех цифровых ресурсов, веб-сайта, брендинговых материалов, изданных книг и их фрагментов, предоставляемых издательством «Booktopia» (далее — «Издательство»). Использование нашей платформы означает ваше полное согласие с данными условиями.",
      sections: [
        {
          title: "Права интеллектуальной собственности",
          content: "Все тексты, книги, дизайны, логотипы и медиаматериалы, опубликованные на платформе, защищены авторским правом. Их копирование, распространение или использование в коммерческих целях без письменного разрешения Издательства строго запрещено."
        },
        {
          title: "Использование книг и фрагментов",
          content: "Изданные произведения и их фрагменты могут использоваться только в личных, образовательных и некоммерческих целях. При любом цитировании обязательно указание автора, названия произведения и издательства «Booktopia»."
        },
        {
          title: "Электронные ресурсы и безопасность",
          content: "При использовании нашего веб-сайта необходимо соблюдать правовые и этические нормы. Любые технические действия, нарушающие работу сайта или направленные на незаконный сбор данных (скрейпинг), запрещены."
        },
        {
          title: "Брендинг и визуальная идентичность",
          content: "Название, логотип и корпоративный дизайн «Booktopia» являются интеллектуальной собственностью. Несанкционированное использование третьими лицами не допускается."
        },
        {
          title: "Ограничение ответственности",
          content: "Издательство не несет юридической ответственности за прямой или косвенный ущерб, возникший в результате использования предоставленной информации."
        },
        {
          title: "Право на изменение условий",
          content: "Booktopia оставляет за собой право вносить изменения в настоящие условия в любое время. Обновления вступают в силу с момента их публикации на сайте."
        },
        {
          title: "Применимое законодательство",
          content: "Настоящие условия регулируются законодательством Республики Узбекистан.\nBooktopia выступает за ответственное отношение к знаниям, уважение авторских прав и интеллектуальную честность."
        }
      ]
    },
    privacy: {
      title: "Политика конфиденциальности",
      preface: "Настоящая Политика конфиденциальности определяет порядок обеспечения конфиденциальности информации, получаемой через платформу «Booktopia» (далее — «Издательство»). Издательство ответственно подходит к личным данным пользователей и защищает их в соответствии с действующим законодательством.",
      sections: [
        {
          title: "Собираемые данные",
          content: "Издательство может собирать и обрабатывать: личные данные, добровольно предоставленные пользователем (имя, электронная почта, контактная информация); технические данные, собираемые автоматически при использовании веб-сайта (например, файлы cookie)."
        },
        {
          title: "Цель использования данных",
          content: "Собранные данные используются для: предоставления и улучшения услуг; предоставления персонализированных рекомендаций на платформе (например, «Kitob sovchilari»); связи с пользователями; выполнения правовых обязательств."
        },
        {
          title: "Раскрытие информации",
          content: "Данные пользователей не передаются третьим лицам, за исключением случаев, предусмотренных законодательством, или при наличии письменного согласия пользователя. Партнерским организациям данные предоставляются исключительно в рамках выполнения договорных обязательств."
        },
        {
          title: "Защита данных",
          content: "Издательство принимает организационные, технические и правовые меры для предотвращения потери, несанкционированного доступа, изменения или раскрытия данных."
        },
        {
          title: "Права пользователей",
          content: "Пользователи имеют право запрашивать информацию о своих личных данных, а также обновлять, исправлять или удалять их в рамках закона."
        },
        {
          title: "Изменения в политике",
          content: "Booktopia оставляет за собой право вносить изменения в настоящую Политику в любое время. Обновления вступают в силу с момента публикации."
        },
        {
          title: "Применимое законодательство",
          content: "Настоящая Политика конфиденциальности регулируется законодательством Республики Узбекистан.\nBooktopia рассматривает конфиденциальность данных как профессиональную ответственность и юридическое обязательство."
        }
      ]
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
      partners: "Partners",
      team: "Team",
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
    terms: {
      title: "Terms of Use",
      preface: "These Terms of Use govern the rules for using all digital resources, websites, branding materials, published books, and excerpts provided by \"Booktopia\" (hereinafter referred to as the \"Publisher\"). By using our platform, you fully agree to these terms.",
      sections: [
        {
          title: "Intellectual Property Rights",
          content: "All texts, books, designs, logos, and media materials published on the platform are protected by copyright law. Copying, distributing, or using them for commercial purposes without the Publisher's written consent is strictly prohibited."
        },
        {
          title: "Use of Books and Excerpts",
          content: "Published works and excerpts may only be used for personal, educational, and non-commercial purposes. Any quotation must clearly state the author, the title of the work, and \"Booktopia\" as the publisher."
        },
        {
          title: "Digital Resources and Security",
          content: "When using our website, users must comply with legal and ethical standards. Any technical actions that disrupt the site's operation or illegally extract data (scraping) are forbidden."
        },
        {
          title: "Branding and Visual Identity",
          content: "The \"Booktopia\" name, logo, and corporate design are intellectual property. Unauthorized use by third parties is not allowed."
        },
        {
          title: "Limitation of Liability",
          content: "The Publisher is not legally responsible for any direct or indirect damages resulting from the use of the information provided."
        },
        {
          title: "Right to Modify Terms",
          content: "Booktopia reserves the right to modify these terms at any time. Updates become effective immediately upon publication on the site."
        },
        {
          title: "Governing Law and Dispute Resolution",
          content: "These terms are governed by the laws of the Republic of Uzbekistan.\nBooktopia stands for responsibility towards knowledge, respect for copyright, and intellectual integrity."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      preface: "This Privacy Policy establishes the procedures for ensuring the confidentiality of information obtained through the \"Booktopia\" platform (hereinafter referred to as the \"Publisher\"). The Publisher takes a responsible approach to users' personal data and protects it in accordance with applicable law.",
      sections: [
        {
          title: "Collected Information",
          content: "The Publisher may collect and process: personal data voluntarily provided by the user (name, email, contact information); technical data automatically collected during the use of the website and digital platforms (e.g., cookies)."
        },
        {
          title: "Purpose of Use",
          content: "Collected data is used for: providing and improving publishing services; offering personalized recommendations within the platform (such as \"Kitob sovchilari\"); communicating with users; fulfilling legal and organizational obligations."
        },
        {
          title: "Data Disclosure",
          content: "User data is not transferred to third parties, except as required by law or with the user's explicit written consent. Data is provided to partner organizations solely within the framework of fulfilling contractual obligations."
        },
        {
          title: "Data Protection",
          content: "The Publisher takes organizational, technical, and legal measures to prevent the loss, unauthorized access, alteration, or disclosure of data. Only authorized personnel have access to this information."
        },
        {
          title: "User Rights",
          content: "Users have the right to request information about their personal data, as well as to update, correct, or delete it within the framework of the law."
        },
        {
          title: "Policy Changes",
          content: "Booktopia reserves the right to modify or update this Privacy Policy at any time. Updates become effective immediately upon publication."
        },
        {
          title: "Governing Law",
          content: "This Privacy Policy is governed by the laws of the Republic of Uzbekistan.\nBooktopia treats data privacy as a professional responsibility and a legal obligation."
        }
      ]
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
