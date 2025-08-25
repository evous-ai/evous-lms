# Teste da Funcionalidade de Trilha

## 🧪 URLs para Testar

### ✅ Cursos Disponíveis (UUIDs válidos):

1. **Trajetória Vibra**
   - URL: `/trilha/550e8400-e29b-41d4-a716-446655440000`
   - Deve mostrar: Curso completo com 2 módulos e 8 aulas

2. **Liderança Efetiva**
   - URL: `/trilha/550e8400-e29b-41d4-a716-446655440001`
   - Deve mostrar: Curso completo com 2 módulos e 6 aulas

3. **Inovação Tecnológica**
   - URL: `/trilha/550e8400-e29b-41d4-a716-446655440002`
   - Deve mostrar: Curso completo com 2 módulos e 7 aulas

4. **Gestão de Projetos Ágeis** (Novo!)
   - URL: `/trilha/2a6dc821-d073-42f5-ac2f-e08c987d90ec`
   - Deve mostrar: Curso completo com 3 módulos e 10 aulas

### ❌ UUIDs Inválidos (deve retornar 404):

- `/trilha/00000000-0000-0000-0000-000000000000`
- `/trilha/curso-inexistente`
- `/trilha/123`

## 🔍 O que Verificar em Cada Página:

1. **✅ Breadcrumb** - Deve mostrar: Dashboard > Nome do Curso
2. **✅ Hero Section** - Título, descrição, categoria, duração
3. **✅ Botão de Ação** - "Começar curso" ou "Continuar curso"
4. **✅ Lista de Módulos** - Módulos expansíveis com aulas
5. **✅ Links das Aulas** - Cada aula deve linkar para `/trilha/[courseId]/[aulaId]`
6. **✅ Controles de Módulos** - Abrir/fechar todos os módulos

## 🚀 Como Testar:

1. **Acesse o dashboard** - `/dashboard`
2. **Clique em um curso** - Deve navegar para `/trilha/[UUID]`
3. **Verifique a página** - Deve mostrar todos os detalhes do curso
4. **Teste os módulos** - Expanda/colapse módulos
5. **Clique em uma aula** - Deve navegar para a página da aula

## 🐛 Problemas Comuns:

- **404 Error**: UUID não está na lista de cursos mockados
- **Página em branco**: Erro no componente CourseDetailsClient
- **Links quebrados**: Problema na geração de URLs das aulas
- **Módulos não expandem**: Problema no estado do accordion

## 📝 Logs para Debug:

Se houver problemas, verifique:
1. Console do navegador para erros JavaScript
2. Network tab para requisições falhando
3. Console do servidor para erros server-side
4. Parâmetros da URL sendo passados corretamente
