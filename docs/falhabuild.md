# Relatório de Erros e Avisos do Build

## 1. Variáveis/Componentes Importados ou Declarados e Não Utilizados

**Exemplo:**
```
5:10  Error: 'Input' is defined but never used.  @typescript-eslint/no-unused-vars
17:10  Error: 'AvatarModal' is defined but never used.  @typescript-eslint/no-unused-vars
...
414:10  Error: 'AvatarModalCustom' is defined but never used.  @typescript-eslint/no-unused-vars
...
748:36  Error: 'prompt' is defined but never used.  @typescript-eslint/no-unused-vars
```
**Motivo:**
Esses erros ocorrem quando você importa ou declara uma variável, função ou componente, mas nunca a utiliza no código. O TypeScript (e o ESLint) sinaliza isso porque pode indicar código morto, redundante ou esquecimento de uso.

**Como corrigir:**
- Remova as importações/declarações não utilizadas.
- Se for usar, utilize-as corretamente no código.

---

## 2. Variáveis Declaradas com let e Nunca Reatribuídas

**Exemplo:**
```
664:9  Error: 'newAssets' is never reassigned. Use 'const' instead.  prefer-const
```
**Motivo:**
Você declarou a variável `newAssets` com `let`, mas nunca alterou seu valor depois da declaração. O ESLint sugere usar `const` para indicar que o valor não muda, melhorando a legibilidade e segurança do código.

**Como corrigir:**
- Troque `let newAssets = ...` por `const newAssets = ...`.

---

## 3. Variáveis Atribuídas mas Nunca Usadas

**Exemplo:**
```
564:9  Error: 'handleAvatarSelect' is assigned a value but never used.  @typescript-eslint/no-unused-vars
808:9  Error: 'renderAvatar' is assigned a value but never used.  @typescript-eslint/no-unused-vars
```
**Motivo:**
Você criou funções ou variáveis, mas nunca as utilizou em nenhum lugar do código. Isso pode ser um erro de lógica ou código desnecessário.

**Como corrigir:**
- Remova essas funções/variáveis se não forem necessárias.
- Se deveriam ser usadas, verifique onde deveriam ser chamadas e corrija.

---

## 4. Uso de <img> ao Invés de <Image /> do Next.js

**Exemplo:**
```
242:25  Warning: Using <img> could result in slower LCP and higher bandwidth. Consider using <Image /> from next/image or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
...
(ocorre em várias linhas)
```
**Motivo:**
O Next.js recomenda usar o componente <Image /> ao invés da tag <img>, pois ele otimiza automaticamente as imagens, melhorando performance (LCP) e reduzindo o consumo de banda.

**Como corrigir:**
- Substitua <img ... /> por <Image ... /> do pacote next/image.
- Lembre-se de importar: `import Image from 'next/image'`.

---

## 5. Falta de Prop alt em Imagens

**Exemplo:**
```
121:25  Warning: Image elements must have an alt prop, either with meaningful text, ou um empty string for decorative images.  jsx-a11y/alt-text
```
**Motivo:**
Acessibilidade: toda imagem deve ter um atributo alt para descrever seu conteúdo, ou alt="" se for decorativa. Isso ajuda leitores de tela e melhora a experiência de todos os usuários.

**Como corrigir:**
- Adicione o atributo alt em todas as imagens, por exemplo: <img src="..." alt="Descrição da imagem" />.

---

## 6. Importações Não Utilizadas em Outros Arquivos

**Exemplo:**
```
./components/app-sidebar.tsx
19:10  Error: 'NavMain' is defined but never used.  @typescript-eslint/no-unused-vars
20:10  Error: 'NavProjects' is defined but never used.  @typescript-eslint/no-unused-vars
```
**Motivo:**
Mesmo caso do item 1, mas em outro arquivo. Importações não utilizadas poluem o código e podem confundir outros desenvolvedores.

**Como corrigir:**
- Remova as importações não utilizadas.

---

## Resumo das Causas

- Importações/declarações não utilizadas: código redundante ou esquecido.
- Uso de let ao invés de const: má prática quando o valor não muda.
- Uso de <img> ao invés de <Image />: não aproveita otimizações do Next.js.
- Falta de alt em imagens: prejudica acessibilidade.
- Funções/variáveis declaradas mas não usadas: código morto ou lógica incompleta.

