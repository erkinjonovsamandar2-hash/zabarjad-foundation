// @refresh reset
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TaxtlarTeaser from "@/components/TaxtlarTeaser";
import MatchmakerQuiz from "@/components/MatchmakerQuiz";
import CuratedLibrary from "@/components/CuratedLibrary";
import Blog from "@/components/Blog";
import Taassurotlar from "@/components/Taassurotlar";
import Footer from "@/components/Footer";
import { useData } from "@/context/DataContext";
import BookOfTheMonth from "@/components/BookOfTheMonth";
import LoadingSplash from "@/components/LoadingSplash";

const Index = () => {
  const { loading } = useData();

  return (
    <div className="min-h-screen bg-background">
      {/* mode="wait" ensures the splash screen finishes fading out BEFORE the homepage fades in */}
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingSplash key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col min-h-screen"
          >
            <Navbar />
            <main className="flex-1">
              <Hero />
              <BookOfTheMonth />
              <TaxtlarTeaser />
              <MatchmakerQuiz />
              <CuratedLibrary />
              <Taassurotlar />
              <Blog />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;