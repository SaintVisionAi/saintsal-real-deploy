class AgentApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.AGENT_API_URL || process.env.AGENT_API_BASE_URL || "https://api.agent.saintvisionai.com";
    this.apiKey = process.env.AGENT_API_KEY || process.env.SAINTVISIONAI_API_KEY || "default_agent_key";
  }

  async sendMessage(message: string, userId: string): Promise<{ content: string; model: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-User-ID': userId,
        },
        body: JSON.stringify({
          message,
          model: 'saintsal-hacp',
          userId,
          metadata: {
            platform: 'saintvisionai-enterprise',
            version: '2.0'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Agent API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.response || data.message || "I'm here to help with your SaintVisionAI needs.",
        model: data.model || "agent-api"
      };
    } catch (error) {
      console.error("Agent API error:", error);
      throw new Error("Failed to connect to SaintSal agent");
    }
  }

  async getAgentStatus(): Promise<{ online: boolean; version: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error("Agent API status check failed");
      }

      const data = await response.json();
      return {
        online: data.online || false,
        version: data.version || "unknown"
      };
    } catch (error) {
      console.error("Agent API status error:", error);
      return { online: false, version: "unknown" };
    }
  }
}

export const agentApiService = new AgentApiService();
