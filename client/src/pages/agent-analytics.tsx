import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header";
import { BarChart3, Activity, Brain, Zap, Globe, Shield } from "lucide-react";
import svLogoImg from "@assets/better saintsal transparent  copy_1754535619830.png";
import { useAdvancedAgent } from "@/hooks/useAdvancedAgent";

interface AgentAnalytics {
  hacp_protocol: {
    status: string;
    patent_number: string;
    version: string;
  };
  capabilities: {
    total_available: number;
    active_sessions: number;
    most_used: string[];
  };
  performance: {
    average_response_time: string;
    accuracy_score: number;
    user_satisfaction: number;
  };
  integrations: {
    azure_openai: string;
    hacp_protocol: string;
    enterprise_features: string;
  };
}

export default function AgentAnalytics() {
  const { toast } = useToast();
  const { getAnalytics, getStatus } = useAdvancedAgent();
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [analyticsData, statusData] = await Promise.all([
        getAnalytics(),
        getStatus()
      ]);
      
      setAnalytics(analyticsData);
      setStatus(statusData);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      toast({
        title: "Analytics Error",
        description: "Failed to load agent analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'operational':
      case 'connected':
      case 'enabled':
        return 'text-[#00ff88]';
      case 'warning':
        return 'text-[#d4af37]';
      case 'error':
      case 'disconnected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <img 
              src={svLogoImg} 
              alt="SaintVisionAI" 
              className="w-16 h-16 mx-auto mb-4 object-contain animate-pulse"
            />
            <p className="text-white/60">Loading Advanced Agent Analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">
            <span className="text-white">Advanced Agent</span>
            <span className="text-[#d4af37] font-medium"> Analytics</span>
          </h1>
          <p className="text-white/60">
            Real-time insights into SaintSal™ AI agent performance and HACP™ protocol status
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Agent Status */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Agent Status</h3>
              <Activity className="h-5 w-5 text-[#00ff88]" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Status:</span>
                <span className={getStatusColor(status?.status)}>
                  {status?.status || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Model:</span>
                <span className="text-white">{status?.model || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Version:</span>
                <span className="text-white">{status?.version || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* HACP™ Protocol */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">HACP™ Protocol</h3>
              <Brain className="h-5 w-5 text-[#d4af37]" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Status:</span>
                <span className={getStatusColor(analytics?.hacp_protocol.status)}>
                  {analytics?.hacp_protocol.status || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Patent:</span>
                <span className="text-white text-sm">{analytics?.hacp_protocol.patent_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Version:</span>
                <span className="text-white">{analytics?.hacp_protocol.version || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Performance</h3>
              <Zap className="h-5 w-5 text-[#00ff88]" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Response Time:</span>
                <span className="text-[#00ff88]">{analytics?.performance.average_response_time || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Accuracy:</span>
                <span className="text-[#00ff88]">{analytics?.performance.accuracy_score || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Satisfaction:</span>
                <span className="text-[#d4af37]">{analytics?.performance.user_satisfaction || 0}/5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Active Capabilities */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Active Capabilities</h3>
              <Shield className="h-6 w-6 text-[#d4af37]" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-white">Total Available</span>
                <span className="text-[#00ff88] font-medium">{analytics?.capabilities.total_available || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-white">Active Sessions</span>
                <span className="text-[#d4af37] font-medium">{analytics?.capabilities.active_sessions || 0}</span>
              </div>

              <div>
                <p className="text-white/60 mb-3">Most Used Capabilities:</p>
                <div className="space-y-2">
                  {analytics?.capabilities.most_used?.map((capability, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <span className="text-white text-sm capitalize">
                        {capability.replace(/_/g, ' ')}
                      </span>
                      <div className="w-16 h-2 bg-gray-700 rounded-full">
                        <div 
                          className="h-full bg-[#d4af37] rounded-full"
                          style={{ width: `${100 - (index * 20)}%` }}
                        />
                      </div>
                    </div>
                  )) || []}
                </div>
              </div>
            </div>
          </div>

          {/* Integration Status */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Integration Status</h3>
              <Globe className="h-6 w-6 text-[#00ff88]" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-white">Azure OpenAI</span>
                <span className={getStatusColor(analytics?.integrations.azure_openai)}>
                  {analytics?.integrations.azure_openai || 'Unknown'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-white">HACP™ Protocol</span>
                <span className={getStatusColor(analytics?.integrations.hacp_protocol)}>
                  {analytics?.integrations.hacp_protocol || 'Unknown'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-white">Enterprise Features</span>
                <span className={getStatusColor(analytics?.integrations.enterprise_features)}>
                  {analytics?.integrations.enterprise_features || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={loadAnalytics} 
            className="bg-[#d4af37] hover:bg-[#d4af37]/80 text-black font-medium"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh Analytics
          </Button>
          
          <Link href="/chat">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Access SaintSal™ Agent
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}