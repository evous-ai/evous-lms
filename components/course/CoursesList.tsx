import { Course } from '@/lib/courses-server'
import { CourseCard } from './CourseCard'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface CoursesListProps {
  courses: Course[]
  title?: string
  showViewAll?: boolean
  viewAllHref?: string
  className?: string
}

export function CoursesList({ 
  courses, 
  title, 
  showViewAll = false, 
  viewAllHref = '/trilha',
  className = '' 
}: CoursesListProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">Nenhum curso encontrado</p>
          <p className="text-sm">Tente novamente mais tarde</p>
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
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
