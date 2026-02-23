import { Link } from "react-router-dom";
import { Download, Send, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useLang } from "@/context/LanguageContext";
import zabarjadLogo from "@/assets/zabarjad-logo.jpg";

const Footer = () => {
  const { siteSettings } = useData();
  const { t } = useLang();
  const { footer, map } = siteSettings;
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative isolate bg-background border-t border-border pt-12 pb-8 overflow-hidden">
      
      {/* ── Subtle Background Glow ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-500/5 via-background to-background" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Classic Editorial Divider ── */}
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center pt-0 pb-12 opacity-60 dark:opacity-40">
          <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent via-amber-700/50 to-amber-900 dark:via-amber-400/50 dark:to-amber-200 rounded-full" />
          <div className="flex items-center gap-3 px-6 text-amber-900 dark:text-amber-200 font-serif drop-shadow-sm">
            <span className="text-xl opacity-70">✦</span>
            <span className="text-4xl">❦</span>
            <span className="text-xl opacity-70">✦</span>
          </div>
          <div className="h-[2px] flex-grow bg-gradient-to-l from-transparent via-amber-700/50 to-amber-900 dark:via-amber-400/50 dark:to-amber-200 rounded-full" />
        </div>

        {/* ── Top Section: Catalogue & Newsletter CTA ──────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 p-8 md:p-10 rounded-3xl bg-amber-500/5 border border-amber-500/20 shadow-lg shadow-amber-500/5">
          
          {/* Catalogue Download */}
          <div className="flex flex-col items-start border-b md:border-b-0 md:border-r border-amber-500/20 pb-8 md:pb-0 md:pr-8">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">Nashriyot Katalogi</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm leading-relaxed">
              Yangi nashrlarimiz, xalqaro bestsellerlar va jahon adabiyoti durdonalari ro'yxati bilan to'liq tanishing.
            </p>
            <a
              href="/katalog.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-bold text-sm tracking-wide hover:bg-amber-500 hover:text-black hover:scale-105 transition-all duration-300 shadow-md"
            >
              <Download className="w-4 h-4" />
              PDF formatda yuklab olish
            </a>
          </div>

          {/* Social / Join Community */}
          <div className="flex flex-col items-start md:pl-8 justify-center">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
              {t.footer.heading || "Zabarjad oilasiga qo'shiling"}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm leading-relaxed">
              {t.footer.desc || "Maxsus takliflar, yangi kitoblar anonsi va adabiyot dunyosidan qaynoq xabarlar oqimi."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href={footer.telegram} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all duration-300 text-sm font-bold tracking-wide">
                <Send className="w-4 h-4" /> Telegram
              </a>
              <a href={footer.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-all duration-300 text-sm font-bold tracking-wide">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* ── Map Embed (Conditional) ──────────────────────────────────────── */}
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

        {/* ── Main Links Grid (4 Columns) ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Col 1: Brand Info & Contacts */}
          <div className="flex flex-col gap-6 lg:col-span-4 lg:pr-8">
            <Link to="/" className="flex items-center gap-3 group">
              {/* The rounded logo you wanted to keep */}
              <img 
                src={zabarjadLogo} 
                alt="Zabarjad Media Logo" 
                className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary transition-all shrink-0 shadow-md" 
              />
              {/* The exact typography styling from your Navbar, scaled up slightly for the footer */}
              <span className="font-serif text-2xl font-bold tracking-wide text-foreground">
                Zabarjad <span className="text-primary">Media</span>
              </span>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Jahon va o'zbek adabiyotining eng sara durdonalarini sifatli tarjima va yuqori poligrafiya darajasida o'quvchilarga taqdim etuvchi premium nashriyot.
            </p>
          
            <div className="flex flex-col gap-4 text-sm text-muted-foreground mt-2 border-l-2 border-amber-500/20 pl-4">
              <div className="flex items-start gap-3 hover:text-foreground transition-colors">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{footer.address}</span>
              </div>
              <div className="flex items-center gap-3 hover:text-foreground transition-colors">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{footer.phone}</span>
              </div>
              <div className="flex items-center gap-3 hover:text-foreground transition-colors">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>info@zabarjad.uz</span>
              </div>
            </div>
          </div>

          {/* Col 2: Faoliyat (Library & Products) */}
          <div className="flex flex-col lg:col-span-3 lg:pl-4">
            <h4 className="font-serif font-bold text-foreground text-sm tracking-widest uppercase mb-6 border-b border-border pb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rotate-45"></span> Faoliyat
            </h4>
            <div className="flex flex-col gap-4">
              <Link to="/library" className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500/40 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Barcha kitoblar</span>
              </Link>
              <Link to="/library?tab=new" className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500/40 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Yangi nashrlar</span>
              </Link>
              <Link to="/library?tab=got" className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500/40 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">"Taxtlar O'yini" seriyasi</span>
              </Link>
              <Link to="/authors" className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500/40 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Mualliflar va Tarjimonlar</span>
              </Link>
            </div>
          </div>

          {/* Col 3: Nashriyot (Company) */}
          <div className="flex flex-col lg:col-span-3">
            <h4 className="font-serif font-bold text-foreground text-sm tracking-widest uppercase mb-6 border-b border-border pb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rotate-45"></span> Nashriyot
            </h4>
            <div className="flex flex-col gap-4">
              <Link to="/biz-haqimizda" className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500/40 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Biz haqimizda</span>
              </Link>
              <Link to="/blog" className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500/40 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Zabarjad Kundaligi</span>
              </Link>
              <Link to="/aloqa" className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500/40 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Aloqa va Hamkorlik</span>
              </Link>
            </div>
          </div>

          {/* Col 4: Huquqiy (Legal) */}
          <div className="flex flex-col lg:col-span-2">
            <h4 className="font-serif font-bold text-foreground text-sm tracking-widest uppercase mb-6 border-b border-border pb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rotate-45"></span> Huquqiy
            </h4>
            <div className="flex flex-col gap-4">
              <Link to="/oferta" className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500/40 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Ommaviy ofеrta</span>
              </Link>
              <Link to="/maxfiylik" className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500/40 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Maxfiylik siyosati</span>
              </Link>
              <Link to="/shartlar" className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500/40 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Foydalanish shartlari</span>
              </Link>
              <Link to="/yetkazish" className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full border border-amber-500/40 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Yetkazib berish</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ────────────────────────────────────────── */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {currentYear} Zabarjad Media. {t.footer.rights || "Barcha huquqlar himoyalangan."}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
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