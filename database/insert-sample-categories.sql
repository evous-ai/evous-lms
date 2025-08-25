-- Script para inserir categorias de exemplo na tabela categories
-- Execute este script no seu projeto Supabase após criar a tabela

-- Primeiro, vamos verificar se a tabela existe
-- SELECT EXISTS (
--   SELECT FROM information_schema.tables 
--   WHERE table_schema = 'public' 
--   AND table_name = 'categories'
-- );

-- Inserir categorias de exemplo
-- IMPORTANTE: Substitua 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31' pelo company_id real da sua empresa

INSERT INTO categories (name, description, company_id, color, variant) VALUES
  ('Identidade Visual', 'Treinamentos sobre marca, logo e identidade visual da empresa', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'blue', 'default'),
  ('Estratégia Comercial', 'Treinamentos sobre estratégias de vendas, marketing e posicionamento', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'green', 'default'),
  ('Produtos & Combustíveis', 'Treinamentos sobre produtos, combustíveis e especificações técnicas', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'purple', 'default'),
  ('Tecnologia', 'Treinamentos sobre inovação tecnológica, sistemas e ferramentas digitais', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'orange', 'default'),
  ('Tratamento', 'Treinamentos sobre procedimentos, tratamentos e protocolos operacionais', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'pink', 'default'),
  ('Patologia', 'Treinamentos sobre diagnósticos, análises e identificação de problemas', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'indigo', 'default'),
  ('Segurança', 'Treinamentos sobre segurança do trabalho, normas e procedimentos de segurança', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'red', 'default'),
  ('Qualidade', 'Treinamentos sobre controle de qualidade, padrões e certificações', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'teal', 'default'),
  ('Gestão', 'Treinamentos sobre liderança, gestão de equipes e administração', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'cyan', 'default'),
  ('Compliance', 'Treinamentos sobre conformidade, regulamentações e políticas da empresa', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'amber', 'default')
ON CONFLICT (name, company_id) DO NOTHING;

-- Verificar as categorias inseridas
SELECT 
  id,
  name,
  description,
  company_id,
  color,
  variant,
  created_at
FROM categories 
WHERE company_id = 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31'
ORDER BY name;

-- Contar total de categorias
SELECT COUNT(*) as total_categorias 
FROM categories 
WHERE company_id = 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31';
