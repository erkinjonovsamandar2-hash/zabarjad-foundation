import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EpicSpotlight from "@/components/EpicSpotlight";
import { useData } from "@/context/DataContext";
import { useLang, locField } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SpotlightPage = () => {
  const { books, articles } = useData();
  const { lang, t } = useLang();

  // Show featured or first few books and published articles
  const relatedBooks = books.filter((b) => b.featured).slice(0, 4);
  const relatedArticles = articles.filter((a) => a.published).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <EpicSpotlight />

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="section-padding bg-background">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {lang === "ru" ? "Связанные книги" : lang === "en" ? "Related Books" : "Tegishli kitoblar"}
                </h2>
                <Link to="/library" className="text-sm text-primary hover:underline">{t.seeAll} →</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {relatedBooks.map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-xl overflow-hidden group"
                  >
                    {book.cover_url && (
                      <div className="aspect-[2/3] overflow-hidden">
                        <img
                          src={book.cover_url}
                          alt={locField(book, "title", lang)}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-serif font-bold text-foreground text-sm line-clamp-2">
                        {locField(book, "title", lang)}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {locField(book, "author", lang)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="section-padding bg-charcoal">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {lang === "ru" ? "Статьи" : lang === "en" ? "Articles" : "Maqolalar"}
                </h2>
                <Link to="/blog" className="text-sm text-primary hover:underline">{t.seeAll} →</Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {relatedArticles.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-xl overflow-hidden group"
                  >
                    {article.cover_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.cover_url}
                          alt={locField(article, "title", lang)}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-foreground text-sm mb-2 line-clamp-2">
                        {locField(article, "title", lang)}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {locField(article, "excerpt", lang)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SpotlightPage;