## Recomendações Gerais

1. Revise e remova todo código/importação não utilizado.
2. Troque let por const quando não houver reatribuição.
3. Substitua todas as tags <img> por <Image /> do Next.js.
4. Adicione sempre o atributo alt em imagens.
5. Após ajustes, rode novamente o build para garantir que os avisos e erros sumiram. 

# Plano de Correções para Erros de Build

## 1. Erros de TypeScript: uso de `any` em `layout-modal.tsx`

**Mensagens:**
- 28:31  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
- 137:33  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

**Causa:**
- Uso de `as any` ao definir o campo `layoutType` nos objetos do array `layouts`.

**Correção:**
- Remover o `as any` e deixar apenas o valor literal, pois o tipo já está corretamente definido na interface `LayoutOption`.
  - Exemplo: Trocar `layoutType: "abertura" as any,` por `layoutType: "abertura",`

---

## 2. Warning de acessibilidade em `media-upload-modal.tsx`

**Mensagem:**
- 121:25  Warning: Image elements must have an alt prop, either with meaningful text, ou um empty string for decorative images.  jsx-a11y/alt-text

**Causa:**
- Uso de `<Image />` sem o atributo `alt`.

**Correção:**
- Adicionar o atributo `alt` em todos os componentes `<Image />`.
  - Se a imagem for decorativa, usar `alt=""`.
  - Se for relevante para o usuário, usar um texto descritivo.

---

## 3. nav-user.tsx
- **Error:** 'AvatarImage' is defined but never used. (@typescript-eslint/no-unused-vars)
  - **Correção:** Remover a importação de `AvatarImage` do arquivo, já que não está sendo utilizada.

---

## 4. soundtrack-modal.tsx
- **Warning:** The ref value 'audioRefs.current' will likely have changed by the time this effect cleanup function runs. (react-hooks/exhaustive-deps)
  - **Correção:** Copiar o valor de `audioRefs.current` para uma variável local dentro do useEffect antes de retornar a função de cleanup.
- **Error:** 'playSyntheticAudio' is assigned a value but never used. (@typescript-eslint/no-unused-vars)
  - **Correção:** Remover a função `playSyntheticAudio` se não for utilizada, ou garantir que ela seja chamada em algum lugar do código.

---

## Resumo das ações
- [ ] Remover todos os `as any` dos campos `layoutType` em `components/modals/layout-modal.tsx`.
- [ ] Adicionar o atributo `alt` em todos os componentes `<Image />` em `components/modals/media-upload-modal.tsx`. 

# Plano de Correção dos Erros de Build

## 1. media-upload-modal.tsx
- **Warning:** Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images. (jsx-a11y/alt-text)
  - **Correção:** Adicionar o atributo `alt` (mesmo vazio) em todos os componentes <Image /> do arquivo.

## 2. soundtrack-modal.tsx
- **Warning:** The ref value 'audioRefs.current' will likely have changed by the time this effect cleanup function runs. (react-hooks/exhaustive-deps)
  - **Correção:** Copiar o valor de `audioRefs.current` para uma variável local dentro do useEffect antes de retornar a função de cleanup.
- **Error:** 'playSyntheticAudio' is assigned a value but never used. (@typescript-eslint/no-unused-vars)
  - **Correção:** Remover a função `playSyntheticAudio` se não for utilizada, ou garantir que ela seja chamada em algum lugar do código.

## 3. nav-user.tsx
- **Error:** 'AvatarImage' is defined but never used. (@typescript-eslint/no-unused-vars)
  - **Correção:** Remover a importação de `AvatarImage` do arquivo, já que não está sendo utilizada.

## 4. app-sidebar.tsx
- **Type error:** Type '{ name: string; email: string; avatar: null; initials: string; }' is not assignable to type '{ name: string; email: string; avatar?: string | undefined; initials?: string | undefined; }'.  Type 'null' is not assignable to type 'string | undefined'.
  - **Correção:** Remover o campo `avatar` ou definir como `undefined` ou uma string vazia, nunca como `null`.

---

Após aplicar essas correções, o build deve passar sem erros ou warnings críticos relacionados a esses pontos. 