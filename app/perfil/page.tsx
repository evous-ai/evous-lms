"use client"

import { LMSSidebar } from "@/components/lms-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { CheckCircle, AlertCircle, Info, User, Shield, Briefcase, Settings, Home, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

// Dados mockados do usuário (em produção viriam da API)
const userData = {
  nome: "Edgar Fonseca",
  email: "edgar@evous.ai",
  telefone: "(11) 99999-9999",
  dataNascimento: "1985-06-15",
  area: "Evous Digital",
  pais: "Brasil",
  notificacoesEmail: true,
  tema: "auto"
}

// Lista de países
const paises = [
  "Brasil", "Argentina", "Chile", "Colômbia", "México", "Peru", "Uruguai", "Venezuela",
  "Estados Unidos", "Canadá", "Reino Unido", "França", "Alemanha", "Espanha", "Itália", "Portugal"
]

// Lista de temas
const temas = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "auto", label: "Automático" }
]

export default function PerfilPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("pessoais")
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info', message: string } | null>(null)
  
  // Estados dos formulários
  const [formData, setFormData] = useState({
    ...userData,
    tema: theme || "auto"
  })
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  // Simular carregamento inicial e sincronizar tema
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

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

  // Função para salvar alterações por aba
  const salvarAba = async (aba: string) => {
    setIsLoading(true)
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Se for a aba de preferências, aplicar o tema imediatamente
      if (aba === "Preferências" && formData.tema !== theme) {
        setTheme(formData.tema)
      }
      
      showAlert('success', `Alterações da aba ${aba} salvas com sucesso!`)
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
    <SidebarProvider>
      <LMSSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50 dark:bg-background">
          
          {/* Header Padrão */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">Meu Perfil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Meu Perfil</h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Gerencie suas informações pessoais e configurações de conta.
            </p>
          </div>

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
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                    <p className="text-sm text-muted-foreground">
                      O número de telefone associado a esta conta
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">
                      Data de nascimento para fins de identificação
                    </p>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <Button 
                      onClick={() => salvarAba("Informações Pessoais")}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Última atualização: {new Date().toLocaleDateString('pt-BR')}
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
                    <Label htmlFor="area">Área</Label>
                    <Input
                      id="area"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="Digite sua empresa ou instituição"
                    />
                    <p className="text-sm text-muted-foreground">
                      A empresa ou instituição onde você atua
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pais">País</Label>
                    <Select value={formData.pais} onValueChange={(value: string) => setFormData({ ...formData, pais: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um país" />
                      </SelectTrigger>
                      <SelectContent>
                        {paises.map((pais) => (
                          <SelectItem key={pais} value={pais}>
                            {pais}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      País onde você atua profissionalmente
                    </p>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <Button 
                      onClick={() => salvarAba("Dados Profissionais")}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

                        {/* Aba: Segurança */}
            <TabsContent value="seguranca" className="mt-6 space-y-6">
              {isLoading ? renderSkeleton() : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="senhaAtual">Senha Atual</Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
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
                    />
                    <p className="text-sm text-muted-foreground">
                      Nova senha desejada
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
                    />
                        <p className="text-sm text-muted-foreground">
                          Confirme a nova senha
                        </p>
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center">
                        <Button 
                          onClick={() => salvarAba("Segurança")}
                          disabled={isLoading}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Salvar Alterações
                        </Button>
                        <div className="text-sm text-muted-foreground">
                          Última atualização: {new Date().toLocaleDateString('pt-BR')}
                        </div>
                      </div>
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
                      checked={formData.notificacoesEmail}
                      onCheckedChange={(checked: boolean) => setFormData({ ...formData, notificacoesEmail: checked })}
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
                        {temas.map((tema) => (
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
                      onClick={() => salvarAba("Preferências")}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>


        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 