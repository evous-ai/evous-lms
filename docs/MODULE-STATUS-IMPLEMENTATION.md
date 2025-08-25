# 📊 Implementação do Sistema de Status dos Módulos e Progresso Baseado em Tempo

## 🎯 **Visão Geral**

Este documento descreve a implementação do sistema de status dos módulos e progresso baseado no tempo real assistido (`progress_seconds`) dos vídeos na tabela `progress_videos`.

## 🔧 **Regras de Status dos Módulos**

### **1. Status "not_started"**
- **Condição**: Nenhum vídeo do módulo existe na tabela `progress_videos`
- **Significado**: O usuário nunca iniciou este módulo

### **2. Status "in_progress"**
- **Condição**: Pelo menos um vídeo do módulo está em `progress_videos`, mas nem todos os vídeos têm status "completed"
- **Significado**: O usuário começou este módulo mas ainda não terminou

### **3. Status "completed"**
- **Condição**: Todos os vídeos do módulo existem em `progress_videos` e todos têm status "completed"
- **Significado**: O usuário completou todos os vídeos deste módulo

## ⏱️ **Sistema de Progresso Baseado em Tempo**

### **1. Cálculo de Progresso por Vídeo**

O progresso de cada vídeo é calculado baseado no `progress_seconds`:

```typescript
// Se o vídeo foi completado
if (userProgress.status === 'completed') {
  watchedDuration += video.duration // Contar toda a duração
  videosCompleted++
} 
// Se o vídeo está em progresso
else if (userProgress.progress_seconds > 0) {
  // Contar apenas o tempo assistido (limitado à duração total)
  const progressTime = Math.min(userProgress.progress_seconds, video.duration)
  watchedDuration += progressTime
}
```

### **2. Cálculo de Progresso por Módulo**

```typescript
// Progresso = (Tempo assistido / Tempo total) * 100
const progressPercentage = totalDuration > 0 
  ? Math.round((watchedDuration / totalDuration) * 100)
  : 0
```

### **3. Cálculo de Progresso do Curso**

```typescript
// Soma o progresso de todos os módulos
modules.forEach(module => {
  const moduleProgress = calculateModuleProgress(module.videos, userId)
  totalDuration += moduleProgress.totalDuration
  watchedDuration += moduleProgress.watchedDuration
  videosCompleted += moduleProgress.videosCompleted
})

// Progresso geral do curso
const progressPercentage = totalDuration > 0 
  ? Math.round((watchedDuration / totalDuration) * 100)
  : 0
```

## 🚀 **Como Usar**

### **1. Buscar Cursos com Progresso Baseado em Tempo**

```typescript
import { getLatestCourses } from '@/lib/courses-server'

// Buscar cursos com progresso baseado em tempo para um usuário específico
const courses = await getLatestCourses(6, userId)

// Cada curso terá progresso calculado baseado em tempo assistido
// ✅ IMPORTANTE: O status dos módulos é calculado dinamicamente
courses.forEach(course => {
  console.log(`Curso: ${course.title}`)
  console.log(`Progresso: ${course.progress?.progressPercentage}%`)
  console.log(`Tempo assistido: ${course.progress?.watchedDuration}s`)
  console.log(`Tempo total: ${course.progress?.totalDuration}s`)
  
  course.modules?.forEach(module => {
    // ✅ Status calculado dinamicamente baseado em progress_videos
    console.log(`  Módulo: ${module.title}`)
    console.log(`  Status: ${module.status}`) // 'not_started' | 'in_progress' | 'completed'
    
    // Exibir progresso dos vídeos
    module.videos?.forEach(video => {
      const userProgress = video.progress_videos?.find(p => p.user_id === userId)
      if (userProgress) {
        console.log(`    Vídeo: ${video.title} - ${userProgress.status} (${userProgress.progress_seconds}s)`)
      }
    })
  })
})
```

### **2. Buscar Curso Específico com Progresso Detalhado**

```typescript
import { getCourseWithModules } from '@/lib/courses-server'

// Buscar curso com progresso baseado em tempo
const course = await getCourseWithModules(courseId, userId)

if (course) {
  console.log(`Progresso geral: ${course.progress?.progressPercentage}%`)
  console.log(`Módulos completados: ${course.progress?.modulesCompleted}/${course.progress?.totalModules}`)
  console.log(`Vídeos completados: ${course.progress?.videosCompleted}/${course.progress?.totalVideos}`)
  console.log(`Tempo assistido: ${course.progress?.watchedDuration}s de ${course.progress?.totalDuration}s`)
  
  // ✅ Status dos módulos calculado dinamicamente
  course.modules?.forEach(module => {
    console.log(`Módulo: ${module.title} - Status: ${module.status}`)
    
    // O status é baseado no progresso dos vídeos em progress_videos
    module.videos?.forEach(video => {
      const userProgress = video.progress_videos?.find(p => p.user_id === userId)
      if (userProgress) {
        console.log(`  Vídeo: ${video.title} - ${userProgress.status} (${userProgress.progress_seconds}s)`)
      }
    })
  })
}
```

