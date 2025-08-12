"use client"

import { Paperclip } from 'lucide-react';

export function AttachmentsPanel() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Paperclip className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">Anexos</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Materiais complementares</p>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-4">
        <div className="text-center text-muted-foreground">
          <Paperclip className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum anexo disponível para esta aula.</p>
          <p className="text-sm mt-2">Os materiais complementares aparecerão aqui quando disponíveis.</p>
        </div>
      </div>
    </div>
  );
} 