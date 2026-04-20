// filepath: src/pages/Index.tsx
// @refresh reset
import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "@/components/Hero";
import YangiNashrlar from "@/components/YangiNashrlar";
import BookOfTheMonth from "@/components/BookOfTheMonth";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import { useData } from "@/context/DataContext";
import LoadingSplash from "@/components/LoadingSplash";

// ── Lazy-load every section that sits below the fold ──────────────────────────
// Keeps the initial JS bundle lean — these chunks download in parallel and are
// ready before the user scrolls to them on any reasonable connection.
const AmirTemurSection = lazy(() => import("@/components/AmirTemurSection"));
const CuratedLibrary = lazy(() => import("@/components/CuratedLibrary"));
const Taassurotlar = lazy(() => import("@/components/Taassurotlar"));
const QuickActions = lazy(() => import("@/components/QuickActions"));

// Minimal height placeholder — prevents CLS while chunk downloads
const SectionFallback = () => <div className="w-full h-32 bg-transparent" aria-hidden />;

const Divider = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
);

const Index = () => {
  const { loading } = useData();
  const [hasSeenSplash, setHasSeenSplash] = useState(
    () => sessionStorage.getItem("splashShown") === "true"
  );

  useEffect(() => {
    if (!loading) {
      sessionStorage.setItem("splashShown", "true");
      const timer = setTimeout(() => setHasSeenSplash(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-background">
      {/* mode="wait" ensures splash finishes fading BEFORE homepage fades in */}
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
              {/* ── Above the fold — statically bundled ── */}
              <Hero />
              <Divider />
              <BookOfTheMonth />
              <Divider />
              <YangiNashrlar />
              <Divider />

              {/* ── Below the fold — code-split, loaded in parallel ── */}

              <Suspense fallback={<SectionFallback />}>
                <CuratedLibrary />
              </Suspense>
              <Divider />

              <Suspense fallback={<SectionFallback />}>
                <AmirTemurSection />
              </Suspense>
              <Divider />

              <Suspense fallback={<SectionFallback />}>
                <Taassurotlar />
              </Suspense>

              <Blog />

              <Suspense fallback={<SectionFallback />}>
                <QuickActions />
              </Suspense>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
