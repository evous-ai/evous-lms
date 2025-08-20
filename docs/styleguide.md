# Guia de Estilo e Padrões do Projeto

> **Objetivo:** Este arquivo documenta todas as regras visuais e estruturais do projeto para garantir consistência em todas as páginas. Sempre consulte este guia **antes** de criar ou modificar qualquer página.

---

## 🎨 Paleta e Layout Base

* **Cor de fundo padrão das páginas:** `bg-slate-50` (fundo claro e limpo, sem texturas ou sombras).
* **Tipografia padrão:** Fonte utilizada pelo Shadcn/UI, pesos regulares e sem exageros.
* **Estilo geral:** Minimalista, clean, inspirado em referências como **Notion**, **OpenAI** e **Vercel**.
* **Sombras:** Evitar — priorizar bordas sutis ou separadores (`border`, `border-b`, `separator`).
* **Espaçamentos:** Utilizar `p-6` ou `p-8` como padrão para áreas principais, mantendo respiro consistente.

---

## 🧹 Estrutura Padrão das Páginas

### 1. **Header**

* Sempre presente no topo.
* Posição **sticky** ou **fixed**, ocupando toda a largura.
* Pode sobrepor sidebars quando necessário.
* Componentes:

  * Logotipo (esquerda)
  * Título/contexto da página
  * Ações/menus do usuário (direita)

### 2. **Sidebar Principal**

* Presente em todas as páginas internas.
* Estado inicial **comprimido** para ocupar menos espaço.
* Ícones com **tooltips** (usar componente `tooltip` do Shadcn).
* Fundo: igual ao da página (`bg-slate-50`), sem sombras.
* Em **mobile**, substituir por um menu inferior (`menubar` do Shadcn).

### 3. **Área de Conteúdo**

* Fundo **transparente** ou igual ao da página.
* Layout **responsivo**, respeitando breakpoints.
* Evitar caixas desnecessárias para textos — deixar fluido.

### 4. **Footer**

* Apenas quando necessário.
* Estilo discreto (sem fundos chamativos).
* Para botões de ação importantes (ex: "Completar Aula"), manter dentro da área de conteúdo principal.

---

## 📹 Player de Vídeo

* Usar player nativo HTML5 ou Next.js (`<video>`).
* Exibir vídeo de **URL mock** enquanto não há integração.
* Largura **100%** da área disponível.
* Controles visíveis.

---

## 🗂 Componentes e Bibliotecas

* Sempre priorizar **Shadcn/UI** antes de criar qualquer componente customizado.
* Componentes já priorizados:

  * `card`, `alert`, `button`, `badge`, `tooltip`, `separator`, `menubar`, `tabs`, `progress`, `skeleton`
* Evitar bibliotecas externas para UI, a menos que seja imprescindível.

---

## 🔄 Comportamentos Reutilizáveis

### Tabs abaixo do vídeo

* Estrutura em `tabs` do Shadcn.
* Abas: **Comentários** (ativo por padrão), **Quiz**, **Anexos**, **Notas**, **Compartilhar**.
* Conteúdo carregado conforme aba ativa.

### Sidebars secundários (comentários, progresso, etc.)

* Podem ser **fixos** à direita ou móveis (ocultar/exibir).
* Em mobile: substituir por menu inferior.

---

## 📏 Regras Gerais de Implementação

* Código limpo e reutilizável.
* Classes do Tailwind **consistentes** com este guia.
* Evitar estilos inline quando possível.
* Todas as telas devem ter:

  * Header
  * Sidebar (ou menubar no mobile)
  * Conteúdo centralizado e responsivo
* Sempre validar espaçamentos e alinhamentos comparando com Notion/OpenAI.

---

## 📌 Referências Visuais

* [Notion](https://www.notion.so)
* [OpenAI](https://openai.com)
* [Vercel](https://vercel.com)
