import { storage } from '../server/storage.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET request - fetch all messages
    if (req.method === 'GET') {
      const messages = await storage.getMessages();
      return res.status(200).json(messages);
    }
    
    // POST request - add a new message
    if (req.method === 'POST') {
      const { role, content } = req.body;
      
      if (!role || !content) {
        return res.status(400).json({ 
          message: "Invalid message format. Both 'role' and 'content' are required." 
        });
      }
      
      const message = await storage.addMessage({ role, content });
      return res.status(201).json(message);
    }
    
    // DELETE request - clear all messages
    if (req.method === 'DELETE') {
      await storage.clearMessages();
      return res.status(200).json({ message: "Messages cleared" });
    }
    
    // If not one of the above methods
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('Error handling messages request:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}