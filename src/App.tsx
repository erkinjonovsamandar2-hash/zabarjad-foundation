// --- App.tsx ---
import AnimatedRoutes from "@/components/AnimatedRoutes";
import PageTransition from "@/components/PageTransition";
import GlobalEffects from "@/components/GlobalEffects";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop"; // <-- ADDED THIS
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
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
              <ScrollToTop /> {/* <-- ADDED THIS: Fixes the scroll-to-bottom issue! */}
              <GlobalEffects />
              {/* Navbar sits OUTSIDE AnimatedRoutes to preserve fixed positioning */}
              <Navbar />
              <AnimatedRoutes>
                <Route path="/" element={<PageTransition><Index /></PageTransition>} />
                
                {/* MATCHED TO FOOTER: Changed from /biz-haqimizda to /about */}
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                
                <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
                <Route path="/library" element={<PageTransition><LibraryPage /></PageTransition>} />
                <Route path="/book/:id" element={<PageTransition><BookDetails /></PageTransition>} />
                <Route path="/quiz" element={<PageTransition><QuizPage /></PageTransition>} />
                <Route path="/spotlight" element={<PageTransition><SpotlightPage /></PageTransition>} />
                <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
                
                {/* Admin nested routes */}
                <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                  <Route index element={<PageTransition><BookManager /></PageTransition>} />
                  <Route path="blog" element={<PageTransition><BlogManager /></PageTransition>} />
                  <Route path="quiz" element={<PageTransition><QuizManager /></PageTransition>} />
                  <Route path="settings" element={<PageTransition><SiteSettingsManager /></PageTransition>} />
                  <Route path="users" element={<PageTransition><AdminUsersManager /></PageTransition>} />
                  <Route path="reviews" element={<PageTransition><AdminReviews /></PageTransition>} />
                </Route>
    
                {/* If a route doesn't exist yet (like /oferta or /contact), it will safely fall back to NotFound */}
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </AnimatedRoutes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;