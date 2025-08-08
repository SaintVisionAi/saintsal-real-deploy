import OpenAI from "openai";
import type { SupportTicket } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

class OpenAIService {
  async generateResponse(userMessage: string): Promise<{ content: string; model: string }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are SaintSal™, an AI assistant powered by SaintVisionAI's patented HACP™ technology (U.S. Patent 10,290,222). You are knowledgeable about:
            
            - HACP™ (Human-AI Connection Protocol) technology and its applications
            - SaintVisionAI's enterprise AI solutions and services
            - Patent-protected adaptive AI systems
            - Enterprise security and compliance (SOC 2, GDPR, CCPA)
            - Business AI integration and optimization
            - Faith-guided innovation principles
            
            Respond professionally, helpfully, and with expertise about SaintVisionAI's technology and services. Always maintain a premium, enterprise-focused tone while being accessible and helpful.`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
      });

      return {
        content: response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.",
        model: "gpt-4o"
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to generate AI response");
    }
  }

  async generateSupportResponse(ticket: SupportTicket): Promise<{ suggestedResponse?: string; priority?: string; category?: string }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an AI support assistant for SaintVisionAI, analyzing support tickets to provide helpful responses and categorization.
            
            Analyze the support ticket and provide:
            1. A helpful suggested response addressing their concern
            2. Appropriate priority level (low, medium, high, urgent)
            3. Category classification
            
            Focus on SaintVisionAI's offerings: HACP™ technology, enterprise AI solutions, patent-protected systems, and premium support.
            
            Respond with JSON in this format: { "suggestedResponse": "...", "priority": "medium", "category": "technical" }`
          },
          {
            role: "user",
            content: `Support Ticket:
            Subject: ${ticket.subject}
            Message: ${ticket.message}
            Current Priority: ${ticket.priority}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        suggestedResponse: result.suggestedResponse,
        priority: result.priority,
        category: result.category
      };
    } catch (error) {
      console.error("OpenAI support analysis error:", error);
      return {};
    }
  }

  async generateHelpResponse(question: string): Promise<{ answer: string; category: string; relatedTopics: string[] }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are SaintVisionAI's help desk AI, powered by the same HACP™ technology that drives our enterprise solutions.
            
            Provide comprehensive, helpful answers about:
            - Getting started with SaintVisionAI platforms
            - HACP™ technology and patent information
            - Enterprise features and integrations
            - Billing, pricing, and account management
            - Security, privacy, and compliance
            - API documentation and developer resources
            - Troubleshooting and technical support
            
            Always provide accurate, detailed responses with a professional, premium tone. Include related topics that might be helpful.
            
            Respond with JSON: { "answer": "detailed response", "category": "category name", "relatedTopics": ["topic1", "topic2", "topic3"] }`
          },
          {
            role: "user",
            content: question
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        answer: result.answer || "I apologize, but I couldn't find a specific answer to your question. Please contact our support team for personalized assistance.",
        category: result.category || "general",
        relatedTopics: result.relatedTopics || []
      };
    } catch (error) {
      console.error("OpenAI help response error:", error);
      return {
        answer: "I apologize, but I'm experiencing technical difficulties. Please contact our support team directly for immediate assistance.",
        category: "technical-error",
        relatedTopics: []
      };
    }
  }
}

export const openaiService = new OpenAIService();
