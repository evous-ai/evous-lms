"use client"

import { useState } from "react"
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
}

export function ContactSupportModal({ isOpen, onClose, lessonTitle, videoId, onSuccess }: ContactSupportModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
    tipo: "duvida"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de solicitação *</Label>
            <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
              <SelectTrigger>
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
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
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