'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Share2,
  Copy,
  MessageSquare,
  Mail,
  Brain
} from "lucide-react"

interface LessonActionsClientProps {
  slug: string
  conteudoId: string
  onComplete?: () => void
  isCompleted?: boolean
}

export function LessonActionsClient({ slug, conteudoId }: LessonActionsClientProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const navegarParaQuiz = () => {
    router.push(`/trilha/${slug}/quiz/${conteudoId}`)
  }

  const navegarParaRoleplay = () => {
    router.push(`/trilha/${slug}/roleplay/${conteudoId}`)
  }

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar link:', err)
    }
  }

  const compartilharWhatsApp = () => {
    const url = encodeURIComponent(window.location.href)
    const texto = encodeURIComponent('Confira esta aula incrível!')
    window.open(`https://wa.me/?text=${texto}%20${url}`, '_blank')
  }

  const compartilharEmail = () => {
    const url = window.location.href
    const assunto = encodeURIComponent('Aula recomendada')
    const corpo = encodeURIComponent(`Confira esta aula incrível: ${url}`)
    window.open(`mailto:?subject=${assunto}&body=${corpo}`, '_blank')
  }

  return (
    <Card className="bg-white border rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle>Atalhos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
          onClick={navegarParaQuiz}
        >
          Iniciar Quiz
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={copiarLink}>
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Link copiado!' : 'Copiar link'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={compartilharWhatsApp}>
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={compartilharEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={navegarParaRoleplay}
        >
          <Brain className="h-4 w-4 mr-2" />
          Abrir Roleplay (IA)
        </Button>
      </CardContent>
    </Card>
  )
} 