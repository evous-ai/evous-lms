"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function EvousLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validação básica
    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }

    setIsLoading(true)

    // Simular atraso de 500ms
    setTimeout(() => {
      setIsLoading(false)
      
      // Lógica de redirecionamento baseada no email
      if (email === "gestor@evous.com") {
        router.push("/dashboard-gestor")
      } else {
        router.push("/dashboard")
      }
    }, 500)
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      {/* Logo Evous – 1 visível por vez via Tailwind (sem JS) */}
      <div className="flex justify-center mb-4">
        {/* Light Mode: logo claro */}
        <Image
          src="/evous_logo_light.svg"
          alt="Evous"
          width={160}
          height={42}
          className="h-10 w-auto block dark:hidden"
          priority
        />
        {/* Dark Mode: logo escuro */}
        <Image
          src="/evous_logo.svg"
          alt="Evous"
          width={160}
          height={42}
          className="h-10 w-auto hidden dark:block"
          priority
        />
      </div>

      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Acesse com sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <a
                      href="/dashboard"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Não tem uma conta?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Criar conta
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Ao clicar em continuar, você concorda com nossos{" "}
        <a href="/dashboard">Termos de Serviço</a> e{" "}
        <a href="/dashboard">Política de Privacidade</a>.
      </div>
    </div>
  )
} 