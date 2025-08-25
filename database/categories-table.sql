-- Tabela de categorias para treinamentos
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  company_id UUID NOT NULL,
  color TEXT NOT NULL DEFAULT 'blue',
  variant TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_categories_company_id ON categories(company_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Habilitar RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver categorias da sua empresa" ON categories
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Administradores podem gerenciar categorias da sua empresa" ON categories
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar timestamp automaticamente
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- Inserir algumas categorias de exemplo (substitua o company_id pelo ID real da sua empresa)
-- INSERT INTO categories (name, description, company_id, color, variant) VALUES
--   ('Identidade Visual', 'Treinamentos sobre marca e identidade visual', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'blue', 'default'),
--   ('Estratégia Comercial', 'Treinamentos sobre estratégias de vendas e marketing', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'green', 'default'),
--   ('Produtos & Combustíveis', 'Treinamentos sobre produtos e combustíveis', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'purple', 'default'),
--   ('Tecnologia', 'Treinamentos sobre tecnologia e inovação', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'orange', 'default'),
--   ('Tratamento', 'Treinamentos sobre tratamentos e procedimentos', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'pink', 'default'),
--   ('Patologia', 'Treinamentos sobre patologias e diagnósticos', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31', 'indigo', 'default');
