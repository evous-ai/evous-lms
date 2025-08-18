# Configuração da Autenticação - Vision LMS

Este documento descreve como configurar e usar o sistema de autenticação implementado no projeto Vision LMS.

## Pré-requisitos

1. **Conta no Supabase**: Crie uma conta em [supabase.com](https://supabase.com)
2. **Projeto Supabase**: Crie um novo projeto no Supabase
3. **Banco de dados configurado**: Configure as tabelas necessárias

## Configuração do Supabase

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
```

### 2. Estrutura do Banco de Dados

Execute os seguintes comandos SQL no seu projeto Supabase:

#### Tabela de Perfis

```sql
-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  pais TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver seus próprios perfis" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios perfis" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar timestamp automaticamente
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Configuração de Autenticação

No painel do Supabase, vá para **Authentication > Settings** e configure:

1. **Site URL**: `http://localhost:3000` (desenvolvimento)
2. **Redirect URLs**: 
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/perfil`

## Funcionalidades Implementadas

### 1. Autenticação de Usuários

- **Cadastro**: Criação de conta com validação de dados
- **Login**: Autenticação com email e senha
- **Logout**: Encerramento de sessão
- **Proteção de Rotas**: Páginas protegidas para usuários autenticados

### 2. Gerenciamento de Perfis

- **Username Único**: Gerado automaticamente a partir do nome completo
- **Informações Pessoais**: Nome completo, país
- **Avatar**: Campo preparado para futura implementação de upload
- **Validações**: Verificação de unicidade e integridade dos dados

### 3. Componentes de Interface

- **AuthGuard**: Componente para proteger rotas
- **useAuth Hook**: Hook personalizado para gerenciar estado de autenticação
- **Formulários**: Formulários de cadastro e edição de perfil

## Uso

### Proteção de Rotas

```tsx
import { AuthGuard } from "@/components/auth-guard"

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Conteúdo protegido</div>
    </AuthGuard>
  )
}
```

### Hook de Autenticação

```tsx
import { useAuth } from "@/hooks/use-auth"

export default function MyComponent() {
  const { user, loading, signOut } = useAuth()
  
  if (loading) return <div>Carregando...</div>
  
  return (
    <div>
      <p>Olá, {user?.profile.full_name}!</p>
      <button onClick={signOut}>Sair</button>
    </div>
  )
}
```

### Atualização de Perfil

```tsx
import { updateProfile } from "@/lib/auth"

const handleUpdate = async () => {
  const result = await updateProfile({
    full_name: "Novo Nome",
    pais: "Brasil"
  })
  
  if (result.success) {
    console.log("Perfil atualizado!")
  }
}
```

## Estrutura de Arquivos

```
lib/
├── auth.ts          # Funções de autenticação
├── supabase.ts      # Configuração do cliente Supabase
└── types.ts         # Tipos TypeScript

hooks/
└── use-auth.ts      # Hook de autenticação

components/
└── auth-guard.tsx   # Componente de proteção de rotas

app/
├── layout.tsx       # Layout com AuthProvider
├── page.tsx         # Página de login
├── signup/
│   └── page.tsx    # Página de cadastro
├── dashboard/
│   └── page.tsx    # Dashboard protegido
└── perfil/
    └── page.tsx    # Perfil protegido
```

## Próximos Passos

1. **Upload de Avatar**: Implementar funcionalidade de upload de imagens
2. **Recuperação de Senha**: Adicionar funcionalidade de reset de senha
3. **Verificação de Email**: Implementar confirmação de email
4. **Autenticação Social**: Adicionar login com Google, GitHub, etc.
5. **Testes**: Implementar testes unitários e de integração

## Troubleshooting

### Erro de Conexão com Supabase

- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se as políticas de segurança estão configuradas

### Erro de Usuário não Encontrado

- Verifique se a tabela `profiles` foi criada corretamente
- Confirme se as políticas RLS estão funcionando
- Verifique se o usuário foi criado tanto na tabela `auth.users` quanto em `profiles`

### Problemas de Redirecionamento

- Verifique as URLs de redirecionamento no painel do Supabase
- Confirme se as rotas estão configuradas corretamente no Next.js
- Verifique se o middleware de autenticação está funcionando

## Suporte

Para dúvidas ou problemas, consulte:
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Issues do projeto](link-para-issues)
