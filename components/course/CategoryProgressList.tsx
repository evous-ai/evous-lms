import { CategoryProgress } from '@/lib/courses-server'
import { CategoryProgressCard } from './CategoryProgressCard'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface CategoryProgressListProps {
  categoryProgress: CategoryProgress[]
  title?: string
  showViewAll?: boolean
  viewAllHref?: string
  className?: string
}

export function CategoryProgressList({ 
  categoryProgress, 
  title, 
  showViewAll = false, 
  viewAllHref = '/trilha',
  className = '' 
}: CategoryProgressListProps) {
  if (!categoryProgress || categoryProgress.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Nenhum progresso encontrado</p>
          <p className="text-sm">Comece a assistir vídeos para ver seu progresso</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {(title || showViewAll) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          )}
          {showViewAll && (
            <Link href={viewAllHref}>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryProgress.map((progress) => (
          <CategoryProgressCard key={progress.category_id} progress={progress} />
        ))}
      </div>
    </div>
  )
}
