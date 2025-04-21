// Simple in-memory storage implementation for Vercel serverless functions
// Note: This will reset on each deployment or function cold start

// Singleton storage instance to maintain state across serverless function invocations
let instance = null;

class MemStorage {
  constructor() {
    if (instance) {
      return instance;
    }
    
    this.messages = new Map();
    this.currentId = 1;
    
    // Add initial welcome message
    this.addMessage({
      role: "assistant",
      content: "Hello! I'm your Groq-powered assistant. How can I help you today?"
    });
    
    instance = this;
  }

  async getMessages() {
    return Array.from(this.messages.values())
      .sort((a, b) => a.id - b.id);
  }

  async addMessage(insertMessage) {
    const id = this.currentId++;
    const timestamp = new Date();
    const message = { ...insertMessage, id, timestamp };
    this.messages.set(id, message);
    return message;
  }

  async clearMessages() {
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