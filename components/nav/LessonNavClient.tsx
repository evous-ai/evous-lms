'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface LessonNavClientProps {
  prevId: string
  nextId: string
  slug: string
  onNavigate?: (id: string) => void
}

export function LessonNavClient({ prevId, nextId, slug, onNavigate }: LessonNavClientProps) {
  const router = useRouter()

  const navegarPara = (id: string) => {
    if (onNavigate) {
      onNavigate(id)
    } else {
      router.push(`/trilha/${slug}/${id}`)
    }
  }

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full"
              onClick={() => navegarPara(prevId)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Aula anterior</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full"
              onClick={() => navegarPara(nextId)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Próxima aula</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
} 