// filepath: src/pages/Index.tsx
// @refresh reset
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "@/components/Hero";
import GlobalClassics from "@/components/GlobalClassics";
import MatchmakerQuiz from "@/components/MatchmakerQuiz";
import YangiNashrlar from "@/components/YangiNashrlar";
import CuratedLibrary from "@/components/CuratedLibrary";
import Blog from "@/components/Blog";
import Taassurotlar from "@/components/Taassurotlar";
import Footer from "@/components/Footer";
import { useData } from "@/context/DataContext";
import BookOfTheMonth from "@/components/BookOfTheMonth";
import LoadingSplash from "@/components/LoadingSplash";
import AuthorSpotlight from "@/components/AuthorSpotlight";
import ScrollToTop from "@/components/ScrollToTop";
import AmirTemurSection from "@/components/AmirTemurSection";
const Index = () => {
  const { loading } = useData();
  const [hasSeenSplash, setHasSeenSplash] = useState(() => sessionStorage.getItem('splashShown') === 'true');

  useEffect(() => {
    if (!loading) {
      sessionStorage.setItem('splashShown', 'true');
      const timer = setTimeout(() => setHasSeenSplash(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);


  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      {/* mode="wait" ensures the splash screen finishes fading out BEFORE the homepage fades in */}
      <AnimatePresence mode="wait">
        {loading && !hasSeenSplash ? (
          <LoadingSplash key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: hasSeenSplash ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col min-h-screen"
          >
            <main className="flex-1">
              <Hero />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <BookOfTheMonth />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <GlobalClassics />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <MatchmakerQuiz />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <AmirTemurSection />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <YangiNashrlar />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <CuratedLibrary />
              <Taassurotlar />
              <Blog />
              <AuthorSpotlight />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;