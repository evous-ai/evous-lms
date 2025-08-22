import { CategoryProgress } from '@/lib/courses-server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, Play, CheckCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface CategoryProgressCardProps {
  progress: CategoryProgress
  className?: string
}

export function CategoryProgressCard({ progress, className = '' }: CategoryProgressCardProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes}min`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'em-andamento':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'nao-iniciado':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Começar':
        return <Play className="w-4 h-4" />
      case 'Continuar':
        return <RefreshCw className="w-4 h-4" />
      case 'Revisar':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const getActionVariant = (action: string) => {
    switch (action) {
      case 'Começar':
        return 'default'
      case 'Continuar':
        return 'default'
      case 'Revisar':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: progress.category_color || '#6B7280' }}
            />
            <h3 className="font-semibold text-lg">{progress.category_name}</h3>
          </div>
          <Badge className={`text-xs font-medium ${getStatusColor(progress.status)}`}>
            {progress.status === 'concluido' ? 'Concluído' : 
             progress.status === 'em-andamento' ? 'Em Andamento' : 'Não Iniciado'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {formatDuration(progress.total_duration)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-gray-600 dark:text-gray-400">
              {progress.videos_count} vídeo{progress.videos_count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progresso</span>
            <span className="font-medium">{progress.completion_percentage}%</span>
          </div>
          <Progress value={progress.completion_percentage} className="h-2" />
          <div className="text-xs text-gray-500">
            {progress.progress_count} de {progress.videos_count} vídeos assistidos
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="pt-2">
          <Link href={`/trilha?category=${progress.category_slug}`}>
            <div className={`
              inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium
              transition-colors cursor-pointer w-full
              ${getActionVariant(progress.user_action) === 'default' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
              }
            `}>
              {getActionIcon(progress.user_action)}
              <span className="ml-2">{progress.user_action}</span>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
