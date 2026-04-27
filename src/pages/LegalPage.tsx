import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
interface LegalPageProps {
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}

const LegalPage = ({ title, updatedAt = "2024-03-15", children }: LegalPageProps) => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-[#0a0806]">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8 border-b border-amber-500/20 pb-8">
            <span className="font-sans text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3 block">
              Huquqiy Hujjat
            </span>
            <h1 className="font-heading font-black tracking-tight text-3xl md:text-4xl font-bold text-foreground mb-4">
              {title}
            </h1>
            <p className="text-sm text-neutral-500">
              Oxirgi yangilanish: {updatedAt}
            </p>
          </div>

          {/* Editorial Cover */}
          <div className="mb-10 w-full rounded-xl overflow-hidden shadow-sm border border-border/20 md:aspect-[2.2/1] aspect-video bg-[#0a0806]">
            <img
              src="/booktopia-logo_dark.jpg"
              alt="Booktopia Legal Cover"
              className="w-full h-full object-cover object-center opacity-90 transition-opacity duration-500 hover:opacity-100"
            />
          </div>

          {/* Content - Prose styling for good readability */}
          <div className="prose prose-lg dark:prose-invert prose-amber font-serif leading-relaxed text-neutral-700 dark:text-neutral-300">
            {children}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;