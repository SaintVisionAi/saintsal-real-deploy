import { users, chatSessions, chatMessages, supportTickets, type User, type InsertUser, type UpsertUser, type ChatSession, type InsertChatSession, type ChatMessage, type InsertChatMessage, type SupportTicket, type InsertSupportTicket } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations - Enhanced for Replit Auth and admin features
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  verifyUserEmail(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUnverifiedUsers(): Promise<User[]>;
  setUserAsAdmin(email: string): Promise<User | undefined>;
  
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessions(userId: string): Promise<ChatSession[]>;
  getChatSessionsByUserId(userId: string): Promise<ChatSession[]>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  getChatMessagesBySessionId(sessionId: string): Promise<ChatMessage[]>;
  
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getSupportTickets(userId?: string): Promise<SupportTicket[]>;
  getSupportTicketsByUserId(userId: string): Promise<SupportTicket[]>;
  updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check if user should be admin based on email (replace with your admin email)
    const adminEmails = [process.env.ADMIN_EMAIL || 'admin@saintvisionai.com'];
    const isAdmin = adminEmails.includes(insertUser.email);
    
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, isAdmin })
      .returning();
    return user;
  }

  // Upsert user for Replit Auth integration
  async upsertUser(userData: UpsertUser): Promise<User> {
    // Check if user should be admin based on email
    const adminEmails = [process.env.ADMIN_EMAIL || 'admin@saintvisionai.com'];
    const isAdmin = adminEmails.includes(userData.email || '');
    
    const userValues = {
      ...userData,
      emailVerified: true,
      isAdmin,
      name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'User',
      phone: '' // Default phone for Replit Auth users
    };
    
    const [user] = await db
      .insert(users)
      .values(userValues)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
          isAdmin, // Update admin status on each login
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async verifyUserEmail(id: string): Promise<User | undefined> {
    return this.updateUser(id, { emailVerified: true, verificationToken: null });
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUnverifiedUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.emailVerified, false))
      .orderBy(desc(users.createdAt));
  }

  async setUserAsAdmin(email: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isAdmin: true, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning();
    return user || undefined;
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const [session] = await db
      .insert(chatSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getChatSessions(userId: string): Promise<ChatSession[]> {
    return await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.createdAt));
  }

  async getChatSessionsByUserId(userId: string): Promise<ChatSession[]> {
    return this.getChatSessions(userId);
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, sessionId));
    return session || undefined;
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  async getChatMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    return this.getChatMessages(sessionId);
  }

  async createSupportTicket(insertTicket: InsertSupportTicket): Promise<SupportTicket> {
    const [ticket] = await db
      .insert(supportTickets)
      .values(insertTicket)
      .returning();
    return ticket;
  }

  async getSupportTickets(userId?: string): Promise<SupportTicket[]> {
    if (userId) {
      return await db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.userId, userId))
        .orderBy(desc(supportTickets.createdAt));
    }
    return await db
      .select()
      .from(supportTickets)
      .orderBy(desc(supportTickets.createdAt));
  }

  async getSupportTicketsByUserId(userId: string): Promise<SupportTicket[]> {
    return this.getSupportTickets(userId);
  }

  async updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | undefined> {
    const [ticket] = await db
      .update(supportTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return ticket || undefined;
  }
}

export const storage = new DatabaseStorage();
