'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface LessonFooterClientProps {
  onComplete?: () => void
  isCompleted?: boolean
}

export function LessonFooterClient({ onComplete, isCompleted = false }: LessonFooterClientProps) {
  const [localCompleted, setLocalCompleted] = useState(isCompleted)

  const handleComplete = () => {
    if (!localCompleted) {
      setLocalCompleted(true)
      if (onComplete) {
        onComplete()
      }
      // Aqui seria implementada a lógica de marcar como concluída
      console.log('Aula completada')
    }
  }

  return (
    <div className="sticky bottom-0 inset-x-0 bg-white border-t">
      <div className="p-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            {localCompleted 
              ? 'Aula concluída com sucesso!' 
              : 'Marque como concluída para avançar na trilha'
            }
          </p>
          <Button 
            onClick={handleComplete}
            disabled={localCompleted}
            className={`${
              localCompleted 
                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {localCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Concluída ✓
              </>
            ) : (
              'Completar aula'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 