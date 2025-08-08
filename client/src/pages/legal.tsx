import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Shield, FileText, CheckCircle, FileCheck, Lock, ShieldCheck, Globe, Award, X, Crown } from "lucide-react";

export default function Legal() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scale className="h-8 w-8 text-[#d4af37]" />
              <h1 className="text-4xl font-bold gradient-text">
                IP Governance & Legal Structure
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive legal framework protecting and governing SaintVisionAI's intellectual property and operations
            </p>
          </div>

          {/* Corporate Structure */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Corporate Structure</h2>
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-[#d4af37] font-semibold">Delaware LP IP Holding Structure:</span>
                    <span className="text-gray-300 ml-2">All patents held separately for risk isolation</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-[#d4af37] font-semibold">Operational LLC:</span>
                    <span className="text-gray-300 ml-2">Day-to-day business operations with full licensing control</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-[#d4af37] font-semibold">International Compliance:</span>
                    <span className="text-gray-300 ml-2">KYC + AML protocols for global operations</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-[#d4af37] font-semibold">Fund Segregation:</span>
                    <span className="text-gray-300 ml-2">Investor and user funds separated under compliance firewall</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Patent Portfolio */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Patent Portfolio</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Patents */}
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                <h3 className="text-[#d4af37] text-lg font-semibold mb-4">Current Patents</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">U.S. Patent No. 10,290,222</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Interactive Tutorial with Escalating Prompts</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Issued: May 2019</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Status: Fully enforceable</p>
                  </div>
                </div>
              </div>

              {/* Pending Filings */}
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                <h3 className="text-[#d4af37] text-lg font-semibold mb-4">Pending Filings</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">CIP extensions for HACP execution</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Memory modules and persona systems</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Advanced behavioral tier logic</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Enterprise integration protocols</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Licensed Technologies */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Licensed Technologies</h2>
            <p className="text-gray-300 mb-6">
              All operational tools are fully licensed and under Saint Visions I.P. Holdings, LP control:
            </p>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-gray-800">
                <span className="text-[#d4af37] font-medium text-sm">GoHighLevel CRM</span>
              </div>
              <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-gray-800">
                <span className="text-[#d4af37] font-medium text-sm">Supabase Database</span>
              </div>
              <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-gray-800">
                <span className="text-[#d4af37] font-medium text-sm">Azure Cloud Services</span>
              </div>
              <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-gray-800">
                <span className="text-[#d4af37] font-medium text-sm">Twilio Communications</span>
              </div>
              <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-gray-800">
                <span className="text-[#d4af37] font-medium text-sm">OpenAI API</span>
              </div>
              <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-gray-800">
                <span className="text-[#d4af37] font-medium text-sm">Stripe Payments</span>
              </div>
            </div>
          </div>

          {/* Security & Compliance */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-6 w-6 text-[#d4af37]" />
              <h2 className="text-2xl font-semibold text-white">Security & Compliance</h2>
            </div>
            
            {/* Security Standards */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">Security Standards</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 p-6 rounded-lg border border-red-500/30 text-center">
                  <Lock className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">SOC 2</h4>
                  <p className="text-gray-300">Type II Compliance</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-6 rounded-lg border border-green-500/30 text-center">
                  <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">AES-256</h4>
                  <p className="text-gray-300">Military-grade encryption</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-6 rounded-lg border border-blue-500/30 text-center">
                  <Globe className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Zero Trust</h4>
                  <p className="text-gray-300">Network architecture</p>
                </div>
              </div>
            </div>
            
            {/* Regulatory Compliance */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">Regulatory Compliance</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our services comply with international data protection regulations and industry standards to ensure your 
                privacy rights and business requirements are fully protected.
              </p>
              
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-green-400 mb-2">GDPR</h4>
                    <p className="text-gray-400 text-sm">EU Compliance</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-blue-400 mb-2">CCPA</h4>
                    <p className="text-gray-400 text-sm">California Privacy</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-purple-400 mb-2">PIPEDA</h4>
                    <p className="text-gray-400 text-sm">Canada Privacy</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-orange-400 mb-2">LGPD</h4>
                    <p className="text-gray-400 text-sm">Brazil Privacy</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Data Retention */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">Data Retention</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                  <h4 className="text-lg font-semibold text-white mb-4">Default Users</h4>
                  <p className="text-gray-300 leading-relaxed">
                    30 days for chat logs, immediate deletion upon request
                  </p>
                </div>
                
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                  <h4 className="text-lg font-semibold text-white mb-4">Pro/Enterprise</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Up to 365 days unless deleted, full user control
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* HACP™ Patent Technology */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="h-6 w-6 text-[#d4af37]" />
              <div>
                <h2 className="text-2xl font-semibold text-white">HACP™ Patent Technology</h2>
                <p className="text-[#d4af37] text-sm">U.S. Patent No. 10,290,222</p>
              </div>
            </div>
            
            {/* What is HACP™? */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">What is HACP™?</h3>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  The Human-AI Connection Protocol (HACP™) is the core adaptive intelligence framework that 
                  powers every Saint Vision interface — from SaintSal's coaching flows to immersive therapy 
                  apps, onboarding flows, PartnerTech routing, and executive dashboards.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  More than just a UX philosophy or prompting technique, HACP is a structured, adaptive, real-time 
                  escalation engine that tunes itself based on user ability, emotional state, task complexity, and timing 
                  feedback loops.
                </p>
              </div>
            </div>
            
            {/* Adaptive Response System & Patent Protection */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                <h4 className="text-lg font-semibold text-[#d4af37] mb-4">Adaptive Response System</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Escalating prompts (hint → cue → example → intervention)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Context-aware persona shifts</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Multimodal inputs (gesture, text, gaze, sensor)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Real-time emotional calibration</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                <h4 className="text-lg font-semibold text-[#d4af37] mb-4">Patent Protection</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Issued: May 2019</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Fully enforceable - no PTAB challenges</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Covers adaptive tutoring systems</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">AR/VR rehabilitation guides</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Commercial Significance */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">Commercial Significance</h3>
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-[#d4af37] mb-2">$10M-$75M</h4>
                    <p className="text-gray-400">Licensing Value</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-green-400 mb-2">Enterprise</h4>
                    <p className="text-gray-400">CRM Integration</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-blue-400 mb-2">Healthcare</h4>
                    <p className="text-gray-400">Therapy Ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms of Service */}
          <Card className="mb-8 glass-effect">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <FileCheck className="h-6 w-6 text-[#d4af37]" />
                Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Service Usage */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Service Usage</h3>
                <p className="text-gray-300 leading-relaxed">
                  By using SaintVisionAI services, you agree to use our platform responsibly and in accordance with 
                  applicable laws and regulations. Our services are designed for legitimate business purposes and 
                  professional collaboration.
                </p>
              </div>

              {/* Account Responsibilities */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Account Responsibilities</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Maintain accurate account information</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Protect your login credentials</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Report security vulnerabilities</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Use services in good faith</p>
                  </div>
                </div>
              </div>

              {/* Intellectual Property */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Intellectual Property</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  All content, features, and functionality are owned by Saint Visions I.P. Holdings, LP and are protected by 
                  international copyright, trademark, and patent laws, including:
                </p>
                
                {/* Protected Technology Box */}
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#d4af37] bg-gradient-to-r from-[#1a1a1a] to-[#252525]">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-5 w-5 text-[#d4af37]" />
                    <h4 className="text-[#d4af37] font-semibold text-lg">Protected Technology</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">HACP™ Human-AI Connection Protocol</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">SaintSal™ Adaptive AI Assistant</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">PartnerTech.ai CRM Integration</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Patent No. 10,290,222 and pending CIP filings</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Limitation of Liability</h3>
                <p className="text-gray-300 leading-relaxed">
                  Saint Visions I.P. Holdings, LP shall not be liable for any indirect, incidental, special, consequential, or punitive 
                  damages resulting from your use of our services. Our total liability is limited to the amount paid for 
                  services in the 12 months preceding the claim.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-[#d4af37]" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* We Protect What Matters */}
              <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 p-6 rounded-lg border border-green-500/30">
                <h3 className="text-xl font-semibold text-green-400 mb-4">We Protect What Matters</h3>
                <p className="text-gray-300 leading-relaxed">
                  Saint Visions I.P. Holdings, LP and its associated platforms (SaintSal™, PartnerTech.ai, Athen.ai, 
                  EbyTech.ai, SVTlegal.ai, SVTteach.ai) are committed to the highest standards of privacy, 
                  data protection, and ethical conduct.
                </p>
              </div>

              {/* What We Collect vs What We NEVER Do */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* What We Collect */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-5 w-5 text-[#d4af37]" />
                    <h3 className="text-xl font-semibold text-white">What We Collect</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Name, email, phone (if you submit them)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Activity logs from SaintSal interactions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Optional CRM, calendar, financial data you connect</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">AI prompt content (with user opt-in only)</p>
                    </div>
                  </div>
                </div>

                {/* What We NEVER Do */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="h-5 w-5 text-red-400" />
                    <h3 className="text-xl font-semibold text-white">What We NEVER Do</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Sell your data</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Share personal info without consent</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Train external models with your inputs</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Track you across other websites</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How We Protect It */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-5 w-5 text-[#d4af37]" />
                  <h3 className="text-xl font-semibold text-white">How We Protect It</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                    <p className="text-[#d4af37] font-semibold mb-2">Encryption:</p>
                    <p className="text-gray-300">AES-256 for stored data</p>
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                    <p className="text-[#d4af37] font-semibold mb-2">Access Control:</p>
                    <p className="text-gray-300">Supabase RLS</p>
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                    <p className="text-[#d4af37] font-semibold mb-2">Infrastructure:</p>
                    <p className="text-gray-300">Zero-trust architecture</p>
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                    <p className="text-[#d4af37] font-semibold mb-2">Hosting:</p>
                    <p className="text-gray-300">SOC 2-aligned stack</p>
                  </div>
                </div>
              </div>

              {/* Global Compliance */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="h-5 w-5 text-[#d4af37]" />
                  <h3 className="text-xl font-semibold text-white">Global Compliance</h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="bg-green-900/20 px-4 py-2 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">GDPR (EU)</span>
                    </div>
                  </div>
                  <div className="bg-green-900/20 px-4 py-2 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">CCPA (California)</span>
                    </div>
                  </div>
                  <div className="bg-green-900/20 px-4 py-2 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">PIPEDA (Canada)</span>
                    </div>
                  </div>
                  <div className="bg-green-900/20 px-4 py-2 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">LGPD (Brazil)</span>
                    </div>
                  </div>
                  <div className="bg-green-900/20 px-4 py-2 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">UK DPA 2018</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Ethics & Disclosure */}
          <Card className="mb-8 glass-effect">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Award className="h-6 w-6 text-[#d4af37]" />
                AI Ethics & Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* SaintSal Charter */}
              <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 p-6 rounded-lg border border-purple-500/40">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">SaintSal Charter</h3>
                <p className="text-gray-300 italic text-lg leading-relaxed">
                  "This isn't AI. This is assistance. Intelligent. Accountable. Adaptive."
                </p>
              </div>

              {/* What SaintSal Is vs Is NOT */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* What SaintSal Is */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <h3 className="text-xl font-semibold text-white">What SaintSal™ Is</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">An always-on adaptive AI assistant</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Trained with proprietary HACP™ logic</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Designed to escalate when needed</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Remembers only what matters to you</p>
                    </div>
                  </div>
                </div>

                {/* What SaintSal Is NOT */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <X className="h-5 w-5 text-red-400" />
                    <h3 className="text-xl font-semibold text-white">What SaintSal™ Is NOT</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">A replacement for licensed professionals</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">A surveillance tool</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">A black-box language model</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">Disconnected from human oversight</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ethical Principles */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-5 w-5 text-[#d4af37]" />
                  <h3 className="text-xl font-semibold text-white">Ethical Principles</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <p className="text-green-400 font-semibold">Clarity over manipulation</p>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <p className="text-green-400 font-semibold">Adaptation over interruption</p>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <p className="text-green-400 font-semibold">Uplift over optimization</p>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <p className="text-green-400 font-semibold">Transparency over performance</p>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <p className="text-green-400 font-semibold">Emotional intelligence over raw data</p>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <p className="text-green-400 font-semibold">Human dignity in every interaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="mt-12 text-center">
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 max-w-2xl mx-auto">
              <h3 className="text-[#d4af37] text-xl font-semibold mb-4">Legal Inquiries</h3>
              <p className="text-gray-300 mb-2">
                For licensing, IP matters, and legal inquiries:
              </p>
              <p className="text-white font-medium">licensing@saintvisionai.com</p>
              <p className="text-gray-400 text-sm mt-2">
                Ryan Capatosto, Managing Director<br />
                Saint Visions I.P. Holdings, LP
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}