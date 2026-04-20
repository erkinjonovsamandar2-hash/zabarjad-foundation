import React from "react";
import { Link } from "react-router-dom";
import logoImg from "@/assets/Logo-blue.png";
import { MapPin, Phone, Mail, Send, Instagram } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useLang } from "@/context/LanguageContext";

const Footer = () => {
  const { siteSettings } = useData();
  const { t } = useLang();
  const { footer } = siteSettings;
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="w-full bg-[#0A1128] border-t border-[rgba(10,17,40,0.15)]">
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem 2rem;
        }
        .footer-links-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem 2rem;
        }
        @media (min-width: 640px) { /* sm */
          .footer-links-wrapper {
            grid-template-columns: 1fr 1fr;
          }
          .footer-link-col:nth-child(3) {
            grid-column: 1 / -1;
          }
        }
        @media (min-width: 768px) { /* md */
          .footer-links-wrapper {
            grid-template-columns: 1fr 1fr 1fr;
          }
          .footer-link-col:nth-child(3) {
            grid-column: auto;
          }
        }
        @media (min-width: 1024px) { /* lg */
          .footer-grid {
            grid-template-columns: 1.6fr 1fr 1fr 1fr;
          }
          .footer-links-wrapper {
            display: contents;
          }
        }
      `}</style>

      {/* ZONE 1 - Main body */}
      <div className="w-full pt-[4rem] px-[2.25rem] pb-0">
        <div className="footer-grid pb-[3rem] border-b border-[rgba(255,255,255,0.08)]">

          {/* COLUMN 1 - Brand column */}
          <div className="flex flex-col">
            <Link to="/" className="inline-block mb-4">
              <img
                src={logoImg}
                alt="Booktopia Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="font-serif text-[1.05rem] leading-[1.8] text-[rgba(255,255,255,0.6)] max-w-[280px] mb-6">
              Jahon va o'zbek adabiyotining eng sara durdonalarini sifatli tarjima va yuqori
              poligrafiya darajasida o'quvchilarga taqdim etuvchi premium nashriyot.
            </p>

            <div className="flex flex-col gap-4">
              {footer.address && (
                <div className="flex items-center gap-3 font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.45)]">
                  <MapPin className="w-5 h-5 text-[#00A3FF] shrink-0" />
                  <span>{footer.address}</span>
                </div>
              )}
              {footer.phone && (
                <a href={`tel:${footer.phone}`} className="flex items-center gap-3 font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.45)] hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-[#00A3FF] shrink-0" />
                  <span>{footer.phone}</span>
                </a>
              )}
              {footer.email && (
                <a href={`mailto:${footer.email}`} className="flex items-center gap-3 font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.45)] hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-[#00A3FF] shrink-0" />
                  <span>{footer.email}</span>
                </a>
              )}
              {(footer.telegram || footer.instagram) && (
                <div className="flex items-center gap-3 mt-1">
                  {footer.telegram && (
                    <a href={footer.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-[#00A3FF]/20 transition-colors" aria-label="Telegram">
                      <Send className="w-4 h-4 text-[#00A3FF]" />
                    </a>
                  )}
                  {footer.instagram && (
                    <a href={footer.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-pink-500/20 transition-colors" aria-label="Instagram">
                      <Instagram className="w-4 h-4 text-pink-400" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* COLUMNS 2, 3, 4 - Link columns wrapper */}
          <div className="footer-links-wrapper">

            {/* Faoliyat */}
            <div className="footer-link-col flex flex-col">
              <h4 className="font-sans text-[0.9rem] font-bold tracking-[0.15em] uppercase text-[#00A3FF] mb-6">
                Faoliyat
              </h4>
              <Link to="/library" className="block font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.55)] mb-4 transition-colors duration-200 hover:text-white outline-none">
                Barcha kitoblar
              </Link>
              <Link to="/library?tab=new" className="block font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.55)] mb-4 transition-colors duration-200 hover:text-white outline-none">
                Yangi nashrlar
              </Link>
              <Link to="/authors" className="block font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.55)] mb-4 transition-colors duration-200 hover:text-white outline-none">
                Mualliflar va Tarjimonlar
              </Link>
            </div>

            {/* Nashriyot */}
            <div className="footer-link-col flex flex-col">
              <h4 className="font-sans text-[0.9rem] font-bold tracking-[0.15em] uppercase text-[#00A3FF] mb-6">
                Nashriyot
              </h4>
              <Link to="/biz-haqimizda" className="block font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.55)] mb-4 transition-colors duration-200 hover:text-white outline-none">
                Biz haqimizda
              </Link>
              <Link to="/blog" className="block font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.55)] mb-4 transition-colors duration-200 hover:text-white outline-none">
                Booktopia Kundaligi
              </Link>
              <a
                href="#footer"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }}
                className="block font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.55)] mb-4 transition-colors duration-200 hover:text-white outline-none"
              >
                Aloqa va Hamkorlik
              </a>
            </div>

            {/* Huquqiy */}
            <div className="footer-link-col flex flex-col">
              <h4 className="font-sans text-[0.9rem] font-bold tracking-[0.15em] uppercase text-[#00A3FF] mb-6">
                Huquqiy
              </h4>
              <Link to="/oferta" className="block font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.55)] mb-4 transition-colors duration-200 hover:text-white outline-none">
                Ommaviy ofеrta
              </Link>
              <Link to="/maxfiylik" className="block font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.55)] mb-4 transition-colors duration-200 hover:text-white outline-none">
                Maxfiylik siyosati
              </Link>
              <Link to="/shartlar" className="block font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.55)] mb-4 transition-colors duration-200 hover:text-white outline-none">
                Foydalanish shartlari
              </Link>
              <Link to="/yetkazish" className="block font-sans text-[0.95rem] font-medium text-[rgba(255,255,255,0.55)] mb-4 transition-colors duration-200 hover:text-white outline-none">
                Yetkazib berish
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ZONE 2 - Copyright bar */}
      <div className="w-full bg-[#050B1A] py-[1rem] px-[2.25rem] flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="font-sans text-[0.7rem] font-semibold tracking-[0.08em] text-[rgba(255,255,255,0.4)] uppercase text-center md:text-left">
          © {currentYear} BOOKTOPIA. {t?.footer?.rights || "BARCHA HUQUQLAR HIMOYALANGAN."}
        </div>
        <div className="font-sans text-[0.7rem] font-semibold tracking-[0.05em] text-[rgba(255,255,255,0.3)] flex items-center justify-center gap-1.5 uppercase">
          <span>MUHABBAT BILAN YARATILDI</span>
          <span style={{ color: '#E24B4A' }} className="text-[0.85rem] translate-y-[-1px]">♥</span>
          <span className="opacity-50">·</span>
          <span>SAMANDAR ERKINJONOV</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;