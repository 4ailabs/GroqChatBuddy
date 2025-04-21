export interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string | Date;
}

export interface SendMessageRequest {
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
  model?: string;
}

export interface SendMessageResponse {
  message: {
    role: string;
    content: string;
  };
}