# TrainingCard Component

## Visão Geral
Componente reutilizável para exibir cards de treinamento/cursos, extraído da página de dashboard e mantendo exatamente o mesmo visual e funcionalidade.

## Características
- **Visual Idêntico**: Mantém 100% do layout e estilos originais
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Dark Mode**: Suporte completo a temas claro/escuro
- **TypeScript**: Tipagem completa e segura
- **Reutilizável**: Pode ser usado em qualquer página

## Props

### TrainingCardProps
```typescript
interface TrainingCardProps {
  id: string                    // Identificador único
  titulo: string               // Título do treinamento
  categoria: string            // Categoria (ex: "Tecnologia", "Tratamento")
  status: "concluido" | "em-andamento" | "nao-iniciado"
  progresso: number            // Progresso em porcentagem (0-100)
  videos: number               // Quantidade de vídeos
  duracao: string             // Duração (ex: "2h30min", "45min")
  cor: "blue" | "green" | "purple" | "orange" | "pink" | "indigo"
  acao: string                 // Texto do botão de ação
  acaoVariant: "default" | "outline"
  acaoHref?: string           // Link opcional para o botão
}
```

## Cores Disponíveis
- **blue**: Azul (Identidade Visual)
- **green**: Verde (Estratégia Comercial)
- **purple**: Roxo (Produtos & Combustíveis)
- **orange**: Laranja (Tecnologia)
- **pink**: Rosa (Tratamento)
- **indigo**: Índigo (Patologia)

## Status
- **concluido**: Badge verde "Curso Concluído"
- **em-andamento**: Badge azul "Em Andamento"
- **nao-iniciado**: Badge outline "Não Iniciado"

## Exemplo de Uso

```tsx
import { TrainingCard } from "@/components/TrainingCard"

<TrainingCard
  id="exemplo"
  titulo="Nome do Treinamento"
  categoria="Categoria"
  status="em-andamento"
  progresso={45}
  videos={8}
  duracao="2h30min"
  cor="green"
  acao="Continuar"
  acaoVariant="default"
  acaoHref="/trilha/exemplo"
/>
```

## Estrutura Visual
1. **Header**: Badge de categoria + título + metadados (vídeos, duração)
2. **Progresso**: Barra de progresso com texto explicativo
3. **Footer**: Badge de status + botão de ação

## Estilos
- **Card**: `rounded-2xl shadow-none` (sem sombras)
- **Cores**: Sistema de cores baseado na categoria
- **Responsivo**: Grid adaptativo para diferentes tamanhos
- **Dark Mode**: Suporte automático via CSS variables

## Localização
- **Arquivo**: `components/TrainingCard.tsx`
- **Export**: `components/index.ts`
- **Import**: `@/components/TrainingCard`

## Validação
O componente foi testado e implementado na página de dashboard, substituindo todos os cards originais. Todos os CTAs levam para `/trilha/trajetoria-vibra` conforme especificado. 