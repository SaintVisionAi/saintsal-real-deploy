import { Link } from "wouter";
import svLogoImg from "@assets/svt sick transparent square  copy_1754596577548.png";

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#0f0f0f] text-gray-400">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={svLogoImg} 
                alt="SaintVisionAI Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-bold text-[#d4af37]">SaintVisionAI</span>
            </div>
            <p className="text-sm">
              Responsible Intelligence. Proven. Patented.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/slides">
                  <span className="hover:text-[#d4af37] transition-colors cursor-pointer">
                    Presentation
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/chat">
                  <span className="hover:text-[#d4af37] transition-colors cursor-pointer">
                    SaintSal™ Chat
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/help">
                  <span className="hover:text-[#d4af37] transition-colors cursor-pointer">
                    Help Desk
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal">
                  <span className="hover:text-[#d4af37] transition-colors cursor-pointer">
                    Legal
                  </span>
                </Link>
              </li>
              <li>
                <span className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Ryan Capatosto, Managing Director</li>
              <li>licensing@saintvisionai.com</li>
              <li>USPTO #10,290,222</li>
              <li>Saint Visions I.P. Holdings, LP</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Saint Visions I.P. Holdings, LP All rights reserved.</p>
          <p className="mt-2 text-xs">Faith-guided with whisper intent. Non-intrusive by design.</p>
        </div>
      </div>
    </footer>
  );
}