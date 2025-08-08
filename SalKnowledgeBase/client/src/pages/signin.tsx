import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";
import cityBgImg from "@assets/Login (2)_1754539143039.png";
import logoImg from "@assets/Screenshot 2025-08-08 at 3.17.50 AM_1754648275077.png";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<'info' | 'verify'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    verificationCode: ""
  });

  // If already authenticated, redirect to slides
  if (isAuthenticated) {
    setLocation("/slides");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (step === 'info') {
        // Step 1: Collect user info and send verification email
        if (!formData.name || !formData.email || !formData.phone) {
          toast({
            title: "Missing Information",
            description: "All fields are required - full name, email, and phone",
            variant: "destructive",
          });
          return;
        }
        
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          toast({
            title: "Registration Failed",
            description: data.message || "Failed to register",
            variant: "destructive",
          });
        } else {
          setStep('verify');
          toast({
            title: "Check Your Email",
            description: "We've sent you a verification code. Enter it below to continue.",
          });
        }
      } else if (step === 'verify') {
        // Step 2: Verify email code
        if (!formData.verificationCode) {
          toast({
            title: "Missing Code",
            description: "Please enter the verification code from your email",
            variant: "destructive",
          });
          return;
        }
        
        const response = await fetch(`/api/verify-email/${formData.verificationCode}`, {
          method: 'GET',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          toast({
            title: "Verification Failed",
            description: data.message || "Invalid verification code",
            variant: "destructive",
          });
        } else {
          // Auto sign in after verification
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              email: formData.email, 
              password: 'auto-verified' // Special auto-login 
            }),
          });
          
          if (loginResponse.ok) {
            toast({
              title: "Welcome to SaintVisionAI!",
              description: "You're all set to start using SaintSal™",
            });
            setLocation("/slides");
          } else {
            toast({
              title: "Success!",
              description: "Email verified! Please sign in.",
            });
            setLocation("/signin");
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cityscape Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${cityBgImg})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>
      </div>

      <Header />

      {/* Main Authentication Panel */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <img 
                src={logoImg} 
                alt="SaintVisionAI" 
                className="h-16 mx-auto object-contain"
                style={{ filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.6))' }}
              />
            </div>
            <h1 className="text-3xl font-light text-white mb-2">
              {step === 'verify' ? "Check Your Email" : "Access "}
              <span className="text-[#d4af37] font-medium">SaintVisionAI</span>
            </h1>
            <p className="text-white/70 text-sm">
              {step === 'verify' 
                ? "Enter the verification code we sent you" 
                : "Enter your information to get started"
              }
            </p>
          </div>


          {/* Registration Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 'info' && (
                <>
                  <div className="space-y-1">
                    <input
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#d4af37] focus:bg-white/10 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#d4af37] focus:bg-white/10 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#d4af37] focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                </>
              )}

              {step === 'verify' && (
                <div className="space-y-1">
                  <input
                    name="verificationCode"
                    type="text"
                    placeholder="000000"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-6 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37] focus:bg-white/10 transition-all duration-300 text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-medium rounded-xl hover:from-[#b8941f] hover:to-[#d4af37] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Please wait...</span>
                  </div>
                ) : (
                  step === 'verify' ? "Verify & Continue" : "Get Access"
                )}
              </button>
            </form>
            
            {/* Navigation */}
            <div className="mt-6 text-center space-y-4">
              {step === 'verify' && (
                <button
                  type="button"
                  onClick={() => {
                    setStep('info');
                    setFormData({
                      email: formData.email,
                      name: formData.name,
                      phone: formData.phone,
                      verificationCode: ""
                    });
                  }}
                  className="text-[#d4af37] hover:text-[#f4d03f] transition-colors duration-300 font-medium"
                >
                  Didn't get the code? Try again
                </button>
              )}

              <div>
                <button
                  type="button"
                  onClick={() => setLocation("/")}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}