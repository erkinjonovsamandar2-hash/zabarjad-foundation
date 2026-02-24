// --- App.tsx ---
import AnimatedRoutes from "@/components/AnimatedRoutes";
import PageTransition from "@/components/PageTransition";
import GlobalEffects from "@/components/GlobalEffects";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import LegalPage from "./pages/LegalPage";
import { Analytics } from "@vercel/analytics/react"; // <-- VERCEL ANALYTICS IMPORT

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
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Yuklanmoqda…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center text-destructive">Ruxsat yo'q. Admin huquqi talab qilinadi.</div>;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <LanguageProvider>
          <TooltipProvider>
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
                <Route path="/privacy" element={
  <PageTransition>
    <LegalPage title="Maxfiylik Siyosati">
      <p>Ushbu maxfiylik siyosati Zabarjad Media saytidan foydalanish qoidalarini belgilaydi...</p>
      <h3>1. Ma'lumotlarni yig'ish</h3>
      <p>Biz foydalanuvchilarning shaxsiy ma'lumotlarini qat'iy himoya qilamiz...</p>
      {/* You can add real text later */}
    </LegalPage>
  </PageTransition>
} />

                <Route path="/terms" element={
  <PageTransition>
    <LegalPage title="Foydalanish Shartlari">
      <p>Saytga tashrif buyurish orqali siz quyidagi shartlarga rozilik bildirasiz...</p>
    </LegalPage>
  </PageTransition>
} />

                <Route path="/oferta" element={
  <PageTransition>
    <LegalPage title="Ommaviy Oferta">
      <p>Ushbu oferta kitob mahsulotlarini sotib olish bo'yicha rasmiy taklif hisoblanadi...</p>
    </LegalPage>
  </PageTransition>
} />
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
            
            {/* VERCEL ANALYTICS COMPONENT */}
            <Analytics /> 
            
          </TooltipProvider>
        </LanguageProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;