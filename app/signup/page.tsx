import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Lock, Globe } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/evous_logo_light.svg" alt="Evous" className="h-12 dark:hidden" />
            <img src="/evous_logo.svg" alt="Evous" className="h-12 hidden dark:block" />
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
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">
                País
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select required>
                  <SelectTrigger className="pl-10">
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

            <Button className="w-full" size="lg">
              Criar conta
            </Button>

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
      </div>
    </div>
  )
} 