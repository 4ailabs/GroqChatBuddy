// Serverless function for Vercel
import axios from 'axios';

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

// Initialize with welcome message if empty
async function initializeIfEmpty() {
  if (messages.length === 0) {
    await addMessage({
      role: "assistant",
      content: "Hello! I'm your Groq-powered assistant. How can I help you today?"
    });
  }
}

// Main handler
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await initializeIfEmpty();
    
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GROQ_API_KEY is not configured' });
    }

    const { messages: requestMessages } = req.body;
    
    if (!requestMessages || !Array.isArray(requestMessages)) {
      return res.status(400).json({ message: 'Invalid request format. Messages array is required.' });
    }

    // Save user message if it exists
    const userMessage = requestMessages[requestMessages.length - 1];
    if (userMessage && userMessage.role === 'user') {
      await addMessage({
        role: userMessage.role,
        content: userMessage.content,
      });
    }

    // Default model
    const model = req.body.model || 'llama3-70b-8192';

    // Make request to Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: model,
        messages: requestMessages,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Get assistant response
    const assistantMessage = response.data.choices[0].message;

    // Save the assistant message
    await addMessage({
      role: assistantMessage.role,
      content: assistantMessage.content,
    });

    // Return the response
    return res.status(200).json({ message: assistantMessage });
    
  } catch (error) {
    console.error('Error calling Groq API:', error);
    
    // Return appropriate error response
    if (error.response) {
      const status = error.response.status || 500;
      const message = error.response.data?.error?.message || 'Error from Groq API';
      return res.status(status).json({ message });
    } else if (error.request) {
      return res.status(503).json({ message: 'No response from Groq API' });
    } else {
      return res.status(500).json({ message: error.message || 'Error calling Groq API' });
    }
  }
}