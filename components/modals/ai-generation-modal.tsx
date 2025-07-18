"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";

interface AIGenerationModalProps {
  onGenerate: (prompt: string) => void;
  onClose: () => void;
  maxAssets?: number;
  currentAssetsCount?: number;
}

export function AIGenerationModal({ 
  onGenerate, 
  onClose, 
  maxAssets = 2, 
  currentAssetsCount = 0 
}: AIGenerationModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simular geração com IA
    setTimeout(() => {
      onGenerate(prompt);
      setIsGenerating(false);
      onClose();
    }, 2000);
  };

  const isAtLimit = currentAssetsCount >= maxAssets;

  return (
    <div className="w-[450px] p-4 bg-background border border-border rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Gerar com IA</h3>
        </div>

        {isAtLimit ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">
              Limite de {maxAssets} ativo{maxAssets > 1 ? 's' : ''} atingido
            </div>
            <div className="text-sm text-muted-foreground">
              Remova um ativo existente para gerar um novo
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Descreva a imagem que você gostaria de gerar com IA
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Prompt de geração</label>
                <Input
                  placeholder="Ex: uma pessoa feliz trabalhando em um escritório moderno"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Sugestões de prompts</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• &ldquo;Uma equipe colaborando em um projeto&rdquo;</div>
                  <div>• &ldquo;Gráficos de crescimento em um dashboard&rdquo;</div>
                  <div>• &ldquo;Pessoa usando tecnologia moderna&rdquo;</div>
                  <div>• &ldquo;Conceito de inovação e criatividade&rdquo;</div>
                </div>
              </div>

              {isGenerating && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Gerando imagem com IA...
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose} disabled={isGenerating}>
                Cancelar
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar com IA
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 