import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SchoolDataProvider, useSchoolData } from "@/lib/data";

import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import About from "@/pages/about";
import Academics from "@/pages/academics";
import Activities from "@/pages/activities";
import Staff from "@/pages/staff";
import Contact from "@/pages/contact";
import Enroll from "@/pages/enroll";
import CalendarPage from "@/pages/calendar";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function VisitTracker() {
  const [location] = useLocation();
  const { recordVisit, isLoaded } = useSchoolData();
  useEffect(() => {
    if (isLoaded) recordVisit(location);
  }, [location, isLoaded, recordVisit]);
  return null;
}

function Router() {
  return (
    <Layout>
      <VisitTracker />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/academics" component={Academics} />
        <Route path="/activities" component={Activities} />
        <Route path="/staff" component={Staff} />
        <Route path="/contact" component={Contact} />
        <Route path="/enroll" component={Enroll} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SchoolDataProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster position="top-right" richColors />
        </SchoolDataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;