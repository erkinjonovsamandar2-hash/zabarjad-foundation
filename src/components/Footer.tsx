import { BookOpen, Send, Instagram, Phone, MapPin } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useLang } from "@/context/LanguageContext";
import zabarjadLogo from "@/assets/zabarjad-logo.jpg";

const Footer = () => {
  const { siteSettings } = useData();
  const { t } = useLang();
  const { footer, map } = siteSettings;

  return (
    <footer id="footer" className="section-padding bg-charcoal border-t border-border">
      <div className="mx-auto max-w-7xl">
        {/* CTA */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {t.footer.heading}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            {t.footer.desc}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={footer.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Send className="h-4 w-4" /> Telegram
            </a>
            <a
              href={footer.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg glass-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </a>
          </div>
        </div>

        {/* Map */}
        {map.enabled && map.embed_url && (
          <div className="mb-10">
            <h3 className="text-lg font-serif font-semibold text-foreground text-center mb-4">{t.footer.mapTitle}</h3>
            <div className="rounded-xl overflow-hidden border border-border">
              <iframe src={map.embed_url} width="100%" height="300" style={{ border: 0 }} loading="lazy" allowFullScreen />
            </div>
          </div>
        )}

        {/* Info */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 border-t border-border pt-10">
          <div className="flex items-start gap-3">
            <img src={zabarjadLogo} alt="Zabarjad Media" className="h-8 w-8 rounded-full object-cover ring-1 ring-primary/30 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-serif font-semibold text-foreground">Zabarjad Media</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {t.hero.badge}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h4 className="font-serif font-semibold text-foreground">{t.footer.address}</h4>
              <p className="text-sm text-muted-foreground mt-1">{footer.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h4 className="font-serif font-semibold text-foreground">{t.footer.contact}</h4>
              <p className="text-sm text-muted-foreground mt-1">{footer.phone}</p>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Zabarjad Media. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
