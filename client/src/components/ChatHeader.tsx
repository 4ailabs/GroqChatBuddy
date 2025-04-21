import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Info } from "lucide-react";
import { useMobile } from '@/hooks/use-mobile';

interface ChatHeaderProps {
  onClearChat: () => void;
}

export default function ChatHeader({ onClearChat }: ChatHeaderProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const isMobile = useMobile();
  
  return (
    <header className="flex items-center justify-between border-b border-border p-4 bg-card">
      <div className="flex items-center space-x-2">
        <img 
          src="https://groq.com/wp-content/themes/website_v2/images/logo.svg" 
          alt="Groq Logo" 
          className="w-8 h-8"
        />
        <h1 className="text-xl font-semibold">Groq Chat</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              size={isMobile ? "icon" : "default"}
              className="border-border"
            >
              <Trash2 className={isMobile ? "h-4 w-4" : "h-4 w-4 mr-2"} />
              {!isMobile && "Clear Chat"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all messages from the current conversation.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClearChat}>
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <AlertDialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>About Groq Chat</AlertDialogTitle>
              <AlertDialogDescription>
                <p className="mb-2">
                  This is a simple chat interface powered by Groq's LLM API.
                </p>
                <p className="mb-2">
                  Groq provides ultra-fast inference for large language models.
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  Built with React, Express and Groq API
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}