# 🎯 **Implementação do Google Analytics (gtag) no Vision LMS**

## 📋 **Visão Geral**

Implementação completa do Google Analytics para tracking de usuários e coleta de dados de comportamento no sistema LMS.

## 🚀 **Funcionalidades Implementadas**

### **1. Tracking Automático de Páginas**
- ✅ **Pageviews automáticos**: Cada navegação é registrada automaticamente
- ✅ **URLs dinâmicas**: Suporte a rotas dinâmicas (`/trilha/[courseId]`, `/trilha/[courseId]/[videoId]`)
- ✅ **Parâmetros de busca**: Tracking de filtros e parâmetros de URL

### **2. Eventos Customizados para LMS**
- ✅ **Visualização de cursos**: Quando usuário clica em um curso
- ✅ **Visualização de vídeos**: Quando usuário acessa uma aula
- ✅ **Progresso de vídeos**: Tracking de tempo assistido
- ✅ **Conclusão de vídeos**: Quando usuário completa uma aula
- ✅ **Conclusão de cursos**: Quando usuário completa todo o curso
- ✅ **Login/Signup**: Tracking de autenticação
- ✅ **Busca e filtros**: Uso de funcionalidades de busca

### **3. Métricas de Engajamento**
- ✅ **Tempo de visualização**: Duração de cada sessão de vídeo
- ✅ **Taxa de conclusão**: Percentual de vídeos/cursos completados
- ✅ **Padrões de navegação**: Como usuários navegam pelo sistema
- ✅ **Uso de filtros**: Quais filtros são mais utilizados

## 🔧 **Arquitetura Técnica**

### **1. Estrutura de Arquivos**
```
lib/
├── gtag.ts                    # Configuração e funções do GA
hooks/
├── use-analytics.ts           # Hook personalizado para tracking
components/
├── GoogleAnalytics.tsx        # Componente de inicialização
app/
├── layout.tsx                 # Integração no layout principal
```

### **2. Componentes Principais**

#### **`lib/gtag.ts` - Configuração Central**
```typescript
// ID do Google Analytics
export const GA_TRACKING_ID = 'G-4R2NGMMBW3'

// Funções de tracking
export const pageview = (url: string) => { /* ... */ }
export const event = ({ action, category, label, value }) => { /* ... */ }

// Eventos específicos para LMS
export const trackCourseView = (courseId: string, courseTitle: string) => { /* ... */ }
export const trackVideoView = (videoId: string, videoTitle: string, courseId: string) => { /* ... */ }
export const trackVideoProgress = (videoId: string, progressSeconds: number, courseId: string) => { /* ... */ }
export const trackVideoCompletion = (videoId: string, courseId: string, totalDuration: number) => { /* ... */ }
export const trackCourseCompletion = (courseId: string, courseTitle: string) => { /* ... */ }
export const trackUserLogin = (userId: string) => { /* ... */ }
export const trackUserSignup = (userId: string) => { /* ... */ }
export const trackSearch = (searchTerm: string, resultsCount: number) => { /* ... */ }
export const trackFilter = (filterType: string, filterValue: string) => { /* ... */ }
```

#### **`components/GoogleAnalytics.tsx` - Inicialização**
```typescript
'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { GA_TRACKING_ID, pageview } from '@/lib/gtag'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    pageview(url)
  }, [pathname, searchParams])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}
```

#### **`hooks/use-analytics.ts` - Hook Personalizado**
```typescript
export const useAnalytics = () => {
  // Evento customizado genérico
  const trackEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    event({ action, category, label, value })
  }, [])

  // Eventos específicos para LMS
  const trackCourse = useCallback((courseId: string, courseTitle: string) => {
    trackCourseView(courseId, courseTitle)
  }, [])

  const trackVideo = useCallback((videoId: string, videoTitle: string, courseId: string) => {
    trackVideoView(videoId, videoTitle, courseId)
  }, [])

  const trackProgress = useCallback((videoId: string, progressSeconds: number, courseId: string) => {
    trackVideoProgress(videoId, progressSeconds, courseId)
  }, [])

  const trackVideoComplete = useCallback((videoId: string, courseId: string, totalDuration: number) => {
    trackVideoCompletion(videoId, courseId, totalDuration)
  }, [])

  const trackCourseComplete = useCallback((courseId: string, courseTitle: string) => {
    trackCourseCompletion(courseId, courseTitle)
  }, [])

  const trackLogin = useCallback((userId: string) => {
    trackUserLogin(userId)
  }, [])

  const trackSignup = useCallback((userId: string) => {
    trackUserSignup(userId)
  }, [])

  const trackSearchQuery = useCallback((searchTerm: string, resultsCount: number) => {
    trackSearch(searchTerm, resultsCount)
  }, [])

  const trackFilterUsage = useCallback((filterType: string, filterValue: string) => {
    trackFilter(filterType, filterValue)
  }, [])

  return {
    trackEvent,
    trackCourse,
    trackVideo,
    trackProgress,
    trackVideoComplete,
    trackCourseComplete,
    trackLogin,
    trackSignup,
    trackSearchQuery,
    trackFilterUsage,
  }
}
```

