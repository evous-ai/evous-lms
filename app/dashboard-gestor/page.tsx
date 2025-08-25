"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Users, TrendingUp, FileText, Download } from 'lucide-react';
import { AnalyticsDashboard } from '@/components/dashboard/analytics/AnalyticsDashboard';

export default function DashboardGestor() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
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

        {/* Dashboard de Analytics */}
        <div className="mb-8">
          <AnalyticsDashboard />
        </div>

        {/* Cards de Ações Rápidas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
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

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold">Relatórios Avançados</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Visualize métricas e relatórios detalhados
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Acessar</Link>
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Configure parâmetros e preferências do sistema
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Acessar</Link>
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <Download className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-semibold">Exportar Dados</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Exporte relatórios e dados para análise externa
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