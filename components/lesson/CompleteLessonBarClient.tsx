"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function CompleteLessonBarClient() {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  return (
    <div className="sticky bottom-0 inset-x-0 bg-white border-t mt-6">
      <div className="mx-auto max-w-screen-2xl flex items-center justify-between gap-4 p-4">
        <span className="text-sm text-muted-foreground">
          {isCompleted 
            ? 'Aula concluída com sucesso! ✓' 
            : 'Marque como concluída para avançar na trilha.'
          }
        </span>
        <Button 
          className={`${
            isCompleted 
              ? 'bg-emerald-600 text-white cursor-not-allowed' 
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }`}
          onClick={handleComplete}
          disabled={isCompleted}
        >
          {isCompleted ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Concluída
            </>
          ) : (
            'Completar lição'
          )}
        </Button>
      </div>
    </div>
  );
} 