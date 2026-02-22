import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import zabarjadBird from "@/assets/zabarjad-bird.png";

// ── Mega Menu Categories ──────────────────────────────────────────────────────
const MEGA_MENU_CATEGORIES = [
  {
    id:    "jahon",
    title: "Jahon Adabiyoti",
    desc:  "Dunyo klassiklari va zamonaviy asarlar",
  },
  {
    id:    "bolalar",
    title: "Bolalar Adabiyoti",
    desc:  "Kichik o'quvchilar uchun ajoyib hikoyalar",
  },
  {
    id:    "ozbek",
    title: "O'zbek Adabiyoti",
    desc:  "Milliy adabiyotimizning eng sara asarlari",
  },
] as const;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
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
    { label: t.nav.blog,      href: "/blog" },
    { label: t.nav.quiz,      href: "/quiz" },
    { label: t.nav.contact,   href: "/#footer" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href.startsWith("/#")) return location.pathname === "/" && location.hash === href.slice(1);
    return location.pathname === href;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass-card border-b border-border rounded-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={zabarjadBird}
            alt="Zabarjad Media"
            className="h-9 w-9 object-contain"
          />
          <span className="font-serif text-xl font-bold tracking-wide text-foreground">
            Zabarjad <span className="text-primary">Media</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              {link.href === "/library" ? (
                // ── Mega Menu Trigger ──────────────────────────────────────
                <div
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  onMouseLeave={() => setMegaMenuOpen(false)}
                  className="relative"
                >
                  <Link
                    to={link.href}
                    className={`
                      inline-flex items-center gap-1
                      text-sm font-medium transition-colors hover:text-primary
                      ${isActive(link.href) ? "text-primary" : "text-muted-foreground"}
                    `}
                  >
                    {link.label}
                    <ChevronDown className="h-3 w-3" />
                  </Link>

                  <AnimatePresence>
                    {megaMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0  }}
                        exit={{   opacity: 0, y: -20  }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="
                          fixed left-0 w-full
                          top-[72px]
                          bg-white/95 dark:bg-[#0a0806]/95
                          backdrop-blur-xl
                          border-b border-neutral-200 dark:border-white/10
                          shadow-2xl
                          z-[100]
                        "
                      >
                        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
                          <div className="grid grid-cols-3 gap-8">
                            {MEGA_MENU_CATEGORIES.map((cat) => (
                              <Link
                                key={cat.id}
                                to={`/library?category=${cat.id}`}
                                className="group flex flex-col"
                                onClick={() => setMegaMenuOpen(false)}
                              >
                                <div className="
                                  w-full h-32
                                  bg-amber-100 dark:bg-neutral-800
                                  rounded-md mb-3 overflow-hidden
                                ">
                                  <div className="
                                    w-full h-full
                                    bg-gradient-to-br
                                    from-amber-200/50 to-amber-400/20
                                    dark:from-neutral-700 dark:to-neutral-900
                                    flex items-center justify-center
                                  ">
                                    <span className="text-4xl opacity-20">📚</span>
                                  </div>
                                </div>

                                <h3 className="
                                  font-serif font-semibold text-base
                                  text-foreground group-hover:text-primary
                                  transition-colors mb-1
                                ">
                                  {cat.title}
                                </h3>

                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {cat.desc}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              ) : link.href.startsWith("/#") ? (
                // ── Hash link ──────────────────────────────────────────────
                <a
                  href={link.href}
                  className={`
                    ${link.href === "/spotlight" 
                      ? "font-got text-sm text-amber-600 dark:text-amber-500 tracking-widest" 
                      : "text-sm font-medium"
                    }
                    transition-colors hover:text-primary
                    ${isActive(link.href) 
                      ? "text-primary" 
                      : link.href === "/spotlight" 
                        ? "" 
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {link.label}
                </a>
              ) : (
                // ── Regular link (BALANCED TAXTLAR STYLING) ────────────────
                <Link
                  to={link.href}
                  className={`
                    ${link.href === "/spotlight" 
                      ? "font-got text-sm text-amber-600 dark:text-amber-500 tracking-widest" 
                      : "text-sm font-medium"
                    }
                    transition-colors hover:text-primary
                    ${isActive(link.href) 
                      ? "text-primary" 
                      : link.href === "/spotlight" 
                        ? "" 
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
          <li>
            <LanguageSwitcher />
          </li>
          <li>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </li>
        </ul>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen(!open)}
            className="text-foreground"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border px-4 pb-4">
          <ul className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("/#") ? (
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`
                      block
                      ${link.href === "/spotlight" 
                        ? "font-got text-sm text-amber-600 dark:text-amber-500 tracking-widest" 
                        : "text-sm font-medium text-muted-foreground"
                      }
                      transition-colors hover:text-primary
                    `}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={`
                      block
                      ${link.href === "/spotlight" 
                        ? "font-got text-sm text-amber-600 dark:text-amber-500 tracking-widest" 
                        : "text-sm font-medium text-muted-foreground"
                      }
                      transition-colors hover:text-primary
                    `}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;