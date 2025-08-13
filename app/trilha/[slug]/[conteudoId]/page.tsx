"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

export default function ConteudoPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navegação */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/trilha/trajetoria-vibra" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao curso
              </Link>
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">Aula 3 – Governança e Cultura</h1>
        <p className="text-muted-foreground mb-6">
          Curso: Trajetória Vibra • 12:30
        </p>
        
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* COLUNA ESQUERDA */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Player de Vídeo</h2>
              <div className="aspect-video bg-slate-200 flex items-center justify-center rounded-lg">
                <p className="text-slate-500">Player será implementado aqui</p>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Transcrição</h2>
              <p className="text-sm text-muted-foreground">
                Transcrição da aula será exibida aqui...
              </p>
            </Card>
          </div>
          
          {/* COLUNA DIREITA */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Comentários</h2>
              <p className="text-sm text-muted-foreground">
                Sistema de comentários será implementado aqui...
              </p>
            </Card>
          </div>
        </div>

        {/* Navegação entre aulas */}
        <div className="mt-8 flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/trilha/trajetoria-vibra" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Aula anterior
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/trilha/trajetoria-vibra" className="flex items-center gap-2">
              Próxima aula
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 