import { NextResponse } from 'next/server'
import { getAuthenticatedUserForAPI } from '@/lib/auth-server'

// ✅ Função para buscar dados de analytics
export async function GET() {
  try {
    // ✅ Verificar autenticação sem redirect
    const userData = await getAuthenticatedUserForAPI()
    if (!userData) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // ✅ Verificar se é gestor (você pode implementar sua lógica de permissão aqui)
    // Por enquanto, vamos permitir para todos os usuários autenticados

    // ✅ Buscar dados de analytics do Google Analytics
    const analyticsData = await fetchAnalyticsData()

    return NextResponse.json({ 
      success: true, 
      data: analyticsData 
    })

  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}

// ✅ Função para buscar dados do Google Analytics
async function fetchAnalyticsData() {
  try {
    // ✅ Aqui você pode integrar com a API do Google Analytics
    // Por enquanto, vamos retornar dados mockados para demonstração
    
    const mockData = {
      // 📊 Visão Geral
      overview: {
        totalUsers: 1247,
        activeUsers: 89,
        totalSessions: 3421,
        averageSessionDuration: '12m 34s',
        bounceRate: '23.4%',
        conversionRate: '8.7%'
      },
      
      // 🎯 Cursos
      courses: {
        totalViews: 5678,
        mostViewed: [
          { id: '1', title: 'Introdução ao LMS', views: 1234, completion: '67%' },
          { id: '2', title: 'Gestão de Conteúdo', views: 987, completion: '78%' },
          { id: '3', title: 'Análise de Dados', views: 756, completion: '82%' }
        ],
        averageCompletion: '72.3%',
        totalCompletions: 2341
      },
      
      // 📹 Vídeos
      videos: {
        totalViews: 15432,
        mostWatched: [
          { id: '1', title: 'Aula 1: Introdução', views: 2341, avgWatchTime: '8m 45s' },
          { id: '2', title: 'Aula 2: Conceitos Básicos', views: 1987, avgWatchTime: '12m 23s' },
          { id: '3', title: 'Aula 3: Prática', views: 1654, avgWatchTime: '15m 12s' }
        ],
        averageWatchTime: '11m 34s',
        completionRate: '68.9%'
      },
      
      // 👥 Usuários
      users: {
        totalRegistered: 1247,
        activeThisWeek: 234,
        activeThisMonth: 567,
        newThisWeek: 45,
        newThisMonth: 123,
        topEngaged: [
          { id: '1', name: 'João Silva', courses: 8, videos: 45, timeSpent: '23h 45m' },
          { id: '2', name: 'Maria Santos', courses: 6, videos: 38, timeSpent: '19h 23m' },
          { id: '3', name: 'Pedro Costa', courses: 7, videos: 42, timeSpent: '21h 12m' }
        ]
      },
      
      // 🔍 Engajamento
      engagement: {
        totalSearches: 3456,
        popularSearches: [
          { term: 'gestão', count: 234 },
          { term: 'liderança', count: 187 },
          { term: 'inovação', count: 156 },
          { term: 'tecnologia', count: 134 }
        ],
        filterUsage: [
          { type: 'categoria', value: 'gestão', count: 456 },
          { type: 'nível', value: 'iniciante', count: 234 },
          { type: 'duração', value: 'curto', count: 189 }
        ],
        averageTimeOnPage: '4m 23s'
      },
      
      // 📈 Tendências (últimos 30 dias)
      trends: {
        dailyActiveUsers: [89, 92, 87, 95, 101, 98, 94, 89, 96, 103, 97, 91, 88, 95, 102, 99, 93, 90, 97, 104, 100, 94, 89, 96, 103, 98, 92, 89, 95, 101],
        courseCompletions: [12, 15, 8, 19, 23, 17, 14, 11, 18, 25, 20, 16, 13, 19, 24, 21, 17, 14, 20, 26, 22, 18, 15, 21, 27, 23, 19, 16, 22, 28],
        videoViews: [234, 256, 198, 287, 312, 276, 245, 223, 289, 334, 298, 267, 234, 289, 345, 312, 278, 245, 301, 356, 323, 289, 256, 312, 367, 334, 301, 267, 323, 378]
      }
    }

    return mockData

  } catch (error) {
    console.error('Erro ao buscar dados de analytics:', error)
    throw error
  }
}
