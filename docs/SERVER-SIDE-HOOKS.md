# Funções Server-Side para Vision LMS

Este documento explica como usar o novo sistema de funções server-side implementado para melhorar a performance e SEO da aplicação.

## 🚀 Benefícios da Implementação Server-Side

- **Performance**: Dados são carregados no servidor antes do HTML ser enviado
- **SEO**: Conteúdo é renderizado no servidor, melhorando indexação
- **Reutilização**: Funções podem ser usadas em qualquer Server Component
- **Menos JavaScript**: Reduz o bundle JavaScript enviado ao cliente
- **Melhor UX**: Página carrega com dados já disponíveis

## 📁 Estrutura dos Arquivos

```
lib/
├── hooks-server.ts          # Funções server-side reutilizáveis
├── categories-server.ts     # Funções para buscar categorias
├── courses-server.ts        # Funções para buscar cursos
└── utils.ts                 # Utilitários incluindo conversores

app/
├── dashboard/
│   ├── page.tsx            # Server Component usando funções
│   └── dashboard-client.tsx # Client Component recebendo dados
└── exemplo-uso-server/
    └── page.tsx            # Exemplo de uso das funções
```

## 🔧 Funções Disponíveis

### 1. `getDashboardData(userId, companyId)`

Busca todos os dados necessários para o dashboard em uma única chamada.

```typescript
import { getDashboardData } from '@/lib/hooks-server'

export default async function DashboardPage() {
  const { user, profile } = await getAuthenticatedUser()
  
  const dashboardData = await getDashboardData(
    user.id, 
    profile?.company_id || ''
  )
  
  return <DashboardClient initialData={dashboardData} />
}
```

**Retorna:**
```typescript
{
  categorias: Category[]
  cursos: Course[]
  progressoCategorias: CategoryProgress[]
  error: string | null
}
```

### 2. `getCompanyData(companyId)`

Busca dados específicos de uma empresa.

```typescript
import { getCompanyData } from '@/lib/hooks-server'

const companyData = await getCompanyData(profile?.company_id || '')
```

**Retorna:**
```typescript
{
  categorias: Category[]
  error: string | null
}
```

### 3. `getCoursesData(userId, limit)`

Busca cursos com limite configurável.

```typescript
import { getCoursesData } from '@/lib/hooks-server'

const coursesData = await getCoursesData(user.id, 6)
```

**Retorna:**
```typescript
{
  cursos: Course[]
  error: string | null
}
```

## 📝 Como Usar em Outras Páginas

### Passo 1: Criar Server Component

```typescript
// app/minha-pagina/page.tsx
import { getCompanyData } from '@/lib/hooks-server'

export default async function MinhaPagina() {
  const companyData = await getCompanyData('company-id')
  
  return (
    <div>
      <h1>Minha Página</h1>
      {/* Renderizar dados */}
    </div>
  )
}
```

### Passo 2: Usar em Client Components (se necessário)

```typescript
// app/minha-pagina/minha-pagina-client.tsx
"use client"

interface MinhaPaginaClientProps {
  initialData: {
    categorias: Category[]
    error: string | null
  }
}

export default function MinhaPaginaClient({ initialData }: MinhaPaginaClientProps) {
  // Dados já estão disponíveis, não precisa fazer fetch
  const { categorias, error } = initialData
  
  if (error) {
    return <div>Erro: {error}</div>
  }
  
  return (
    <div>
      {categorias.map(cat => (
        <div key={cat.id}>{cat.name}</div>
      ))}
    </div>
  )
}
```

## 🔄 Conversão de Tipos

Para compatibilidade com componentes existentes, use a função de conversão:

```typescript
import { convertCourseToTreinamento } from '@/lib/utils'

// Converter Course para Treinamento
const treinamentos = cursos.map(convertCourseToTreinamento)
```

## ⚡ Performance

### Busca Paralela

As funções usam `Promise.all()` para buscar dados em paralelo:

```typescript
const [categorias, cursos, progressoCategorias] = await Promise.all([
  getCategoriesByCompany(companyId),
  getLatestCourses(6),
  getCategoryProgress(userId, 10)
])
```

### Cache do Next.js

Os dados são automaticamente cacheados pelo Next.js quando usado em Server Components.

## 🚨 Tratamento de Erros

Todas as funções retornam um objeto com campo `error`:

```typescript
const data = await getDashboardData(userId, companyId)

if (data.error) {
  // Tratar erro
  return <ErrorComponent message={data.error} />
}
```

## 📱 Exemplo Completo

Veja `app/exemplo-uso-server/page.tsx` para um exemplo completo de uso.

## 🔮 Próximos Passos

1. **Implementar em outras páginas**: Aplicar o padrão em `/meus-treinamentos`, `/trilha`, etc.
2. **Adicionar cache**: Implementar cache mais sofisticado com Redis ou similar
3. **Otimizar queries**: Refinar as queries do Supabase para melhor performance
4. **Adicionar loading states**: Implementar loading states para operações assíncronas

## ❓ FAQ

**Q: Posso usar estas funções em Client Components?**
R: Não, estas funções são específicas para Server Components. Para Client Components, passe os dados como props.

**Q: Como atualizar dados em tempo real?**
R: Use Server Actions ou API Routes para operações de escrita, e revalide o cache conforme necessário.

**Q: E se eu precisar de dados diferentes para cada usuário?**
R: As funções já recebem `userId` como parâmetro, então os dados são específicos para cada usuário.

**Q: Por que não são hooks React?**
R: Porque hooks React só funcionam em Client Components e funções async. Para Server Components, usamos funções regulares.
