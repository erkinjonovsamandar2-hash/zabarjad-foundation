import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useData } from "@/context/DataContext";
import { locField } from "@/context/LanguageContext";
import { ChevronDown, BookOpen } from "lucide-react";
import {
  LIBRARY_FILTER_KEYS,
  LIBRARY_FILTER_LABELS,
  LIBRARY_FILTER_ICONS,
  type LibraryFilterKey,
} from "@/lib/constants";

// ── i18n ──────────────────────────────────────────────────────────────────────
const TX = {
  uz: {
    title: "Fikr qoldiring",
    warning: "Diqqat: har bir fikr moderatsiyadan o'tadi — hammasi ham nashr etilmaydi.",
    typeLabel: "Fikr turi",
    typeBook: "Kitob haqida",
    typeGeneral: "Umumiy fikr",
    categoryLabel: "Turkum tanlang",
    bookLabel: "Kitob tanlang",
    bookPh: "— Kitobni tanlang —",
    noBooksInCategory: "Bu turkumda kitob yo'q",
    name: "Ismingiz *",
    namePh: "Masalan: Malika Yusupova",
    role: "Kasb / Lavozim",
    rolePh: "Masalan: O'qituvchi, Talaba...",
    city: "Shahar",
    cityPh: "Masalan: Toshkent",
    review: "Fikringiz *",
    reviewPh: "Kitob yoki nashriyot haqida fikringizni yozing...",
    stars: "Baho bering",
    submit: "Yuborish",
    submitting: "Yuborilmoqda...",
    successTitle: "Rahmat!",
    successSub: "Fikringiz qabul qilindi va ko'rib chiqiladi.",
    errorMsg: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    charCount: (n: number) => `${n}/280`,
    minChars: "Kamida 20 ta belgi kiriting.",
    required: "Bu maydon majburiy.",
    selectBookFirst: "Avval kitob tanlang.",
  },
  ru: {
    title: "Оставить отзыв",
    warning: "Внимание: каждый отзыв проходит модерацию — публикуются не все.",
    typeLabel: "Тип отзыва",
    typeBook: "О книге",
    typeGeneral: "Общий отзыв",
    categoryLabel: "Выберите категорию",
    bookLabel: "Выберите книгу",
    bookPh: "— Выберите книгу —",
    noBooksInCategory: "В этой категории нет книг",
    name: "Ваше имя *",
    namePh: "Например: Jasur Normatov",
    role: "Должность / Профессия",
    rolePh: "Например: Учитель, Студент...",
    city: "Город",
    cityPh: "Например: Самарканд",
    review: "Ваш отзыв *",
    reviewPh: "Напишите о книге или издательстве...",
    stars: "Оцените",
    submit: "Отправить",
    submitting: "Отправка...",
    successTitle: "Спасибо!",
    successSub: "Ваш отзыв получен и будет рассмотрен.",
    errorMsg: "Произошла ошибка. Попробуйте снова.",
    charCount: (n: number) => `${n}/280`,
    minChars: "Минимум 20 символов.",
    required: "Это поле обязательно.",
    selectBookFirst: "Сначала выберите книгу.",
  },
  en: {
    title: "Leave a Review",
    warning: "Note: every review is moderated — not all will be published.",
    typeLabel: "Review type",
    typeBook: "About a book",
    typeGeneral: "General feedback",
    categoryLabel: "Select category",
    bookLabel: "Select a book",
    bookPh: "— Select a book —",
    noBooksInCategory: "No books in this category",
    name: "Your name *",
    namePh: "e.g. Dilnoza Rahimova",
    role: "Role / Occupation",
    rolePh: "e.g. Teacher, Student...",
    city: "City",
    cityPh: "e.g. Bukhara",
    review: "Your review *",
    reviewPh: "Write about the book or the publishing house...",
    stars: "Rate it",
    submit: "Submit",
    submitting: "Submitting...",
    successTitle: "Thank you!",
    successSub: "Your review has been received and will be reviewed.",
    errorMsg: "Something went wrong. Please try again.",
    charCount: (n: number) => `${n}/280`,
    minChars: "Minimum 20 characters.",
    required: "This field is required.",
    selectBookFirst: "Please select a book first.",
  },
} as const;

type TxLang = keyof typeof TX;

// ── Shared input className ────────────────────────────────────────────────────
const inputCls = `
  w-full rounded-xl border px-4 py-2.5 text-sm font-sans
  bg-white dark:bg-neutral-800
  border-amber-200 dark:border-amber-900/30
  text-neutral-900 dark:text-neutral-100
  placeholder:text-neutral-400 dark:placeholder:text-neutral-600
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
  transition-colors
`;

const selectCls = `${inputCls} appearance-none cursor-pointer pr-10`;

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
    {error && <p className="text-[11px] text-red-500 font-sans">{error}</p>}
  </div>
);

const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {children}
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
  </div>
);

