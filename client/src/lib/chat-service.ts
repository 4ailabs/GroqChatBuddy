import axios from 'axios';
import { type Message } from '@/types/chat';

// Function to fetch all messages
export async function fetchMessages(): Promise<Message[]> {
  try {
    const response = await axios.get('/api/messages');
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

// Function to send a message to the API
export async function sendMessage(content: string): Promise<Message> {
  try {
    // Get existing messages
    const messages = await fetchMessages();
    
    // Format messages for Groq API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add the new user message
    formattedMessages.push({
      role: 'user',
      content
    });
    
    // Send to server
    const response = await axios.post('/api/chat', {
      messages: formattedMessages
    });
    
    return response.data.message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Function to clear chat history
export async function clearMessages(): Promise<void> {
  try {
    await axios.delete('/api/messages');
  } catch (error) {
    console.error('Error clearing messages:', error);
    throw error;
  }
}