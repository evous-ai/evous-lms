"use client"


import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

interface VideoGenerationModalProps {
  onConfirm: () => void;
  onClose: () => void;
  isGenerating?: boolean;
}

export function VideoGenerationModal({ 
  onConfirm, 
  onClose, 
  isGenerating = false 
}: VideoGenerationModalProps) {
  return (
    <div className="w-[400px] p-6 bg-background border border-border rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="text-center">
          {isGenerating ? (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          )}
          
          <h3 className="font-semibold text-lg mb-2">
            {isGenerating ? "Gerando vídeo..." : "Confirmar geração"}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            {isGenerating 
              ? "Aguarde enquanto processamos seu vídeo. Isso pode levar alguns minutos."
              : "Gerar este vídeo consumirá 3 créditos. Deseja continuar?"
            }
          </p>
        </div>

        {!isGenerating && (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onConfirm} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Confirmar geração
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 