### **3. Calcular Progresso Manualmente**

```typescript
import { calculateModuleProgress, calculateCourseProgress } from '@/lib/courses-server'

// Calcular progresso de um módulo específico
const moduleProgress = calculateModuleProgress(module.videos, userId)
console.log(`Progresso do módulo: ${moduleProgress.progressPercentage}%`)

// Calcular progresso de todo o curso
const courseProgress = calculateCourseProgress(course.modules, userId)
console.log(`Progresso do curso: ${courseProgress.progressPercentage}%`)
```

## 📊 **Estrutura de Dados Atualizada**

### **1. Interface Course (Refletindo a Estrutura Real do Banco)**

```typescript
export interface Course {
  // ... outros campos
  modules?: {
    id: string
    title: string
    description: string | null
    order: number | null
    created_at: string
    updated_at: string
    // ✅ IMPORTANTE: Status NÃO existe na tabela modules
    // Status é calculado dinamicamente baseado em progress_videos
    videos: {
      id: string
      title: string
      description: string | null
      duration: number
      video_url: string
      weight: number
      order: number | null
      rating_video: number
      is_preview: boolean
      created_at: string
      updated_at: string
      progress_videos: {
        user_id: string
        status: string
        progress_seconds: number
        completed_at: string | null
      }[]
    }[]
  }[]
  progress?: {
    totalVideos: number
    videosConcluidos: number
    // ✅ NOVOS CAMPOS baseados em tempo
    totalDuration: number        // Duração total em segundos
    watchedDuration: number      // Tempo assistido em segundos
    progressPercentage: number   // Porcentagem baseada em tempo
    modulesCompleted: number     // Módulos completamente finalizados
    totalModules: number         // Total de módulos
  }
}
```

### **2. Status dos Módulos Calculado Dinamicamente**

```typescript
// ✅ O status dos módulos é calculado em tempo real baseado em progress_videos
// NÃO existe na tabela modules

export interface ModuleWithStatus {
  id: string
  title: string
  description: string | null
  order: number | null
  created_at: string
  updated_at: string
  status: 'not_started' | 'in_progress' | 'completed' // ✅ Calculado dinamicamente
  videos: Array<{
    // ... campos dos vídeos
    progress_videos: Array<{
      user_id: string
      status: string
      progress_seconds: number
      completed_at: string | null
    }>
  }>
}
```

### **3. Como o Status é Calculado**

```typescript
// ✅ Função que calcula status do módulo baseado em progress_videos
export function calculateModuleStatus(
  videos: Array<{ progress_videos: Array<{ user_id: string, status: string }> }>,
  userId: string
): 'not_started' | 'in_progress' | 'completed' {
  
  // Regras baseadas na tabela progress_videos:
  // 1. "not_started" → Nenhum vídeo do módulo existe em progress_videos
  // 2. "in_progress" → Pelo menos um vídeo em progress_videos, mas nem todos "completed"
  // 3. "completed" → Todos os vídeos existem em progress_videos e todos "completed"
  
  // ... implementação da lógica
}
```

### **2. Retorno das Funções de Progresso**

```typescript
// calculateModuleProgress retorna:
{
  totalDuration: number      // Duração total do módulo
  watchedDuration: number    // Tempo assistido no módulo
  progressPercentage: number // Porcentagem de progresso
  videosCompleted: number    // Vídeos marcados como completed
  totalVideos: number        // Total de vídeos no módulo
}

// calculateCourseProgress retorna:
{
  totalDuration: number      // Duração total do curso
  watchedDuration: number    // Tempo total assistido
  progressPercentage: number // Porcentagem geral do curso
  modulesCompleted: number   // Módulos completamente finalizados
  totalModules: number       // Total de módulos
  videosCompleted: number    // Total de vídeos completados
  totalVideos: number        // Total de vídeos no curso
}
```

## 🔍 **Funções Utilitárias**

### **1. calculateModuleProgress**

```typescript
export function calculateModuleProgress(
  videos: Array<{ duration: number, progress_videos: Array<{ user_id: string, status: string, progress_seconds: number }> }>,
  userId: string
): ModuleProgress
```

**Lógica:**
- ✅ Conta duração total dos vídeos
- ✅ Soma tempo assistido baseado em `progress_seconds`
- ✅ Para vídeos completados: conta duração total
- ✅ Para vídeos em progresso: conta tempo assistido (limitado à duração)
- ✅ Calcula porcentagem: `(tempo assistido / tempo total) * 100`

