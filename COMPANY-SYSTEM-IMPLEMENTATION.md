# Sistema de Empresas - Implementação Completa

Este documento descreve a implementação completa do sistema de empresas no Vision LMS, incluindo cache, SSR e fácil acesso em todos os componentes.

## 🏗️ Arquitetura Implementada

### 1. **Tipos TypeScript**
- `Company` interface com todos os campos necessários
- `Profile` atualizado para incluir relação com empresa
- Tipos para todas as operações de empresa

### 2. **Funções de Banco de Dados**
- `getCompany()` / `getCompanyServer()` - Busca empresa por ID
- `getCompanies()` / `getCompaniesServer()` - Lista todas as empresas
- `getDefaultCompany()` / `getDefaultCompanyServer()` - Busca empresa padrão

### 3. **CompanyProvider (React Context)**
- Gerenciamento centralizado dos dados da empresa
- Cache automático e fallback para dados padrão
- Hooks especializados para diferentes usos

### 4. **Dados Padrão**
- Fallback automático para desenvolvimento
- Configuração centralizada de cores e logos
- Sem quebra de funcionalidade em caso de erro

## 🚀 Como Usar

### 1. **Hook Principal**
```tsx
import { useCompany } from '@/components/providers/company-provider'

function MyComponent() {
  const { company, loading, error, refetch } = useCompany()
  
  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>
  
  return (
    <div>
      <h1>{company?.name}</h1>
      <p>Cor: {company?.primary_color}</p>
    </div>
  )
}
```

### 2. **Hook para Cor Primária**
```tsx
import { useCompanyColor } from '@/components/providers/company-provider'

function WelcomeHero() {
  const primaryColor = useCompanyColor()
  
  return (
    <div style={{ backgroundColor: primaryColor }}>
      <h1>Bem-vindo!</h1>
    </div>
  )
}
```

### 3. **Hook para Logos**
```tsx
import { useCompanyLogo } from '@/components/providers/company-provider'

function CompanyLogo() {
  const { logo, darkLogo, icon } = useCompanyLogo()
  
  return (
    <div>
      <img src={logo} alt="Logo Light" />
      <img src={darkLogo} alt="Logo Dark" />
      <img src={icon} alt="Icon" />
    </div>
  )
}
```

### 4. **Hook para Dados Completos**
```tsx
import { useCompanyData } from '@/components/providers/company-provider'

function CompanyInfo() {
  const company = useCompanyData()
  
  if (!company) return null
  
  return (
    <div>
      <h2>{company.name}</h2>
      <p>Cor: {company.primary_color}</p>
      <p>Logo: {company.logo}</p>
    </div>
  )
}
```

## 📊 Estrutura da Tabela Companies

```sql
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  logo TEXT NOT NULL,
  dark_logo TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir empresa padrão (Lubrax)
INSERT INTO companies (id, name, primary_color, logo, dark_logo, icon) VALUES (
  'c9551059-35fb-4c5e-bcb7-bc09ddc25f31',
  'Lubrax',
  '#144722',
  '/logo_lubrax_lightmode.png',
  '/logo_lubrax_darkmode.png',
  '/favicon_lubrax.png'
);
```

## 🎯 Casos de Uso Implementados

### 1. **WelcomeHero (Dashboard)**
- ✅ Background dinâmico com `primary_color`
- ✅ Logo dinâmico com `dark_logo`
- ✅ Sem piscadas ou mudanças visuais

### 2. **Sidebar**
- ✅ Logo adaptativo (light/dark/icon)
- ✅ Responsivo ao estado colapsado
- ✅ Tema automático

### 3. **Componentes Globais**
- ✅ Favicon dinâmico
- ✅ Logos em todos os lugares
- ✅ Cores consistentes

## 🔧 Configuração

### 1. **Layout Principal**
```tsx
// app/layout.tsx
import { CompanyProvider } from "@/components/providers/company-provider"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <CompanyProvider>
            {children}
          </CompanyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. **Dados Padrão**
```tsx
// lib/company-defaults.ts
export const DEFAULT_COMPANY: Company = {
  id: 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31',
  name: 'Lubrax',
  primary_color: '#144722',
  logo: '/logo_lubrax_lightmode.png',
  dark_logo: '/logo_lubrax_darkmode.png',
  icon: '/favicon_lubrax.png'
}
```

## 🚀 Benefícios da Implementação

### 1. **Performance**
- Cache automático dos dados
- Sem chamadas redundantes à API
- Fallback para dados padrão

### 2. **UX**
- Sem piscadas ou mudanças visuais
- Carregamento suave
- Dados sempre disponíveis

### 3. **Desenvolvimento**
- Hooks especializados e intuitivos
- Tipos TypeScript completos
- Fácil manutenção e extensão

### 4. **SSR/SSG**
- Compatível com Next.js
- Hidratação suave
- SEO otimizado

## 🔄 Atualizações e Cache

### 1. **Cache Automático**
- Dados carregados uma vez por sessão
- Atualização automática em background
- Fallback para dados padrão

### 2. **Refetch Manual**
```tsx
const { refetch } = useCompany()

// Atualizar dados manualmente
await refetch()
```

### 3. **Estado de Loading**
```tsx
const { loading } = useCompany()

if (loading) {
  return <Skeleton />
}
```

## 🧪 Testando a Implementação

### 1. **Verificar Dados da Empresa**
```tsx
const { company } = useCompany()
console.log('Dados da empresa:', company)
```

### 2. **Verificar Cores**
```tsx
const primaryColor = useCompanyColor()
console.log('Cor primária:', primaryColor)
```

### 3. **Verificar Logos**
```tsx
const { logo, darkLogo, icon } = useCompanyLogo()
console.log('Logos:', { logo, darkLogo, icon })
```

## 🚨 Troubleshooting

### 1. **Erro: "useCompany deve ser usado dentro de um CompanyProvider"**
- Verificar se o `CompanyProvider` está no layout
- Verificar se o componente está dentro da árvore

### 2. **Dados não carregando**
- Verificar conexão com Supabase
- Verificar se a tabela `companies` existe
- Verificar console para erros

### 3. **Logos não aparecendo**
- Verificar se os arquivos existem em `/public`
- Verificar se os caminhos estão corretos
- Verificar se o `CompanyProvider` está funcionando

## 📈 Próximos Passos

### 1. **Múltiplas Empresas**
- Sistema de seleção de empresa
- Context switching
- Empresas por usuário

### 2. **Configuração Dinâmica**
- Painel de administração
- Upload de logos
- Seleção de cores

### 3. **Cache Avançado**
- React Query / SWR
- Persistência local
- Sincronização em tempo real

## ✨ Resumo

A implementação fornece:
- ✅ Sistema completo e robusto
- ✅ Fácil de usar com hooks especializados
- ✅ Cache automático e fallback
- ✅ Compatível com SSR/SSG
- ✅ Sem piscadas ou mudanças visuais
- ✅ Fácil manutenção e extensão

O sistema está pronto para produção e pode ser facilmente estendido para suportar múltiplas empresas e configurações dinâmicas.
