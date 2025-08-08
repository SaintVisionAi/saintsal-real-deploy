import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        setLocation("/slides");
      } else {
        setLocation("/");
      }
    }
  }, [user, isLoading, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-primary-foreground font-bold text-2xl">SV</span>
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-4">SaintVisionAI</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
