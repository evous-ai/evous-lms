'use client'

import { useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, AlertCircle, Info, User, Shield, Briefcase, Settings, Save, Edit } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { THEMES } from "@/lib/constants"
import { CountrySelect } from "@/components/ui/country-select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AvatarUpload } from "@/components/ui/avatar-upload"

interface PerfilFormProps {
  user: {
    id: string
    email?: string
  }
  profile: {
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    country?: string | null
    address?: string | null
    email?: string | null
    phone?: string | null
    age?: string | null
    position?: string | null
    notification?: boolean | null
    company_id?: string | null
    updated_at?: string | null
  } | null
}

export function PerfilForm({ user, profile }: PerfilFormProps) {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("pessoais")
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info', message: string } | null>(null)
  
  // Estados dos formulários
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    full_name: profile?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    age: profile?.age || "",
    address: profile?.address || "",
    position: profile?.position || "",
    country: profile?.country || "",
    notification: profile?.notification ?? true,
    tema: theme || "auto"
  })

  // Estado para avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null)

  // Função para atualizar avatar
  const handleAvatarUpdate = useCallback((newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl)
  }, [])

  // Estado para controlar o modal de upload
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)





  // Última atualização do perfil (do banco)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(profile?.updated_at ?? null)

  // Estados para alteração de senha
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [senhaErrors, setSenhaErrors] = useState<{ [key: string]: string }>({})

  // Função para criar perfil automaticamente
  const createProfileIfNotExists = useCallback(async () => {
    if (profile) return profile // Se já existe, retorna

    try {
      const supabase = createClient()
      
      console.log('Tentando criar perfil para usuário:', user.id)
      
      // Criar perfil básico com apenas os campos que existem
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.email?.split('@')[0] || 'Usuário',
          username: user.email?.split('@')[0] || 'usuario',
          notification: true,
          company_id: "c9551059-35fb-4c5e-bcb7-bc09ddc25f31"
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar perfil:', error)
        
        // Se o erro for de coluna não encontrada, tentar com campos mínimos
        if (error.code === 'PGRST204') {
          console.log('Tentando criar perfil com campos mínimos...')
          
          const { data: minimalData, error: minimalError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email
            })
            .select()
            .single()
            
          if (minimalError) {
            console.error('Erro ao criar perfil mínimo:', minimalError)
            return null
          }
          
          return minimalData
        }
        
        return null
      }

      console.log('Perfil criado com sucesso:', data)
      return data
    } catch (error) {
      console.error('Erro ao criar perfil:', error)
      return null
    }
  }, [profile, user.id, user.email])

  // Sincronizar dados quando usuário mudar
  useEffect(() => {
    const initializeProfile = async () => {
      if (user) {
        let currentProfile = profile
        
        // Se não há perfil, tenta criar um
        if (!currentProfile) {
          console.log('Perfil não encontrado, tentando criar...')
          currentProfile = await createProfileIfNotExists()
          
          if (!currentProfile) {
            console.warn('Não foi possível criar o perfil automaticamente')
            // Usar dados básicos do usuário como fallback
            setFormData(prev => ({
              ...prev,
              username: user.email?.split('@')[0] || 'usuario',
              full_name: user.email?.split('@')[0] || 'Usuário',
              email: user.email || "",
              phone: "",
              age: "",
              address: "",
              position: "",
              country: "",
              notification: true
            }))
            return
          }
        }

        if (currentProfile) {
          setFormData(prev => ({
            ...prev,
            username: currentProfile.username || "",
            full_name: currentProfile.full_name || "",
            email: user.email || "",
            phone: currentProfile.phone || "",
            age: currentProfile.age || "",
            address: currentProfile.address || "",
            position: currentProfile.position || "",
            country: currentProfile.country || "",
            notification: currentProfile.notification ?? true
          }))
          setLastUpdatedAt(currentProfile.updated_at ?? null)
        }
      }
    }

    initializeProfile()
  }, [user, profile, createProfileIfNotExists])

  // Sincronizar tema quando mudar
  useEffect(() => {
    if (theme && theme !== formData.tema) {
      setFormData(prev => ({ ...prev, tema: theme }))
    }
  }, [theme, formData.tema])

  // Função para mostrar alertas
  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  // Função para atualizar perfil
  const updateProfile = async (profileData: Record<string, unknown>) => {
    try {
      const supabase = createClient()

      // Filtrar apenas campos que não são undefined ou null
      const cleanData = Object.fromEntries(
        Object.entries(profileData).filter(([, value]) => value !== undefined && value !== null)
      )
      
      const { data, error } = await supabase
        .from('profiles')
        .update(cleanData)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, profile: data }
    } catch {
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // Função para alterar senha
  const alterarSenha = async () => {
    setIsLoading(true)
    setSenhaErrors({})

    try {
      const supabase = createClient()

      // 1. Verificar se a senha atual está correta
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: senhaAtual
      })

      if (signInError) {
        setSenhaErrors({ senhaAtual: 'Senha atual incorreta' })
        showAlert('error', 'Senha atual incorreta. Verifique e tente novamente.')
        setIsLoading(false)
        return
      }

      // 2. Alterar a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: novaSenha
      })

      if (updateError) {
        showAlert('error', 'Erro ao alterar senha: ' + updateError.message)
        setIsLoading(false)
        return
      }

      // 3. Limpar campos e mostrar sucesso
      setSenhaAtual("")
      setNovaSenha("")
      setConfirmarSenha("")
      showAlert('success', 'Senha alterada com sucesso!')
      
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      showAlert('error', 'Erro interno do servidor. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar se o botão de alterar senha deve estar habilitado
  const senhaFormValido = senhaAtual && novaSenha && confirmarSenha && novaSenha === confirmarSenha && novaSenha.length >= 6

  // Função para salvar alterações por aba
  const salvarAba = async (aba: string) => {
    setIsLoading(true)
    
    try {
      if (aba === "pessoais") {
        const result = await updateProfile({
          full_name: formData.full_name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          age: formData.age,
          address: formData.address
        })
        
        if (result.success) {
          setLastUpdatedAt((result.profile as { updated_at?: string })?.updated_at ?? lastUpdatedAt)
          showAlert('success', 'Informações pessoais atualizadas com sucesso!')
        } else {
          showAlert('error', result.error || 'Erro ao atualizar informações')
        }
      } else if (aba === "profissionais") {
        const result = await updateProfile({
          position: formData.position,
          country: formData.country
        })
        
        if (result.success) {
          setLastUpdatedAt((result.profile as { updated_at?: string })?.updated_at ?? lastUpdatedAt)
          showAlert('success', 'Dados profissionais atualizadas com sucesso!')
        } else {
          showAlert('error', result.error || 'Erro ao atualizar dados profissionais')
        }
      } else if (aba === "preferencias") {
        // Se for a aba de preferências, aplicar o tema imediatamente
        if (formData.tema !== theme) {
          setTheme(formData.tema)
        }
        
        // Salvar também a preferência de notificação
        const result = await updateProfile({
          notification: formData.notification
        })
        
        if (result.success) {
          setLastUpdatedAt((result.profile as { updated_at?: string })?.updated_at ?? lastUpdatedAt)
          showAlert('success', 'Preferências atualizadas com sucesso!')
        } else {
          showAlert('error', result.error || 'Erro ao atualizar preferências')
        }
      } else {
        showAlert('success', `Alterações da aba ${aba} salvas com sucesso!`)
      }
    } catch {
      showAlert('error', 'Erro ao salvar alterações. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Renderizar alerta
  const renderAlert = () => {
    if (!alert) return null

    const alertConfig = {
      success: { icon: CheckCircle, className: "border-green-200 bg-green-50 text-green-800" },
      error: { icon: AlertCircle, className: "border-red-200 bg-red-50 text-red-800" },
      warning: { icon: AlertCircle, className: "border-yellow-200 bg-yellow-50 text-yellow-800" },
      info: { icon: Info, className: "border-blue-200 bg-blue-50 text-blue-800" }
    }

    const config = alertConfig[alert.type]
    const IconComponent = config.icon

    return (
      <Alert className={config.className}>
        <IconComponent className="h-4 w-4" />
        <AlertDescription>{alert.message}</AlertDescription>
      </Alert>
    )
  }

  // Renderizar skeleton de carregamento
  const renderSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-10 w-full" />
    </div>
  )

  return (
    <>
      {/* Alertas */}
      {renderAlert()}

      {/* Sistema de Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pessoais" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Informações Pessoais
          </TabsTrigger>
          <TabsTrigger value="profissionais" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Dados Profissionais
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="preferencias" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferências
          </TabsTrigger>
        </TabsList>

        {/* Aba: Informações Pessoais */}
        <TabsContent value="pessoais" className="mt-6 space-y-6">
          {isLoading ? renderSkeleton() : (
            <>
              {/* Avatar */}
              <div className="space-y-4">
                <Label>Foto do Perfil</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 rounded-full overflow-hidden">
                    <AvatarImage src={avatarUrl || undefined} className="object-cover" />
                    <AvatarFallback className="text-lg">
                      {profile?.full_name ? 
                        profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                        user.email?.charAt(0).toUpperCase() || 'U'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAvatarUpload(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Alterar Avatar
                    </Button>
                  </div>
                </div>
                
                {/* Modal de Upload escondido */}
                {showAvatarUpload && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Alterar Foto do Perfil</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowAvatarUpload(false)}
                        >
                          ✕
                        </Button>
                      </div>
                      <AvatarUpload
                        currentAvatarUrl={avatarUrl}
                        userId={user.id}
                        onAvatarUpdate={(newUrl) => {
                          handleAvatarUpdate(newUrl)
                          setShowAvatarUpload(false)
                        }}
                        size="lg"
                        className="mx-auto"
                      />
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        Clique na imagem para alterar sua foto de perfil
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  value={formData.username}
                  placeholder="Digite seu nome de usuário"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Nome único para identificação
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Digite seu nome completo"
                />
                <p className="text-sm text-muted-foreground">
                  O nome associado a esta conta
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  O endereço de e-mail associado a esta conta
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
                <p className="text-sm text-muted-foreground">
                  O número de telefone associado a esta conta
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="text"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="25"
                />
                <p className="text-sm text-muted-foreground">
                  Sua idade
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Digite seu endereço completo"
                />
                <p className="text-sm text-muted-foreground">
                  Seu endereço residencial
                </p>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <Button 
                  onClick={() => salvarAba("pessoais")}
                  disabled={isLoading}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
                <div className="text-sm text-muted-foreground">
                  Última atualização: {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString('pt-BR') : '—'}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* Aba: Dados Profissionais */}
        <TabsContent value="profissionais" className="mt-6 space-y-6">
          {isLoading ? renderSkeleton() : (
            <>
              <div className="space-y-2">
                <Label htmlFor="position">Área/Posição</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Desenvolvedor, Designer, etc."
                />
                <p className="text-sm text-muted-foreground">
                  Sua área de atuação profissional
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <CountrySelect
                  value={formData.country}
                  onValueChange={(value: string) => setFormData({ ...formData, country: value })}
                  placeholder="Selecione um país"
                />
                <p className="text-sm text-muted-foreground">
                  País onde você atua profissionalmente
                </p>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <Button 
                  onClick={() => salvarAba("profissionais")}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
                <div className="text-sm text-muted-foreground">
                  Última atualização: {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString('pt-BR') : '—'}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* Aba: Segurança */}
        <TabsContent value="seguranca" className="mt-6 space-y-6">
          {isLoading ? renderSkeleton() : (
            <>
              <form onSubmit={(e) => { e.preventDefault(); alterarSenha(); }}>
                {/* Campo de username oculto para acessibilidade/gerenciadores de senha */}
                <input
                  type="email"
                  name="username"
                  autoComplete="username"
                  value={user.email || ''}
                  readOnly
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                  aria-hidden="true"
                />
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="senhaAtual">Senha Atual</Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      placeholder="Digite sua senha atual"
                      autoComplete="current-password"
                      className={senhaErrors.senhaAtual ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {senhaErrors.senhaAtual && (
                      <p className="text-sm text-red-600">{senhaErrors.senhaAtual}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Sua senha atual para confirmação
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="novaSenha">Nova Senha</Label>
                    <Input
                      id="novaSenha"
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      placeholder="Digite sua nova senha"
                      autoComplete="new-password"
                      className={senhaErrors.novaSenha ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {senhaErrors.novaSenha && (
                      <p className="text-sm text-red-600">{senhaErrors.novaSenha}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Nova senha desejada (mínimo 6 caracteres)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      placeholder="Confirme sua nova senha"
                      autoComplete="new-password"
                      className={senhaErrors.confirmarSenha ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {senhaErrors.confirmarSenha && (
                      <p className="text-sm text-red-600">{senhaErrors.confirmarSenha}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Confirme a nova senha
                    </p>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <Button 
                      type="submit"
                      disabled={!senhaFormValido || isLoading}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Shield className="h-4 w-4" />
                      {isLoading ? 'Alterando...' : 'Atualizar Senha'}
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Última atualização: {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString('pt-BR') : '—'}
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </TabsContent>

        {/* Aba: Preferências */}
        <TabsContent value="preferencias" className="mt-6 space-y-6">
          {isLoading ? renderSkeleton() : (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações sobre novos treinamentos
                  </p>
                </div>
                <Switch
                  checked={formData.notification}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, notification: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tema">Tema da Interface</Label>
                <Select value={formData.tema} onValueChange={(value: string) => {
                  setFormData({ ...formData, tema: value })
                  setTheme(value)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES.map((tema) => (
                      <SelectItem key={tema.value} value={tema.value}>
                        {tema.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Preferência de tema visual
                </p>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <Button 
                  onClick={() => salvarAba("preferencias")}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
                <div className="text-sm text-muted-foreground">
                  Última atualização: {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString('pt-BR') : '—'}
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
