import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Configuração do cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'evous'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string
    const directory = formData.get('directory') as string
    const userId = formData.get('userId') as string

    // Validações
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    if (!fileName || !directory || !userId) {
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

    // Converter arquivo para buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Construir chave do arquivo no S3
    const key = `${directory}/${userId}/${fileName}`

    // Comando para upload
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read', // Tornar o arquivo público
      Metadata: {
        'original-name': file.name,
        'uploaded-by': userId,
        'upload-date': new Date().toISOString(),
      },
    })

    // Fazer upload
    await s3Client.send(uploadCommand)

    // Construir URL pública
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`

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
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor durante o upload',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
