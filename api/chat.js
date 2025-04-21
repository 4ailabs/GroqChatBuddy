import axios from 'axios';
import { storage } from '../server/storage.js';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GROQ_API_KEY is not configured' });
    }

    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid request format. Messages array is required.' });
    }

    // Save user message if it exists
    const userMessage = messages[messages.length - 1];
    if (userMessage && userMessage.role === 'user') {
      await storage.addMessage({
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
        messages: messages,
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
    await storage.addMessage({
      role: assistantMessage.role,
      content: assistantMessage.content,
    });

    // Return the response
    return res.status(200).json({ message: assistantMessage });
    
  } catch (error) {
    console.error('Error calling Groq API:', error);
    
    // Return appropriate error response
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status || 500;
      const message = error.response.data?.error?.message || 'Error from Groq API';
      return res.status(status).json({ message });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({ message: 'No response from Groq API' });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({ message: error.message || 'Error calling Groq API' });
    }
  }
}