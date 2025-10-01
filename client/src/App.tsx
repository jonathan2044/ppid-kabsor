import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { QuickAccessCards } from "@/components/QuickAccessCards";
import { InfoCategories } from "@/components/InfoCategories";
import { StatsDashboard } from "@/components/StatsDashboard";
import { NewsSection } from "@/components/NewsSection";
import { Footer } from "@/components/Footer";

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
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
