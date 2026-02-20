import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useLang, locField } from "@/context/LanguageContext";

const Blog = () => {
  const { articles } = useData();
  const { lang, t } = useLang();
  const published = articles.filter((a) => a.published).slice(0, 3);

  return (
    <section id="blog" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">{t.blog.badge}</p>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-10">{t.blog.title}</h2>

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

        {articles.filter((a) => a.published).length > 3 && (
          <div className="text-center mt-10">
            <Link to="/blog" className="inline-flex items-center gap-2 rounded-lg glass-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30">
              {t.seeAll} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
