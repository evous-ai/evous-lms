"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Users, BarChart3, Settings, Activity } from 'lucide-react';

export default function DashboardGestor() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navegação */}
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Dashboard do Gestor</h1>
          <p className="text-lg text-muted-foreground">
            Bem-vindo ao painel de controle do gestor
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Gerencie usuários, permissões e acessos ao sistema
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Acessar</Link>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold">Relatórios Avançados</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Visualize métricas e relatórios detalhados
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Acessar</Link>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Configure parâmetros e preferências do sistema
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Acessar</Link>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-semibold">Monitoramento de Atividades</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Acompanhe atividades e logs do sistema
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Acessar</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
} 