import { Link, useLocation } from "wouter";
import { Menu, X, Download, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import svLogoImg from "@assets/svt sick transparent square  copy_1754596577548.png";

export function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { user, logout, login, isAuthenticated } = useAuth();

  const handleSignOut = () => {
    logout(); // This will redirect to /api/logout
  };

  const handleSignIn = () => {
    window.location.href = '/signin';
  };

  // PWA Install functionality
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('🎉 User accepted the PWA install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src={svLogoImg} 
                alt="SaintVisionAI" 
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col">
                <div className="text-white font-bold text-lg leading-none">SaintVisionAI</div>
                <div className="text-[#d4af37] text-sm leading-none">Cookin' Knowledge</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/slides" className={`transition-colors font-medium ${
              location === "/slides" ? "text-[#d4af37]" : "text-white/80 hover:text-white"
            }`}>
              Presentation
            </Link>
            <Link href="/chat" className={`transition-colors font-medium ${
              location === "/chat" ? "text-[#d4af37]" : "text-white/80 hover:text-white"
            }`}>
              SaintSal™ Chat
            </Link>
            <Link href="/help" className={`transition-colors font-medium ${
              location === "/help" ? "text-[#d4af37]" : "text-white/80 hover:text-white"
            }`}>
              Help Desk
            </Link>
            <Link href="/legal" className={`transition-colors font-medium ${
              location === "/legal" ? "text-[#d4af37]" : "text-white/80 hover:text-white"
            }`}>
              Legal
            </Link>
          </nav>

          {/* Desktop Auth + PWA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {showInstallPrompt && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 text-[#d4af37] hover:text-[#f4d03f] transition-colors font-medium px-3 py-2 rounded-lg border border-[#d4af37]/20 hover:border-[#d4af37]/40"
                title="Install SaintVisionAI App"
              >
                <Download size={16} />
                <span className="hidden xl:inline">Install App</span>
              </button>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-white/80 text-sm">
                  {(user as any)?.name || (user as any)?.firstName || (user as any)?.email || "User"}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-[#00bfff] hover:text-[#0099cc] transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleSignIn}
                  className="text-[#00bfff] hover:text-[#0099cc] transition-colors font-medium px-4 py-2 rounded-lg border border-transparent hover:border-[#00bfff]/20"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleSignIn}
                  className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black px-6 py-2 rounded-lg font-medium hover:from-[#b8941f] hover:to-[#d4af37] transition-all duration-200 shadow-lg"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center space-x-2">
            {showInstallPrompt && (
              <button
                onClick={handleInstallClick}
                className="text-[#d4af37] hover:text-[#f4d03f] transition-colors p-2"
                title="Install App"
              >
                <Smartphone size={20} />
              </button>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="text-[#00bfff] hover:text-[#0099cc] transition-colors font-medium text-sm"
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={handleSignIn}
                className="text-[#00bfff] hover:text-[#0099cc] transition-colors font-medium text-sm"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#d4af37] transition-colors p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-white/10">
            <nav className="flex flex-col p-4 space-y-4">
              <Link 
                href="/slides" 
                className={`transition-colors font-medium py-2 ${
                  location === "/slides" ? "text-[#d4af37]" : "text-white/80 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Presentation
              </Link>
              <Link 
                href="/chat" 
                className={`transition-colors font-medium py-2 ${
                  location === "/chat" ? "text-[#d4af37]" : "text-white/80 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                SaintSal™ Chat
              </Link>
              <Link 
                href="/help" 
                className={`transition-colors font-medium py-2 ${
                  location === "/help" ? "text-[#d4af37]" : "text-white/80 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Help Desk
              </Link>
              <Link 
                href="/legal" 
                className={`transition-colors font-medium py-2 ${
                  location === "/legal" ? "text-[#d4af37]" : "text-white/80 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Legal
              </Link>
              {!isAuthenticated && (
                <button 
                  onClick={() => { handleSignIn(); setIsMenuOpen(false); }}
                  className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black px-6 py-3 rounded-lg font-medium hover:from-[#b8941f] hover:to-[#d4af37] transition-all duration-200 shadow-lg text-center mt-4"
                >
                  Get Started
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}