"use client"

import { BookOpen } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function NotesPanel() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-orange-600" />
          <h3 className="font-semibold">Minhas Notas</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Anotações pessoais</p>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <Textarea
            placeholder="Digite suas anotações sobre esta aula..."
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              Salvar Notas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 