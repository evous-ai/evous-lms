import { NextRequest, NextResponse } from 'next/server'
import { getCategoryProgress } from '@/lib/courses-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const categoryProgress = await getCategoryProgress(userId, limit)

    return NextResponse.json({ categoryProgress })
  } catch (error) {
    console.error('Erro na API de progresso por categoria:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
