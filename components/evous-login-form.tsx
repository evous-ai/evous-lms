'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/client"

export function EvousLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg('Email ou senha inválidos.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setErrorMsg('Erro interno do servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 dark:bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo Lubrax */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo_lubrax_lightmode.png"
              alt="Lubrax"
              width={160}
              height={42}
              className="h-10 w-auto block dark:hidden"
              priority
            />
            <Image
              src="/logo_lubrax_darkmode.png"
              alt="Lubrax"
              width={160}
              height={42}
              className="h-10 w-auto hidden dark:block"
              priority
            />
          </div>
        </div>

        {/* Formulário */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Bem-vindo de volta!</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    autoComplete="email" 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    autoComplete="current-password" 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>
              {errorMsg && (
                <div className="text-red-500 text-sm text-center">
                  {errorMsg}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <Separator />
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Criar conta
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 