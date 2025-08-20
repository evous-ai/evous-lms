import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3'

// Configuração do cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'evous'

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando upload de avatar...')
    console.log('Variáveis de ambiente:', {
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET_NAME,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
    })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string
    const directory = formData.get('directory') as string
    const userId = formData.get('userId') as string

    console.log('Dados recebidos:', {
      fileName,
      directory,
      userId,
      fileType: file?.type,
      fileSize: file?.size
    })

    // Validações
    if (!file) {
      console.log('Erro: Nenhum arquivo foi enviado')
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    if (!fileName || !directory || !userId) {
      console.log('Erro: Parâmetros obrigatórios não fornecidos', { fileName, directory, userId })
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Apenas arquivos de imagem são permitidos' },
        { status: 400 }
      )
    }

    // Validar tamanho (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'O arquivo deve ter no máximo 5MB' },
        { status: 400 }
      )
    }

    // Verificar se o bucket existe e está acessível
    try {
      console.log('Verificando acesso ao bucket...')
      await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }))
      console.log('Bucket acessível:', BUCKET_NAME)
    } catch (bucketError) {
      console.error('Erro ao acessar bucket:', bucketError)
      return NextResponse.json(
        { error: 'Bucket de armazenamento não acessível. Verifique as configurações.' },
        { status: 500 }
      )
    }

    // Converter arquivo para buffer
    console.log('Convertendo arquivo para buffer...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('Buffer criado, tamanho:', buffer.length)

    // Construir chave do arquivo no S3
    const key = `${directory}/${userId}/${fileName}`
    console.log('Chave S3:', key)

    // Comando para upload
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        'original-name': file.name,
        'uploaded-by': userId,
        'upload-date': new Date().toISOString(),
      },
    })

    console.log('Iniciando upload para S3...')
    // Fazer upload
    await s3Client.send(uploadCommand)
    console.log('Upload para S3 concluído com sucesso')

    // Construir URL pública
    // Se o bucket não permite ACLs, a URL será baseada na política de bucket
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-2'}.amazonaws.com/${key}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key: key,
      fileName: fileName,
      size: file.size,
      type: file.type,
    })

  } catch (error) {
    console.error('Erro no upload do avatar:', error)
    
    // Tratamento específico para erros AWS
    let errorMessage = 'Erro interno do servidor durante o upload'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('Access Denied') || error.message.includes('Unauthorized')) {
        errorMessage = 'Erro de acesso ao serviço de armazenamento. Verifique as credenciais.'
        statusCode = 403
      } else if (error.message.includes('NoSuchBucket')) {
        errorMessage = 'Bucket de armazenamento não encontrado.'
        statusCode = 404
      } else if (error.message.includes('InvalidAccessKeyId')) {
        errorMessage = 'Credenciais de acesso inválidas.'
        statusCode = 401
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: statusCode }
    )
  }
}
