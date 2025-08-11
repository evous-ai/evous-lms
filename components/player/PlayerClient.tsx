'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Volume2, Maximize, Pause } from "lucide-react"

interface PlayerClientProps {
  titulo: string
  duracao: string
  slug: string
  conteudoId: string
}

export function PlayerClient({ titulo, duracao }: PlayerClientProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // Aqui seria implementada a lógica real do player
    if (!isPlaying) {
      // Simular progresso
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1
          const newProgress = (newTime / (parseInt(duracao.split(':')[0]) * 60 + parseInt(duracao.split(':')[1]))) * 100
          setProgress(newProgress)
          if (newProgress >= 100) {
            clearInterval(interval)
            setIsPlaying(false)
          }
          return newTime
        })
      }, 1000)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value)
    setProgress(newProgress)
    // Aqui seria implementada a lógica de seek do player
  }

  return (
    <Card className="bg-white border rounded-2xl shadow-none">
      <CardContent className="p-0">
        <div className="aspect-video bg-slate-200 flex items-center justify-center">
          <div className="text-center">
            {isPlaying ? (
              <Pause className="h-16 w-16 text-slate-400 mx-auto mb-2" />
            ) : (
              <Play className="h-16 w-16 text-slate-400 mx-auto mb-2" />
            )}
            <p className="text-slate-500">Player de vídeo</p>
            <p className="text-sm text-slate-400 mt-1">{titulo}</p>
          </div>
        </div>
        
        {/* Controles do player */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Progresso</span>
            <span className="text-muted-foreground">
              {formatTime(currentTime)} / {duracao} · {Math.round(progress)}%
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #059669 0%, #059669 ${progress}%, #e2e8f0 ${progress}%, #e2e8f0 100%)`
            }}
          />
          
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button size="icon" variant="outline" className="rounded-full">
              <Volume2 className="h-4 w-4" />
            </Button>
            
            <Button size="icon" variant="outline" className="rounded-full">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 