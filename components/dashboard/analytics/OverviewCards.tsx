import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock, TrendingUp, Target, Activity, BarChart3 } from 'lucide-react'
import { AnalyticsOverview } from '@/hooks/use-analytics-dashboard'

interface OverviewCardsProps {
  data: AnalyticsOverview
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const cards = [
    {
      title: 'Total de Usuários',
      value: data.totalUsers.toLocaleString('pt-BR'),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-700'
    },
    {
      title: 'Usuários Ativos',
      value: data.activeUsers.toLocaleString('pt-BR'),
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      borderColor: 'border-green-200 dark:border-green-700'
    },
    {
      title: 'Total de Sessões',
      value: data.totalSessions.toLocaleString('pt-BR'),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-700'
    },
    {
      title: 'Duração Média da Sessão',
      value: data.averageSessionDuration,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      borderColor: 'border-orange-200 dark:border-orange-700'
    },
    {
      title: 'Taxa de Rejeição',
      value: data.bounceRate,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-700'
    },
    {
      title: 'Taxa de Conversão',
      value: data.conversionRate,
      icon: Target,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
      borderColor: 'border-emerald-200 dark:border-emerald-700'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className={`border ${card.borderColor} ${card.bgColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
