import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react'
import { AutoRedirectClient } from './AutoRedirectClient'

interface CallbackPageProps {
  searchParams: Promise<{ state?: string }>
}

function CallbackContent({ state }: { state?: string }) {
  if (state === 'success') {
    return (
      <>
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-700" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">Login concluído com sucesso</h1>
            <Badge variant="secondary" className="text-emerald-700 bg-emerald-100">
              SSO Microsoft
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Tudo certo! Sua sessão foi criada e você já pode continuar.
          </p>
          
          <AutoRedirectClient />
        </CardContent>
      </>
    )
  }

  if (state === 'error') {
    return (
      <>
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-700" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Não foi possível concluir o login</h1>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Seu acesso não pôde ser validado agora. Tente novamente ou contate um administrador.
          </p>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Verifique se está usando a conta corporativa correta.</p>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white" asChild>
              <Link href="/login">Tentar novamente</Link>
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                <ExternalLink className="w-4 h-4 mr-2" />
                Contatar administrador
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    Ver detalhes do erro
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Código: AUTH_401</p>
                  <p>Origem: Microsoft SSO (mock)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </>
    )
  }

  // Estado pendente (padrão)
  return (
    <>
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-slate-600 animate-spin" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">Processando seu login…</h1>
          <p className="text-sm text-muted-foreground">
            Aguarde alguns instantes enquanto validamos suas credenciais.
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        <Progress value={66} className="h-2 rounded-full" />
        
        <p className="text-xs text-muted-foreground text-center">
          Isso pode levar poucos segundos.
        </p>
        
        <Separator />
        

      </CardContent>
    </>
  )
}

export default async function CallbackPage({ searchParams }: CallbackPageProps) {
  const { state } = await searchParams

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white border rounded-2xl shadow-none p-6 space-y-4">
        <Suspense fallback={
          <div className="text-center space-y-4">
            <Skeleton className="w-12 h-12 rounded-full mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        }>
          <div aria-live="polite">
            <CallbackContent state={state} />
          </div>
        </Suspense>
      </Card>
    </div>
  )
} 