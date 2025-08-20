'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock, Loader2 } from "lucide-react"
import { CountrySelect } from "@/components/ui/country-select"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    country: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.full_name || !formData.email || !formData.password || !formData.country) {
      setError("Por favor, preencha todos os campos")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      
      // Verifica se já há uma sessão ativa e faz logout
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.auth.signOut()
      }

      // Criar usuário no Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            country: formData.country,
            notification: true
          },
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`
        }
      })

      if (signUpError) {
        let errorMessage = signUpError.message
        
        if (errorMessage.includes('User already registered')) {
          errorMessage = 'Este e-mail já está registrado.'
        } else if (errorMessage.includes('unique constraint') && errorMessage.includes('username')) {
          errorMessage = 'O nome de usuário já está em uso. Por favor, escolha outro.'
        }
        
        setError(errorMessage)
        setIsLoading(false)
        return
      }

      if (!data.user) {
        setError('Erro ao criar usuário')
        setIsLoading(false)
        return
      }

      // O trigger handle_new_user deve criar o perfil automaticamente
      // Força logout para garantir que não haja sessão ativa
      await supabase.auth.signOut()

      setFormData({ full_name: '', email: '', password: '', country: '' })
      setSuccess('✅ Registro realizado com sucesso! Verifique seu e-mail para confirmar a conta antes de fazer login.')
      
    } catch {
      setError('Erro interno do servidor. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 dark:bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 hidden">
          <div className="flex justify-center mb-4">
            <Image src="/evous_logo_light.svg" alt="Evous" width={48} height={48} className="h-12 dark:hidden" />
            <Image src="/evous_logo.svg" alt="Evous" width={48} height={48} className="h-12 hidden dark:block" />
          </div>
        </div>

        {/* Formulário */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Criar conta</CardTitle>
            <CardDescription className="text-center">
              Preencha as informações abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {success && (
              <div className="text-center space-y-2">
                <div className="text-sm text-green-600 font-medium">
                  ✅ Conta criada com sucesso!
                </div>
                <p className="text-xs text-muted-foreground">
                  Após confirmar seu e-mail, você poderá fazer login.
                </p>
                <div className="space-y-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = "/"}
                  >
                    Ir para Login
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSuccess("")
                      setError("")
                    }}
                  >
                    Criar Outra Conta
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
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
                    autoComplete="email"
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
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  País
                </Label>
                <CountrySelect
                  value={formData.country}
                  onValueChange={(value) => handleInputChange('country', value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>

              <Separator />
              
              <div className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/" className="text-primary hover:underline font-medium">
                  Fazer login
                </Link>
              </div>
            </form>
            
            {/* Termos */}
            <div className="pt-4">
              <p className="text-xs text-center text-muted-foreground">
                Ao criar uma conta, você concorda com nossos{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Termos de Serviço
                </Link>{" "}
                e{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
