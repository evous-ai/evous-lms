"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Send, X } from "lucide-react"

interface ContactSupportModalProps {
  isOpen: boolean
  onClose: () => void
  lessonTitle?: string
  videoId?: string // Novo prop para identificar o vídeo
  onSuccess?: () => void // Callback após envio bem-sucedido
  user?: {
    id: string
    email?: string
  }
  profile?: {
    full_name?: string | null
    country?: string | null
  } | null
}

export function ContactSupportModal({ 
  isOpen, 
  onClose, 
  lessonTitle, 
  videoId, 
  onSuccess,
  user,
  profile
}: ContactSupportModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
    tipo: "duvida"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // ✅ Preencher automaticamente nome e email quando o modal abrir
  useEffect(() => {
    if (isOpen && user && profile) {
      setFormData(prev => ({
        ...prev,
        nome: profile.full_name || "",
        email: user.email || ""
      }))
    }
  }, [isOpen, user, profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)
    
    try {
      if (!videoId) {
        setSubmitMessage({ type: 'error', text: 'ID do vídeo não encontrado' })
        return
      }

      const response = await fetch('/api/video-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          name: formData.nome,
          email: formData.email,
          requestType: formData.tipo,
          subject: formData.assunto,
          message: formData.mensagem
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: data.message })
        
        // Reset form após sucesso
        setFormData({
          nome: "",
          email: "",
          assunto: "",
          mensagem: "",
          tipo: "duvida"
        })
        
        // Chamar callback de sucesso se fornecido
        if (onSuccess) {
          onSuccess()
        }
        
        // Fechar modal após 2 segundos
        setTimeout(() => {
          onClose()
          setSubmitMessage(null)
        }, 2000)
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Erro ao enviar mensagem' })
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error)
      setSubmitMessage({ type: 'error', text: 'Erro de conexão. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    // ✅ Não permitir alteração de campos somente leitura
    if (field === 'nome' && profile?.full_name) {
      return // Campo nome é somente leitura quando preenchido automaticamente
    }
    if (field === 'email' && user?.email) {
      return // Campo email é somente leitura quando preenchido automaticamente
    }
    
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="h-5 w-5 text-emerald-600" />
            Precisa de ajuda?
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="flex items-center gap-2">
                Nome *
                {profile?.full_name && (
                  <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                    Não editável
                  </span>
                )}
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Seu nome completo"
                required
                readOnly={!!profile?.full_name}
                className={`${profile?.full_name ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 cursor-not-allowed opacity-90" : ""}`}
                title={profile?.full_name ? "Este campo não pode ser alterado" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                Email *
                {user?.email && (
                  <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                    Não editável
                  </span>
                )}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="seu@email.com"
                required
                readOnly={!!user?.email}
                className={`${user?.email ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 cursor-not-allowed opacity-90" : ""}`}
                title={user?.email ? "Este campo não pode ser alterado" : ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de solicitação *</Label>
            <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="duvida">Dúvida sobre a aula</SelectItem>
                <SelectItem value="tecnico">Problema técnico</SelectItem>
                <SelectItem value="sugestao">Sugestão</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assunto">Assunto *</Label>
            <Input
              id="assunto"
              value={formData.assunto}
              onChange={(e) => handleInputChange("assunto", e.target.value)}
              placeholder="Resumo da sua solicitação"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem *</Label>
            <Textarea
              id="mensagem"
              value={formData.mensagem}
              onChange={(e) => handleInputChange("mensagem", e.target.value)}
              placeholder="Descreva detalhadamente sua dúvida ou solicitação..."
              rows={4}
              required
            />
          </div>

          {lessonTitle && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <strong>Aula:</strong> {lessonTitle}
            </div>
          )}

          {/* Mensagens de feedback */}
          {submitMessage && (
            <div className={`p-3 rounded-lg text-sm ${
              submitMessage.type === 'success' 
                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {submitMessage.text}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 