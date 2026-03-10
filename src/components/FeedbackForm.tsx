import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useData } from "@/context/DataContext";
import { locField } from "@/context/LanguageContext";
import { ChevronDown } from "lucide-react";

// ── Category options — match DB category values exactly ──────────────────────
const CATEGORIES = [
  { value: "new",  uz: "Yangi nashrlar",    ru: "Новые издания",    en: "New Releases"     },
  { value: "soon", uz: "Tez kunda",         ru: "Скоро",            en: "Coming Soon"      },
  { value: "gold", uz: "Oltin kolleksiya",  ru: "Золотая коллекция",en: "Gold Collection"  },
] as const;

type Category = typeof CATEGORIES[number]["value"];

// ── i18n ──────────────────────────────────────────────────────────────────────
const TX = {
  uz: {
    title:            "Fikr qoldiring",
    warning:          "Diqqat: har bir fikr moderatsiyadan o'tadi — hammasi ham nashr etilmaydi.",
    typeLabel:        "Fikr turi",
    typeBook:         "Kitob haqida",
    typeGeneral:      "Umumiy fikr",
    categoryLabel:    "Turkum tanlang",
    categoryPh:       "— Turkumni tanlang —",
    bookLabel:        "Kitob tanlang",
    bookPh:           "— Kitobni tanlang —",
    name:             "Ismingiz *",
    namePh:           "Masalan: Malika Yusupova",
    role:             "Kasb / Lavozim",
    rolePh:           "Masalan: O'qituvchi, Talaba...",
    city:             "Shahar",
    cityPh:           "Masalan: Toshkent",
    review:           "Fikringiz *",
    reviewPh:         "Kitob yoki nashriyot haqida fikringizni yozing...",
    stars:            "Baho bering",
    submit:           "Yuborish",
    submitting:       "Yuborilmoqda...",
    successTitle:     "Rahmat!",
    successSub:       "Fikringiz qabul qilindi va ko'rib chiqiladi.",
    errorMsg:         "Xatolik yuz berdi. Qayta urinib ko'ring.",
    charCount:        (n: number) => `${n}/280`,
    minChars:         "Kamida 20 ta belgi kiriting.",
    required:         "Bu maydon majburiy.",
    selectCategory:   "Avval turkumni tanlang.",
  },
  ru: {
    title:            "Оставить отзыв",
    warning:          "Внимание: каждый отзыв проходит модерацию — публикуются не все.",
    typeLabel:        "Тип отзыва",
    typeBook:         "О книге",
    typeGeneral:      "Общий отзыв",
    categoryLabel:    "Выберите категорию",
    categoryPh:       "— Выберите категорию —",
    bookLabel:        "Выберите книгу",
    bookPh:           "— Выберите книгу —",
    name:             "Ваше имя *",
    namePh:           "Например: Jasur Normatov",
    role:             "Должность / Профессия",
    rolePh:           "Например: Учитель, Студент...",
    city:             "Город",
    cityPh:           "Например: Самарканд",
    review:           "Ваш отзыв *",
    reviewPh:         "Напишите о книге или издательстве...",
    stars:            "Оцените",
    submit:           "Отправить",
    submitting:       "Отправка...",
    successTitle:     "Спасибо!",
    successSub:       "Ваш отзыв получен и будет рассмотрен.",
    errorMsg:         "Произошла ошибка. Попробуйте снова.",
    charCount:        (n: number) => `${n}/280`,
    minChars:         "Минимум 20 символов.",
    required:         "Это поле обязательно.",
    selectCategory:   "Сначала выберите категорию.",
  },
  en: {
    title:            "Leave a Review",
    warning:          "Note: every review is moderated — not all will be published.",
    typeLabel:        "Review type",
    typeBook:         "About a book",
    typeGeneral:      "General feedback",
    categoryLabel:    "Select category",
    categoryPh:       "— Select a category —",
    bookLabel:        "Select a book",
    bookPh:           "— Select a book —",
    name:             "Your name *",
    namePh:           "e.g. Dilnoza Rahimova",
    role:             "Role / Occupation",
    rolePh:           "e.g. Teacher, Student...",
    city:             "City",
    cityPh:           "e.g. Bukhara",
    review:           "Your review *",
    reviewPh:         "Write about the book or the publishing house...",
    stars:            "Rate it",
    submit:           "Submit",
    submitting:       "Submitting...",
    successTitle:     "Thank you!",
    successSub:       "Your review has been received and will be reviewed.",
    errorMsg:         "Something went wrong. Please try again.",
    charCount:        (n: number) => `${n}/280`,
    minChars:         "Minimum 20 characters.",
    required:         "This field is required.",
    selectCategory:   "Please select a category first.",
  },
} as const;

