# Dados Dinâmicos de Cursos

## Visão Geral

Implementação de cálculos dinâmicos para substituir valores estáticos nos cards de treinamentos, utilizando dados reais do banco de dados.

## Valores Corrigidos

### ❌ **Antes (Estático)**
```typescript
{
  videos: 1, // Sempre 1
  duracao: "N/D", // Sempre "N/D"
  progresso: 0, // Sempre 0
  status: "nao-iniciado", // Sempre não iniciado
  acao: "Começar", // Sempre começar
}
```

### ✅ **Depois (Dinâmico)**
```typescript
{
  videos: totalVideos, // Contagem real de vídeos
  duracao: formatDuration(totalDuration), // Duração real (ex: "2h 30min")
  progresso: Math.round((videosCompletos / totalVideos) * 100), // % real
  status: calculateStatus(videosCompletos, videosEmAndamento, totalVideos),
  acao: calculateAction(status), // "Começar", "Continuar" ou "Revisar"
}
```

## Implementação

### 1. **Atualização da Interface Course**
```typescript
export interface Course {
  // ... campos existentes
  modules?: {
    id: string
    videos: {
      id: string
      duration: number
      progress_videos: {
        user_id: string
        status: string
        progress_seconds: number
        completed_at: string | null
      }[]
    }[]
  }[]
}
```

### 2. **Query Supabase Expandida**
```sql
SELECT 
  courses.*,
  categories(...),
  modules(
    id,
    videos(
      id,
      duration,
      progress_videos(
        user_id,
        status,
        progress_seconds,
        completed_at
      )
    )
  )
FROM courses
WHERE status = 'published'
```

### 3. **Função de Conversão Dinâmica**
```typescript
function courseToTraining(course: Course, userId?: string): Treinamento {
  // Calcular métricas reais
  let totalVideos = 0
  let totalDuration = 0
  let videosCompletos = 0
  let videosEmAndamento = 0
  
  // Percorrer módulos e vídeos
  for (const courseModule of course.modules || []) {
    for (const video of courseModule.videos || []) {
      totalVideos++
      totalDuration += video.duration || 0
      
      if (userId) {
        const userProgress = video.progress_videos?.find(p => p.user_id === userId)
        if (userProgress?.status === 'completed') videosCompletos++
        else if (userProgress?.status === 'in_progress') videosEmAndamento++
      }
    }
  }
  
  // Determinar status e ação
  const { status, acao, progresso } = calculateCourseStatus(
    videosCompletos, 
    videosEmAndamento, 
    totalVideos
  )
  
  return {
    videos: totalVideos || 1,
    duracao: formatDuration(totalDuration),
    progresso,
    status,
    acao,
    // ... outros campos
  }
}
```

## Lógica de Cálculo

### **Status do Curso**
- ✅ **Concluído**: `videosCompletos === totalVideos && totalVideos > 0`
- 🔄 **Em Andamento**: `videosCompletos > 0 || videosEmAndamento > 0`
- ⏸️ **Não Iniciado**: `videosCompletos === 0 && videosEmAndamento === 0`

### **Ação do Usuário**
- 🎯 **"Começar"**: Curso não iniciado
- ▶️ **"Continuar"**: Curso em andamento
- 📖 **"Revisar"**: Curso concluído

### **Progresso**
```typescript
const progresso = totalVideos > 0 
  ? Math.round((videosCompletos / totalVideos) * 100) 
  : 0
```

### **Duração**
```typescript
function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`
  }
  return `${minutes}min`
}
```

## Integração com API

### **Hook Atualizado**
```typescript
const { courses } = useLatestCourses(6, user?.id) // Passa userId
```

### **API Route**
```typescript
GET /api/courses?type=latest&limit=6&userId={userId}
```

### **Dados Retornados**
```typescript
{
  courses: [
    {
      id: "...",
      title: "Curso ABC",
      modules: [
        {
          videos: [
            {
              duration: 1800, // 30 minutos
              progress_videos: [
                {
                  user_id: "...",
                  status: "completed"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Resultados

### **Cards de Cursos Agora Exibem:**
- 📊 **Quantidade real de vídeos** (ex: "8 vídeos")
- ⏱️ **Duração total calculada** (ex: "2h 30min")
- 📈 **Progresso real do usuário** (ex: "45%")
- 🎯 **Status baseado no progresso** (Não Iniciado/Em Andamento/Concluído)
- ▶️ **Ação contextual** (Começar/Continuar/Revisar)

### **Eliminação de Dados Estáticos**
- ❌ **Removidos**: Todos os 6 treinamentos estáticos hardcoded
- ✅ **Substituídos por**: Cursos dinâmicos do banco de dados
- 🔄 **Fonte única**: Todos os dados vêm do Supabase
- 📱 **Interface limpa**: Sem dados duplicados ou conflitantes

### **Performance**
- ✅ **Server-side rendering** mantido
- ✅ **Dados em tempo real** do banco
- ✅ **Cálculos otimizados** no backend
- ✅ **Cache eficiente** no frontend

## Benefícios

1. **Precisão**: Dados sempre atualizados e corretos
2. **Experiência**: Usuário vê progresso real
3. **Motivação**: Visualização clara do que já foi feito
4. **Orientação**: Ações contextuais (começar vs. continuar)
5. **Escalabilidade**: Funciona com qualquer quantidade de vídeos
6. **Manutenibilidade**: Fonte única de verdade (banco de dados)
7. **Consistência**: Sem dados duplicados ou conflitantes
8. **Flexibilidade**: Fácil adicionar/remover cursos via admin

## Limpeza de Dados Estáticos

### **O que foi removido:**
- ❌ Array `treinamentosEstaticos` com 6 treinamentos hardcoded
- ❌ Dados estáticos de "Rebranding", "Trajetória Vibra", "Mitos e Verdades", etc.
- ❌ Categorias estáticas fallback
- ❌ Lógica de combinação estática + dinâmica

### **O que foi implementado:**
- ✅ Fonte única de dados (Supabase)
- ✅ Cálculos dinâmicos em tempo real
- ✅ Interface limpa e consistente
- ✅ Mensagens contextuais baseadas nos dados reais
- ✅ Filtros funcionando apenas com dados do banco

## Próximos Passos

- [ ] Adicionar cache Redis para performance
- [ ] Implementar websockets para atualizações em tempo real
- [ ] Adicionar estimativa de tempo restante
- [ ] Criar dashboard de analytics de progresso
