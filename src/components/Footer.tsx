import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Send, Instagram, MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useLang } from "@/context/LanguageContext";

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { siteSettings } = useData();
  const { t } = useLang();
  const { footer, map } = siteSettings;
  const currentYear = new Date().getFullYear();

  const toggle = (section: string) =>
    setOpenSection((prev) => (prev === section ? null : section));

  return (
    <footer
      id="footer"
      className="relative isolate bg-background border-t border-border pt-24 md:pt-32 pb-12 overflow-hidden"
    >
      {/* ── Subtle Background Glow ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-500/5 via-background to-background" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Classic Editorial Divider ── */}
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center pt-0 pb-12 opacity-60">
          <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent via-accent/50 to-accent rounded-full" />
          <div className="flex items-center gap-3 px-6 text-accent font-heading font-bold drop-shadow-sm">
            <span className="text-xl opacity-70">✦</span>
            <span className="text-4xl">❦</span>
            <span className="text-xl opacity-70">✦</span>
          </div>
          <div className="h-[2px] flex-grow bg-gradient-to-l from-transparent via-accent/50 to-accent rounded-full" />
        </div>

        {/* ── Top Section: Catalogue & Newsletter CTA ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 p-8 md:p-10 rounded-3xl bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(38,89,153,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">

          {/* Catalogue Download */}
          <div className="flex flex-col items-start border-b md:border-b-0 md:border-r border-accent/20 pb-8 md:pb-0 md:pr-8">
            <h3 className="text-2xl md:text-3xl font-heading font-bold tracking-wide leading-[1.05] text-foreground mb-3">
              Nashriyot Katalogi
            </h3>
            <p className="font-serif text-muted-foreground text-sm sm:text-base mb-6 max-w-sm leading-loose">
              Yangi nashrlarimiz, xalqaro bestsellerlar va jahon adabiyoti durdonalari ro'yxati bilan to'liq tanishing.
            </p>
            <a
              href="/katalog.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl bg-primary text-primary-foreground font-sans font-bold text-[11px] tracking-[0.2em] uppercase shadow-[0_10px_25px_-5px_rgba(0,205,254,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(0,205,254,0.5)] hover:bg-primary/90 transition-all duration-500 ease-out"
            >
              <Download className="w-4 h-4" />
              PDF formatda yuklab olish
            </a>
          </div>

          {/* Social / Join Community */}
          <div className="flex flex-col items-start md:pl-8 justify-center">
            <h3 className="text-2xl font-heading font-bold tracking-wide leading-[1.05] text-foreground mb-3">
              {t.footer.heading || "Booktopia oilasiga qo'shiling"}
            </h3>
            <p className="font-serif text-muted-foreground text-sm sm:text-base mb-6 max-w-sm leading-loose">
              {t.footer.desc || "Maxsus takliflar, yangi kitoblar anonsi va adabiyot dunyosidan qaynoq xabarlar oqimi."}
            </p>
            {/* Newsletter Form */}
            <form className="w-full flex items-center gap-2 mb-6" onSubmit={(e) => { e.preventDefault(); }}>
              <input type="email" placeholder="Email manzilingiz" className="flex-1 bg-white/60 dark:bg-black/40 backdrop-blur-md border border-border rounded-xl px-4 py-3.5 sm:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
              <button type="submit" className="bg-primary text-primary-foreground px-6 py-3.5 sm:py-4 rounded-xl font-sans text-[11px] font-bold tracking-[0.2em] uppercase shadow-[0_10px_25px_-5px_rgba(0,205,254,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(0,205,254,0.5)] hover:bg-primary/90 transition-all duration-500 ease-out">Obuna</button>
            </form>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={footer.telegram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all duration-300 text-sm font-bold tracking-wide"
              >
                <Send className="w-4 h-4" /> Telegram
              </a>
              <a
                href={footer.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-all duration-300 text-sm font-bold tracking-wide"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* ── Map Embed (Conditional) ── */}
        {map.enabled && map.embed_url && (
          <div className="mb-16">
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-[250px] md:h-[300px] w-full bg-muted">
              <iframe
                src={map.embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* ── Main Links Grid (4 Columns) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">

          {/* ── Col 1: Brand Info & Contacts ── */}
          <div className="flex flex-col gap-6 lg:pr-8">
            <Link to="/" className="flex items-center gap-3 group mb-2">
              <img
                src="/Logo-blue.png"
                alt="Booktopia Logo"
                className="h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </Link>
            <p className="font-serif text-sm sm:text-base text-foreground/80 leading-loose">
              Jahon va o'zbek adabiyotining eng sara durdonalarini sifatli tarjima va yuqori
              poligrafiya darajasida o'quvchilarga taqdim etuvchi premium nashriyot.
            </p>
            <div className="flex flex-col gap-4 font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-foreground/80 mt-2 border-l-2 border-accent/20 pl-4">
              <div className="flex items-start gap-3 hover:text-primary transition-colors">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{footer.address}</span>
              </div>
              <div className="flex items-center gap-3 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>{footer.phone}</span>
              </div>
              <div className="flex items-center gap-3 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>hello@booktopia.uz</span>
              </div>
            </div>
          </div>

          {/* ── Col 2: Faoliyat ── */}
          <div className="flex flex-col group">
            {/* UPDATED: font-serif on heading button */}
            <button
              type="button"
              onClick={() => toggle("FAOLIYAT")}
              className="w-full font-sans font-bold text-foreground text-[11px] tracking-[0.2em] uppercase border-b border-border/50 pb-4 flex items-center justify-between gap-2 transition-colors hover:text-primary md:cursor-default md:pointer-events-none"
              aria-expanded={openSection === "FAOLIYAT"}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rotate-45 inline-block transition-transform duration-300 md:group-hover:scale-125" />
                Faoliyat
              </div>
              <ChevronDown
                className={`w-4 h-4 text-foreground/50 transition-transform duration-500 md:hidden ${openSection === "FAOLIYAT" ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Collapsible list — collapses on mobile, always open on md+ */}
            <div
              className={`flex flex-col gap-4 overflow-hidden transition-all duration-500 ease-in-out ${openSection === "FAOLIYAT"
                ? "max-h-[500px] opacity-100 mt-4"
                : "max-h-0 opacity-0 mt-0 md:max-h-[500px] md:opacity-100 md:mt-4"
                }`}
            >
              {/* UPDATED: font-serif on all footer links */}
              <Link
                to="/library"
                className="group/link flex items-center gap-3 text-[13px] font-serif font-bold text-foreground/70 hover:text-primary transition-colors py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full border border-primary/40 group-hover/link:bg-primary group-hover/link:border-primary transition-all duration-300" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">Barcha kitoblar</span>
              </Link>
              <Link
                to="/library?tab=new"
                className="group/link flex items-center gap-3 text-[13px] font-serif font-bold text-foreground/70 hover:text-primary transition-colors py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full border border-primary/40 group-hover/link:bg-primary group-hover/link:border-primary transition-all duration-300" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">Yangi nashrlar</span>
              </Link>
              <Link
                to="/authors"
                className="group/link flex items-center gap-3 text-[13px] font-serif font-bold text-foreground/70 hover:text-primary transition-colors py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full border border-primary/40 group-hover/link:bg-primary group-hover/link:border-primary transition-all duration-300" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">Mualliflar va Tarjimonlar</span>
              </Link>
            </div>
          </div>

          {/* ── Col 3: Nashriyot ── */}
          <div className="flex flex-col group">
            {/* UPDATED: font-serif on heading button */}
            <button
              type="button"
              onClick={() => toggle("NASHRIYOT")}
              className="w-full font-sans font-bold text-foreground text-[11px] tracking-[0.2em] uppercase border-b border-border/50 pb-4 flex items-center justify-between gap-2 transition-colors hover:text-primary md:cursor-default md:pointer-events-none"
              aria-expanded={openSection === "NASHRIYOT"}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rotate-45 inline-block transition-transform duration-300 md:group-hover:scale-125" />
                Nashriyot
              </div>
              <ChevronDown
                className={`w-4 h-4 text-foreground/50 transition-transform duration-500 md:hidden ${openSection === "NASHRIYOT" ? "rotate-180" : ""
                  }`}
              />
            </button>

            <div
              className={`flex flex-col gap-4 overflow-hidden transition-all duration-500 ease-in-out ${openSection === "NASHRIYOT"
                ? "max-h-[500px] opacity-100 mt-4"
                : "max-h-0 opacity-0 mt-0 md:max-h-[500px] md:opacity-100 md:mt-4"
                }`}
            >
              <Link
                to="/biz-haqimizda"
                className="group/link flex items-center gap-3 text-[13px] font-serif font-bold text-foreground/70 hover:text-primary transition-colors py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full border border-primary/40 group-hover/link:bg-primary group-hover/link:border-primary transition-all duration-300" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">Biz haqimizda</span>
              </Link>
              <Link
                to="/blog"
                className="group/link flex items-center gap-3 text-[13px] font-serif font-bold text-foreground/70 hover:text-primary transition-colors py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full border border-primary/40 group-hover/link:bg-primary group-hover/link:border-primary transition-all duration-300" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">Booktopia Kundaligi</span>
              </Link>
              <Link
                to="/aloqa"
                className="group/link flex items-center gap-3 text-[13px] font-serif font-bold text-foreground/70 hover:text-primary transition-colors py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full border border-primary/40 group-hover/link:bg-primary group-hover/link:border-primary transition-all duration-300" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">Aloqa va Hamkorlik</span>
              </Link>
            </div>
          </div>

          {/* ── Col 4: Huquqiy ── */}
          <div className="flex flex-col group">
            {/* UPDATED: font-serif on heading button */}
            <button
              type="button"
              onClick={() => toggle("HUQUQIY")}
              className="w-full font-sans font-bold text-foreground text-[11px] tracking-[0.2em] uppercase border-b border-border/50 pb-4 flex items-center justify-between gap-2 transition-colors hover:text-primary md:cursor-default md:pointer-events-none"
              aria-expanded={openSection === "HUQUQIY"}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rotate-45 inline-block transition-transform duration-300 md:group-hover:scale-125" />
                Huquqiy
              </div>
              <ChevronDown
                className={`w-4 h-4 text-foreground/50 transition-transform duration-500 md:hidden ${openSection === "HUQUQIY" ? "rotate-180" : ""
                  }`}
              />
            </button>

            <div
              className={`flex flex-col gap-4 overflow-hidden transition-all duration-500 ease-in-out ${openSection === "HUQUQIY"
                ? "max-h-[500px] opacity-100 mt-4"
                : "max-h-0 opacity-0 mt-0 md:max-h-[500px] md:opacity-100 md:mt-4"
                }`}
            >
              <Link
                to="/oferta"
                className="group/link flex items-center gap-3 text-[13px] font-serif font-bold text-foreground/70 hover:text-primary transition-colors py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full border border-primary/40 group-hover/link:bg-primary group-hover/link:border-primary transition-all duration-300" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">Ommaviy ofеrta</span>
              </Link>
              <Link
                to="/maxfiylik"
                className="group/link flex items-center gap-3 text-[13px] font-serif font-bold text-foreground/70 hover:text-primary transition-colors py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full border border-primary/40 group-hover/link:bg-primary group-hover/link:border-primary transition-all duration-300" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">Maxfiylik siyosati</span>
              </Link>
              <Link
                to="/shartlar"
                className="group/link flex items-center gap-3 text-[13px] font-serif font-bold text-foreground/70 hover:text-primary transition-colors py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full border border-primary/40 group-hover/link:bg-primary group-hover/link:border-primary transition-all duration-300" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">Foydalanish shartlari</span>
              </Link>
              <Link
                to="/yetkazish"
                className="group/link flex items-center gap-3 text-[13px] font-serif font-bold text-foreground/70 hover:text-primary transition-colors py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full border border-primary/40 group-hover/link:bg-primary group-hover/link:border-primary transition-all duration-300" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">Yetkazib berish</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-sans text-[10px] sm:text-[11px] text-foreground/60 font-bold uppercase tracking-[0.1em]">
            &copy; {currentYear} Booktopia.{" "}
            {t.footer.rights || "Barcha huquqlar himoyalangan."}
          </p>
          <p className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
            <span>Muhabbat bilan yaratildi</span>
            <span className="text-red-400 text-base leading-none">♥</span>
            <span className="text-muted-foreground/40 mx-0.5">·</span>
            <a
              href="https://github.com/erkinjonovsamandar2-hash"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-foreground/70 hover:text-primary transition-colors duration-200"
            >
              Samandar Erkinjonov
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;