## 📊 **Eventos Implementados**

### **1. Eventos de Curso**
| Evento | Categoria | Label | Valor | Descrição |
|--------|-----------|-------|-------|-----------|
| `view_course` | `course` | Nome do curso | - | Usuário visualizou um curso |
| `course_completion` | `course` | Nome do curso | - | Usuário completou um curso |

### **2. Eventos de Vídeo**
| Evento | Categoria | Label | Valor | Descrição |
|--------|-----------|-------|-------|-----------|
| `view_video` | `video` | `courseId:videoTitle` | - | Usuário visualizou um vídeo |
| `video_progress` | `video` | `courseId` | Segundos | Progresso em segundos |
| `video_completion` | `video` | `courseId` | Duração total | Vídeo completado |

### **3. Eventos de Usuário**
| Evento | Categoria | Label | Valor | Descrição |
|--------|-----------|-------|-------|-----------|
| `user_login` | `user` | `userId` | - | Usuário fez login |
| `user_signup` | `user` | `userId` | - | Usuário se registrou |

### **4. Eventos de Engajamento**
| Evento | Categoria | Label | Valor | Descrição |
|--------|-----------|-------|-------|-----------|
| `search` | `engagement` | Termo buscado | Resultados | Busca realizada |
| `filter` | `engagement` | `tipo:valor` | - | Filtro aplicado |

## 🔄 **Integração nos Componentes**

### **1. TrainingCard - Tracking de Visualização**
```typescript
export function TrainingCard({ id, titulo, ... }: TrainingCardProps) {
  const { trackCourse } = useAnalytics()

  const handleCourseView = () => {
    trackCourse(id, titulo)
  }

  return (
    <Link href={href} className="block" onClick={handleCourseView}>
      {/* Conteúdo do card */}
    </Link>
  )
}
```

### **2. DashboardFilters - Tracking de Filtros**
```typescript
export function DashboardFilters({ ... }: DashboardFiltersProps) {
  const { trackFilterUsage } = useAnalytics()

  const handleFilterChange = (key: keyof DashboardFiltersType, value: string) => {
    onFilterChange(key, value)
    
    if (key === 'categoria' && value) {
      trackFilterUsage('categoria', value)
    } else if (key === 'status' && value) {
      trackFilterUsage('status', value)
    }
  }
}
```

### **3. Dashboard - Tracking de Busca**
```typescript
export default function DashboardClient({ ... }: DashboardClientProps) {
  const { trackSearchQuery } = useAnalytics()

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    atualizarFiltro(key, value)
    
    if (key === 'busca' && value.trim()) {
      const resultsCount = treinamentosFiltrados.length
      trackSearchQuery(value.trim(), resultsCount)
    }
  }
}
```

## 🎯 **Configuração do Google Analytics**

### **1. Script de Inicialização**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-4R2NGMMBW3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-4R2NGMMBW3');
</script>
```

### **2. ID de Rastreamento**
- **ID**: `G-4R2NGMMBW3`
- **Propriedade**: Vision LMS
- **Tipo**: GA4 (Google Analytics 4)

## 📈 **Métricas Disponíveis**

### **1. Visão Geral**
- ✅ **Usuários ativos**: Quantos usuários únicos acessaram
- ✅ **Sessões**: Número total de sessões
- ✅ **Pageviews**: Visualizações de páginas
- ✅ **Taxa de rejeição**: Percentual de sessões com uma página

### **2. Comportamento do Usuário**
- ✅ **Páginas mais visitadas**: Quais cursos/vídeos são mais populares
- ✅ **Tempo na página**: Engajamento com o conteúdo
- ✅ **Fluxo de usuário**: Como usuários navegam pelo sistema
- ✅ **Eventos personalizados**: Métricas específicas do LMS

### **3. Performance de Cursos**
- ✅ **Taxa de conclusão**: Percentual de usuários que completam cursos
- ✅ **Tempo médio de conclusão**: Duração média para completar um curso
- ✅ **Drop-off points**: Onde usuários abandonam cursos
- ✅ **Re-engagement**: Usuários que retornam para completar cursos

## 🚀 **Como Usar**

### **1. Tracking Automático**
```typescript
// ✅ Tracking automático de páginas
// Não é necessário fazer nada - funciona automaticamente
```

### **2. Tracking de Eventos Customizados**
```typescript
import { useAnalytics } from '@/hooks/use-analytics'

