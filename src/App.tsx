import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from "framer-motion";

import { DataProvider } from "@/context/DataContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import AnimatedRoutes from "@/components/AnimatedRoutes";
import PageTransition from "@/components/PageTransition";
import GlobalEffects from "@/components/GlobalEffects";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

// ── STATIC IMPORTS (critical path — must be instant for FCP) ─────────────────
import Index from "./pages/Index";

// ── LAZY IMPORTS (non-critical — split into separate JS chunks) ──────────────
const BlogPage            = lazy(() => import("./pages/BlogPage"));
const LibraryPage         = lazy(() => import("./pages/LibraryPage"));
const QuizPage            = lazy(() => import("./pages/QuizPage"));
const SpotlightPage       = lazy(() => import("./pages/SpotlightPage"));
const BookDetails         = lazy(() => import("./pages/BookDetails"));
const About               = lazy(() => import("./pages/About"));
const LegalPage           = lazy(() => import("./pages/LegalPage"));
const NotFound            = lazy(() => import("./pages/NotFound"));
const AdminLayout         = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin          = lazy(() => import("./pages/admin/AdminLogin"));
const BookManager         = lazy(() => import("./pages/admin/BookManager"));
const BlogManager         = lazy(() => import("./pages/admin/BlogManager"));
const QuizManager         = lazy(() => import("./pages/admin/QuizManager"));
const SiteSettingsManager = lazy(() => import("./pages/admin/SiteSettingsManager"));
const AdminUsersManager   = lazy(() => import("./pages/admin/AdminUsersManager"));
const AdminReviews        = lazy(() => import("@/pages/AdminReviews"));

const queryClient = new QueryClient();

// ── Active theme ──────────────────────────────────────────────────────────────
const ACTIVE_THEME = 2;

// ── Suspense Fallback ─────────────────────────────────────────────────────────
// Minimal branded fallback rendered while a lazy chunk is downloading.
// Intentionally lightweight — no heavy imports, pure Tailwind + CSS animation.
const SuspenseFallback = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 transition-colors duration-500">
    <div className="relative flex items-center justify-center">
      <span
        className="absolute inline-flex h-16 w-16 rounded-full bg-primary/20 animate-ping"
        style={{ animationDuration: "1.4s" }}
      />
      <img
        src="/Element-blue.png"
        alt="Booktopia"
        className="relative h-12 w-12 object-contain opacity-90"
      />
    </div>
    <div className="w-32 h-[2px] rounded-full bg-border overflow-hidden">
      <div
        className="h-full bg-primary rounded-full animate-pulse"
        style={{ width: "60%" }}
      />
    </div>
    <p className="font-serif text-xs tracking-[0.3em] uppercase text-muted-foreground">
      Yuklanmoqda…
    </p>
  </div>
);

// ── Auth Guard ────────────────────────────────────────────────────────────────
const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Yuklanmoqda…
      </div>
    );
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin)
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        Ruxsat yo'q. Admin huquqi talab qilinadi.
      </div>
    );
  return <>{children}</>;
};

// ── Lazy route wrapper ────────────────────────────────────────────────────────
// Each lazy route gets its own tightly-scoped Suspense boundary.
// This is the KEY architectural fix:
//
// BEFORE (broken):
//   <Suspense>                          ← wraps entire Routes tree
//     <AnimatePresence mode="wait">     ← sees Suspense fallback + Routes = 2 children → freeze
//       <Routes>
//         <Route element={<LazyPage/>}/>
//       </Routes>
//     </AnimatePresence>
//   </Suspense>
//
// AFTER (fixed):
//   <AnimatePresence mode="wait">       ← always sees exactly ONE child: <Routes>
//     <Routes key={pathname}>
//       <Route element={
//         <Suspense fallback={...}>     ← scoped to THIS route only
//           <PageTransition>
//             <LazyPage/>
//           </PageTransition>
//         </Suspense>
//       }/>
//     </Routes>
//   </AnimatePresence>
//
// AnimatePresence now always has exactly one direct child (<Routes>).
// Suspense boundaries are isolated per-route — they never compete with
// the AnimatePresence animation pipeline.
const Lazy = ({
  component: Component,
}: {
  component: React.ComponentType;
}) => (
  <Suspense fallback={<SuspenseFallback />}>
    <PageTransition>
      <Component />
    </PageTransition>
  </Suspense>
);

// ── Inner app — needs useLocation which requires BrowserRouter context ────────
const AppInner = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <GlobalEffects />
      <Navbar />

      {/* FIX: AnimatePresence wraps AnimatedRoutes DIRECTLY as its only child.
          No Suspense between AnimatePresence and Routes — the pipeline can
          now track a single stable child through every navigation.          */}
      <AnimatePresence mode="wait">
        <AnimatedRoutes>

          {/* STATIC — no Suspense needed, eagerly loaded */}
          <Route
            path="/"
            element={
              <PageTransition>
                <Index />
              </PageTransition>
            }
          />

          {/* LAZY — public pages */}
          <Route path="/about"     element={<Lazy component={About} />} />
          <Route path="/blog"      element={<Lazy component={BlogPage} />} />
          <Route path="/library"   element={<Lazy component={LibraryPage} />} />
          <Route path="/book/:id"  element={<Lazy component={BookDetails} />} />
          <Route path="/quiz"      element={<Lazy component={QuizPage} />} />
          <Route path="/spotlight" element={<Lazy component={SpotlightPage} />} />

          {/* LAZY — legal pages */}
          <Route
            path="/privacy"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <LegalPage title="Maxfiylik Siyosati">
                    <p>Ushbu maxfiylik siyosati Booktopia saytidan foydalanish qoidalarini belgilaydi...</p>
                    <h3>1. Ma'lumotlarni yig'ish</h3>
                    <p>Biz foydalanuvchilarning shaxsiy ma'lumotlarini qat'iy himoya qilamiz...</p>
                  </LegalPage>
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <LegalPage title="Foydalanish Shartlari">
                    <p>Saytga tashrif buyurish orqali siz quyidagi shartlarga rozilik bildirasiz...</p>
                  </LegalPage>
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/oferta"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <LegalPage title="Ommaviy Oferta">
                    <p>Ushbu oferta kitob mahsulotlarini sotib olish bo'yicha rasmiy taklif hisoblanadi...</p>
                  </LegalPage>
                </PageTransition>
              </Suspense>
            }
          />

          {/* LAZY — admin (heaviest chunk, gated behind auth) */}
          <Route
            path="/admin/login"
            element={<Lazy component={AdminLogin} />}
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              </Suspense>
            }
          >
            <Route index        element={<Lazy component={BookManager} />} />
            <Route path="blog"     element={<Lazy component={BlogManager} />} />
            <Route path="quiz"     element={<Lazy component={QuizManager} />} />
            <Route path="settings" element={<Lazy component={SiteSettingsManager} />} />
            <Route path="users"    element={<Lazy component={AdminUsersManager} />} />
            <Route path="reviews"  element={<Lazy component={AdminReviews} />} />
          </Route>

          <Route path="*" element={<Lazy component={NotFound} />} />

        </AnimatedRoutes>
      </AnimatePresence>
    </>
  );
};

// ── App ───────────────────────────────────────────────────────────────────────
const App = () => {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("theme-1", "theme-2", "theme-3");
    html.classList.add(`theme-${ACTIVE_THEME}`);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <LanguageProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppInner />
                </BrowserRouter>
                <Analytics />
              </div>
            </TooltipProvider>
          </LanguageProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;