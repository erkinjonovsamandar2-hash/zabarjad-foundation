import { CalendarDays } from "lucide-react";
import { useData } from "@/context/DataContext";

const Blog = () => {
  const { articles } = useData();
  const published = articles.filter((a) => a.published);

  return (
    <section id="blog" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">Zabarjad Kundaligi</p>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-10">So'nggi Maqolalar</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((article) => (
            <article key={article.id} className="glass-card rounded-xl overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-primary/20 transition-colors">
              {article.cover_url && (
                <img src={article.cover_url} alt={article.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <time>{article.date}</time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
