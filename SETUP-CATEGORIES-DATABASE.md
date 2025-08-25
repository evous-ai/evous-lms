# 🗄️ Configuração do Banco de Dados - Categorias

## 📋 Passo a Passo para Configurar as Categorias

### **1. Acessar o Supabase**

1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto Vision LMS

### **2. Executar o SQL da Tabela**

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Cole o conteúdo do arquivo `database/categories-table.sql`
4. Clique em **Run** para executar

### **3. Verificar se a Tabela foi Criada**

1. Vá para **Table Editor** no menu lateral
2. Você deve ver a tabela `categories` listada
3. Clique na tabela para ver sua estrutura

### **4. Inserir Categorias de Exemplo**

1. Volte para **SQL Editor**
2. Crie uma nova query
3. Cole o conteúdo do arquivo `database/insert-sample-categories.sql`
4. **IMPORTANTE**: Substitua o `company_id` pelo ID real da sua empresa
5. Clique em **Run**

### **5. Verificar os Dados Inseridos**

1. Vá para **Table Editor** > **categories**
2. Você deve ver as 10 categorias inseridas
3. Verifique se o `company_id` está correto

### **6. Testar a Funcionalidade**

1. Acesse `/dashboard` no seu projeto
2. Abra o console do navegador (F12)
3. Verifique os logs de carregamento das categorias
4. O dropdown deve mostrar as categorias do banco

## 🔍 Como Encontrar o Company ID

### **Opção 1: Verificar na Tabela Profiles**
```sql
SELECT id, email, company_id 
FROM profiles 
WHERE company_id IS NOT NULL 
LIMIT 5;
```

### **Opção 2: Verificar na Tabela Companies**
```sql
SELECT id, name 
FROM companies 
LIMIT 5;
```

### **Opção 3: Usar o Company ID Padrão**
Se você não tiver uma empresa específica, use o ID padrão:
```sql
-- Este é o ID usado no código atual
'c9551059-35fb-4c5e-bcb7-bc09ddc25f31'
```

## 📊 Estrutura da Tabela Categories

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,           -- Identificador único
  name TEXT NOT NULL,            -- Nome da categoria
  description TEXT,              -- Descrição detalhada
  company_id UUID NOT NULL,      -- ID da empresa
  color TEXT NOT NULL,           -- Cor da categoria
  variant TEXT NOT NULL,         -- Variante visual
  created_at TIMESTAMP,          -- Data de criação
  updated_at TIMESTAMP           -- Data de atualização
);
```

## 🎨 Cores Disponíveis

As categorias de exemplo usam estas cores:
- **blue**: Identidade Visual
- **green**: Estratégia Comercial
- **purple**: Produtos & Combustíveis
- **orange**: Tecnologia
- **pink**: Tratamento
- **indigo**: Patologia
- **red**: Segurança
- **teal**: Qualidade
- **cyan**: Gestão
- **amber**: Compliance

## 🚨 Troubleshooting

### **Erro: "Table does not exist"**
- ✅ Execute primeiro o arquivo `categories-table.sql`
- ✅ Verifique se não há erros de sintaxe

### **Erro: "Company ID not found"**
- ✅ Verifique se o company_id existe na tabela profiles
- ✅ Use um company_id válido no script de inserção

### **Erro: "Permission denied"**
- ✅ Verifique se as políticas RLS estão configuradas
- ✅ Confirme se o usuário tem acesso à tabela

### **Categorias não aparecem no dropdown**
- ✅ Verifique o console do navegador para erros
- ✅ Confirme se o company_id está correto
- ✅ Verifique se as categorias foram inseridas

## 📱 Testando no Frontend

### **1. Acessar o Dashboard**
```
http://localhost:3000/dashboard
```

### **2. Verificar o Console**
- Abra DevTools (F12)
- Vá para a aba Console
- Procure por logs sobre categorias

### **3. Verificar o Dropdown**
- Clique no filtro de categoria
- Deve mostrar as categorias do banco
- Não deve mostrar "Carregando..." por muito tempo

### **4. Verificar a Seção de Debug**
- Em desenvolvimento, deve aparecer uma caixa de debug
- Mostra informações sobre as categorias carregadas

## 🔄 Próximos Passos

### **1. Personalizar Categorias**
- Editar nomes e descrições
- Alterar cores das categorias
- Adicionar novas categorias

### **2. Integrar com Treinamentos**
- Relacionar treinamentos com categorias
- Usar cores das categorias nos cards
- Filtros mais avançados

### **3. Interface de Administração**
- CRUD de categorias
- Upload de cores personalizadas
- Gerenciamento de variantes

## ✅ Checklist de Configuração

- [ ] Tabela `categories` criada
- [ ] Políticas RLS configuradas
- [ ] Categorias de exemplo inseridas
- [ ] Company ID correto configurado
- [ ] Frontend carregando categorias
- [ ] Dropdown funcionando
- [ ] Logs sem erros
- [ ] Seção de debug visível

## 🎯 Resultado Esperado

Após a configuração, você deve ver:
1. **10 categorias** no dropdown de filtro
2. **Logs de sucesso** no console
3. **Seção de debug** mostrando as categorias
4. **Filtros funcionais** com dados reais do banco
5. **Performance otimizada** com índices

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no console
2. Confirme se o SQL foi executado corretamente
3. Verifique se o company_id está correto
4. Teste as consultas SQL diretamente no Supabase
