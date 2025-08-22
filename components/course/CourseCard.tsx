import { Course } from '@/lib/courses-server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CourseCardProps {
  course: Course
  showCategory?: boolean
  className?: string
}

export function CourseCard({ course, showCategory = true, className = '' }: CourseCardProps) {
  const getLevelColor = (level: string | null) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getLevelText = (level: string | null) => {
    switch (level) {
      case 'beginner':
        return 'Iniciante'
      case 'intermediate':
        return 'Intermediário'
      case 'advanced':
        return 'Avançado'
      default:
        return 'N/A'
    }
  }

  return (
    <Link href={`/trilha/${course.id}`}>
      <Card className={`group hover:shadow-lg transition-all duration-200 cursor-pointer ${className}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            {course.cover_image ? (
              <Image
                src={course.cover_image}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            )}
            {course.categories && showCategory && (
              <div className="absolute top-2 left-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs font-medium"
                  style={{
                    backgroundColor: course.categories.color || undefined,
                    color: course.categories.color ? 'white' : undefined
                  }}
                >
                  {course.categories.name}
                </Badge>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge className={`text-xs font-medium ${getLevelColor(course.level)}`}>
                {getLevelText(course.level)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>
            
            {course.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {course.description}
              </p>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {course.rating_average && course.rating_average > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating_average.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Recente</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-400">
                {new Date(course.created_at).toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
