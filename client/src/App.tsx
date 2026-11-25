import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccessibilityWidget } from "@/components/AccessibilityWidget";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { QuickAccessCards } from "@/components/QuickAccessCards";
import { InfoCategories } from "@/components/InfoCategories";
import { StatsDashboard } from "@/components/StatsDashboard";
import { NewsSection } from "@/components/NewsSection";
import { Footer } from "@/components/Footer";
import NotFound from "@/pages/not-found";
import PermohonanPage from "@/pages/PermohonanPage";
import TrackingPage from "@/pages/TrackingPage";
import InformasiPublikPage from "@/pages/InformasiPublikPage";
import BeritaPage from "@/pages/BeritaPage";
import BeritaDetailPage from "@/pages/BeritaDetailPage";
import ProfilPPIDPage from "@/pages/ProfilPPIDPage";
import FAQPage from "@/pages/FAQPage";
import KontakPage from "@/pages/KontakPage";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminPengaturanPage from "@/pages/admin/AdminPengaturanPage";
import AdminBeritaPage from "@/pages/admin/AdminBeritaPage";
import AdminFAQPage from "@/pages/admin/AdminFAQPage";
import AdminGaleriPage from "@/pages/admin/AdminGaleriPage";
import AdminInformasiPublikPage from "@/pages/admin/AdminInformasiPublikPage";
import AdminPermohonanPage from "@/pages/admin/AdminPermohonanPage";
import AdminPenggunaPage from "@/pages/admin/AdminPenggunaPage";

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <QuickAccessCards />
        <InfoCategories />
        <StatsDashboard />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/permohonan" component={PermohonanPage} />
      <Route path="/tracking" component={TrackingPage} />
      <Route path="/informasi-publik" component={InformasiPublikPage} />
      <Route path="/berita" component={BeritaPage} />
      <Route path="/berita/:slug" component={BeritaDetailPage} />
      <Route path="/profil-ppid" component={ProfilPPIDPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/kontak" component={KontakPage} />
      
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin">
        {() => (
          <AdminLayout>
            <AdminDashboardPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/pengaturan">
        {() => (
          <AdminLayout requireAdmin>
            <AdminPengaturanPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/berita">
        {() => (
          <AdminLayout>
            <AdminBeritaPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/faq">
        {() => (
          <AdminLayout>
            <AdminFAQPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/galeri">
        {() => (
          <AdminLayout>
            <AdminGaleriPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/informasi-publik">
        {() => (
          <AdminLayout>
            <AdminInformasiPublikPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/permohonan">
        {() => (
          <AdminLayout>
            <AdminPermohonanPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/pengguna">
        {() => (
          <AdminLayout>
            <AdminPenggunaPage />
          </AdminLayout>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

/** Tombol aksesibilitas hanya untuk halaman publik: di panel admin posisinya
 *  menutupi tombol-tombol di kaki sidebar. */
function AksesibilitasPublik() {
  const [location] = useLocation();
  if (location.startsWith('/admin')) return null;
  return <AccessibilityWidget />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AksesibilitasPublik />
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
