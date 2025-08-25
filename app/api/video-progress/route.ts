import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getAuthenticatedUser } from '@/lib/auth-server'

interface ProgressData {
  status: string
  progress_seconds: number
  completed_at: string | null
}

interface InsertError {
  code: string
  message: string
  details?: string
  hint?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const { user } = await getAuthenticatedUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se o request foi abortado
    if (request.signal?.aborted) {
      return NextResponse.json({ error: 'Request abortado' }, { status: 499 })
    }

    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error)
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
    }

    const { videoId, status, progressSeconds = 0 } = body

    if (!videoId || !status) {
      return NextResponse.json({ error: 'videoId e status são obrigatórios' }, { status: 400 })
    }

    const supabase = createClient()

    // Preparar dados para inserção/atualização
    const progressData: ProgressData = {
      status,
      progress_seconds: Math.floor(progressSeconds),
      completed_at: null
    }

    // Adicionar completed_at apenas quando o status for 'completed'
    if (status === 'completed') {
      progressData.completed_at = new Date().toISOString()
    }

    // Tentar inserir primeiro, se falhar por constraint único, atualizar
    try {
      const { data: insertResult, error: insertError } = await supabase
        .from('progress_videos')
        .insert({
          user_id: user.id,
          video_id: videoId,
          ...progressData
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      return NextResponse.json({ 
        success: true, 
        progress: insertResult,
        message: status === 'in_progress' ? 'Curso iniciado com sucesso!' : 'Progresso atualizado com sucesso!'
      })

    } catch (insertError: unknown) {
      // Se falhou por constraint único, tentar atualizar
      const error = insertError as InsertError
      if (error.code === '23505') {
        const { data: updateResult, error: updateError } = await supabase
          .from('progress_videos')
          .update(progressData)
          .eq('user_id', user.id)
          .eq('video_id', videoId)
          .select()
          .single()

        if (updateError) {
          console.error('Erro ao atualizar progresso:', updateError)
          return NextResponse.json({ error: 'Erro ao atualizar progresso' }, { status: 500 })
        }

        return NextResponse.json({ 
          success: true, 
          progress: updateResult,
          message: status === 'in_progress' ? 'Curso iniciado com sucesso!' : 'Progresso atualizado com sucesso!'
        })
      } else {
        // Se não for constraint único, retornar erro
        console.error('Erro ao inserir progresso:', insertError)
        return NextResponse.json({ error: 'Erro ao criar progresso' }, { status: 500 })
      }
    }

  } catch (error) {
    // Verificar se é um erro de conexão abortada
    if (error instanceof Error && error.message.includes('aborted')) {
      console.log('Request abortado pelo cliente')
      return NextResponse.json({ error: 'Request abortado' }, { status: 499 })
    }

    console.error('Erro na API de progresso do vídeo:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const { user } = await getAuthenticatedUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se o request foi abortado
    if (request.signal?.aborted) {
      return NextResponse.json({ error: 'Request abortado' }, { status: 499 })
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')

    if (!videoId) {
      return NextResponse.json({ error: 'videoId é obrigatório' }, { status: 400 })
    }

    const supabase = createClient()

    // Buscar progresso do usuário para este vídeo
    const { data: progress, error } = await supabase
      .from('progress_videos')
      .select('*')
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar progresso:', error)
      return NextResponse.json({ error: 'Erro ao buscar progresso' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      progress: progress || null 
    })

  } catch (error) {
    // Verificar se é um erro de conexão abortada
    if (error instanceof Error && error.message.includes('aborted')) {
      console.log('Request abortado pelo cliente')
      return NextResponse.json({ error: 'Request abortado' }, { status: 499 })
    }

    console.error('Erro na API de progresso do vídeo:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
