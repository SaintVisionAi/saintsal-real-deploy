import { useState, useEffect } from 'react';
import { useAdvancedAgent } from '@/hooks/useAdvancedAgent';
import { Activity, Brain, Zap } from 'lucide-react';

interface AgentStatusProps {
  className?: string;
  showDetails?: boolean;
}

export function AgentStatus({ className = "", showDetails = false }: AgentStatusProps) {
  const { getStatus } = useAdvancedAgent();
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatus();
    // Refresh every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      const statusData = await getStatus();
      setStatus(statusData);
    } catch (error) {
      console.error('Failed to load agent status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational':
      case 'active':
        return 'text-[#00ff88]';
      case 'warning':
        return 'text-[#d4af37]';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  if (!status) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        <span className="text-red-400 text-sm">Offline</span>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${status.status === 'operational' ? 'bg-[#00ff88]' : 'bg-red-400'}`}></div>
        <span className={`text-sm ${getStatusColor(status.status)}`}>
          {status.status || 'Unknown'}
        </span>
        {status.hacp_enabled && (
          <div className="flex items-center space-x-1">
            <Brain className="w-3 h-3 text-[#d4af37]" />
            <span className="text-xs text-[#d4af37]">HACP™</span>
          </div>
        )}
      </div>
      
      {showDetails && (
        <div className="mt-2 space-y-1 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Model:</span>
            <span className="text-white">{status.model}</span>
          </div>
          <div className="flex justify-between">
            <span>Version:</span>
            <span className="text-white">{status.version}</span>
          </div>
          <div className="flex justify-between">
            <span>Capabilities:</span>
            <span className="text-[#00ff88]">{status.capabilities_online}</span>
          </div>
        </div>
      )}
    </div>
  );
}