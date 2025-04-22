// Serverless function for Vercel
// In-memory storage (will reset on cold starts)
let messages = [];
let currentId = 1;

// Helper functions for storage
async function getMessages() {
  return [...messages].sort((a, b) => a.id - b.id);
}

async function addMessage(message) {
  const id = currentId++;
  const timestamp = new Date();
  const newMessage = { ...message, id, timestamp };
  messages.push(newMessage);
  return newMessage;
}

async function clearMessages() {
  messages = [];
  currentId = 1;
  await addMessage({
    role: "assistant",
    content: "Hello! I'm your Groq-powered assistant. How can I help you today?"
  });
}

// Initialize with welcome message if empty
async function initializeIfEmpty() {
  if (messages.length === 0) {
    await addMessage({
      role: "assistant",
      content: "Hello! I'm your Groq-powered assistant. How can I help you today?"
    });
  }
}

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
    await initializeIfEmpty();
    
    // GET request - fetch all messages
    if (req.method === 'GET') {
      const allMessages = await getMessages();
      return res.status(200).json(allMessages);
    }
    
    // POST request - add a new message
    if (req.method === 'POST') {
      const { role, content } = req.body;
      
      if (!role || !content) {
        return res.status(400).json({ 
          message: "Invalid message format. Both 'role' and 'content' are required." 
        });
      }
      
      const message = await addMessage({ role, content });
      return res.status(201).json(message);
    }
    
    // DELETE request - clear all messages
    if (req.method === 'DELETE') {
      await clearMessages();
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