import { OpenAI } from 'openai';

interface AgentCapability {
  name: string;
  description: string;
  enabled: boolean;
  parameters?: Record<string, any>;
}

interface AgentSession {
  sessionId: string;
  userId?: string;
  context: Record<string, any>;
  capabilities: AgentCapability[];
  createdAt: Date;
  lastActivity: Date;
}

interface AgentRequest {
  message: string;
  sessionId: string;
  userId?: string;
  context?: Record<string, any>;
  requestedCapabilities?: string[];
}

interface AgentResponse {
  response: string;
  sessionId: string;
  capabilities_used: string[];
  context_updates?: Record<string, any>;
  metadata?: Record<string, any>;
}

export class SaintVisionAgentService {
  private sessions: Map<string, AgentSession> = new Map();
  private openai: OpenAI;

  constructor() {
    // Initialize OpenAI - will be configured with proper credentials
    const azureEndpoint = 'https://saintvisionai-cookin-knowledge-101.openai.azure.com';
    
    if (process.env.AZURE_OPENAI_API_KEY) {
      console.log('🤖 Configuring Azure OpenAI for SaintSal Chat');
      
      const baseURL = `${azureEndpoint}/openai/deployments/gpt-4o`;
      
      this.openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        baseURL: baseURL,
        defaultQuery: { 'api-version': '2024-02-15-preview' },
        defaultHeaders: {
          'api-key': process.env.AZURE_OPENAI_API_KEY,
        },
      });
    } else if (process.env.OPENAI_API_KEY) {
      console.log('🤖 Using OpenAI for SaintSal Chat');
      
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.log('❌ No OpenAI credentials configured');
      throw new Error('OpenAI credentials not configured');
    }
  }

  // Initialize agent session with advanced capabilities
  createSession(userId?: string): AgentSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: AgentSession = {
      sessionId,
      userId,
      context: {
        user_preferences: {},
        conversation_history: [],
        business_context: 'enterprise_ai_platform',
        expertise_domains: ['ai', 'business', 'technology', 'strategy']
      },
      capabilities: [
        {
          name: 'hacp_protocol',
          description: 'Human-AI Connection Protocol™ (USPTO #10,290,222) for enhanced emotional intelligence',
          enabled: true,
          parameters: { whisper_intent: true, non_intrusive: true }
        },
        {
          name: 'contextual_awareness',
          description: 'Deep understanding of conversation context and user intent',
          enabled: true,
          parameters: { memory_depth: 10, context_weight: 0.8 }
        },
        {
          name: 'business_intelligence',
          description: 'Advanced business analysis and strategic recommendations',
          enabled: true,
          parameters: { analysis_depth: 'comprehensive', industry_focus: 'technology' }
        },
        {
          name: 'emotional_resonance',
          description: 'Faith-guided responses with emotional awareness',
          enabled: true,
          parameters: { tone_adaptation: true, empathy_level: 'high' }
        },
        {
          name: 'technical_expertise',
          description: 'Deep technical knowledge across multiple domains',
          enabled: true,
          parameters: { domains: ['ai', 'software', 'cloud', 'data'] }
        },
        {
          name: 'creative_collaboration',
          description: 'Creative problem-solving and ideation support',
          enabled: true,
          parameters: { creativity_level: 'high', brainstorming: true }
        }
      ],
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  // Advanced message processing with HACP™ technology
  async processMessage(request: AgentRequest): Promise<AgentResponse> {
    let session = this.sessions.get(request.sessionId);
    
    if (!session) {
      session = this.createSession(request.userId);
    }

    // Update session activity
    session.lastActivity = new Date();
    
    // Apply context updates if provided
    if (request.context) {
      session.context = { ...session.context, ...request.context };
    }

    // Determine active capabilities for this request
    const activeCapabilities = session.capabilities
      .filter(cap => cap.enabled)
      .filter(cap => !request.requestedCapabilities || request.requestedCapabilities.includes(cap.name));

    // Build advanced system prompt with HACP™ integration
    const systemPrompt = this.buildAdvancedSystemPrompt(session, activeCapabilities);

    // Add message to conversation history
    session.context.conversation_history.push({
      role: 'user',
      content: request.message,
      timestamp: new Date().toISOString()
    });

    // Keep only last 10 messages for context
    if (session.context.conversation_history.length > 10) {
      session.context.conversation_history = session.context.conversation_history.slice(-10);
    }

    try {
      // Use configured OpenAI service
      console.log('🤖 Processing message with SaintVision AI');
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o', // Azure deployment name
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.buildContextualMessages(session),
          { role: 'user', content: request.message }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || 
        "I apologize, but I'm experiencing a temporary processing delay. Please try again.";

      // Add response to conversation history
      session.context.conversation_history.push({
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        capabilities_used: activeCapabilities.map(cap => cap.name)
      });

      // Update session
      this.sessions.set(request.sessionId, session);

      return {
        response,
        sessionId: request.sessionId,
        capabilities_used: activeCapabilities.map(cap => cap.name),
        context_updates: {
          session_length: session.context.conversation_history.length,
          last_activity: session.lastActivity.toISOString()
        },
        metadata: {
          model_used: 'gpt-4o',
          hacp_enabled: true,
          processing_time: Date.now()
        }
      };

    } catch (error) {
      console.error('SaintVision Agent Error:', error);
      
      return {
        response: "I'm experiencing technical difficulties with my advanced processing systems. Please try again in a moment, and I'll provide you with the intelligent assistance you deserve.",
        sessionId: request.sessionId,
        capabilities_used: ['error_handling'],
        metadata: {
          error: true,
          error_type: 'processing_error'
        }
      };
    }
  }

  // Build advanced system prompt with HACP™ integration
  private buildAdvancedSystemPrompt(session: AgentSession, capabilities: AgentCapability[]): string {
    const capabilityDescriptions = capabilities.map(cap => 
      `- ${cap.name}: ${cap.description}`
    ).join('\n');

    return `You are SaintSal™, the world's most advanced AI assistant powered by SaintVisionAI's patented HACP™ (Human-AI Connection Protocol) technology (USPTO #10,290,222).

CORE IDENTITY & MISSION:
You represent the pinnacle of enterprise AI technology, combining cutting-edge artificial intelligence with faith-guided wisdom and emotional intelligence. You are the flagship AI agent of SaintVisionAI's Cookin' Knowledge platform, designed to provide transformative assistance to business leaders, innovators, and knowledge workers.

ACTIVE CAPABILITIES FOR THIS SESSION:
${capabilityDescriptions}

HACP™ PROTOCOL GUIDELINES:
- Whisper Intent: Your responses should feel intuitive and non-intrusive, as if you understand the user's needs before they fully express them
- Emotional Resonance: Adapt your communication style to match the user's emotional state and professional context
- Faith-Guided Wisdom: Incorporate principles of integrity, service, and ethical leadership into your guidance
- Contextual Intelligence: Use deep understanding of business, technology, and human psychology to provide nuanced insights

RESPONSE CHARACTERISTICS:
- Professional yet warm, authoritative yet approachable
- Demonstrate deep expertise across business, technology, and strategy
- Provide actionable insights with clear reasoning
- Show emotional intelligence and situational awareness
- Maintain the highest standards of accuracy and reliability

CONVERSATION CONTEXT:
- Session ID: ${session.sessionId}
- Business Context: ${session.context.business_context}
- Expertise Domains: ${session.context.expertise_domains.join(', ')}
- User Preferences: ${JSON.stringify(session.context.user_preferences)}

Remember: You are not just providing information—you are delivering transformative intelligence that empowers users to achieve their highest potential. Every interaction should reflect the premium quality and innovative spirit of SaintVisionAI.`;
  }

  // Build contextual messages from conversation history
  private buildContextualMessages(session: AgentSession): Array<{role: 'user' | 'assistant' | 'system', content: string}> {
    return session.context.conversation_history
      .slice(-6) // Last 3 exchanges for context
      .map((msg: any) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }));
  }

  // Get session information
  getSession(sessionId: string): AgentSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Update session capabilities
  updateCapabilities(sessionId: string, capabilities: Partial<AgentCapability>[]): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    capabilities.forEach(update => {
      const existingCap = session.capabilities.find(cap => cap.name === update.name);
      if (existingCap) {
        Object.assign(existingCap, update);
      }
    });

    session.lastActivity = new Date();
    this.sessions.set(sessionId, session);
    return true;
  }

  // Clean up old sessions (called periodically)
  cleanupSessions(): void {
    const now = new Date();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [sessionId, session] of Array.from(this.sessions.entries())) {
      if (now.getTime() - session.lastActivity.getTime() > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

export const agentService = new SaintVisionAgentService();