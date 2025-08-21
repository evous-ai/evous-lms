# Implementação da Coluna company_id

Este documento descreve as mudanças necessárias para implementar a nova coluna `company_id` na tabela `profiles` do banco de dados.

## Mudanças no Banco de Dados

### 1. Adicionar a nova coluna

Execute o seguinte comando SQL no seu projeto Supabase:

```sql
-- Adicionar a coluna company_id na tabela profiles
ALTER TABLE profiles 
ADD COLUMN company_id UUID NOT NULL DEFAULT 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31';

-- Criar índice para melhor performance
CREATE INDEX idx_profiles_company_id ON profiles(company_id);

-- Adicionar constraint de foreign key (opcional, se você tiver uma tabela companies)
-- ALTER TABLE profiles 
-- ADD CONSTRAINT fk_profiles_company_id 
-- FOREIGN KEY (company_id) REFERENCES companies(id);
```

### 2. Atualizar perfis existentes

Se você já tem usuários cadastrados, atualize todos os perfis existentes:

```sql
-- Atualizar todos os perfis existentes com o company_id padrão
UPDATE profiles 
SET company_id = 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31' 
WHERE company_id IS NULL;
```

## Mudanças no Código

### 1. Tipos TypeScript (✅ Já implementado)

O arquivo `lib/types.ts` foi atualizado para incluir o campo `company_id`:

```typescript
export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  country: string | null
  address: string | null
  email: string | null
  phone?: string | null
  age?: string | null
  position?: string | null
  notification?: boolean | null
  company_id: string  // ✅ Nova coluna
  updated_at: string
}
```

### 2. Formulário de Perfil (✅ Já implementado)

O arquivo `app/perfil/perfil-form.tsx` foi atualizado para incluir o `company_id` na criação automática de perfis:

```typescript
// Na função createProfileIfNotExists
const { data, error } = await supabase
  .from('profiles')
  .insert({
    id: user.id,
    email: user.email,
    full_name: user.email?.split('@')[0] || 'Usuário',
    username: user.email?.split('@')[0] || 'usuario',
    notification: true,
    company_id: "c9551059-35fb-4c5e-bcb7-bc09ddc25f31" // ✅ Valor padrão
  })
  .select()
  .single()
```

### 3. Interface do Formulário (✅ Já implementado)

A interface `PerfilFormProps` foi atualizada para incluir o campo `company_id`:

```typescript
interface PerfilFormProps {
  user: {
    id: string
    email?: string
  }
  profile: {
    // ... outros campos
    company_id?: string | null  // ✅ Nova coluna
    updated_at?: string | null
  } | null
}
```

## Valor Padrão

O valor padrão para `company_id` é hardcode como:
```
c9551059-35fb-4c5e-bcb7-bc09ddc25f31
```

## Comportamento

1. **Novos usuários**: Todos os novos usuários terão automaticamente o `company_id` definido como o valor padrão
2. **Usuários existentes**: Se você executar o SQL de atualização, todos os usuários existentes também terão o `company_id` definido
3. **Criação automática**: Quando um perfil é criado automaticamente (através da função `createProfileIfNotExists`), o `company_id` é sempre incluído

## Próximos Passos

1. **Executar o SQL** no seu projeto Supabase para adicionar a coluna
2. **Testar** a criação de novos usuários para verificar se o `company_id` está sendo definido corretamente
3. **Verificar** se os usuários existentes foram atualizados (se aplicável)

## Verificação

Para verificar se a implementação está funcionando:

1. Crie um novo usuário
2. Verifique no banco de dados se o perfil foi criado com o `company_id` correto
3. Verifique se o campo aparece corretamente na interface do perfil

## Notas Importantes

- O `company_id` é obrigatório (NOT NULL) no banco de dados
- Todos os novos perfis devem ter este campo preenchido
- O valor padrão é hardcode por enquanto, mas pode ser configurável no futuro
- A coluna foi adicionada como UUID para compatibilidade com futuras implementações de tabela de empresas
