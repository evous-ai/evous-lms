import { useAnalyticsDashboard } from '@/hooks/use-analytics-dashboard'
import { OverviewCards } from './OverviewCards'
import { TrendsChart } from './TrendsChart'
import { DataTables } from './DataTables'
import { Button } from '@/components/ui/button'
import { RefreshCw, Download, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AnalyticsDashboard() {
  const { data, loading, error, refreshData } = useAnalyticsDashboard()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Dashboard de Analytics</h2>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            <span className="text-sm text-muted-foreground">Carregando...</span>
          </div>
        </div>
        
        {/* Skeleton loading */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Dashboard de Analytics</h2>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
        
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Erro ao Carregar Dados
              </h3>
              <p className="text-red-600 dark:text-red-300 mb-4">
                {error}
              </p>
              <Button onClick={refreshData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Dashboard de Analytics</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhum Dado Disponível</h3>
              <p className="text-muted-foreground mb-4">
                Não foi possível carregar os dados de analytics no momento.
              </p>
              <Button onClick={refreshData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dashboard de Analytics</h2>
          <p className="text-muted-foreground mt-1">
            Visão completa dos dados de engajamento e performance do LMS
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Últimos 30 dias
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de visão geral */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Visão Geral</h3>
        <OverviewCards data={data.overview} />
      </div>

      {/* Gráficos de tendência */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Tendências dos Últimos 30 Dias</h3>
        <TrendsChart data={data.trends} />
      </div>

      {/* Tabelas de dados */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Análise Detalhada</h3>
        <DataTables 
          courses={data.courses}
          videos={data.videos}
          users={data.users}
          engagement={data.engagement}
        />
      </div>

      {/* Resumo de métricas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa Média de Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.courses.averageCompletion}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.courses.totalCompletions.toLocaleString('pt-BR')} cursos concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Visualização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.videos.averageWatchTime}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.videos.totalViews.toLocaleString('pt-BR')} visualizações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.users.activeThisMonth.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              +{data.users.newThisMonth} novos usuários
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio na Página</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data.engagement.averageTimeOnPage}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.engagement.totalSearches.toLocaleString('pt-BR')} buscas realizadas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
