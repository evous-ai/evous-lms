import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CourseAnalytics, 
  VideoAnalytics, 
  UserAnalytics, 
  EngagementAnalytics 
} from '@/hooks/use-analytics-dashboard'

interface DataTablesProps {
  courses: CourseAnalytics
  videos: VideoAnalytics
  users: UserAnalytics
  engagement: EngagementAnalytics
}

export function DataTables({ courses, videos, users, engagement }: DataTablesProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 🎯 Cursos Mais Visualizados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cursos Mais Visualizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courses.mostViewed.map((course, index) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.views.toLocaleString('pt-BR')} visualizações
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {course.completion}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 📹 Vídeos Mais Assistidos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vídeos Mais Assistidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {videos.mostWatched.map((video, index) => (
              <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{video.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {video.views.toLocaleString('pt-BR')} visualizações
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {video.avgWatchTime}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 👥 Usuários Mais Engajados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usuários Mais Engajados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.topEngaged.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.courses} cursos • {user.videos} vídeos
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {user.timeSpent}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 🔍 Termos de Busca Populares */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Termos de Busca Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {engagement.popularSearches.map((search, index) => (
              <div key={search.term} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">&ldquo;{search.term}&rdquo;</p>
                    <p className="text-xs text-muted-foreground">
                      {search.count} buscas
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {((search.count / engagement.totalSearches) * 100).toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
