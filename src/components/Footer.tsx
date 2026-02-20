import { BookOpen, Send, Instagram, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="section-padding bg-charcoal border-t border-border">
      <div className="mx-auto max-w-7xl">
        {/* CTA */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Zabarjad oilasiga qo'shiling.
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Yangi nashrlar, maxsus takliflar va adabiyot dunyosidan xabarlar olish uchun bizga qo'shiling.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Send className="h-4 w-4" /> Telegram
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg glass-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 border-t border-border pt-10">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h4 className="font-serif font-semibold text-foreground">Zabarjad Media</h4>
              <p className="text-sm text-muted-foreground mt-1">Premium fiction nashriyoti</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h4 className="font-serif font-semibold text-foreground">Manzil</h4>
              <p className="text-sm text-muted-foreground mt-1">Muqimiy ko'chasi 178/310</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h4 className="font-serif font-semibold text-foreground">Aloqa</h4>
              <p className="text-sm text-muted-foreground mt-1">+998 97 409 04 84</p>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Zabarjad Media. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
