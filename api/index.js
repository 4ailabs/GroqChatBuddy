// Vercel serverless function entry point
import express from 'express';
import { registerRoutes } from '../server/routes.js';
import { storage } from '../server/storage.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS headers for Vercel deployment
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS method for preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Simplified routes just for the API
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await storage.getMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = await storage.addMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to add message" });
  }
});

app.delete('/api/messages', async (req, res) => {
  try {
    await storage.clearMessages();
    res.status(200).json({ message: "Messages cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear messages" });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    // For Vercel functions, we'll need to implement this handler
    // that calls the Groq API directly, similar to what's in routes.ts
    // This is a simplified version
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "GROQ_API_KEY is not configured" });
    }

    // The simplified handler would process the chat request here
    // This would need to be filled in with actual Groq API integration
    
    // Placeholder response
    res.json({
      message: {
        role: "assistant",
        content: "This is a placeholder response. The Groq API integration needs to be implemented in the serverless function."
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing chat request" });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('API error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

export default app;