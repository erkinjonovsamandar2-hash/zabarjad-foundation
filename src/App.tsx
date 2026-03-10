// --- App.tsx ---
import { useEffect } from "react";
import AnimatedRoutes from "@/components/AnimatedRoutes";
import PageTransition from "@/components/PageTransition";
import GlobalEffects from "@/components/GlobalEffects";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import LegalPage from "./pages/LegalPage";
import { Analytics } from "@vercel/analytics/react";

import Index from "./pages/Index";
import BlogPage from "./pages/BlogPage";
import LibraryPage from "./pages/LibraryPage";
import QuizPage from "./pages/QuizPage";
import SpotlightPage from "./pages/SpotlightPage";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import BookManager from "./pages/admin/BookManager";
import BlogManager from "./pages/admin/BlogManager";
import QuizManager from "./pages/admin/QuizManager";
import SiteSettingsManager from "./pages/admin/SiteSettingsManager";
import AdminUsersManager from "./pages/admin/AdminUsersManager";
import AdminReviews from "@/pages/AdminReviews";
import About from "./pages/About";
import BookDetails from "./pages/BookDetails";

const queryClient = new QueryClient();

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

// ── Change to 1, 2, or 3 to switch the active colour theme ──────────────────
// The class is applied directly to <html> so :root-level CSS variable
// inheritance works across body, fixed elements, and portals.
const ACTIVE_THEME = 2;

const App = () => {
  // FIXED: apply theme class to <html> element, not a wrapper <div>.
  // This ensures CSS variable overrides in .theme-N cascade correctly to
  // every element in the document — including fixed Navbar and body bg.
  useEffect(() => {
    const html = document.documentElement;

    // Remove any previously applied theme classes
    html.classList.remove("theme-1", "theme-2", "theme-3");

    // Apply the active theme
    html.classList.add(`theme-${ACTIVE_THEME}`);
  }, []); // runs once on mount — re-run if ACTIVE_THEME changes at runtime

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <LanguageProvider>
            <TooltipProvider>
              {/* Wrapper div no longer carries theme class — <html> does */}
              <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <GlobalEffects />
                  <Navbar />
                  <AnimatedRoutes>
                    <Route path="/" element={<PageTransition><Index /></PageTransition>} />
                    <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                    <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
                    <Route path="/library" element={<PageTransition><LibraryPage /></PageTransition>} />
                    <Route path="/book/:id" element={<PageTransition><BookDetails /></PageTransition>} />
                    <Route path="/quiz" element={<PageTransition><QuizPage /></PageTransition>} />
                    <Route path="/spotlight" element={<PageTransition><SpotlightPage /></PageTransition>} />
                    <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />

                    <Route
                      path="/privacy"
                      element={
                        <PageTransition>
                          <LegalPage title="Maxfiylik Siyosati">
                            <p>Ushbu maxfiylik siyosati Booktopia saytidan foydalanish qoidalarini belgilaydi...</p>
                            <h3>1. Ma'lumotlarni yig'ish</h3>
                            <p>Biz foydalanuvchilarning shaxsiy ma'lumotlarini qat'iy himoya qilamiz...</p>
                          </LegalPage>
                        </PageTransition>
                      }
                    />
                    <Route
                      path="/terms"
                      element={
                        <PageTransition>
                          <LegalPage title="Foydalanish Shartlari">
                            <p>Saytga tashrif buyurish orqali siz quyidagi shartlarga rozilik bildirasiz...</p>
                          </LegalPage>
                        </PageTransition>
                      }
                    />
                    <Route
                      path="/oferta"
                      element={
                        <PageTransition>
                          <LegalPage title="Ommaviy Oferta">
                            <p>Ushbu oferta kitob mahsulotlarini sotib olish bo'yicha rasmiy taklif hisoblanadi...</p>
                          </LegalPage>
                        </PageTransition>
                      }
                    />

                    {/* Admin nested routes */}
                    <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                      <Route index element={<PageTransition><BookManager /></PageTransition>} />
                      <Route path="blog" element={<PageTransition><BlogManager /></PageTransition>} />
                      <Route path="quiz" element={<PageTransition><QuizManager /></PageTransition>} />
                      <Route path="settings" element={<PageTransition><SiteSettingsManager /></PageTransition>} />
                      <Route path="users" element={<PageTransition><AdminUsersManager /></PageTransition>} />
                      <Route path="reviews" element={<PageTransition><AdminReviews /></PageTransition>} />
                    </Route>

                    <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                  </AnimatedRoutes>
                </BrowserRouter>

                {/* Vercel Analytics */}
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