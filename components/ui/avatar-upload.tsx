'use client'

import { useState, useRef, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  userId: string
  onAvatarUpdate: (avatarUrl: string) => void
  size?: "sm" | "md" | "lg"
  className?: string
}

const AVATAR_SIZES = {
  sm: "h-16 w-16",
  md: "h-24 w-24", 
  lg: "h-32 w-32"
}

export function AvatarUpload({ 
  currentAvatarUrl, 
  userId, 
  onAvatarUpdate, 
  size = "md",
  className = ""
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Função para sanitizar o nome do arquivo
  const sanitizeFileName = (fileName: string): string => {
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Função para gerar nome único do arquivo
  const generateFileName = (originalName: string): string => {
    const timestamp = Date.now()
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
    const sanitizedName = sanitizeFileName(originalName.split('.')[0])
    return `${sanitizedName}-${timestamp}.${extension}`
  }

  // Função para fazer upload para AWS S3
  const uploadToS3 = async (file: File): Promise<string> => {
    const formData = new FormData()
    const fileName = generateFileName(file.name)
    
    formData.append('file', file)
    formData.append('fileName', fileName)
    formData.append('directory', 'lsm/avatar')
    formData.append('userId', userId)

    const response = await fetch('/api/upload-avatar', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erro no upload')
    }

    const data = await response.json()
    return data.url
  }

  // Função para atualizar avatar no Supabase
  const updateAvatarInSupabase = async (avatarUrl: string) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId)

    if (error) {
      throw new Error('Erro ao atualizar perfil no banco de dados')
    }
  }

  // Função para lidar com seleção de arquivo
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validações
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('A imagem deve ter no máximo 5MB')
      return
    }

    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Limpar mensagens anteriores
    setError(null)
    setSuccess(null)
  }, [])

  // Função para fazer upload
  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)

    try {
      // Simular progresso (em produção, isso viria do S3)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Upload para S3
      const avatarUrl = await uploadToS3(file)
      
      // Atualizar no Supabase
      await updateAvatarInSupabase(avatarUrl)
      
      // Finalizar progresso
      setUploadProgress(100)
      
      // Atualizar avatar na interface
      onAvatarUpdate(avatarUrl)
      
      // Mostrar sucesso
      setSuccess('Avatar atualizado com sucesso!')
      
      // Limpar preview
      setPreviewUrl(null)
      
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido no upload')
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  // Função para cancelar upload
  const handleCancel = () => {
    setPreviewUrl(null)
    setError(null)
    setSuccess(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Função para abrir seletor de arquivo
  const openFileSelector = () => {
    fileInputRef.current?.click()
  }

  const avatarSize = AVATAR_SIZES[size]
  const displayUrl = previewUrl || currentAvatarUrl

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Avatar */}
      <div className="relative group">
        <Avatar className={`${avatarSize} border-2 border-border`}>
          <AvatarImage src={displayUrl || undefined} alt="Avatar do usuário" />
          <AvatarFallback className="text-lg font-semibold">
            {currentAvatarUrl ? 'U' : 'U'}
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay de upload */}
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="icon"
            variant="secondary"
            onClick={openFileSelector}
            className="h-8 w-8 rounded-full"
            disabled={isUploading}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Botões de ação */}
      {previewUrl && (
        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Upload className="h-4 w-4 animate-pulse" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Confirmar
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Barra de progresso */}
      {isUploading && (
        <div className="w-full max-w-xs space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-xs text-center text-muted-foreground">
            {uploadProgress}% concluído
          </p>
        </div>
      )}

      {/* Mensagens de status */}
      {error && (
        <Alert variant="destructive" className="max-w-xs">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="max-w-xs border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Botão de alterar (quando não há preview) */}
      {!previewUrl && !isUploading && (
        <Button
          variant="outline"
          size="sm"
          onClick={openFileSelector}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          {currentAvatarUrl ? 'Alterar Avatar' : 'Adicionar Avatar'}
        </Button>
      )}
    </div>
  )
}
