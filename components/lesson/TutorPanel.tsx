"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Send, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  type: 'user' | 'tutor'
  content: string
  timestamp: Date
  source?: string
  isStreaming?: boolean
}

export function TutorPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Mensagem inicial com streaming simulado
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: '1',
      type: 'tutor',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    }
    
    setMessages([initialMessage])
    
    // Simular streaming da mensagem inicial
    const welcomeText = "Olá! Como posso ajudar com o conteúdo deste módulo?"
    let currentIndex = 0
    
    const streamInterval = setInterval(() => {
      if (currentIndex < welcomeText.length) {
        setMessages(prev => prev.map(msg => 
          msg.id === '1' 
            ? { ...msg, content: welcomeText.slice(0, currentIndex + 1) }
            : msg
        ))
        currentIndex++
      } else {
        setMessages(prev => prev.map(msg => 
          msg.id === '1' 
            ? { ...msg, isStreaming: false }
            : msg
        ))
        clearInterval(streamInterval)
      }
    }, 50)
    
    return () => clearInterval(streamInterval)
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setShowSuggestions(false) // Esconde sugestões ao enviar mensagem

    // Simular resposta do tutor após 1 segundo
    setTimeout(() => {
      const tutorResponse = generateTutorResponse(inputValue.trim())
      
      // Criar mensagem do tutor com conteúdo inicial (primeiro caractere)
      const tutorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'tutor',
        content: tutorResponse.content.charAt(0), // Primeiro caractere para evitar balão vazio
        timestamp: new Date(),
        source: tutorResponse.source,
        isStreaming: true
      }

      setMessages(prev => [...prev, tutorMessage])

      // Simular streaming da resposta (começando do segundo caractere)
      let currentIndex = 1 // Começar do segundo caractere
      const streamInterval = setInterval(() => {
        if (currentIndex < tutorResponse.content.length) {
          setMessages(prev => prev.map(msg => 
            msg.id === tutorMessage.id 
              ? { ...msg, content: tutorResponse.content.slice(0, currentIndex + 1) }
              : msg
          ))
          currentIndex++
        } else {
          setMessages(prev => prev.map(msg => 
            msg.id === tutorMessage.id 
              ? { ...msg, content: tutorResponse.content, isStreaming: false }
              : msg
          ))
          setIsLoading(false)
          clearInterval(streamInterval)
        }
      }, 30)
    }, 1000)
  }

  // Função para lidar com clique nas sugestões
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setShowSuggestions(false) // Esconde sugestões ao clicar
  }

  const generateTutorResponse = (userInput: string) => {
    const input = userInput.toLowerCase()
    
    // Respostas mocadas baseadas no conteúdo
    if (input.includes('dendritos') || input.includes('neurônio')) {
      return {
        content: "Dendritos são ramificações do neurônio que recebem sinais de outras células. Eles aumentam a área de contato e levam essas informações até o corpo celular, onde o neurônio integra os sinais antes de responder. Em resumo: dendritos recebem, o axônio transmite.",
        source: "Seção — Neuroanatomia"
      }
    }
    
    if (input.includes('sistema nervoso') || input.includes('cérebro')) {
      return {
        content: "Pense num centro de comando: o cérebro e a medula são como a torre de controle do corpo. Eles recebem mensagens, decidem o que fazer e mandam respostas. Os neurônios são os 'fiozinhos' que carregam os recados. Dendritos escutam; axônio leva a mensagem adiante.",
        source: "Seção — Introdução ao SNC"
      }
    }
    
    if (input.includes('10 anos') || input.includes('criança')) {
      return {
        content: "Imagine que seu corpo é uma cidade muito organizada! O cérebro é o prefeito que toma todas as decisões. Os neurônios são os mensageiros que levam recados de um lugar para outro. Quando você quer mexer o braço, o cérebro manda uma mensagem pelos neurônios até os músculos, e eles obedecem!",
        source: "Seção — Introdução ao SNC"
      }
    }
    
    if (input.includes('governança') || input.includes('cultura')) {
      return {
        content: "Governança e cultura organizacional são como as regras e valores que fazem uma empresa funcionar bem. É como ter um manual de instruções que todos seguem, mas também é sobre como as pessoas se sentem trabalhando lá. Uma boa governança garante que as decisões sejam tomadas de forma justa e transparente.",
        source: "Seção — Governança Corporativa"
      }
    }
    
    // Resposta padrão para perguntas fora do escopo
    return {
      content: "Não encontrei informações específicas sobre isso no conteúdo deste módulo. Tente fazer uma pergunta relacionada ao conteúdo da aula ou use as sugestões para começar.",
      source: "Módulo atual"
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-white dark:bg-gray-950">
      {/* Chat - área scrollável */}
      <div className="grow overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-6">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-foreground mb-2">
                  Pergunte ao conteúdo do módulo...
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Ex.: &ldquo;Resuma em 3 pontos a neuroanatomia&rdquo;
                </p>
              </div>
            </div>
          ) : (
            // Mensagens do chat
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                    message.type === 'user'
                      ? "ml-auto text-primary-foreground bg-primary"
                      : "mr-auto bg-muted text-foreground"
                  )}
                >
                  <p className="leading-relaxed">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
                    )}
                  </p>
                  
                  {message.source && message.type === 'tutor' && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Fonte: {message.source}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {/* Skeleton loading */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="mr-auto max-w-[80%] rounded-2xl px-3 py-2 bg-muted">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          )}
          
          {/* Sugestões de mensagens - boxes flutuantes na extremidade inferior */}
          {showSuggestions && messages.length > 0 && (
            <div className="mt-8 space-y-3">
              <div className="text-center text-sm text-muted-foreground mb-3">
                Sugestões de perguntas:
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <div 
                  className="cursor-pointer p-3 bg-muted/50 hover:bg-muted rounded-lg border border-border/30 transition-colors"
                  onClick={() => handleSuggestionClick("Explique como se eu tivesse 10 anos: sistema nervoso")}
                >
                  <p className="text-sm text-foreground">Explique como se eu tivesse 10 anos</p>
                </div>
                <div 
                  className="cursor-pointer p-3 bg-muted/50 hover:bg-muted rounded-lg border border-border/30 transition-colors"
                  onClick={() => handleSuggestionClick("Resuma em 3 pontos")}
                >
                  <p className="text-sm text-foreground">Resumo em 3 pontos</p>
                </div>
                <div 
                  className="cursor-pointer p-3 bg-muted/50 hover:bg-muted rounded-lg border border-border/30 transition-colors"
                  onClick={() => handleSuggestionClick("O que são dendritos?")}
                >
                  <p className="text-sm text-foreground">O que são dendritos?</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input - sempre visível no rodapé com margem adequada */}
      <div className="shrink-0 sticky bottom-0 border-t border-border/50 bg-background p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <div className="flex items-end gap-3">
          {/* Input de mensagem */}
          <div className="flex-1">
            <Input
              placeholder="Pergunte ao conteúdo do módulo..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[40px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>
          
          {/* Botão enviar */}
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 