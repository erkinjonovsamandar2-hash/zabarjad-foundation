import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useLang } from "@/context/LanguageContext";

const Footer = () => {
  const { siteSettings } = useData();
  const { t } = useLang();
  const { footer } = siteSettings;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0A1128] border-t border-[rgba(10,17,40,0.15)]">
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
      <div className="w-full pt-[3rem] px-[2.25rem] pb-0">
        <div className="footer-grid pb-[2.25rem] border-b border-[rgba(255,255,255,0.08)]">

          {/* COLUMN 1 - Brand column */}
          <div className="flex flex-col">
            <Link to="/" className="inline-block mb-3">
              <img
                src="/Logo-blue.png"
                alt="Booktopia Logo"
                className="h-8 w-auto object-contain"
              />
            </Link>

            <p className="font-sans text-[0.7rem] leading-[1.75] text-[rgba(255,255,255,0.38)] max-w-[260px] mb-5">
              Jahon va o'zbek adabiyotining eng sara durdonalarini sifatli tarjima va yuqori
              poligrafiya darajasida o'quvchilarga taqdim etuvchi premium nashriyot.
            </p>

            <div className="flex flex-col gap-0">
              <div className="flex items-center gap-2 font-sans text-[0.7rem] leading-[2] text-[rgba(255,255,255,0.32)]">
                <MapPin className="w-3.5 h-3.5 text-[rgba(255,255,255,0.25)] shrink-0" />
                <span className="truncate">{footer.address}</span>
              </div>
              <div className="flex items-center gap-2 font-sans text-[0.7rem] leading-[2] text-[rgba(255,255,255,0.32)]">
                <Phone className="w-3.5 h-3.5 text-[rgba(255,255,255,0.25)] shrink-0" />
                <span className="truncate">{footer.phone}</span>
              </div>
              <div className="flex items-center gap-2 font-sans text-[0.7rem] leading-[2] text-[rgba(255,255,255,0.32)]">
                <Mail className="w-3.5 h-3.5 text-[rgba(255,255,255,0.25)] shrink-0" />
                <span className="truncate">hello@booktopia.uz</span>
              </div>
            </div>
          </div>

          {/* COLUMNS 2, 3, 4 - Link columns wrapper */}
          <div className="footer-links-wrapper">

            {/* Faoliyat */}
            <div className="footer-link-col flex flex-col">
              <h4 className="font-sans text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-[#00A3FF] mb-[0.875rem]">
                Faoliyat
              </h4>
              <Link to="/library" className="block font-sans text-[0.7rem] text-[rgba(255,255,255,0.42)] mb-2 transition-colors duration-150 hover:text-[rgba(255,255,255,0.85)] outline-none">
                Barcha kitoblar
              </Link>
              <Link to="/library?tab=new" className="block font-sans text-[0.7rem] text-[rgba(255,255,255,0.42)] mb-2 transition-colors duration-150 hover:text-[rgba(255,255,255,0.85)] outline-none">
                Yangi nashrlar
              </Link>
              <Link to="/authors" className="block font-sans text-[0.7rem] text-[rgba(255,255,255,0.42)] mb-2 transition-colors duration-150 hover:text-[rgba(255,255,255,0.85)] outline-none">
                Mualliflar va Tarjimonlar
              </Link>
            </div>

            {/* Nashriyot */}
            <div className="footer-link-col flex flex-col">
              <h4 className="font-sans text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-[#00A3FF] mb-[0.875rem]">
                Nashriyot
              </h4>
              <Link to="/biz-haqimizda" className="block font-sans text-[0.7rem] text-[rgba(255,255,255,0.42)] mb-2 transition-colors duration-150 hover:text-[rgba(255,255,255,0.85)] outline-none">
                Biz haqimizda
              </Link>
              <Link to="/blog" className="block font-sans text-[0.7rem] text-[rgba(255,255,255,0.42)] mb-2 transition-colors duration-150 hover:text-[rgba(255,255,255,0.85)] outline-none">
                Booktopia Kundaligi
              </Link>
              <Link to="/aloqa" className="block font-sans text-[0.7rem] text-[rgba(255,255,255,0.42)] mb-2 transition-colors duration-150 hover:text-[rgba(255,255,255,0.85)] outline-none">
                Aloqa va Hamkorlik
              </Link>
            </div>

            {/* Huquqiy */}
            <div className="footer-link-col flex flex-col">
              <h4 className="font-sans text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-[#00A3FF] mb-[0.875rem]">
                Huquqiy
              </h4>
              <Link to="/oferta" className="block font-sans text-[0.7rem] text-[rgba(255,255,255,0.42)] mb-2 transition-colors duration-150 hover:text-[rgba(255,255,255,0.85)] outline-none">
                Ommaviy ofеrta
              </Link>
              <Link to="/maxfiylik" className="block font-sans text-[0.7rem] text-[rgba(255,255,255,0.42)] mb-2 transition-colors duration-150 hover:text-[rgba(255,255,255,0.85)] outline-none">
                Maxfiylik siyosati
              </Link>
              <Link to="/shartlar" className="block font-sans text-[0.7rem] text-[rgba(255,255,255,0.42)] mb-2 transition-colors duration-150 hover:text-[rgba(255,255,255,0.85)] outline-none">
                Foydalanish shartlari
              </Link>
              <Link to="/yetkazish" className="block font-sans text-[0.7rem] text-[rgba(255,255,255,0.42)] mb-2 transition-colors duration-150 hover:text-[rgba(255,255,255,0.85)] outline-none">
                Yetkazib berish
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ZONE 2 - Copyright bar */}
      <div className="w-full bg-[#050B1A] py-[0.875rem] px-[2.25rem] flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="font-sans text-[0.625rem] tracking-[0.08em] text-[rgba(255,255,255,0.22)] uppercase text-center md:text-left">
          © {currentYear} BOOKTOPIA. {t?.footer?.rights || "BARCHA HUQUQLAR HIMOYALANGAN."}
        </div>
        <div className="font-sans text-[0.625rem] tracking-[0.05em] text-[rgba(255,255,255,0.18)] flex items-center justify-center gap-1.5 uppercase">
          <span>MUHABBAT BILAN YARATILDI</span>
          <span style={{ color: '#E24B4A' }} className="text-[0.7rem] translate-y-[-1px]">♥</span>
          <span className="opacity-50">·</span>
          <span>SAMANDAR ERKINJONOV</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;