"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Lock, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PoweredByEvous } from "@/components/powered-by-evous"
import { createClient } from "@/utils/supabase/client"

interface SignupFormData {
  full_name: string
  email: string
  password: string
  country: string
}

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    full_name: "",
    email: "",
    password: "",
    country: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.full_name || !formData.email || !formData.password || !formData.country) {
      setError("Por favor, preencha todos os campos")
      return
    }

    console.log('Iniciando cadastro...')
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      console.log('Chamando signUp...')
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            country: formData.country,
            email: formData.email
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.log('Erro no cadastro:', error.message)
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        console.log('Cadastro bem-sucedido, redirecionando...')
        setSuccess("Conta criada com sucesso! Redirecionando...")
        
        // Força logout para evitar sessão ativa
        await supabase.auth.signOut()
        
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    } catch (error) {
      console.error('Exceção no cadastro:', error)
      setError("Erro interno do servidor")
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo_lubrax_lightmode.png"
              alt="Lubrax"
              width={160}
              height={42}
              className="h-8 w-auto block dark:hidden"
              priority
            />
            <Image
              src="/logo_lubrax_darkmode.png"
              alt="Lubrax"
              width={160}
              height={42}
              className="h-8 w-auto hidden dark:block"
              priority
            />
          </div>
        </div>

        {/* Formulário */}
        <Card className="border-border/50 dark:border-border/20 bg-card shadow-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Criar conta</CardTitle>
            <CardDescription className="text-center">
              Preencha as informações abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    className="pl-10"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  País
                </Label>
                <div className="relative w-full">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select 
                    value={formData.country} 
                    onValueChange={(value) => handleInputChange('country', value)}
                    required
                  >
                    <SelectTrigger className="w-full pl-10">
                      <SelectValue placeholder="Selecione seu país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="br">Brasil</SelectItem>
                      <SelectItem value="pt">Portugal</SelectItem>
                      <SelectItem value="mx">México</SelectItem>
                      <SelectItem value="ar">Argentina</SelectItem>
                      <SelectItem value="co">Colômbia</SelectItem>
                      <SelectItem value="pe">Peru</SelectItem>
                      <SelectItem value="cl">Chile</SelectItem>
                      <SelectItem value="ve">Venezuela</SelectItem>
                      <SelectItem value="ec">Equador</SelectItem>
                      <SelectItem value="bo">Bolívia</SelectItem>
                      <SelectItem value="py">Paraguai</SelectItem>
                      <SelectItem value="uy">Uruguai</SelectItem>
                      <SelectItem value="gy">Guiana</SelectItem>
                      <SelectItem value="sr">Suriname</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
            
            <Separator />
            <div className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/" className="text-primary hover:underline font-medium">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Termos */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          Ao criar uma conta, você concorda com nossos{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Política de Privacidade
          </Link>
        </p>

        {/* Powered by Evous */}
        <div className="mt-8 text-center">
          <PoweredByEvous size="md" />
        </div>
      </div>
    </div>
  )
}