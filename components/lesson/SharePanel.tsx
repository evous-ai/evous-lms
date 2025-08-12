"use client"

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SharePanel() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Erro ao copiar link');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold">Compartilhar</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Compartilhe esta aula</p>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Link da aula:</p>
            <div className="flex gap-2">
              <Input value={window.location.href} readOnly className="flex-1" />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopyLink}
                className="min-w-fit"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Compartilhar via:</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className="flex-1"
              >
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent('Confira esta aula: ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className="flex-1"
              >
                <a 
                  href={`mailto:?subject=${encodeURIComponent('Trajetória Vibra - Introdução à meditação para iniciantes')}&body=${encodeURIComponent('Confira esta aula: ' + window.location.href)}`}
                >
                  Email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 