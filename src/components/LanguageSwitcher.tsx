import { useLang, Lang } from "@/context/LanguageContext";

const langs: { lang: Lang; code: string; label: string }[] = [
  { lang: "uz", code: "UZ", label: "O'zbek" },
  { lang: "ru", code: "RU", label: "Русский" },
  { lang: "en", code: "EN", label: "English" },
];

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1">
      {langs.map((f) => (
        <button
          key={f.lang}
          onClick={() => setLang(f.lang)}
          className={`inline-flex items-center justify-center w-7 h-7 rounded text-[11px] font-bold tracking-wide transition-all ${lang === f.lang
              ? "bg-primary/20 scale-110"
              : "opacity-60 hover:opacity-100"
            }`}
          aria-label={f.label}
          title={f.label}
        >
          {f.code}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
