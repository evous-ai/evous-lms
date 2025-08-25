import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { TrendsAnalytics } from '@/hooks/use-analytics-dashboard'

interface TrendsChartProps {
  data: TrendsAnalytics
}

export function TrendsChart({ data }: TrendsChartProps) {
  // ✅ Calcular tendências
  const calculateTrend = (values: number[]) => {
    if (values.length < 2) return { direction: 'neutral', percentage: 0 }
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2))
    const secondHalf = values.slice(Math.floor(values.length / 2))
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
    
    if (firstAvg === 0) return { direction: 'neutral', percentage: 0 }
    
    const percentage = ((secondAvg - firstAvg) / firstAvg) * 100
    
    return {
      direction: percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'neutral',
      percentage: Math.abs(percentage)
    }
  }

  const userTrend = calculateTrend(data.dailyActiveUsers)
  const courseTrend = calculateTrend(data.courseCompletions)
  const videoTrend = calculateTrend(data.videoViews)

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          {getTrendIcon(userTrend.direction)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.dailyActiveUsers[data.dailyActiveUsers.length - 1]}
          </div>
          <p className={`text-xs ${getTrendColor(userTrend.direction)}`}>
            {userTrend.direction === 'up' ? '+' : userTrend.direction === 'down' ? '-' : ''}
            {userTrend.percentage.toFixed(1)}% vs período anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conclusões de Cursos</CardTitle>
          {getTrendIcon(courseTrend.direction)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.courseCompletions[data.courseCompletions.length - 1]}
          </div>
          <p className={`text-xs ${getTrendColor(courseTrend.direction)}`}>
            {courseTrend.direction === 'up' ? '+' : courseTrend.direction === 'down' ? '-' : ''}
            {courseTrend.percentage.toFixed(1)}% vs período anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visualizações de Vídeos</CardTitle>
          {getTrendIcon(videoTrend.direction)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.videoViews[data.videoViews.length - 1]}
          </div>
          <p className={`text-xs ${getTrendColor(videoTrend.direction)}`}>
            {videoTrend.direction === 'up' ? '+' : videoTrend.direction === 'down' ? '-' : ''}
            {videoTrend.percentage.toFixed(1)}% vs período anterior
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
