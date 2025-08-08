import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import logoImg from "@assets/Screenshot 2025-08-08 at 3.17.50 AM_1754648275077.png";

export default function Splash() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to slides
  if (isAuthenticated) {
    setLocation("/slides");
    return null;
  }


  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative w-full">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]"></div>
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <img 
            src={logoImg} 
            alt="SaintVisionAI Logo" 
            className="h-16 w-auto object-contain"
          />
          <div>
            <div className="text-white font-semibold text-lg">SaintVisionAI</div>
            <div className="text-[#d4af37] text-sm font-medium">Cookin' Knowledge</div>
          </div>
        </div>
        <div className="text-gray-400 text-sm">EST. 2023</div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-6 leading-tight text-center">
              <div className="text-white mb-2">Responsible</div>
              <div className="bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8941f] bg-clip-text text-transparent">
                Intelligence
              </div>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8 px-4">
              Revolutionizing industries through{" "}
              <span className="text-[#d4af37]">patented HACP™ technology</span>,{" "}
              faith-guided innovation, and AI solutions that change lives.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => setLocation("/signin")}
              className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-medium px-8 py-4 rounded-lg hover:from-[#b8941f] hover:to-[#d4af37] transition-all duration-300 transform hover:scale-105"
            >
              Start Cookin →
            </button>
            
            <button
              onClick={() => setLocation("/slides")}
              className="text-gray-300 hover:text-white px-8 py-4 transition-colors duration-300 border-b border-transparent hover:border-gray-300"
            >
              ▶ Why Us
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}