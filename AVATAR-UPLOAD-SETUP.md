# 🖼️ Upload de Avatar para AWS S3

## 📋 Visão Geral

Sistema completo de upload de avatar para usuários, integrado com AWS S3 e Supabase. Permite que usuários selecionem, visualizem e enviem imagens de perfil diretamente do formulário de perfil.

## ✨ Funcionalidades

- **Upload para AWS S3**: Diretório fixo `lsm/avatar`
- **Validação de arquivos**: Apenas imagens, máximo 5MB
- **Sanitização de nomes**: Sem espaços, caracteres especiais, sempre lowercase
- **Preview em tempo real**: Visualização antes do upload
- **Barra de progresso**: Feedback visual durante o envio
- **Integração Supabase**: Atualização automática do campo `avatar_url`
- **Interface responsiva**: Componente circular com overlay hover
- **Mensagens em português**: Feedback localizado para o usuário

## 🏗️ Arquitetura

### Componentes
- `AvatarUpload`: Componente principal reutilizável
- `Avatar`: Componente de exibição do avatar
- `Progress`: Barra de progresso do upload
- `Alert`: Mensagens de status (sucesso/erro)

### API Routes
- `/api/upload-avatar`: Endpoint para upload para S3

### Integrações
- **AWS S3**: Armazenamento de arquivos
- **Supabase**: Banco de dados e autenticação
- **Next.js**: Framework e API routes

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis no seu `.env.local`:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-2
AWS_BUCKET_NAME=evous
```

# Supabase Configuration (já existente)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Permissões AWS S3

Certifique-se de que sua conta AWS tenha as seguintes permissões:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::evous/lsm/avatar/*"
    }
  ]
}
```

### 3. Política de Bucket S3

Configure o bucket para permitir acesso público aos avatares:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForAvatarBucket",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::evous/lsm/avatar/*"
    }
  ]
}
```

## 🚀 Uso

### Componente Básico

```tsx
import { AvatarUpload } from "@/components/ui/avatar-upload"

<AvatarUpload
  currentAvatarUrl={user.avatar_url}
  userId={user.id}
  onAvatarUpdate={(newUrl) => setAvatarUrl(newUrl)}
/>
```

### Com Props Personalizadas

```tsx
<AvatarUpload
  currentAvatarUrl={user.avatar_url}
  userId={user.id}
  onAvatarUpdate={(newUrl) => setAvatarUrl(newUrl)}
  size="lg"
  className="mx-auto"
/>
```

### Props Disponíveis

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `currentAvatarUrl` | `string \| null` | - | URL atual do avatar |
| `userId` | `string` | - | ID do usuário (obrigatório) |
| `onAvatarUpdate` | `(url: string) => void` | - | Callback após upload |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamanho do avatar |
| `className` | `string` | `""` | Classes CSS adicionais |

## 📁 Estrutura de Arquivos

```
components/ui/
├── avatar-upload.tsx          # Componente principal
├── avatar.tsx                 # Componente de exibição
└── progress.tsx               # Barra de progresso

app/api/
└── upload-avatar/
    └── route.ts               # API route para S3

app/perfil/
└── perfil-form.tsx            # Formulário integrado
```

## 🔄 Fluxo de Upload

1. **Seleção**: Usuário clica no avatar para selecionar arquivo
2. **Validação**: Verificação de tipo e tamanho (máx. 5MB)
3. **Preview**: Exibição da imagem selecionada
4. **Upload**: Envio para AWS S3 via API route
5. **Progresso**: Barra de progresso durante o envio
6. **Atualização**: Atualização no Supabase e interface
7. **Sucesso**: Mensagem de confirmação e limpeza

## 🛡️ Segurança

- **Validação de tipos**: Apenas arquivos de imagem
- **Limite de tamanho**: Máximo 5MB por arquivo
- **Sanitização**: Nomes de arquivo limpos e seguros
- **Autenticação**: Usuário deve estar logado
- **Isolamento**: Cada usuário tem seu diretório no S3

## 🎨 Personalização

### Cores e Estilos

O componente usa as variáveis CSS do tema Shadcn UI:

```css
--border: 220 13% 91%
--muted: 220 14.3% 95.9%
--muted-foreground: 220 8.9% 46.1%
```

### Tamanhos Disponíveis

- **sm**: 64x64px (`h-16 w-16`)
- **md**: 96x96px (`h-24 w-24`) - Padrão
- **lg**: 128x128px (`h-32 w-32`)

## 🐛 Troubleshooting

### Erro: "Erro interno do servidor durante o upload"

Este é o erro mais comum e pode ter várias causas:

#### 1. **Variáveis de Ambiente Incorretas**
```bash
# ❌ Incorreto (não funcionará)
AWS_S3_BUCKET_NAME=evous

# ✅ Correto
AWS_BUCKET_NAME=evous
```

#### 2. **Região AWS Incorreta**
```bash
# ❌ Incorreto (pode causar timeout)
AWS_REGION=us-east-1

# ✅ Correto (verifique sua região real)
AWS_REGION=us-east-2
```

#### 3. **Credenciais AWS Inválidas**
- Verifique se `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY` estão corretos
- Confirme se as credenciais têm permissões para S3
- Teste as credenciais no AWS CLI

#### 4. **Bucket S3 Não Existe**
- Confirme se o bucket `evous` existe na sua conta AWS
- Verifique se está na região correta

#### 5. **Permissões Insuficientes**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::evous/lsm/avatar/*"
    }
  ]
}
```

### Como Debuggar

1. **Verifique os logs do servidor** - A API agora tem logs detalhados
2. **Use o arquivo de teste** - `test-upload.html` para testar a API
3. **Verifique o console do navegador** - Para erros de rede
4. **Teste as credenciais AWS** - Use AWS CLI ou console

### Erro: "Access Denied"
- Verifique as permissões AWS
- Confirme se o bucket existe e está acessível

### Erro: "File too large"
- O arquivo excede 5MB
- Comprima a imagem antes do upload

### Erro: "Invalid file type"
- Apenas arquivos de imagem são aceitos
- Formatos: JPG, PNG, GIF, WebP

### Avatar não atualiza
- Verifique se o callback `onAvatarUpdate` está funcionando
- Confirme se o Supabase está atualizando corretamente

## 📱 Responsividade

O componente é totalmente responsivo e funciona em:
- **Desktop**: Hover effects e interações completas
- **Tablet**: Touch-friendly com botões maiores
- **Mobile**: Interface otimizada para toque

## 🔮 Próximos Passos

- [ ] Suporte a múltiplos formatos de imagem
- [ ] Compressão automática de imagens
- [ ] Crop/redimensionamento de imagens
- [ ] Histórico de avatares
- [ ] Backup automático no S3
- [ ] Integração com CDN

## 📄 Licença

Este componente é parte do projeto Vision LMS e segue as mesmas diretrizes de licenciamento.
