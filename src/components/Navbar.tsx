// @refresh reset
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, ChevronDown, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchModal from "./SearchModal"; // <-- Import the new Search Modal
import zabarjadBird from "@/assets/zabarjad-bird.png";

// ── Assets (Standard Imports) ─────────────────────────────────────────────────
// Note: If these images haven't been generated yet, the code will fallback safely.
import jahonImg from "@/assets/nav/jahon.png";
import bolalarImg from "@/assets/nav/bolalar.png";
import ozbekImg from "@/assets/nav/ozbek.png";

// ── Mega Menu Categories ──────────────────────────────────────────────────────
const MEGA_MENU_CATEGORIES = [
  {
    id:    "jahon",
    title: "Jahon Adabiyoti",
    desc:  "Dunyo klassiklari va zamonaviy asarlar",
    img:   jahonImg,
  },
  {
    id:    "bolalar",
    title: "Bolalar Adabiyoti",
    desc:  "Kichik o'quvchilar uchun ajoyib hikoyalar",
    img:   bolalarImg,
  },
  {
    id:    "ozbek",
    title: "O'zbek Adabiyoti",
    desc:  "Milliy adabiyotimizning eng sara asarlari",
    img:   ozbekImg,
  },
] as const;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // <-- Search State
  
  const { t } = useLang();
  const location = useLocation();
  
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("zabarjad-theme") as "dark" | "light") || "light";
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
    localStorage.setItem("zabarjad-theme", theme);
  }, [theme]);

  const navLinks = [
    { label: t.nav.home,      href: "/" },
    { label: t.nav.spotlight, href: "/spotlight" },
    { label: t.nav.library,   href: "/library" },
    { label: t.nav.quiz,      href: "/quiz" }, 
    { label: t.nav.blog,      href: "/blog" },
    { label: t.nav.contact,   href: "/#footer" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href.startsWith("/#")) return location.pathname === "/" && location.hash === href.slice(1);
    return location.pathname === href;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 dark:bg-[#0a0806]/85 backdrop-blur-xl border-b border-neutral-200/50 dark:border-white/10 shadow-sm transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 drop-shadow-sm transition-transform hover:scale-[1.02]">
            <img
              src={zabarjadBird}
              alt="Zabarjad Media"
              className="h-10 w-10 object-contain"
            />
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-foreground">
              Zabarjad <span className="text-amber-500">Media</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                
                {link.href === "/library" ? (
                  // ── Mega Menu Trigger ──────────────────────────────────────
                  <div
                    onMouseEnter={() => setMegaMenuOpen(true)}
                    onMouseLeave={() => setMegaMenuOpen(false)}
                    className="py-2 cursor-pointer"
                  >
                    <Link
                      to={link.href}
                      className={`
                        inline-flex items-center gap-1.5
                        text-[15px] font-bold transition-all duration-200 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]
                        ${isActive(link.href) ? "text-amber-500" : "text-foreground hover:text-amber-500"}
                      `}
                    >
                      {link.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`} />
                    </Link>
                  </div>

                ) : link.href === "/quiz" ? (
                  // ── HIGHLIGHTED LINK (Kitob Sovchilari) ────────────────────
                  <Link
                    to={link.href}
                    className="group relative inline-flex items-center drop-shadow-sm hover:scale-105 transition-transform duration-300"
                  >
                    <span className={`
                      text-[16px] font-extrabold tracking-wide
                      bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 bg-clip-text text-transparent
                      bg-[length:200%_auto] animate-gradient
                    `}>
                      {link.label}
                    </span>
                  </Link>

                ) : link.href.startsWith("/#") ? (
                  // ── Hash link ──────────────────────────────────────────────
                  <a
                    href={link.href}
                    className={`
                      ${link.href === "/spotlight" 
                        ? "font-got text-[15px] text-amber-600 dark:text-amber-500 tracking-widest drop-shadow-sm" 
                        : "text-[15px] font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      }
                      transition-all duration-200 hover:text-amber-500
                      ${isActive(link.href) ? "text-amber-500" : link.href === "/spotlight" ? "" : "text-foreground"}
                    `}
                  >
                    {link.label}
                  </a>
                ) : (
                  // ── Regular link ───────────────────────────────────────────
                  <Link
                    to={link.href}
                    className={`
                      ${link.href === "/spotlight" 
                        ? "font-got text-[15px] text-amber-700 dark:text-amber-500 tracking-[0.15em] drop-shadow-sm hover:scale-105" 
                        : "text-[15px] font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      }
                      transition-all duration-200 hover:text-amber-500
                      ${isActive(link.href) ? "text-amber-500" : link.href === "/spotlight" ? "" : "text-foreground"}
                    `}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            
            {/* ── Desktop Controls ── */}
            <li className="flex items-center gap-3 pl-4 border-l border-neutral-300 dark:border-neutral-700">
              {/* Search Trigger */}
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-white/10 rounded-full transition-all"
                aria-label="Qidiruv"
              >
                <Search className="w-5 h-5" />
              </button>

              <LanguageSwitcher />
              
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-foreground transition-colors hover:text-amber-500 focus:outline-none drop-shadow-sm"
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
              className="p-2 text-foreground hover:text-amber-500 transition-colors"
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

        {/* ── DESKTOP MEGA MENU ── */}
        <AnimatePresence>
          {megaMenuOpen && (
            <div 
              className="absolute left-0 right-0 top-full hidden md:flex justify-center pt-2"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0  }}
                exit={{   opacity: 0, y: -10  }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-[92vw] max-w-[850px] bg-white/95 dark:bg-[#0a0806]/95 backdrop-blur-2xl rounded-2xl border border-neutral-200 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] overflow-hidden"
              >
                <div className="p-6 lg:p-8">
                  <div className="grid grid-cols-3 gap-6 lg:gap-8">
                    {MEGA_MENU_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/library?category=${cat.id}`}
                        className="group flex flex-col p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                        onClick={() => setMegaMenuOpen(false)}
                      >
                        {/* Image Container with Hover Zoom */}
                        <div className="w-full h-32 bg-amber-100 dark:bg-neutral-800 rounded-xl mb-4 overflow-hidden border border-neutral-200/50 dark:border-white/5 shadow-inner relative">
                          {cat.img ? (
                            <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-200/50 to-amber-400/20 dark:from-neutral-700 dark:to-neutral-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                              <span className="text-4xl opacity-40 group-hover:opacity-70 transition-opacity">📚</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                        </div>

                        <h3 className="font-serif font-bold text-base lg:text-lg text-foreground group-hover:text-amber-500 transition-colors mb-1.5">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-foreground/70 leading-relaxed font-medium">
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

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {open && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-200/50 dark:border-white/10 bg-white/95 dark:bg-[#0a0806]/95 backdrop-blur-2xl shadow-xl overflow-hidden"
            >
              <ul className="flex flex-col gap-1 px-6 py-6">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    
                    {link.href === "/quiz" ? (
                      // MOBILE HIGHLIGHTED LINK
                      <Link
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className="block py-3 px-2 rounded-lg transition-colors active:bg-pink-500/10"
                      >
                        <span className="text-base font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 bg-clip-text text-transparent">
                          {link.label}
                        </span>
                      </Link>
                    ) : link.href.startsWith("/#") ? (
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`
                          block py-3 px-2 rounded-lg
                          ${link.href === "/spotlight" ? "font-got text-base text-amber-600 dark:text-amber-500 tracking-widest" : "text-base font-bold text-foreground"}
                          transition-colors active:bg-amber-500/10 hover:text-amber-500
                        `}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className={`
                          block py-3 px-2 rounded-lg
                          ${link.href === "/spotlight" ? "font-got text-base text-amber-600 dark:text-amber-500 tracking-widest" : "text-base font-bold text-foreground"}
                          transition-colors active:bg-amber-500/10 hover:text-amber-500
                          ${isActive(link.href) ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : ""}
                        `}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
                
                <li className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 w-full py-3 px-2 text-base font-bold text-foreground transition-colors active:bg-amber-500/10 rounded-lg"
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

      {/* ── GLOBAL SEARCH MODAL ── */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;