### **2. calculateCourseProgress**

```typescript
export function calculateCourseProgress(
  modules: Course['modules'],
  userId: string
): CourseProgress
```

**Lógica:**
- ✅ Soma progresso de todos os módulos
- ✅ Calcula progresso geral baseado em tempo total
- ✅ Conta módulos e vídeos completados
- ✅ Retorna estatísticas completas do curso

### **3. Funções de Formatação**

```typescript
// Formatar duração em segundos para formato legível
formatDuration(seconds: number): string
// Exemplo: 3661 → "1h1min"

// Formatar progresso de tempo assistido
formatProgressTime(watchedSeconds: number, totalSeconds: number): string
// Exemplo: "45min de 2h30min"
```

## 📱 **Exemplos de Uso em Componentes**

### **1. Dashboard com Progresso Baseado em Tempo**

```typescript
// O progresso agora é calculado baseado no tempo real assistido
const treinamentos = courses.map(convertCourseToTreinamento)

treinamentos.forEach(treinamento => {
  console.log(`${treinamento.titulo}: ${treinamento.progresso}%`)
  // Progresso será baseado em tempo assistido, não apenas vídeos completados
})
```

### **2. Página de Trilha com Progresso Detalhado**

```typescript
// ✅ Exibir progresso baseado em tempo e status calculado dinamicamente
course.modules?.forEach(module => {
  // O status do módulo é calculado dinamicamente baseado em progress_videos
  const moduleProgress = calculateModuleProgress(module.videos, userId)
  
  return (
    <div>
      <h3>{module.title}</h3>
      {/* ✅ Status calculado dinamicamente baseado em progress_videos */}
      <p>Status: {module.status}</p>
      <p>Progresso: {moduleProgress.progressPercentage}%</p>
      <p>Tempo: {formatProgressTime(moduleProgress.watchedDuration, moduleProgress.totalDuration)}</p>
      
      {/* Exibir progresso dos vídeos individuais */}
      <div className="space-y-2">
        {module.videos?.map(video => {
          const userProgress = video.progress_videos?.find(p => p.user_id === userId)
          return (
            <div key={video.id} className="flex items-center gap-2">
              <span>{video.title}</span>
              {userProgress ? (
                <>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(userProgress.status)}`}>
                    {userProgress.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {userProgress.progress_seconds}s / {video.duration}s
                  </span>
                </>
              ) : (
                <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                  Não iniciado
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})
```

### **3. Barra de Progresso Inteligente**

```typescript
// ✅ Barra de progresso baseada em tempo real assistido
const progressBar = (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div 
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${course.progress?.progressPercentage || 0}%` }}
    />
  </div>
)

// Texto explicativo com tempo assistido
const progressText = (
  <p className="text-sm text-gray-600">
    {formatProgressTime(
      course.progress?.watchedDuration || 0,
      course.progress?.totalDuration || 0
    )}
    {' '}({course.progress?.progressPercentage || 0}%)
  </p>
)

// ✅ Status dos módulos calculado dinamicamente
const modulesStatus = (
  <div className="space-y-2">
    {course.modules?.map(module => (
      <div key={module.id} className="flex items-center gap-2">
        <span className="text-sm">{module.title}</span>
        {/* Status calculado dinamicamente baseado em progress_videos */}
        <span className={`px-2 py-1 rounded text-xs ${getModuleStatusColor(module.status)}`}>
          {getModuleStatusText(module.status)}
        </span>
      </div>
    ))}
  </div>
)
```

## 🎨 **Estilos CSS para Progresso**

### **1. Cores por Porcentagem de Progresso**

```css
/* Baixo progresso (0-25%) */
.progress-low {
  color: #ef4444; /* text-red-500 */
}

/* Progresso médio (26-75%) */
.progress-medium {
  color: #f59e0b; /* text-yellow-500 */
}

/* Alto progresso (76-100%) */
.progress-high {
  color: #10b981; /* text-green-500 */
}
```

### **2. Barra de Progresso Animada**

```css
.progress-bar {
  transition: width 0.3s ease-in-out;
}

.progress-bar-fill {
  background: linear-gradient(90deg, #3b82f6, #10b981);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

## 🔄 **Atualizações em Tempo Real**

### **1. Quando o Progresso Muda**

O progresso baseado em tempo é recalculado automaticamente sempre que:
- ✅ Um vídeo é pausado/retomado (`progress_seconds` atualizado)
- ✅ Um vídeo é marcado como "completed"
- ✅ Um novo vídeo é acessado
- ✅ O usuário navega entre vídeos

### **2. Sincronização**

- **Dashboard**: Progresso atualizado em tempo real baseado em tempo assistido
- **Trilha**: Progresso consistente com dashboard
- **API Routes**: Todas as funções calculam progresso baseado em tempo
- **Cache**: Progresso é recalculado a cada requisição para precisão

## 🧪 **Testes**

### **1. Cenários de Teste para Progresso Baseado em Tempo**

```typescript
// Teste: Vídeo em progresso
const videoInProgress = {
  duration: 300, // 5 minutos
  progress_videos: [{
    user_id: userId,
    status: 'in_progress',
    progress_seconds: 180 // 3 minutos assistidos
  }]
}
expect(calculateModuleProgress([videoInProgress], userId).progressPercentage).toBe(60)

// Teste: Vídeo completado
const videoCompleted = {
  duration: 300,
  progress_videos: [{
    user_id: userId,
    status: 'completed',
    progress_seconds: 300
  }]
}
expect(calculateModuleProgress([videoCompleted], userId).progressPercentage).toBe(100)

// Teste: Módulo misto
const mixedModule = {
  videos: [
    videoCompleted,    // 100% - 5 min
    videoInProgress   // 60% - 3 min de 5 min
  ]
}
// Total: 10 min, Assistido: 8 min, Progresso: 80%
expect(calculateModuleProgress(mixedModule.videos, userId).progressPercentage).toBe(80)
```

## 🚀 **Benefícios da Nova Implementação**

### **1. Para Usuários**
- ✅ **Progresso preciso**: Baseado no tempo real assistido (`progress_seconds`)
- ✅ **Status dinâmico**: Status dos módulos atualiza em tempo real baseado em `progress_videos`
- ✅ **Feedback imediato**: Progresso atualiza conforme assiste
- ✅ **Motivação**: Ver progresso crescer em tempo real
- ✅ **Realismo**: Progresso reflete tempo real investido

### **2. Para Desenvolvedores**
- ✅ **Lógica robusta**: Cálculos baseados em dados reais da tabela `progress_videos`
- ✅ **Performance**: Cálculos otimizados e eficientes
- ✅ **Flexibilidade**: Fácil de estender e modificar
- ✅ **Testabilidade**: Funções puras e testáveis
- ✅ **Estrutura real**: Implementação reflete a estrutura real do banco de dados

### **3. Para o Sistema**
- ✅ **Escalabilidade**: Funciona com múltiplos usuários
- ✅ **Confiabilidade**: Progresso baseado em dados reais da tabela `progress_videos`
- ✅ **Precisão**: Não depende apenas de status binário, considera tempo assistido
- ✅ **Experiência**: Interface mais responsiva e informativa
- ✅ **Integridade**: Status calculado dinamicamente, não armazenado incorretamente

### **4. Arquitetura do Banco de Dados**
- ✅ **Respeita a estrutura real**: Não adiciona campos inexistentes na tabela `modules`
- ✅ **Calcula status dinamicamente**: Baseado na tabela `progress_videos`
- ✅ **Eficiência**: Usa relacionamentos existentes para calcular status
- ✅ **Manutenibilidade**: Lógica centralizada e reutilizável

## 📝 **Conclusão**

O novo sistema de progresso baseado em tempo fornece:

- ✅ **Precisão**: Progresso calculado baseado em `progress_seconds` da tabela `progress_videos`
- ✅ **Status dinâmico**: Status dos módulos calculado em tempo real, não armazenado incorretamente
- ✅ **Estrutura real**: Implementação respeita a estrutura real do banco de dados
- ✅ **Tempo real**: Atualizações conforme o usuário assiste
- ✅ **Consistência**: Mesma lógica em todas as páginas
- ✅ **Flexibilidade**: Fácil de estender e personalizar
- ✅ **Performance**: Cálculos otimizados e eficientes

### **🔑 Pontos-Chave da Implementação:**

1. **Status dos Módulos**: Calculado dinamicamente baseado na tabela `progress_videos`, não armazenado na tabela `modules`
2. **Progresso Baseado em Tempo**: Usa `progress_seconds` para calcular progresso real, não apenas status binário
3. **Estrutura do Banco**: Respeita a estrutura real sem adicionar campos inexistentes
4. **Performance**: Cálculos eficientes usando relacionamentos existentes
5. **Manutenibilidade**: Lógica centralizada e reutilizável

**Sistema implementado e funcionando perfeitamente, respeitando a estrutura real do banco de dados!** 🎉✨

## 🔗 **Arquivos Modificados**

1. ✅ **`lib/courses-server.ts`** - Funções de cálculo de progresso baseado em tempo
2. ✅ **`lib/hooks-server.ts`** - Integração com novo sistema de progresso
3. ✅ **`lib/utils.ts`** - Funções utilitárias de formatação
4. ✅ **`lib/types.ts`** - Interfaces atualizadas com novos campos
5. ✅ **`docs/MODULE-STATUS-IMPLEMENTATION.md`** - Documentação completa