// ── Star picker ───────────────────────────────────────────────────────────────
const StarPicker = ({ value, onChange, label }: {
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

// ── Category pill grid ────────────────────────────────────────────────────────
const CategoryPills = ({
  selected,
  onChange,
  lang,
}: {
  selected: LibraryFilterKey | "";
  onChange: (v: LibraryFilterKey | "") => void;
  lang: TxLang;
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {LIBRARY_FILTER_KEYS.map((key) => {
      const active = selected === key;
      const labels = LIBRARY_FILTER_LABELS[key];
      const icon   = LIBRARY_FILTER_ICONS[key];
      const label  = labels[lang] ?? labels.uz;
      return (
        <motion.button
          key={key}
          type="button"
          onClick={() => onChange(active ? "" : key)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`
            flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left
            transition-all duration-150 text-sm font-sans
            ${active
              ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
              : "border-amber-200 dark:border-amber-900/30 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-primary/40 hover:bg-primary/5"
            }
          `}
        >
          <span className="text-base shrink-0">{icon}</span>
          <span className="truncate leading-tight">{label}</span>
        </motion.button>
      );
    })}
  </div>
);

// ── Main form ─────────────────────────────────────────────────────────────────
const FeedbackForm = () => {
  const { lang } = useLang();
  const { books, submitReview } = useData();

  const tx = TX[(lang as TxLang)] ?? TX.uz;

  const [feedbackType, setFeedbackType] = useState<"book" | "general">("general");
  const [category,     setCategory]     = useState<LibraryFilterKey | "">("");
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

  const filteredBooks = useMemo(
    () => category ? books.filter((b) => b.category === category) : [],
    [books, category]
  );

  const selectedBook = useMemo(
    () => books.find((b) => b.id === bookId) ?? null,
    [books, bookId]
  );

  const handleCategoryChange = (val: LibraryFilterKey | "") => {
    setCategory(val);
    setBookId("");
  };

  const handleTypeChange = (type: "book" | "general") => {
    setFeedbackType(type);
    setCategory("");
    setBookId("");
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = tx.required;
    if (!text.trim()) e.text = tx.required;
    else if (text.trim().length < 20) e.text = tx.minChars;
    if (feedbackType === "book" && !bookId) e.book = tx.selectBookFirst;
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");

    const bookTitle = selectedBook
      ? locField(selectedBook, "title", lang) as string
      : null;

    const { error } = await submitReview({
      name:       name.trim(),
      role:       role.trim()  || null,
      city:       city.trim()  || null,
      text:       text.trim(),
      stars,
      book_id:    bookId   || null,
      book_title: bookTitle || null,
    });

    setLoading(false);
    if (error) setApiError(tx.errorMsg);
    else        setSuccess(true);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="
          flex flex-col items-center justify-center
          gap-3 py-10 text-center rounded-2xl
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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        rounded-2xl p-6 md:p-8 space-y-5
        bg-[#fdfbf7] dark:bg-[#1a1a1a]
        border border-amber-100/80 dark:border-amber-900/20
        shadow-lg
      "
      noValidate
    >
      {/* Moderation warning */}
      <div className="
        flex items-start gap-3 rounded-xl px-4 py-3
        bg-primary/5 dark:bg-amber-900/15
        border border-amber-200 dark:border-amber-800/30
      ">
        <span className="text-base shrink-0 mt-0.5">⚠️</span>
        <p className="font-sans text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          {tx.warning}
        </p>
      </div>

      {/* Feedback type toggle */}
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
          {tx.typeLabel}
        </p>
        <div className="flex rounded-xl overflow-hidden border border-amber-200 dark:border-amber-900/30">
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

      {/* Book selector — only when type === "book" */}
      <AnimatePresence>
        {feedbackType === "book" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden space-y-4"
          >
            {/* Category pill grid */}
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
                {tx.categoryLabel}
              </p>
              <CategoryPills
                selected={category}
                onChange={handleCategoryChange}
                lang={lang as TxLang}
              />
            </div>

            {/* Book dropdown — only shown after category is picked */}
            <AnimatePresence>
              {category && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <Field label={tx.bookLabel} error={errors.book}>
                    <SelectWrapper>
                      <select
                        value={bookId}
                        onChange={(e) => {
                          setBookId(e.target.value);
                          setErrors((p) => ({ ...p, book: "" }));
                        }}
                        className={selectCls}
                        disabled={filteredBooks.length === 0}
                      >
                        <option value="">
                          {filteredBooks.length === 0 ? tx.noBooksInCategory : tx.bookPh}
                        </option>
                        {filteredBooks.map((book) => (
                          <option key={book.id} value={book.id}>
                            {locField(book, "title", lang)} — {locField(book, "author", lang)}
                          </option>
                        ))}
                      </select>
                    </SelectWrapper>
                  </Field>

                  {/* Selected book preview */}
                  <AnimatePresence>
                    {selectedBook && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        className="
                          mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5
                          bg-primary/5 border border-primary/20
                        "
                      >
                        {selectedBook.cover_url ? (
                          <img
                            src={selectedBook.cover_url}
                            alt=""
                            className="h-10 w-7 rounded object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-7 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <BookOpen className="h-4 w-4 text-primary/50" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold font-sans text-foreground truncate">
                            {locField(selectedBook, "title", lang)}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {locField(selectedBook, "author", lang)}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name + Role */}
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

      {/* City + Stars */}
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

      {/* Review textarea */}
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

      {apiError && (
        <p className="text-sm text-red-500 font-sans text-center">{apiError}</p>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={loading ? {} : { scale: 1.01 }}
        whileTap={loading ? {} : { scale: 0.985 }}
        className="btn-glass w-full"
      >
        {loading ? tx.submitting : tx.submit}
      </motion.button>
    </motion.form>
  );
};

export default FeedbackForm;
