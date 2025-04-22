// Simple in-memory storage for serverless
let messages = [];
let currentId = 1;

// Sistema de instrucciones para especialización
const SYSTEM_INSTRUCTIONS = {
  role: "system",
  content: `Eres un asistente especializado en nutrigenómica, suplementos nutricionales, vitaminas y alimentos funcionales. 
  
Tu objetivo es proporcionar información actualizada y basada en evidencia sobre:
- Cómo los alimentos afectan la expresión genética (nutrigenómica)
- Suplementos nutricionales y su eficacia según estudios científicos
- Alimentos funcionales y sus beneficios para la salud
- Recomendaciones personalizadas basadas en perfiles genéticos
- Interacciones entre nutrientes, medicamentos y genética
- Vitaminas, minerales y su impacto en las vías metabólicas
- Últimos avances en nutrición personalizada y medicina de precisión

Usa un enfoque científico al responder, citando estudios cuando sea relevante, pero manteniendo un lenguaje accesible. Aclara siempre que tus respuestas son informativas y no reemplazan el consejo médico personalizado. Cuando no tengas información suficiente o actualizada sobre un tema, sé transparente al respecto.`
};

// Add initial welcome message
const welcomeMessage = {
  id: currentId++,
  role: "assistant",
  content: "¡Hola! Soy tu asistente especializado en nutrigenómica, suplementos y alimentos funcionales. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre interacciones entre alimentos y genes, recomendaciones de suplementos basadas en evidencia, o información sobre alimentos funcionales específicos.",
  timestamp: new Date().toISOString()
};
messages.push(welcomeMessage);

// Standard handler for vercel serverless functions
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Route handling based on path and method
  const path = req.url;
  
  try {
    // API Routes for messages
    if (path.includes('/api/messages')) {
      if (req.method === 'GET') {
        return res.status(200).json(messages);
      }
      
      if (req.method === 'POST') {
        const { role, content } = req.body;
        
        if (!role || !content) {
          return res.status(400).json({ message: "Invalid message format" });
        }
        
        const message = {
          id: currentId++,
          role,
          content,
          timestamp: new Date().toISOString()
        };
        
        messages.push(message);
        return res.status(201).json(message);
      }
      
      if (req.method === 'DELETE') {
        messages = [];
        currentId = 1;
        
        // Add welcome message back
        messages.push({
          id: currentId++,
          role: "assistant",
          content: "¡Hola! Soy tu asistente especializado en nutrigenómica, suplementos y alimentos funcionales. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre interacciones entre alimentos y genes, recomendaciones de suplementos basadas en evidencia, o información sobre alimentos funcionales específicos.",
          timestamp: new Date().toISOString()
        });
        
        return res.status(200).json({ message: "Messages cleared" });
      }
    }
    
    // API Route for chat
    if (path.includes('/api/chat') && req.method === 'POST') {
      const { messages: chatMessages, model = 'llama3-70b-8192' } = req.body;
      
      if (!chatMessages || !Array.isArray(chatMessages)) {
        return res.status(400).json({ message: "Invalid request format" });
      }
      
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "GROQ_API_KEY is not configured" });
      }
      
      // Save user message
      const userMessage = chatMessages[chatMessages.length - 1];
      if (userMessage && userMessage.role === 'user') {
        messages.push({
          id: currentId++,
          role: userMessage.role,
          content: userMessage.content,
          timestamp: new Date().toISOString()
        });
      }
      
      // Preparar mensajes para Groq API con las instrucciones del sistema
      const messagesWithSystem = [SYSTEM_INSTRUCTIONS, ...chatMessages];
      
      // Call Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: messagesWithSystem
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json({
          message: error.error?.message || "Error from Groq API"
        });
      }
      
      const data = await response.json();
      const assistantMessage = data.choices[0].message;
      
      // Save assistant message
      messages.push({
        id: currentId++,
        role: assistantMessage.role,
        content: assistantMessage.content,
        timestamp: new Date().toISOString()
      });
      
      return res.status(200).json({ message: assistantMessage });
    }
    
    // Default response for other routes
    return res.status(404).json({ message: "Not found" });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message
    });
  }
}