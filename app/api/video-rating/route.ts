import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getAuthenticatedUser } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const { videoId, rating } = await request.json()
    
    if (!videoId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const supabase = createClient()

    // Verificar se o usuário já avaliou este vídeo
    const { data: existingRating, error: checkError } = await supabase
      .from('ratings_videos')
      .select('id, rating')
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao verificar avaliação existente:', checkError)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    // Se já existe uma avaliação, não permitir alteração
    if (existingRating) {
      return NextResponse.json({ 
        error: 'Você já avaliou este vídeo e não pode alterar a avaliação',
        currentRating: existingRating.rating
      }, { status: 400 })
    }

    // Inserir nova avaliação
    const { data: newRating, error: insertError } = await supabase
      .from('ratings_videos')
      .insert({
        user_id: user.id,
        video_id: videoId,
        rating: rating,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao inserir avaliação:', insertError)
      return NextResponse.json({ error: 'Erro ao salvar avaliação' }, { status: 500 })
    }

    // Atualizar o rating_video na tabela videos
    const { error: updateError } = await supabase
      .from('videos')
      .update({ 
        rating_video: rating,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId)

    if (updateError) {
      console.error('Erro ao atualizar rating do vídeo:', updateError)
      // Não falhar se não conseguir atualizar o rating do vídeo
    }

    return NextResponse.json({ 
      success: true, 
      rating: newRating,
      message: 'Avaliação salva com sucesso!'
    })

  } catch (error) {
    console.error('Erro na API de avaliação:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')
    
    if (!videoId) {
      return NextResponse.json({ error: 'ID do vídeo é obrigatório' }, { status: 400 })
    }

    const supabase = createClient()

    // Buscar avaliação do usuário para este vídeo
    const { data: userRating, error: userError } = await supabase
      .from('ratings_videos')
      .select('id, rating, created_at')
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('Erro ao buscar avaliação do usuário:', userError)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    // Buscar estatísticas gerais do vídeo
    const { data: videoStats, error: statsError } = await supabase
      .from('ratings_videos')
      .select('rating')
      .eq('video_id', videoId)

    if (statsError) {
      console.error('Erro ao buscar estatísticas do vídeo:', statsError)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    // Calcular estatísticas
    const totalRatings = videoStats.length
    const averageRating = totalRatings > 0 
      ? videoStats.reduce((acc, r) => acc + r.rating, 0) / totalRatings 
      : 0

    return NextResponse.json({
      userRating: userRating || null,
      stats: {
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10, // Arredondar para 1 casa decimal
        canRate: !userRating // Usuário pode avaliar se não avaliou antes
      }
    })

  } catch (error) {
    console.error('Erro na API de avaliação:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
