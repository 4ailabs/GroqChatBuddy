import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMessages, sendMessage, clearMessages } from '@/lib/chat-service';
import ChatHeader from '@/components/ChatHeader';
import MessageContainer from '@/components/MessageContainer';
import ChatInput from '@/components/ChatInput';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch messages query
  const { data: messages = [], isError } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      console.error('Error sending message:', error);
    },
  });
  
  // Clear messages mutation
  const clearMessagesMutation = useMutation({
    mutationFn: clearMessages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: 'Success',
        description: 'Chat history cleared',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to clear chat history',
        variant: 'destructive',
      });
    },
  });
  
  // Show error if messages couldn't be fetched
  useEffect(() => {
    if (isError) {
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    }
  }, [isError, toast]);
  
  // Handler for sending messages
  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      await sendMessageMutation.mutateAsync(content);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler for clearing chat
  const handleClearChat = async () => {
    await clearMessagesMutation.mutateAsync();
  };
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader onClearChat={handleClearChat} />
      <MessageContainer messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      <Toaster />
    </div>
  );
}