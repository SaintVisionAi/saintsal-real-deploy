import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Slides from "@/pages/slides";
import Chat from "@/pages/chat";
import Legal from "@/pages/legal";
import Help from "@/pages/help";
import AdminDashboard from "@/pages/admin";
import Splash from "@/pages/splash";
import SignIn from "@/pages/signin";
import AgentAnalytics from "@/pages/agent-analytics";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Splash} />
      <Route path="/splash" component={Splash} />
      <Route path="/signin" component={SignIn} />
      <Route path="/legal" component={Legal} />
      <Route path="/help" component={Help} />
      
      {/* Protected routes */}
      {isAuthenticated ? (
        <>
          <Route path="/home" component={Home} />
          <Route path="/slides" component={Slides} />
          <Route path="/chat" component={Chat} />
          <Route path="/analytics" component={AgentAnalytics} />
          <Route path="/admin" component={AdminDashboard} />
        </>
      ) : (
        <>
          {/* Redirect to splash page for protected routes */}
          <Route path="/home" component={() => { window.location.href = '/'; return null; }} />
          <Route path="/slides" component={() => { window.location.href = '/'; return null; }} />
          <Route path="/chat" component={() => { window.location.href = '/'; return null; }} />
          <Route path="/analytics" component={() => { window.location.href = '/'; return null; }} />
          <Route path="/admin" component={() => { window.location.href = '/'; return null; }} />
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
