import { CalendarDays } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useLang, locField } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogPage = () => {
  const { articles } = useData();
  const { lang, t } = useLang();
  const published = articles.filter((a) => a.published);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="section-padding pt-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">{t.blog.badge}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-10">{t.blog.title}</h1>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((article) => (
              <article key={article.id} className="glass-card rounded-xl overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-primary/20 transition-colors">
                {article.cover_url && (
                  <img src={article.cover_url} alt={locField(article, "title", lang)} className="w-full h-40 object-cover" />
                )}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {locField(article, "title", lang)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {locField(article, "excerpt", lang)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <time>{article.date}</time>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {published.length === 0 && (
            <p className="text-center text-muted-foreground py-20">
              {lang === "uz" ? "Hozircha maqolalar yo'q." : lang === "ru" ? "Статей пока нет." : "No articles yet."}
            </p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BlogPage;
