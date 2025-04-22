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
        <div>
          <h1 className="text-xl font-semibold">NutriGenAI</h1>
          <p className="text-xs text-muted-foreground">Asistente de Nutrigenómica</p>
        </div>
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
              {!isMobile && "Limpiar Chat"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Limpiar historial de chat?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará todos los mensajes de la conversación actual.
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onClearChat}>
                Limpiar
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
              <AlertDialogTitle>Acerca de NutriGenAI</AlertDialogTitle>
              <AlertDialogDescription>
                <p className="mb-2">
                  NutriGenAI es un asistente especializado en nutrigenómica, suplementos nutricionales y alimentos funcionales.
                </p>
                <p className="mb-2">
                  Proporciona información basada en la ciencia sobre cómo los alimentos interactúan con tu genética y recomendaciones personalizadas.
                </p>
                <p className="mb-2">
                  Recuerda: Este asistente proporciona información general y no sustituye el consejo médico profesional.
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  Desarrollado con Groq y tecnologías avanzadas de IA
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Cerrar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}