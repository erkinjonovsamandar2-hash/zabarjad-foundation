import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Process Timeline Steps ────────────────────────────────────────────────────
const STEPS = [
  {
    number: 1,
    title: "Tanlov",
    subtitle: "Selection",
    desc: "Dunyoning eng sara asarlarini tanlash — klassik romanlar, falsafa, she'riyat. Har bir kitob o'zbek o'quvchisi uchun qimmatli xazina bo'lishi kerak.",
  },
  {
    number: 2,
    title: "Huquqlar",
    subtitle: "Rights Acquisition",
    desc: "Xalqaro nashriyotlar bilan hamkorlik qilish. Rasmiy tarjima huquqlarini olish — bu jarayon ko'pincha oylar davom etadi, lekin bu sifat kafolatidir.",
  },
  {
    number: 3,
    title: "Tarjima San'ati",
    subtitle: "The Art of Translation",
    desc: "Eng yaxshi tarjimonlar bilan ishlash. Har bir jumla asl asarning ruhini saqlab qolishi kerak. Bu — ilm emas, san'at.",
  },
  {
    number: 4,
    title: "Nashr",
    subtitle: "Premium Printing",
    desc: "Yuqori sifatli qog'oz, chiroyli muqova dizayni, professional bosma. Kitob faqat matn emas — bu sizning qo'lingizdagi san'at asari.",
  },
];

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#fdfbf7] dark:bg-[#1a1a1a]"
    >
      <Navbar />

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center">
        {/* Badge */}
        <div className="
          inline-flex items-center gap-2
          px-4 py-1.5
          rounded-full
          border border-amber-500/30
          bg-amber-500/10
          text-amber-700 dark:text-amber-400
          font-bold tracking-[0.2em]
          text-xs sm:text-sm
          mb-6
        ">
          <span className="text-lg leading-none">✦</span>
          BIZNING HIKOYA
        </div>

        {/* Headline */}
        <h1 className="
          text-4xl sm:text-5xl lg:text-6xl
          font-serif font-bold
          text-neutral-900 dark:text-neutral-100
          leading-tight
          mb-6
        ">
          Kitob sahifalaridan ko'ngilga ko'chgan so'zlar.
        </h1>

        {/* Mission paragraph */}
        <p className="
          text-lg
          text-neutral-600 dark:text-neutral-400
          leading-relaxed
          max-w-2xl mx-auto
        ">
          Zabarjad Media — bu dunyo adabiyotining eng sara asarlarini o'zbek tiliga 
          professional tarjima qiladigan va yuqori sifatli kitoblar nashr etadigan 
          zamonaviy nashriyot. Bizning maqsadimiz — har bir o'zbek o'quvchisiga jahon 
          klassikalarini ona tilida o'qish imkoniyatini yaratish.
        </p>
      </section>

      {/* ── Process Timeline (4 Steps) ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        
        {STEPS.map((step, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Text column */}
              <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
                {/* Step number badge */}
                <span className="
                  text-sm font-bold tracking-widest uppercase
                  text-amber-600 dark:text-amber-500
                  mb-2 block
                ">
                  QADAM {step.number}
                </span>

                {/* Step title */}
                <h2 className="
                  text-3xl font-serif
                  text-amber-900 dark:text-amber-200
                  mb-2
                ">
                  {step.title}
                </h2>

                {/* Subtitle (English) */}
                <p className="
                  text-sm font-sans italic
                  text-neutral-500 dark:text-neutral-500
                  mb-4
                ">
                  {step.subtitle}
                </p>

                {/* Description */}
                <p className="
                  text-base
                  text-neutral-600 dark:text-neutral-400
                  leading-relaxed
                ">
                  {step.desc}
                </p>
              </div>

              {/* Image placeholder */}
              <div className={isEven ? "order-2" : "order-2 lg:order-1"}>
                <div className="
                  w-full h-64
                  bg-amber-100/50 dark:bg-amber-900/10
                  rounded-2xl
                  border border-amber-200/50 dark:border-amber-800/30
                  flex items-center justify-center
                ">
                  {/* Decorative icon */}
                  <span className="text-6xl opacity-20">
                    {step.number === 1 && "🔍"}
                    {step.number === 2 && "📜"}
                    {step.number === 3 && "✍️"}
                    {step.number === 4 && "📚"}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

      </section>

      <Footer />
    </motion.div>
  );
};

export default About;