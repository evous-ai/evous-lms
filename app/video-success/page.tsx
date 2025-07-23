"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VideoSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/video-preview");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center space-y-6">
          {/* Ícone de sucesso */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-teal-700" />
            </div>
          </div>

          {/* Título e mensagem */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Vídeo gerado com sucesso!
            </h1>
            <p className="text-muted-foreground">
              Seu vídeo foi processado e está pronto para download.
            </p>
          </div>

          {/* Informações do vídeo */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duração:</span>
              <span className="font-medium">2:34</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Qualidade:</span>
              <span className="font-medium">1080p</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tamanho:</span>
              <span className="font-medium">15.2 MB</span>
            </div>
          </div>

          {/* Informações do vídeo */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duração:</span>
              <span className="font-medium">2:34</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Qualidade:</span>
              <span className="font-medium">1080p</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tamanho:</span>
              <span className="font-medium">15.2 MB</span>
            </div>
          </div>

          {/* Redirecionamento */}
          <div className="text-sm text-muted-foreground">
            Você será redirecionado em {countdown} segundo{countdown !== 1 ? 's' : ''}...
          </div>

          {/* Botão voltar */}
          <Button 
            variant="ghost" 
            onClick={() => router.push("/video-preview")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao editor
          </Button>
        </div>
      </div>
    </div>
  );
} 