// @refresh reset
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, ChevronDown, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchModal from "./SearchModal";

// ── Asset Imports ──────────────────────────────────────────────────────────
// ADDED: logo image import from src/assets
import logoImg from "@/assets/Logo-blue.png";
import jahonImg from "@/assets/nav/jahon.png";
import bolalarImg from "@/assets/nav/bolalar.png";
import ozbekImg from "@/assets/nav/ozbek.png";

// ── Mega Menu Categories ───────────────────────────────────────────────────
const MEGA_MENU_CATEGORIES = [
  {
    id: "jahon",
    title: "Jahon Adabiyoti",
    desc: "Dunyo klassiklari va zamonaviy asarlar",
    img: jahonImg,
  },
  {
    id: "bolalar",
    title: "Bolalar Adabiyoti",
    desc: "Kichik o'quvchilar uchun ajoyib hikoyalar",
    img: bolalarImg,
  },
  {
    id: "ozbek",
    title: "O'zbek Adabiyoti",
    desc: "Milliy adabiyotimizning eng sara asarlari",
    img: ozbekImg,
  },
] as const;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const { t } = useLang();
  const location = useLocation();

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("booktopia-theme") as "dark" | "light") || "light";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    localStorage.setItem("booktopia-theme", theme);
  }, [theme]);

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.spotlight, href: "/spotlight" },
    { label: t.nav.library, href: "/library" },
    { label: t.nav.quiz, href: "/quiz" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.contact, href: "/#footer" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href.startsWith("/#"))
      return location.pathname === "/" && location.hash === href.slice(1);
    return location.pathname === href;
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-primary origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />
      <nav className="fixed top-0 left-0 right-0 z-[90] bg-white/40 dark:bg-black/20 backdrop-blur-2xl border-b border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-colors duration-500 ease-out">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">

          {/* ── Logo ── */}
          {/* FIXED: replaced text span with <img> from src/assets/Logo-blue.png */}
          {/* Removed gap-2.5 (no sibling elements), kept drop-shadow-sm        */}
          <Link
            to="/"
            className="flex items-center drop-shadow-sm"
          >
            <img
              src={logoImg}
              alt="Booktopia Logo"
              className="h-8 md:h-10 w-auto object-contain transition-transform hover:scale-105 duration-300"
            />
          </Link>

          {/* ── Desktop Links ── */}
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.filter((l) => l.href !== "/spotlight").map((link) => (
              <li key={link.href}>

                {link.href === "/library" ? (
                  /* Mega Menu Trigger */
                  <div
                    onMouseEnter={() => setMegaMenuOpen(true)}
                    onMouseLeave={() => setMegaMenuOpen(false)}
                    className="py-2 cursor-pointer group/nav"
                  >
                    <Link
                      to={link.href}
                      className={`
                        inline-flex items-center gap-1.5 relative
                        font-serif font-bold text-lg sm:text-xl px-4 py-1.5 rounded-lg transition-colors duration-300
                        ${isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground/80 hover:text-foreground"}
                      `}
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${megaMenuOpen ? "rotate-180" : ""}`}
                      />
                    </Link>
                  </div>

                ) : link.href === "/quiz" ? (
                  /* Highlighted gradient link */
                  <Link
                    to={link.href}
                    className={`
                      group relative inline-flex items-center gap-1.5
                      font-serif font-bold text-lg sm:text-xl px-4 py-1.5 rounded-lg transition-colors duration-300
                      ${isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground/80 hover:text-foreground"}
                    `}
                  >
                    <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                      {link.label}
                    </span>
                  </Link>

                ) : link.href.startsWith("/#") ? (
                  /* Hash link */
                  <a
                    href={link.href}
                    className={`
                      relative inline-flex items-center gap-1.5
                      font-sans font-bold text-[12px] sm:text-[13px] tracking-wide uppercase px-4 py-2 rounded-full transition-all duration-300
                      ${isActive(link.href) ? "bg-primary/10 text-primary dark:bg-primary/20" : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}
                    `}
                  >
                    {link.label}
                  </a>

                ) : (
                  /* Regular link */
                  <Link
                    to={link.href}
                    className={`
                      relative inline-flex items-center gap-1.5
                      font-sans font-bold text-[12px] sm:text-[13px] tracking-wide uppercase px-4 py-2 rounded-full transition-all duration-300
                      ${isActive(link.href) ? "bg-primary/10 text-primary dark:bg-primary/20" : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}
                    `}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}

            {/* ── Desktop Controls ── */}
            <li className="flex items-center gap-3 pl-4 border-l border-border">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-foreground/70 hover:text-accent hover:bg-primary/5 rounded-full transition-all"
                aria-label="Qidiruv"
              >
                <Search className="w-5 h-5" />
              </button>

              <LanguageSwitcher />

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-foreground transition-colors hover:text-accent focus:outline-none drop-shadow-sm"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </li>
          </ul>

          {/* ── Mobile Controls ── */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-foreground hover:text-accent transition-colors"
              aria-label="Qidiruv"
            >
              <Search className="w-6 h-6" />
            </button>

            <LanguageSwitcher />

            <button
              onClick={() => setOpen(!open)}
              className="text-foreground drop-shadow-sm p-1"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* ── Desktop Mega Menu ── */}
        <AnimatePresence>
          {megaMenuOpen && (
            <div
              className="absolute left-0 right-0 top-full hidden md:flex justify-center pt-2"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-screen max-w-4xl bg-background/98 dark:bg-slate-950/98 backdrop-blur-3xl border border-border/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden z-[100]"
              >
                <div className="p-6 lg:p-8">
                  <div className="grid grid-cols-3 gap-6 lg:gap-8">
                    {MEGA_MENU_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/library?category=${cat.id}`}
                        className="group flex flex-col p-3 rounded-xl hover:bg-muted/50 transition-colors"
                        onClick={() => setMegaMenuOpen(false)}
                      >
                        <div className="w-full h-32 bg-primary/10 rounded-xl mb-4 overflow-hidden border border-border/30 shadow-inner relative">
                          {cat.img ? (
                            <img
                              src={cat.img}
                              alt={cat.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                              <span className="text-4xl opacity-40 group-hover:opacity-70 transition-opacity">📚</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                        </div>

                        <h3 className="font-heading tracking-wide leading-tight text-base lg:text-lg text-foreground group-hover:text-accent transition-colors mb-1.5">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-foreground/70 leading-relaxed font-serif">
                          {cat.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-2xl shadow-xl overflow-hidden"
            >
              <ul className="flex flex-col gap-1 px-6 py-6">
                {navLinks.filter((l) => l.href !== "/spotlight").map((link) => (
                  <li key={link.href}>
                    {link.href === "/quiz" ? (
                      /* Mobile highlighted link */
                      <Link
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className={`
                          block py-3 px-4 rounded-full
                          font-sans font-bold text-[12px] sm:text-[13px] tracking-wide uppercase
                          transition-all duration-300 active:bg-primary/10
                          ${isActive(link.href) ? "bg-primary/10 text-primary dark:bg-primary/20" : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}
                        `}
                      >
                        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                          {link.label}
                        </span>
                      </Link>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className={`
                          block py-3 px-4 rounded-full
                          font-sans font-bold text-[12px] sm:text-[13px] tracking-wide uppercase
                          transition-all duration-300 active:bg-primary/10
                          ${isActive(link.href) ? "bg-primary/10 text-primary dark:bg-primary/20" : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}
                        `}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}

                <li className="mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 w-full py-3 px-2 text-base font-bold text-foreground transition-colors active:bg-primary/10 rounded-lg"
                  >
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    {theme === "dark" ? "Kunduzgi rejim" : "Tungi rejim"}
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Global Search Modal ── */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;