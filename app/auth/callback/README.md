# Página de Callback de Autenticação

## Visão Geral
Página estática que exibe diferentes estados do processo de login, sem integração real com sistemas de autenticação.

## Estados Disponíveis

### 1. Estado Pendente (Padrão)
- **URL**: `/auth/callback`
- **Visual**: Loader animado, skeletons, barra de progresso
- **Ações**: Nenhuma (estado de carregamento)

### 2. Estado de Sucesso
- **URL**: `/auth/callback?state=success`
- **Visual**: Ícone de sucesso, badge "SSO Microsoft"
- **Recurso**: Redirecionamento automático após 3 segundos para `/dashboard`

### 3. Estado de Erro
- **URL**: `/auth/callback?state=error`
- **Visual**: Ícone de erro, alerta destrutivo
- **Ações**:
  - "Tentar novamente" → `/login`
  - "Contatar administrador" → `/`
- **Recurso**: Tooltip com detalhes do erro (mock)

## Componentes Utilizados
- **Shadcn**: Card, Button, Badge, Alert, Progress, Skeleton, Separator, Tooltip
- **Lucide Icons**: CheckCircle, AlertCircle, Loader2, ExternalLink, User, Home
- **Next.js**: Suspense, searchParams

## Estrutura de Arquivos
```
app/auth/callback/
├── page.tsx              # Página principal (server component)
├── AutoRedirectClient.tsx # Componente cliente para redirecionamento
└── README.md             # Esta documentação
```

## Características Técnicas
- **Server Component**: Página principal sem `'use client'`
- **Responsivo**: Design mobile-first com max-width de 448px
- **Acessibilidade**: `aria-live="polite"` para leitores de tela
- **Estados**: Gerenciamento condicional baseado em query params
- **Fallback**: Suspense com skeletons durante carregamento
- **Redirecionamento**: Automático após 3 segundos no estado de sucesso

## Uso em Desenvolvimento
Para testar os diferentes estados, acesse:
- `/auth/callback` - Estado pendente
- `/auth/callback?state=success` - Estado de sucesso
- `/auth/callback?state=error` - Estado de erro

## Estilos
- **Background**: `bg-slate-50` (cinza claro)
- **Card**: `bg-white` com bordas arredondadas
- **Botões primários**: `bg-emerald-700` (verde Evous)
- **Sem sombras**: `shadow-none` para visual clean 