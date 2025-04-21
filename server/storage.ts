import { messages, type Message, type InsertMessage } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getMessages(): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
  clearMessages(): Promise<void>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  currentId: number;

  constructor() {
    this.messages = new Map();
    this.currentId = 1;
    
    // Add initial welcome message
    this.addMessage({
      role: "assistant",
      content: "Hello! I'm your Groq-powered assistant. How can I help you today?"
    });
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values())
      .sort((a, b) => a.id - b.id);
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const timestamp = new Date();
    const message: Message = { ...insertMessage, id, timestamp };
    this.messages.set(id, message);
    return message;
  }

  async clearMessages(): Promise<void> {
    this.messages.clear();
    this.currentId = 1;
    
    // Add welcome message back after clearing
    await this.addMessage({
      role: "assistant",
      content: "Hello! I'm your Groq-powered assistant. How can I help you today?"
    });
  }
}

export const storage = new MemStorage();