# LMS Sidebar - Novo Componente

## Visão Geral

O `LMSSidebar` é um novo componente de navegação lateral otimizado especificamente para a plataforma LMS da Evous. Ele foi projetado com foco na **experiência do usuário** e **simplicidade de navegação**.

## Estrutura Implementada

### 1. **🏠 Início**
- Botão único para acesso rápido ao dashboard
- Sem agrupamento, sempre visível

### 2. **📚 Aprender**
- **Minhas Trilhas**: Acesso às trilhas de aprendizado
- **Biblioteca**: Explorar conteúdos disponíveis

### 3. **📊 Meu Progresso**
- **Meu Desempenho**: Dashboard de progresso e estatísticas
- **Missões Ativas**: Missões em andamento e próximas

### 4. **👤 Usuário** (Footer)
- Perfil do usuário
- Configurações de conta
- Logout

## Características Técnicas

- ✅ **Colapsível**: Pode ser minimizado para ícones
- ✅ **Responsivo**: Adapta-se a dispositivos móveis
- ✅ **Tooltips**: Mostra nomes quando colapsado
- ✅ **Logo Dinâmico**: Muda conforme tema (claro/escuro)
- ✅ **Navegação Intuitiva**: Estrutura simplificada e lógica

## Como Usar

### Importação Básica
```tsx
import { LMSSidebar } from "@/components"
import { SidebarProvider } from "@/components/ui/sidebar"

export function MinhaPagina() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen">
        <LMSSidebar />
        <main className="flex-1">
          {/* Conteúdo da página */}
        </main>
      </div>
    </SidebarProvider>
  )
}
```

### Com Estado Controlado
```tsx
import { LMSSidebar } from "@/components"
import { SidebarProvider } from "@/components/ui/sidebar"

export function MinhaPagina() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-screen">
        <LMSSidebar />
        <main className="flex-1">
          {/* Conteúdo da página */}
        </main>
      </div>
    </SidebarProvider>
  )
}
```

## Rotas Configuradas

- **Início**: `/dashboard`
- **Minhas Trilhas**: `/trilha`
- **Biblioteca**: `/biblioteca`
- **Meu Desempenho**: `/dashboard`
- **Missões Ativas**: `/missoes`

## Diferenças do Sidebar Anterior

| Aspecto | Sidebar Anterior | LMS Sidebar |
|---------|------------------|-------------|
| **Complexidade** | 4 grupos + Teams | 3 grupos + Usuário |
| **Foco** | Funcionalidades gerais | Experiência de aprendizado |
| **Navegação** | Mais opções | Menos opções, mais foco |
| **UX** | Funcional | Motivacional e intuitivo |

## Próximos Passos

1. **Implementar lógica de permissões** para diferentes tipos de usuário
2. **Criar versão para líderes/gestores** com visão da equipe
3. **Adicionar funcionalidades específicas** conforme necessário
4. **Testes de usabilidade** com usuários reais

## Arquivos Relacionados

- `lms-sidebar.tsx` - Componente principal
- `lms-sidebar-demo.tsx` - Demonstração de uso
- `app-sidebar.tsx` - Sidebar original (mantido)
- `sidebar.tsx` - Componentes base do UI 