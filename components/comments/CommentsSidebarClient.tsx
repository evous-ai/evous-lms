'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Send, SmilePlus, Paperclip, Heart, MessageCircle, Share2, FileText, Brain } from "lucide-react"

interface Comment {
  id: number
  avatar: string
  nome: string
  tempo: string
  texto: string
  curtidas: number
  respostas: number
  curtido?: boolean
}

// Dados mock dos comentários
const comentariosMock: Comment[] = [
  {
    id: 1,
    avatar: '/avatar_default.png',
    nome: 'Erling Highland',
    tempo: 'há 2d',
    texto: 'Excelente aula! A parte sobre governança corporativa foi muito esclarecedora.',
    curtidas: 3,
    respostas: 1,
    curtido: false
  },
  {
    id: 2,
    avatar: '/avatar_default_002.png',
    nome: 'Brooklyn Simmons',
    tempo: 'há 1d',
    texto: 'Gostei muito da abordagem sobre cultura organizacional. A Vibra realmente é um exemplo.',
    curtidas: 2,
    respostas: 0,
    curtido: true
  },
  {
    id: 3,
    avatar: '/avatar_default_003.png',
    nome: 'Dianne Russell',
    tempo: 'há 1d',
    texto: 'Alguém pode explicar melhor sobre o sistema de compliance mencionado?',
    curtidas: 1,
    respostas: 2,
    curtido: false
  },
  {
    id: 4,
    avatar: '/avatar_default.png',
    nome: 'Ben Mingo',
    tempo: 'há 12h',
    texto: 'Perfeito! A combinação de governança sólida com cultura forte é realmente fundamental.',
    curtidas: 4,
    respostas: 0,
    curtido: false
  }
]

export function CommentsSidebarClient() {
  const [comentarios, setComentarios] = useState<Comment[]>(comentariosMock)
  const [novoComentario, setNovoComentario] = useState('')

  const toggleCurtida = (id: number) => {
    setComentarios(prev => prev.map(com => 
      com.id === id 
        ? { ...com, curtidas: com.curtido ? com.curtidas - 1 : com.curtidas + 1, curtido: !com.curtido }
        : com
    ))
  }

  const adicionarComentario = () => {
    if (novoComentario.trim()) {
      const novoComentarioObj: Comment = {
        id: Date.now(),
        avatar: '/avatar_default.png',
        nome: 'Usuário Atual',
        tempo: 'Agora',
        texto: novoComentario,
        curtidas: 0,
        respostas: 0,
        curtido: false
      }
      
      setComentarios(prev => [novoComentarioObj, ...prev])
      setNovoComentario('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      adicionarComentario()
    }
  }

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      // Aqui você poderia mostrar uma notificação de sucesso
    } catch (err) {
      console.error('Erro ao copiar link:', err)
    }
  }

  const compartilharWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`Trajetória Vibra - Aula 3: ${window.location.href}`)}`
    window.open(url, '_blank')
  }

  const compartilharEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent('Trajetória Vibra - Aula 3')}&body=${encodeURIComponent(window.location.href)}`
    window.open(url)
  }

  return (
    <div className="space-y-6">
      {/* Card 1 - Comentários */}
      <Card className="bg-white border rounded-2xl shadow-none">
        <CardHeader>
          <CardTitle>Comentários</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <ScrollArea className="h-[calc(100vh-220px)] pr-4">
            <div className="space-y-4">
              {comentarios.map((comentario) => (
                <div key={comentario.id} className="space-y-2">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comentario.avatar} />
                      <AvatarFallback>{comentario.nome.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comentario.nome}</span>
                        <span className="text-xs text-muted-foreground">{comentario.tempo}</span>
                      </div>
                      <p className="text-sm mt-1">{comentario.texto}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button 
                          className={`text-xs flex items-center gap-1 hover:text-emerald-700 transition-colors ${
                            comentario.curtido ? 'text-emerald-700' : 'text-muted-foreground'
                          }`}
                          onClick={() => toggleCurtida(comentario.id)}
                        >
                          <Heart className={`h-3 w-3 ${comentario.curtido ? 'fill-current' : ''}`} />
                          {comentario.curtidas}
                        </button>
                        <button 
                          className="text-xs text-muted-foreground hover:text-emerald-700 flex items-center gap-1 transition-colors"
                          onClick={() => console.log('Responder comentário')}
                        >
                          <MessageCircle className="h-3 w-3" />
                          Responder
                        </button>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Campo de comentário */}
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="rounded-full">
                <SmilePlus className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full">
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Escreva um comentário..." 
                className="flex-1"
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button 
                size="icon" 
                className="bg-emerald-700 hover:bg-emerald-800"
                onClick={adicionarComentario}
                disabled={!novoComentario.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2 - Atalhos */}
      <Card className="bg-white border rounded-2xl shadow-none p-6">
        <div className="space-y-4">
          <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Iniciar Quiz
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={copiarLink}>
                <Share2 className="h-4 w-4 mr-2" />
                Copiar link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={compartilharWhatsApp}>
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={compartilharEmail}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="w-full">
            <Brain className="h-4 w-4 mr-2" />
            Abrir Roleplay (IA)
          </Button>
        </div>
      </Card>
    </div>
  )
} 