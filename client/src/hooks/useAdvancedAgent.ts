import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AgentCapability {
  name: string;
  description: string;
  enabled: boolean;
  parameters?: Record<string, any>;
}

interface AgentSession {
  sessionId: string;
  capabilities: AgentCapability[];
  context: {
    conversation_length: number;
    business_context: string;
    expertise_domains: string[];
  };
  created_at: string;
  last_activity: string;
}

interface AgentMessage {
  message: string;
  sessionId: string;
  capabilities_used?: string[];
  context_updates?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: string;
}

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

export function useAdvancedAgent() {
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<AgentSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Send message with advanced capabilities
  const sendMessage = useCallback(async (
    message: string,
    options?: {
      sessionId?: string;
      userId?: string;
      context?: Record<string, any>;
      requestedCapabilities?: string[];
    }
  ): Promise<AgentMessage | null> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId: options?.sessionId || currentSession,
          userId: options?.userId,
          context: options?.context,
          requestedCapabilities: options?.requestedCapabilities,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      
      // Update current session if new one was created
      if (data.sessionId && data.sessionId !== currentSession) {
        setCurrentSession(data.sessionId);
      }

      return {
        message: data.message,
        sessionId: data.sessionId,
        capabilities_used: data.capabilities_used,
        context_updates: data.context_updates,
        metadata: data.metadata,
        timestamp: data.timestamp,
      };
    } catch (error) {
      console.error('Advanced agent error:', error);
      toast({
        title: 'Agent Communication Error',
        description: error instanceof Error ? error.message : 'Failed to communicate with SaintSal™',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, toast]);

  // Get session information
  const getSessionInfo = useCallback(async (sessionId?: string): Promise<AgentSession | null> => {
    const targetSessionId = sessionId || currentSession;
    if (!targetSessionId) return null;

    try {
      const response = await fetch(`/api/agent/session/${targetSessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get session info');
      }

      const data = await response.json();
      setSessionData(data);
      return data;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }, [currentSession]);

  // Update agent capabilities
  const updateCapabilities = useCallback(async (
    capabilities: Partial<AgentCapability>[],
    sessionId?: string
  ): Promise<boolean> => {
    const targetSessionId = sessionId || currentSession;
    if (!targetSessionId) return false;

    try {
      const response = await fetch(`/api/agent/session/${targetSessionId}/capabilities`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ capabilities }),
      });

      if (!response.ok) {
        throw new Error('Failed to update capabilities');
      }

      // Refresh session data
      await getSessionInfo(targetSessionId);
      
      toast({
        title: 'Capabilities Updated',
        description: 'Agent capabilities have been successfully updated',
      });

      return true;
    } catch (error) {
      console.error('Update capabilities error:', error);
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update capabilities',
        variant: 'destructive',
      });
      return false;
    }
  }, [currentSession, getSessionInfo, toast]);

  // Get agent analytics
  const getAnalytics = useCallback(async (): Promise<AgentAnalytics | null> => {
    try {
      const response = await fetch('/api/agent/analytics');
      
      if (!response.ok) {
        throw new Error('Failed to get analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Analytics error:', error);
      return null;
    }
  }, []);

  // Get agent status
  const getStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/agent/status');
      
      if (!response.ok) {
        throw new Error('Failed to get status');
      }

      return await response.json();
    } catch (error) {
      console.error('Status error:', error);
      return null;
    }
  }, []);

  // Create new session
  const createSession = useCallback((userId?: string) => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentSession(newSessionId);
    setSessionData(null);
    return newSessionId;
  }, []);

  return {
    // State
    currentSession,
    sessionData,
    isLoading,
    
    // Actions
    sendMessage,
    getSessionInfo,
    updateCapabilities,
    getAnalytics,
    getStatus,
    createSession,
    
    // Utilities
    setCurrentSession,
  };
}