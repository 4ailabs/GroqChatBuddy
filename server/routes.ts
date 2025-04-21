import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema, insertMessageSchema } from "@shared/schema";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all messages
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Add a new message
  app.post("/api/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid message format", 
          errors: result.error.errors 
        });
      }
      
      const message = await storage.addMessage(result.data);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to add message" });
    }
  });

  // Clear all messages
  app.delete("/api/messages", async (req, res) => {
    try {
      await storage.clearMessages();
      res.status(200).json({ message: "Messages cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear messages" });
    }
  });

  // Send message to Groq API and get a response
  app.post("/api/chat", async (req, res) => {
    try {
      const result = chatRequestSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid request format", 
          errors: result.error.errors 
        });
      }

      const apiKey = process.env.GROQ_API_KEY || "";
      if (!apiKey) {
        return res.status(500).json({ message: "GROQ_API_KEY is not configured" });
      }

      // Save the user message to storage
      const userMessage = result.data.messages[result.data.messages.length - 1];
      if (userMessage && userMessage.role === "user") {
        await storage.addMessage({
          role: userMessage.role,
          content: userMessage.content,
        });
      }

      // Set default model if not provided
      const model = result.data.model || "llama3-70b-8192";

      // Make request to Groq API
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: model,
          messages: result.data.messages,
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Get assistant response
      const assistantMessage = response.data.choices[0].message;

      // Save the assistant message to storage
      await storage.addMessage({
        role: assistantMessage.role,
        content: assistantMessage.content,
      });

      // Return the complete response
      res.json({ message: assistantMessage });
    } catch (error: any) {
      console.error("Error calling Groq API:", error);
      
      // Return appropriate error response
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error.response.status || 500;
        const message = error.response.data?.error?.message || "Error from Groq API";
        res.status(status).json({ message });
      } else if (error.request) {
        // The request was made but no response was received
        res.status(503).json({ message: "No response from Groq API" });
      } else {
        // Something happened in setting up the request that triggered an Error
        res.status(500).json({ message: error.message || "Error calling Groq API" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}