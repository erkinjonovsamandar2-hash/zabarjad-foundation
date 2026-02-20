import { CalendarDays } from "lucide-react";

const articles = [
  {
    title: "Fantastika janrining kelajagi",
    excerpt: "O'zbek adabiyotida fantastika qanday rivojlanmoqda?",
    date: "2026-02-15",
  },
  {
    title: "Martin va uning olami",
    excerpt: "Muz va Olov Qo'shig'i seriyasining yaratilish tarixi.",
    date: "2026-02-10",
  },
  {
    title: "Tarjima san'ati",
    excerpt: "Zabarjad Media tarjima jarayoniga qanday yondashadi.",
    date: "2026-02-05",
  },
  {
    title: "Eng ko'p o'qilgan 5 kitob",
    excerpt: "2026-yil yanvar oyida eng mashhur kitoblar ro'yxati.",
    date: "2026-01-28",
  },
  {
    title: "Fantastik dunyo yaratish",
    excerpt: "Yozuvchilar qanday qilib o'z olamlarini qurishadi?",
    date: "2026-01-20",
  },
  {
    title: "Kitobxonlar uchun tavsiyalar",
    excerpt: "Qish oqshomlari uchun eng yaxshi kitoblar tanlovi.",
    date: "2026-01-15",
  },
];

const Blog = () => {
  return (
    <section id="blog" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary">
          Zabarjad Kundaligi
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-10">
          So'nggi Maqolalar
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <article
              key={i}
              className="glass-card rounded-xl p-6 flex flex-col justify-between gap-4 group cursor-pointer hover:border-primary/20 transition-colors"
            >
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <time>{article.date}</time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
