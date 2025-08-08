import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LogIn, 
  Presentation, 
  MessageSquare, 
  Scale, 
  HelpCircle, 
  Menu,
  X,
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentView: string;
  onSlideSelect?: (slideIndex: number) => void;
}

const SLIDES = [
  "Wall Street Presence",
  "Going Public", 
  "Global Partnerships",
  "AI Research Institute",
  "SaintSal + You",
  "Cookin' Knowledge",
  "SaintGPT Throwbacks"
];

export function Sidebar({ currentView, onSlideSelect }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navigationItems = [
    { icon: LogIn, label: "Sign In", path: "/signin", id: "signin" },
    { icon: Presentation, label: "Presentation", path: "/slides", id: "slides" },
    { icon: MessageSquare, label: "Chat with SaintSal", path: "/chat", id: "chat" },
    { icon: Scale, label: "Legal", path: "/legal", id: "legal" },
    { icon: HelpCircle, label: "Help & Support", path: "/help", id: "help" },
  ];

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-60 bg-primary text-primary-foreground border-primary/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <nav 
        className={cn(
          "fixed left-0 top-0 h-full w-80 glass-effect z-50 transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">SV</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">SaintVisionAI</h1>
              <p className="text-xs text-muted-foreground">Enterprise AI Platform</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-2 flex-1">
            {navigationItems.map((item) => {
              if (item.id === "signin" && user) return null;
              
              return (
                <Link key={item.id} href={item.path}>
                  <Button
                    variant={currentView === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left",
                      currentView === item.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-primary/10 hover:text-primary"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            {/* Slide Navigation */}
            {currentView === "slides" && onSlideSelect && (
              <div className="mt-8 pt-6 border-t border-primary/20">
                <h3 className="text-sm font-medium text-primary mb-4">Presentation Slides</h3>
                <div className="space-y-1 text-sm">
                  {SLIDES.map((slide, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left p-2 h-auto hover:bg-primary/10 hover:text-primary"
                      onClick={() => {
                        onSlideSelect(index);
                        setIsOpen(false);
                      }}
                    >
                      <span className="text-xs mr-2 opacity-60">{index + 1}.</span>
                      {slide}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          {user && (
            <Card className="glass-effect border-primary/20 mt-auto">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name || user.email}</p>
                    <p className="text-xs text-muted-foreground">Enterprise User</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
