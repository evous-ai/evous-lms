"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AudioPlayButtonProps {
  text: string
  className?: string
  disabled?: boolean
}

export function AudioPlayButton({ 
  text, 
  className = "",
  disabled = false 
}: AudioPlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Verificar se o navegador suporta speech synthesis
    setIsSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window)
  }, [])

  useEffect(() => {
    if (!isSupported) return

    // Configurar speech synthesis
    speechRef.current = new SpeechSynthesisUtterance()
    speechRef.current.lang = 'pt-BR'
    speechRef.current.rate = 0.9
    speechRef.current.pitch = 1
    speechRef.current.volume = 1

    // Event listeners
    speechRef.current.onstart = () => setIsPlaying(true)
    speechRef.current.onend = () => setIsPlaying(false)
    speechRef.current.onerror = () => setIsPlaying(false)

    return () => {
      if (speechRef.current) {
        speechRef.current.onstart = null
        speechRef.current.onend = null
        speechRef.current.onerror = null
      }
    }
  }, [isSupported])

  const handlePlay = () => {
    if (!isSupported || !text.trim() || disabled) return

    // Parar qualquer reprodução atual
    window.speechSynthesis.cancel()

    if (speechRef.current) {
      speechRef.current.text = text
      window.speechSynthesis.speak(speechRef.current)
    }
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }

  if (!isSupported) {
    return null // Não renderiza o botão se não for suportado
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={isPlaying ? handleStop : handlePlay}
            disabled={disabled || !text.trim()}
            className={`h-8 w-8 ${className}`}
          >
            {isPlaying ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isPlaying ? "Parar narração" : "Ouvir narração"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 