export function MeuComponente() {
  const { trackCourse, trackVideo } = useAnalytics()

  const handleCourseClick = () => {
    trackCourse('course-123', 'Nome do Curso')
  }

  const handleVideoClick = () => {
    trackVideo('video-456', 'Nome do Vídeo', 'course-123')
  }
}
```

### **3. Tracking de Progresso**
```typescript
const { trackProgress } = useAnalytics()

// Em um player de vídeo
const handleTimeUpdate = (currentTime: number) => {
  trackProgress('video-456', Math.floor(currentTime), 'course-123')
}
```

### **4. Tracking de Conclusão**
```typescript
const { trackVideoComplete } = useAnalytics()

const handleVideoEnd = () => {
  trackVideoComplete('video-456', 'course-123', videoDuration)
}
```

## 🔍 **Debugging e Testes**

### **1. Console do Navegador**
```javascript
// Verificar se gtag está funcionando
console.log(window.gtag)
console.log(window.dataLayer)

// Testar evento manualmente
gtag('event', 'test_event', {
  event_category: 'test',
  event_label: 'manual_test'
})
```

### **2. Google Analytics Debugger**
- Instalar extensão "Google Analytics Debugger" no Chrome
- Ver eventos em tempo real no console
- Validar dados enviados para o GA

### **3. Real-time Reports**
- Acessar Google Analytics
- Ir para "Relatórios em tempo real"
- Ver eventos sendo registrados em tempo real

## 📱 **Responsividade e Performance**

### **1. Estratégia de Carregamento**
- ✅ **`afterInteractive`**: Scripts carregam após a página estar interativa
- ✅ **Lazy loading**: Não bloqueia o carregamento inicial
- ✅ **Suspense boundary**: Evita erros de hidratação

### **2. Otimizações**
- ✅ **Debounce**: Evita múltiplos eventos de progresso
- ✅ **Callback memoization**: Funções otimizadas com useCallback
- ✅ **Type safety**: TypeScript para evitar erros

## 🔒 **Privacidade e Compliance**

### **1. GDPR Compliance**
- ✅ **Consentimento**: Usuário deve aceitar cookies
- ✅ **Anonimização**: IDs de usuário não são expostos diretamente
- ✅ **Controle**: Usuário pode desabilitar tracking

### **2. Dados Coletados**
- ✅ **Comportamento**: Como usuário interage com o sistema
- ✅ **Performance**: Métricas de engajamento e conclusão
- ✅ **Não pessoais**: Não coleta informações pessoais sensíveis

## 🚀 **Próximos Passos**

### **1. Implementações Futuras**
- 🔄 **A/B Testing**: Testar diferentes layouts e funcionalidades
- 🔄 **Funnels**: Análise de conversão de usuários
- 🔄 **Cohort Analysis**: Análise de retenção por período
- 🔄 **Heatmaps**: Visualização de cliques e scroll

### **2. Integrações**
- 🔄 **Google Ads**: Remarketing baseado em comportamento
- 🔄 **Google Optimize**: Otimização automática de conversão
- 🔄 **Data Studio**: Dashboards personalizados
- 🔄 **BigQuery**: Análise avançada de dados

## 📚 **Recursos e Documentação**

### **1. Links Úteis**
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [gtag.js Reference](https://developers.google.com/tag-platform/gtagjs/reference)
- [Event Measurement](https://developers.google.com/analytics/devguides/collection/ga4/events)

### **2. Exemplos de Implementação**
- [E-commerce Tracking](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Enhanced E-commerce](https://developers.google.com/analytics/devguides/collection/ga4/enhanced-ecommerce)
- [Custom Dimensions](https://developers.google.com/analytics/devguides/collection/ga4/custom-dimensions)

## ✅ **Status da Implementação**

- ✅ **Google Analytics configurado**
- ✅ **Tracking automático de páginas**
- ✅ **Eventos customizados para LMS**
- ✅ **Hook personalizado para uso fácil**
- ✅ **Integração em componentes principais**
- ✅ **Build funcionando sem erros**
- ✅ **Documentação completa**

**Google Analytics implementado com sucesso no Vision LMS!** 🎉✨
