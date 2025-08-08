import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from 'express-session';
import MemoryStore from 'memorystore';

// Simple auth middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.session?.user) {
    req.user = (req.session as any).user;
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};
import { insertUserSchema, insertChatSessionSchema, insertChatMessageSchema, insertSupportTicketSchema } from "@shared/schema";
import OpenAI from "openai";
import { agentService } from "./services/agentService";

// Initialize OpenAI
let openai: OpenAI | null = null;

// Configure OpenAI service
const azureEndpoint = 'https://saintvisionai-cookin-knowledge-101.openai.azure.com';

if (process.env.AZURE_OPENAI_API_KEY) {
  console.log('Routes: Configuring Azure OpenAI');
  
  const baseURL = `${azureEndpoint}/openai/deployments/gpt-4o`;
  
  openai = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: baseURL,
    defaultQuery: { 'api-version': '2024-02-15-preview' },
    defaultHeaders: {
      'api-key': process.env.AZURE_OPENAI_API_KEY,
    },
  });
} else if (process.env.OPENAI_API_KEY) {
  console.log('Routes: Using OpenAI');
  
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.log('❌ No OpenAI credentials configured');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  const store = MemoryStore(session);
  
  app.use(session({
    secret: 'saint-vision-ai-session-secret-2025',
    store: new store({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if user is verified
      if (!user.emailVerified) {
        return res.status(401).json({ message: "Please verify your email first" });
      }

      // Simple password check (in production, use bcrypt)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Set session
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        isAdmin: user.isAdmin,
        emailVerified: user.emailVerified
      };

      res.json({ 
        message: "Login successful",
        user: (req.session as any).user
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Register endpoint
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      
      // Validate all required fields
      if (!name || !email || !phone || !password) {
        return res.status(400).json({ 
          message: "All fields are required: name, email, phone, and password" 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Check if email is admin (you can modify this list)
      const adminEmails = [
        'ryan@saintvisiongroup.com',
        'admin@saintvisionai.com',
      ];
      const isAdmin = adminEmails.includes(email.toLowerCase());

      // Create user
      const newUser = await storage.createUser({
        name,
        email: email.toLowerCase(),
        phone,
        password, // In production, hash this with bcrypt
        username: email.toLowerCase(),
        emailVerified: true, // Auto-verify for now
        isAdmin
      });

      // Set session
      (req.session as any).user = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        isAdmin: newUser.isAdmin,
        emailVerified: newUser.emailVerified
      };

      res.json({ 
        message: "Account created successfully",
        user: (req.session as any).user
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Logout endpoint  
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });
  
  // Admin routes - for viewing all users and contacts
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = req.user;
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.get('/api/admin/contacts', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = req.user;
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      // Get unverified users as new contacts
      const contacts = await storage.getUnverifiedUsers();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });
  
  // User registration endpoint
  app.post('/api/register', async (req, res) => {
    try {
      const { name, phone, email } = req.body;
      
      // Validate required fields
      if (!name || !phone || !email) {
        return res.status(400).json({ message: "Name, phone, and email are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      // Create verification token (6-digit code)
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Check if email is admin
      const adminEmails = [
        'ryan@saintvisiongroup.com',
        'admin@saintvisionai.com',
      ];
      const isAdmin = adminEmails.includes(email.toLowerCase());
      
      const newUser = await storage.createUser({
        name,
        phone,
        email: email.toLowerCase(),
        password: 'auto-verified', // Placeholder password
        username: email.toLowerCase(),
        emailVerified: false,
        isAdmin
      });
      
      // Update with verification token after creation
      await storage.updateUser(newUser.id, {
        verificationToken
      });
      
      // In production, send actual email here
      console.log(`\n📧 VERIFICATION EMAIL for ${email}:`);
      console.log(`Your verification code is: ${verificationToken}`);
      console.log(`User: ${name}`);
      console.log(`Phone: ${phone}\n`);
      
      res.json({ 
        message: "Please check your email for verification code.",
        userId: newUser.id
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  // Email verification endpoint
  app.get('/api/verify-email/:token', async (req, res) => {
    try {
      const { token } = req.params;
      
      // Find user by verification token
      const users = await storage.getAllUsers();
      const user = users.find(u => u.verificationToken === token && !u.emailVerified);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }
      
      // Verify the user and set up for auto-login
      const verifiedUser = await storage.verifyUserEmail(user.id);
      
      // Auto-login after verification
      (req.session as any).user = {
        id: verifiedUser!.id,
        email: verifiedUser!.email,
        name: verifiedUser!.name,
        phone: verifiedUser!.phone,
        isAdmin: verifiedUser!.isAdmin,
        emailVerified: true
      };
      
      console.log(`✅ User verified and logged in: ${verifiedUser!.name} (${verifiedUser!.email})`);
      
      res.json({ 
        message: "Email verified successfully",
        user: (req.session as any).user
      });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });
  

  // Chat session routes
  app.get("/api/chat/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const sessions = await storage.getChatSessionsByUserId(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Get chat sessions error:", error);
      res.status(500).json({ message: "Failed to get chat sessions" });
    }
  });

  app.post("/api/chat/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const sessionData = insertChatSessionSchema.parse({
        ...req.body,
        userId,
      });
      
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Create chat session error:", error);
      res.status(400).json({ message: "Failed to create chat session" });
    }
  });

  app.get("/api/chat/sessions/:sessionId/messages", isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessagesBySessionId(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Get chat messages error:", error);
      res.status(500).json({ message: "Failed to get chat messages" });
    }
  });

  app.post("/api/chat/sessions/:sessionId/messages", isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        sessionId,
      });

      const message = await storage.createChatMessage(messageData);

      // If this is a user message, generate AI response
      if (messageData.role === 'user') {
        try {
          // Get conversation history
          const messages = await storage.getChatMessagesBySessionId(sessionId);
          
          // Prepare messages for OpenAI
          const conversationHistory = messages.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }));

          // Generate AI response using Azure OpenAI (if available)
          if (!openai) {
            throw new Error('OpenAI not configured');
          }
          const completion = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
              {
                role: 'system',
                content: 'You are SaintSal™, an advanced AI agent powered by HACP™ (Human-AI Connection Protocol). You provide intelligent, context-aware assistance with a professional yet warm demeanor. You understand business operations, technology, and human needs.'
              },
              ...conversationHistory
            ],
            max_tokens: 1000,
            temperature: 0.7,
          });

          const aiResponse = completion.choices[0]?.message?.content;
          
          if (aiResponse) {
            // Save AI response
            const aiMessage = await storage.createChatMessage({
              sessionId,
              role: 'assistant',
              content: aiResponse,
            });
            
            // Return both user message and AI response
            res.json({ userMessage: message, aiMessage });
          } else {
            res.json({ userMessage: message });
          }
        } catch (aiError) {
          console.error("AI response error:", aiError);
          // Return user message even if AI fails
          res.json({ userMessage: message });
        }
      } else {
        res.json({ userMessage: message });
      }
    } catch (error) {
      console.error("Create chat message error:", error);
      res.status(400).json({ message: "Failed to create chat message" });
    }
  });

  // Support ticket routes
  app.get("/api/support/tickets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const tickets = await storage.getSupportTicketsByUserId(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Get support tickets error:", error);
      res.status(500).json({ message: "Failed to get support tickets" });
    }
  });

  app.post("/api/support/tickets", async (req, res) => {
    try {
      const { subject, category, priority, description, email, name } = req.body;

      // Analyze the support ticket with AI for intelligent routing
      try {
        if (!openai) {
          throw new Error('OpenAI not configured');
        }
        
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an AI support ticket analyzer for SaintVisionAI. Analyze support tickets and provide:
1. Urgency assessment (Low/Medium/High/Critical)
2. Department routing (Technical/Sales/Legal/General)
3. Key issues identified
4. Suggested response priority

Respond in JSON format only.`
            },
            {
              role: "user",
              content: `Analyze this support ticket:
Subject: ${subject}
Category: ${category}
Priority: ${priority}
Description: ${description}
Customer: ${name} (${email})`
            }
          ],
          max_tokens: 300,
          temperature: 0.3,
          response_format: { type: "json_object" }
        });

        let analysis = { urgency: priority, department: "General", issues: [], priority: "Standard" };
        const aiResponse = completion.choices[0]?.message?.content;
        if (aiResponse) {
          try {
            analysis = JSON.parse(aiResponse);
          } catch (e) {
            console.error('Failed to parse analysis:', e);
          }
        }

        // Store the ticket (in a real app, this would go to a database)
        const ticket = {
          id: Date.now().toString(),
          subject,
          category,
          priority,
          description,
          email,
          name,
          analysis,
          status: "Open",
          createdAt: new Date().toISOString()
        };

        console.log('Support ticket created:', ticket);

        res.json({ 
          success: true,
          ticketId: ticket.id,
          message: "Support ticket created successfully. Our team will respond within 24 hours."
        });

      } catch (analysisError) {
        console.error('Support ticket analysis error:', analysisError);
        // Still create ticket even if analysis fails
        const ticket = {
          id: Date.now().toString(),
          subject,
          category,
          priority,
          description,
          email,
          name,
          status: "Open",
          createdAt: new Date().toISOString()
        };

        res.json({ 
          success: true,
          ticketId: ticket.id,
          message: "Support ticket created successfully. Our team will respond within 24 hours."
        });
      }
    } catch (error) {
      console.error("Create support ticket error:", error);
      res.status(400).json({ message: "Failed to create support ticket" });
    }
  });

  // Advanced Agent API with HACP™ technology
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId, userId, context, requestedCapabilities } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      const agentRequest = {
        message,
        sessionId: sessionId || `session_${Date.now()}`,
        userId,
        context,
        requestedCapabilities
      };

      const agentResponse = await agentService.processMessage(agentRequest);

      res.json({
        message: agentResponse.response,
        sessionId: agentResponse.sessionId,
        capabilities_used: agentResponse.capabilities_used,
        context_updates: agentResponse.context_updates,
        metadata: agentResponse.metadata,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Advanced Agent API error:", error);
      res.status(500).json({ 
        error: "Failed to process message with advanced agent",
        detail: error instanceof Error ? error.message : "Unknown error",
        hacp_enabled: true
      });
    }
  });

  // Advanced Agent API Endpoints

  // Get agent session information
  app.get("/api/agent/session/:sessionId", (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = agentService.getSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json({
        sessionId: session.sessionId,
        capabilities: session.capabilities,
        context: {
          conversation_length: session.context.conversation_history.length,
          business_context: session.context.business_context,
          expertise_domains: session.context.expertise_domains
        },
        created_at: session.createdAt,
        last_activity: session.lastActivity
      });
    } catch (error) {
      console.error("Get session error:", error);
      res.status(500).json({ error: "Failed to retrieve session" });
    }
  });

  // Update agent capabilities
  app.patch("/api/agent/session/:sessionId/capabilities", (req, res) => {
    try {
      const { sessionId } = req.params;
      const { capabilities } = req.body;

      if (!Array.isArray(capabilities)) {
        return res.status(400).json({ error: "Capabilities must be an array" });
      }

      const success = agentService.updateCapabilities(sessionId, capabilities);
      
      if (!success) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json({ 
        success: true, 
        message: "Capabilities updated successfully",
        sessionId 
      });
    } catch (error) {
      console.error("Update capabilities error:", error);
      res.status(500).json({ error: "Failed to update capabilities" });
    }
  });

  // Agent analytics endpoint
  app.get("/api/agent/analytics", (req, res) => {
    try {
      // Note: In production, this would pull from analytics database
      res.json({
        hacp_protocol: {
          status: "active",
          patent_number: "USPTO #10,290,222",
          version: "2.1.0"
        },
        capabilities: {
          total_available: 6,
          active_sessions: agentService.getSession ? agentService.getSession("demo")?.capabilities?.length || 0 : 0, // Simplified for demo
          most_used: ["contextual_awareness", "business_intelligence", "emotional_resonance"]
        },
        performance: {
          average_response_time: "1.2s",
          accuracy_score: 98.7,
          user_satisfaction: 4.9
        },
        integrations: {
          azure_openai: "connected",
          hacp_protocol: "enabled",
          enterprise_features: "active"
        }
      });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to retrieve analytics" });
    }
  });

  // Agent status and health
  app.get("/api/agent/status", (req, res) => {
    try {
      res.json({
        status: "operational",
        hacp_enabled: true,
        capabilities_online: 6,
        model: "gpt-4o",
        platform: "SaintVisionAI Cookin' Knowledge",
        version: "3.0.0",
        last_updated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Agent status error:", error);
      res.status(500).json({ error: "Failed to retrieve agent status" });
    }
  });

  // Twilio integration for phone support
  app.post("/api/twilio/call", async (req, res) => {
    try {
      const { action } = req.body;
      
      // In a production environment, this would integrate with Twilio
      // For now, we'll simulate the call initiation
      console.log('Twilio call request:', action);
      
      // TODO: Integrate with actual Twilio SDK when credentials are configured
      // const twilio = require('twilio');
      // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      // await client.calls.create({
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: userPhoneNumber,
      //   url: 'http://demo.twilio.com/docs/voice.xml'
      // });
      
      res.json({
        success: true,
        message: "Call request received. A support specialist will contact you within 5 minutes.",
        estimated_wait_time: "2-5 minutes"
      });
    } catch (error) {
      console.error('Twilio call error:', error);
      res.status(500).json({ 
        error: "Failed to initiate call",
        fallback_number: "+1-855-724-6824"
      });
    }
  });

  // OpenAI chat endpoint for help system
  app.post("/api/openai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!openai) {
        throw new Error('OpenAI not configured');
      }

      // Customize system prompt based on context
      let systemPrompt = 'You are SaintSal™, an advanced AI support agent for SaintVisionAI powered by HACP™ (Human-AI Connection Protocol). You provide helpful, accurate support with a professional yet warm demeanor.';
      
      if (context === 'help_support') {
        systemPrompt += ' You specialize in helping users with SaintVisionAI platform questions, HACP™ technology, billing, technical issues, and general support. Always be helpful and direct users to appropriate resources when needed.';
      }

      // Use the configured model
      const modelToUse = "gpt-4o";
      
      const completion = await openai.chat.completions.create({
        model: modelToUse, // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      
      res.json({
        response: response || "I apologize, but I'm having trouble processing your request. Please try again or contact our support team directly at support@saintvisionai.com",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("OpenAI chat error:", error);
      res.status(500).json({ 
        error: "Failed to process message",
        fallback_message: "I'm experiencing technical difficulties. Please contact our support team directly at support@saintvisionai.com or try again in a moment."
      });
    }
  });

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      hacp_protocol: "active",
      agent_service: "operational"
    });
  });

  // Azure Speech Services Integration
  app.post("/api/speech/start-recognition", async (req, res) => {
    try {
      // Check if Azure Speech Services is configured
      if (!process.env.AZURE_SPEECH_API_KEY) {
        return res.status(503).json({ 
          error: "Azure Speech Services not configured",
          fallback: "browser_speech"
        });
      }

      console.log('Azure Speech Services available');
      
      res.json({ 
        success: true, 
        message: "Azure Speech Services available",
        service: "azure_speech",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Azure Speech error:", error);
      res.status(500).json({ 
        error: "Failed to initialize Azure Speech Services",
        fallback: "browser_speech"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}