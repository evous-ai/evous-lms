# Implementação de Cursos no LMS

## Visão Geral

Esta implementação fornece uma solução completa e reutilizável para exibir cursos no sistema LMS, incluindo:

- **Server-side functions** para buscar dados do Supabase
- **Componentes reutilizáveis** para exibir cursos
- **Hooks personalizados** para gerenciar estado e busca
- **Design responsivo** com suporte a tema claro/escuro

## Estrutura dos Arquivos

```
lib/
├── courses-server.ts          # Funções server-side para buscar cursos
hooks/
├── use-courses.ts             # Hooks personalizados para cursos
components/course/
├── CourseCard.tsx             # Card individual de curso
├── CoursesList.tsx            # Lista de cursos com grid
└── index.ts                   # Exportações dos componentes
```

## Como Usar

### 1. Buscar Cursos (Server-side)

```typescript
import { getLatestCourses, getCoursesByCategory } from '@/lib/courses-server'

// Buscar últimos 6 cursos
const latestCourses = await getLatestCourses(6)

// Buscar cursos por categoria
const categoryCourses = await getCoursesByCategory('tecnologia', 10)
```

### 2. Usar Componentes

```tsx
import { CoursesList, CourseCard } from '@/components/course'

// Lista completa com título e botão "Ver todos"
<CoursesList
  courses={courses}
  title="Cursos em Destaque"
  showViewAll={true}
  viewAllHref="/cursos"
/>

// Card individual
<CourseCard course={course} showCategory={false} />
```

### 3. Usar Hooks

```tsx
import { useLatestCourses, useCoursesByCategory } from '@/hooks/use-courses'

function MyComponent() {
  // Buscar últimos cursos
  const { courses, loading, error } = useLatestCourses(6)
  
  // Buscar por categoria
  const { courses: categoryCourses } = useCoursesByCategory('tecnologia', 8)
  
  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>
  
  return <CoursesList courses={courses} />
}
```

## Funcionalidades

### CourseCard
- Imagem de capa com fallback
- Badge de categoria com cor personalizada
- Badge de nível (Iniciante, Intermediário, Avançado)
- Rating com estrelas
- Data de criação
- Hover effects e transições
- Link para página do curso

### CoursesList
- Grid responsivo (1 coluna mobile, 2 tablet, 3 desktop)
- Título opcional
- Botão "Ver todos" opcional
- Estado vazio com mensagem personalizada
- Skeleton loading

### Server Functions
- `getLatestCourses(limit)`: Últimos cursos publicados
- `getCoursesByCategory(slug, limit)`: Cursos por categoria
- `getCoursesWithProgress(userId, limit)`: Cursos com progresso do usuário
- `getCourseById(id)`: Curso específico por ID

## Personalização

### Cores de Categoria
As cores das categorias são definidas no banco de dados e aplicadas automaticamente:

```sql
UPDATE categories SET color = '#3B82F6' WHERE slug = 'tecnologia'
```

### Níveis de Curso
Os níveis são mapeados automaticamente:
- `beginner` → "Iniciante" (verde)
- `intermediate` → "Intermediário" (amarelo)
- `advanced` → "Avançado" (vermelho)

### Responsividade
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3 colunas

## Performance

- **Server-side rendering** para melhor SEO
- **Lazy loading** de imagens
- **Debounced search** nos filtros
- **Memoização** de resultados de busca
- **Pagination** opcional para grandes listas

## Exemplos de Uso

### Dashboard Principal
```tsx
// Últimos 6 cursos adicionados
const { courses } = useLatestCourses(6)
<CoursesList courses={courses} title="Cursos Recentes" showViewAll={true} />
```

### Página de Categoria
```tsx
// Cursos de uma categoria específica
const { courses } = useCoursesByCategory(categorySlug, 12)
<CoursesList courses={courses} title={categoryName} />
```

### Página de Perfil
```tsx
// Cursos com progresso do usuário
const { courses } = useCoursesWithProgress(userId, 8)
<CoursesList courses={courses} title="Meus Cursos" />
```

## Manutenção

### Adicionar Novo Campo
1. Atualizar interface `Course` em `courses-server.ts`
2. Atualizar query SQL na função correspondente
3. Atualizar componente `CourseCard` se necessário

### Adicionar Nova Funcionalidade
1. Criar nova função server-side
2. Criar hook correspondente se necessário
3. Atualizar componentes conforme necessário

## Troubleshooting

### Cursos não aparecem
- Verificar se `status = 'published'` no banco
- Verificar se há dados na tabela `courses`
- Verificar console para erros de SQL

### Imagens não carregam
- Verificar URLs das imagens no banco
- Verificar se as imagens existem no storage
- Verificar fallback do componente

### Performance lenta
- Verificar índices no banco de dados
- Considerar implementar paginação
- Verificar se as queries estão otimizadas
