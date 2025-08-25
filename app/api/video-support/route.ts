import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getAuthenticatedUser } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const { videoId, name, email, requestType, subject, message } = await request.json()
    
    // Validação dos campos obrigatórios
    if (!name || !email || !requestType || !subject || !message) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    // Validação do tipo de solicitação
    const validRequestTypes = ['duvida', 'tecnico', 'sugestao', 'outro']
    if (!validRequestTypes.includes(requestType)) {
      return NextResponse.json({ error: 'Tipo de solicitação inválido' }, { status: 400 })
    }

    const supabase = createClient()

    // Inserir solicitação de suporte
    const { data: supportRequest, error: insertError } = await supabase
      .from('video_support_requests')
      .insert({
        video_id: videoId,
        user_id: user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        request_type: requestType,
        subject: subject.trim(),
        message: message.trim(),
        status: 'open', // Status padrão
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao inserir solicitação de suporte:', insertError)
      return NextResponse.json({ error: 'Erro ao salvar solicitação' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      supportRequest,
      message: 'Solicitação enviada com sucesso! Entraremos em contato em breve.'
    })

  } catch (error) {
    console.error('Erro na API de suporte:', error)
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

    // Buscar solicitações de suporte do usuário para este vídeo com mais detalhes
    const { data: userRequests, error: userError } = await supabase
      .from('video_support_requests')
      .select(`
        id,
        request_type,
        subject,
        message,
        status,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .order('created_at', { ascending: false })

    if (userError) {
      console.error('Erro ao buscar solicitações do usuário:', userError)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    // Formatar as datas para exibição
    const formattedRequests = (userRequests || []).map(request => ({
      ...request,
      created_at_formatted: new Date(request.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      updated_at_formatted: request.updated_at ? new Date(request.updated_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : null
    }))

    return NextResponse.json({
      userRequests: formattedRequests,
      canCreateNew: true // Usuário sempre pode criar nova solicitação
    })

  } catch (error) {
    console.error('Erro na API de suporte:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
