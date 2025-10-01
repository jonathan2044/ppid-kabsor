import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import ProfilPPIDPage from "@/pages/ProfilPPIDPage";
import FAQPage from "@/pages/FAQPage";
import KontakPage from "@/pages/KontakPage";

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
      <Route path="/profil-ppid" component={ProfilPPIDPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/kontak" component={KontakPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityWidget />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
