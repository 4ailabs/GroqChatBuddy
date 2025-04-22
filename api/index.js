// Vercel API router - simplified version
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // This is just a root handler to confirm the API is working
  return res.status(200).json({ 
    status: 'ok',
    message: 'GroqChatBuddy API is running. Use /api/chat or /api/messages endpoints.',
    apiKey: process.env.GROQ_API_KEY ? 'configured' : 'missing'
  });
}