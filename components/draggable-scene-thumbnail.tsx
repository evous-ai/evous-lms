"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import LayoutThumbnail from "@/components/layout-thumbnail"

interface DraggableSceneThumbnailProps {
  scene: {
    id: string
    layoutId: string
  }
  index: number
  isCurrent: boolean
  isPlaying: boolean
  progress: number
  onSelect: () => void
  onDelete: (e: React.MouseEvent) => void
}

export function DraggableSceneThumbnail({
  scene,
  index,
  isCurrent,
  isPlaying,
  progress,
  onSelect,
  onDelete
}: DraggableSceneThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative w-32 h-20 bg-muted rounded-lg border-2 shadow-sm cursor-grab active:cursor-grabbing overflow-hidden flex-shrink-0 ${
        isCurrent ? 'border-primary' : 'border-transparent hover:border-primary/50'
      } ${isDragging ? 'shadow-lg scale-105' : ''}`}
      onClick={onSelect}
    >
      <div className="w-full h-full pointer-events-none relative">
        <LayoutThumbnail layoutId={scene.layoutId} />
        {/* Barra de progresso inferior simples */}
        {isPlaying && isCurrent && (
          <div
            className="absolute left-0 bottom-0 h-[3px] bg-green-600 rounded-full transition-all duration-100"
            style={{ width: `${progress * 100}%`, opacity: 0.85 }}
          />
        )}
      </div>
      
      {/* Badge com número da cena */}
      <div className="absolute bottom-1 left-1">
        <Badge variant="secondary" className="text-xs bg-white/80 backdrop-blur-sm text-black">
          Cena {index + 1}
        </Badge>
      </div>
      
      {/* Botão de deletar */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" 
        onClick={onDelete}
      >
        <Trash2 className="w-3 h-3" />
      </Button>
      
      {/* Indicador de arrastável */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
        <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
          <div className="w-3 h-3 bg-muted-foreground/60 rounded-sm"></div>
        </div>
      </div>
    </div>
  )
} 