import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Send } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLang();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0A1128] border-t border-[rgba(255,255,255,0.05)] text-white/80 font-sans transition-colors duration-500">
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem 2rem;
        }
        .footer-links-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem 2rem;
        }
        @media (min-width: 640px) {
          .footer-links-wrapper {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.5fr 2fr;
          }
          .footer-links-wrapper {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      {/* ZONE 1 - Main body */}
      <div className="w-full max-w-7xl mx-auto pt-16 md:pt-20 px-6 md:px-8 pb-16">
        <div className="footer-grid">
          
          {/* Brand & Contact Info */}
          <div className="flex flex-col gap-6 md:pr-8">
            <Link to="/" className="inline-block w-max">
              <img
                src="/Logo-blue.png"
                alt="Booktopia Logo"
                className="h-10 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </Link>
            
            <p className="text-sm text-white/60 leading-relaxed font-serif max-w-sm">
              Jahon va o'zbek adabiyotining eng sara durdonalarini sifatli tarjima va yuqori
              poligrafiya darajasida o'quvchilarga taqdim etuvchi premium nashriyot.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-[#c8973a] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  Uchtepa tumani, G9A-mavze, 20-uy
                </span>
              </a>
              
              <a href="tel:+998770164455" className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-[#c8973a] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  +998770164455
                </span>
              </a>
              
              <a href="mailto:info@booktopia.uz" className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-[#c8973a] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  info@booktopia.uz
                </span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-links-wrapper">
            
            {/* Faoliyat */}
            <div className="flex flex-col gap-5">
              <h3 className="font-heading text-lg font-semibold text-white tracking-wide">Faoliyat</h3>
              <div className="flex flex-col gap-3">
                <Link to="/library" className="text-sm text-white/60 hover:text-[#c8973a] transition-colors">Barcha kitoblar</Link>
                <Link to="/library?tab=new" className="text-sm text-white/60 hover:text-[#c8973a] transition-colors">Yangi nashrlar</Link>
                <Link to="/team" className="text-sm text-white/60 hover:text-[#c8973a] transition-colors">Jamoa</Link>
              </div>
            </div>

            {/* Nashriyot */}
            <div className="flex flex-col gap-5">
              <h3 className="font-heading text-lg font-semibold text-white tracking-wide">Nashriyot</h3>
              <div className="flex flex-col gap-3">
                <Link to="/about" className="text-sm text-white/60 hover:text-[#c8973a] transition-colors">Biz haqimizda</Link>
                <Link to="/blog" className="text-sm text-white/60 hover:text-[#c8973a] transition-colors">Blog</Link>
                <Link to="/contact" className="text-sm text-white/60 hover:text-[#c8973a] transition-colors">Aloqa va Hamkorlik</Link>
              </div>
            </div>

            {/* Huquqiy & Ijtimoiy */}
            <div className="flex flex-col gap-5">
              <h3 className="font-heading text-lg font-semibold text-white tracking-wide">Ma'lumot</h3>
              <div className="flex flex-col gap-3">
                <Link to="/oferta" className="text-sm text-white/60 hover:text-[#c8973a] transition-colors">Ommaviy oferta</Link>
                <Link to="/privacy" className="text-sm text-white/60 hover:text-[#c8973a] transition-colors">Maxfiylik siyosati</Link>
                <Link to="/terms" className="text-sm text-white/60 hover:text-[#c8973a] transition-colors">Foydalanish shartlari</Link>
              </div>
              
              {/* Built-in Socials */}
              <div className="flex items-center gap-4 mt-2">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#E1306C] hover:text-white transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://t.me" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#229ED9] hover:text-white transition-all duration-300">
                  <Send className="w-4 h-4 ml-[-2px] mt-[2px]" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ZONE 2 - Copyright bar */}
      <div className="w-full bg-[#050B1A] py-5 px-6 md:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[11px] sm:text-xs text-white/50 font-medium tracking-wide uppercase">
            &copy; {currentYear} Booktopia. {t.footer?.rights || "Barcha huquqlar himoyalangan."}
          </p>
          
          <p className="text-[10px] sm:text-[11px] text-white/40 tracking-wider uppercase flex items-center gap-1.5">
            Muhabbat bilan yaratildi <span className="text-red-500/80 text-sm">♥</span> 
            <span className="mx-1">|</span>
            <a href="https://t.me/white_crow_8" target="_blank" rel="noreferrer" className="hover:text-white/80 transition-colors">
              Samandar Erkinjonov
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;