type TxLang = keyof typeof TX;

// ── Shared input className ────────────────────────────────────────────────────
const inputCls = `
  w-full rounded-lg border px-4 py-2.5 text-sm font-sans
  bg-white dark:bg-neutral-800
  border-amber-200 dark:border-amber-900/30
  text-neutral-900 dark:text-neutral-100
  placeholder:text-neutral-400 dark:placeholder:text-neutral-600
  focus:outline-none focus:ring-2 focus:ring-primary/40
  transition-colors
`;

const selectCls = `
  ${inputCls}
  appearance-none cursor-pointer pr-10
`;

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({
  label, error, children,
}: {
  label: string; error?: string; children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
      {label}
    </label>
    {children}
    {error && (
      <p className="text-[11px] text-red-500 font-sans">{error}</p>
    )}
  </div>
);

// ── Select wrapper (adds chevron icon) ────────────────────────────────────────
const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {children}
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
  </div>
);

// ── Star picker ───────────────────────────────────────────────────────────────
const StarPicker = ({
  value, onChange, label,
}: {
  value: number; onChange: (n: number) => void; label: string;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div>
      <p className="font-sans text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
        {label}
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-2xl leading-none transition-transform hover:scale-125 focus:outline-none"
            aria-label={`${star} yulduz`}
          >
            <span className={star <= (hovered || value) ? "text-primary" : "text-neutral-300 dark:text-neutral-600"}>
              ★
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Main form ─────────────────────────────────────────────────────────────────
const FeedbackForm = () => {
  const { lang }         = useLang();
  const { books, submitReview } = useData();

  const tx = TX[(lang as TxLang)] ?? TX.uz;

  // ── Form state ──────────────────────────────────────────────────────────
  const [feedbackType, setFeedbackType] = useState<"book" | "general">("general");
  const [category,     setCategory]     = useState<Category | "">("");
  const [bookId,       setBookId]       = useState<string>("");
  const [name,         setName]         = useState("");
  const [role,         setRole]         = useState("");
  const [city,         setCity]         = useState("");
  const [text,         setText]         = useState("");
  const [stars,        setStars]        = useState(5);
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [apiError,     setApiError]     = useState("");

  // Books filtered by selected category
  const filteredBooks = useMemo(
    () => category ? books.filter((b) => b.category === category) : [],
    [books, category]
  );

  // Reset book when category changes
  const handleCategoryChange = (val: Category | "") => {
    setCategory(val);
    setBookId("");
  };

  // Reset book+category when type changes
  const handleTypeChange = (type: "book" | "general") => {
    setFeedbackType(type);
    setCategory("");
    setBookId("");
    setErrors({});
  };

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())              e.name = tx.required;
    if (!text.trim())              e.text = tx.required;
    else if (text.trim().length < 20) e.text = tx.minChars;
    return e;
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");

    const { error } = await submitReview({
      name:  name.trim(),
      role:  role.trim() || null,
      city:  city.trim() || null,
      text:  text.trim(),
      stars,
    });

    setLoading(false);
    if (error) { setApiError(tx.errorMsg); }
    else       { setSuccess(true); }
  };

  // ── Success state ────────────────────────────────────────────────────────
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1   }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="
          flex flex-col items-center justify-center
          gap-3 py-10 text-center rounded-xl
          bg-[#fdfbf7] dark:bg-[#1a1a1a]
          border border-amber-100/80 dark:border-amber-900/20
          shadow-lg
        "
      >
        <span className="text-4xl">🌿</span>
        <p className="font-serif text-xl font-bold text-foreground">{tx.successTitle}</p>
        <p className="font-sans text-sm text-muted-foreground max-w-xs">{tx.successSub}</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.35 }}
      className="
        rounded-xl p-6 md:p-8 space-y-5
        bg-[#fdfbf7] dark:bg-[#1a1a1a]
        border border-amber-100/80 dark:border-amber-900/20
        shadow-lg
      "
      noValidate
    >
      {/* ── Moderation warning ────────────────────────────────────────────── */}
      <div className="
        flex items-start gap-3 rounded-lg px-4 py-3
        bg-primary/5 dark:bg-amber-900/15
        border border-amber-200 dark:border-amber-800/30
      ">
        <span className="text-base shrink-0 mt-0.5">⚠️</span>
        <p className="font-sans text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          {tx.warning}
        </p>
      </div>

      {/* ── Feedback type toggle ──────────────────────────────────────────── */}
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
          {tx.typeLabel}
        </p>
        <div className="flex rounded-lg overflow-hidden border border-amber-200 dark:border-amber-900/30">
          {(["general", "book"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`
                flex-1 py-2.5 text-sm font-semibold font-sans transition-colors
                ${feedbackType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary/5 dark:hover:bg-neutral-700"
                }
              `}
            >
              {type === "general" ? tx.typeGeneral : tx.typeBook}
            </button>
          ))}
        </div>
      </div>

      {/* ── Book selector — only when type === "book" ─────────────────────── */}
      <AnimatePresence>
        {feedbackType === "book" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden space-y-4"
          >
            {/* Category dropdown */}
            <Field label={tx.categoryLabel}>
              <SelectWrapper>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as Category | "")}
                  className={selectCls}
                >
                  <option value="">{tx.categoryPh}</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat[lang as TxLang] ?? cat.uz}
                    </option>
                  ))}
                </select>
              </SelectWrapper>
            </Field>

            {/* Book dropdown — only shown after category is picked */}
            <AnimatePresence>
              {category && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1,  y: 0  }}
                  exit={{   opacity: 0,  y: -8  }}
                  transition={{ duration: 0.22 }}
                >
                  <Field label={tx.bookLabel}>
                    <SelectWrapper>
                      <select
                        value={bookId}
                        onChange={(e) => setBookId(e.target.value)}
                        className={selectCls}
                        disabled={filteredBooks.length === 0}
                      >
                        <option value="">
                          {filteredBooks.length === 0
                            ? tx.selectCategory
                            : tx.bookPh
                          }
                        </option>
                        {filteredBooks.map((book) => (
                          <option key={book.id} value={book.id}>
                            {locField(book, "title", lang)} — {locField(book, "author", lang)}
                          </option>
                        ))}
                      </select>
                    </SelectWrapper>
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Name + Role ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={tx.name} error={errors.name}>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
            placeholder={tx.namePh}
            className={inputCls}
            maxLength={80}
          />
        </Field>
        <Field label={tx.role}>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder={tx.rolePh}
            className={inputCls}
            maxLength={80}
          />
        </Field>
      </div>

      {/* ── City + Stars ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <Field label={tx.city}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={tx.cityPh}
            className={inputCls}
            maxLength={60}
          />
        </Field>
        <StarPicker value={stars} onChange={setStars} label={tx.stars} />
      </div>

      {/* ── Review textarea ───────────────────────────────────────────────── */}
      <Field label={tx.review} error={errors.text}>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= 280) {
                setText(e.target.value);
                setErrors((p) => ({ ...p, text: "" }));
              }
            }}
            placeholder={tx.reviewPh}
            rows={4}
            className={`${inputCls} resize-none`}
          />
          <span className={`
            absolute bottom-2.5 right-3 font-sans text-[10px]
            ${text.length > 250 ? "text-accent" : "text-neutral-400 dark:text-neutral-600"}
          `}>
            {tx.charCount(text.length)}
          </span>
        </div>
      </Field>

      {/* ── API error ─────────────────────────────────────────────────────── */}
      {apiError && (
        <p className="text-sm text-red-500 font-sans text-center">{apiError}</p>
      )}

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={loading ? {} : { scale: 1.02 }}
        whileTap={loading  ? {} : { scale: 0.98 }}
        className="
          w-full rounded-xl py-3 text-sm font-semibold font-sans
          bg-primary text-primary-foreground
          hover:opacity-90 disabled:opacity-50
          transition-opacity
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
        "
      >
        {loading ? tx.submitting : tx.submit}
      </motion.button>
    </motion.form>
  );
};

export default FeedbackForm;