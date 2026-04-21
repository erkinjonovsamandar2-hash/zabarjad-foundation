import { useLang, Lang } from "@/context/LanguageContext";

const flags: { lang: Lang; flag: string; label: string }[] = [
  { lang: "uz", flag: "🇺🇿", label: "O'zbek" },
  { lang: "ru", flag: "🇷🇺", label: "Русский" },
  { lang: "en", flag: "EN", label: "English" },
];

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1">
      {flags.map((f) => (
        <button
          key={f.lang}
          onClick={() => setLang(f.lang)}
          className={`text-base px-1.5 py-0.5 rounded transition-all ${lang === f.lang
            ? "bg-primary/20 scale-110"
            : "opacity-60 hover:opacity-100"
            }`}
          aria-label={f.label}
          title={f.label}
        >
          {f.flag}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
