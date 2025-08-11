'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, SmilePlus, Paperclip, Heart, MessageCircle } from "lucide-react"

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

interface CommentsSidebarClientProps {
  slug: string
  conteudoId: string
  comentarios: Comment[]
}

export function CommentsSidebarClient({ comentarios: initialComentarios }: CommentsSidebarClientProps) {
  const [comentarios, setComentarios] = useState<Comment[]>(initialComentarios)
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

  return (
    <Card className="bg-white border rounded-2xl shadow-none sticky top-6 h-[calc(100vh-3rem)]">
      <CardHeader>
        <CardTitle>Comentários</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <ScrollArea className="flex-1 pr-4">
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
              placeholder="Adicione um comentário..." 
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
  )
} 