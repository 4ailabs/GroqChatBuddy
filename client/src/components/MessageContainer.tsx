import { useRef, useEffect } from 'react';
import { type Message } from '@/types/chat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageContainerProps {
  messages: Message[];
}

export default function MessageContainer({ messages }: MessageContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // If no messages yet, show welcome
  if (messages.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 bg-background"
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center h-full text-center">
          <Bot className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">Welcome to Groq Chat</h2>
          <p className="text-muted-foreground mt-2">
            Start a conversation with the Groq-powered assistant
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 bg-background"
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 message-bubble",
              message.role === "user" ? "justify-end" : ""
            )}
          >
            {message.role !== "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[85%]",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="message-content whitespace-pre-wrap break-words">
                {message.content}
              </div>
              <div className="mt-1 text-xs opacity-70 text-right">
                {formatDate(message.timestamp)}
              </div>
            </div>
            
            {message.role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}