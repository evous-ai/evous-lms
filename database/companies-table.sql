-- Criação da tabela companies
-- Execute este SQL no seu projeto Supabase

-- 1. Criar a tabela companies
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  logo TEXT NOT NULL,
  dark_logo TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de segurança (ajuste conforme necessário)
-- Política para leitura pública (todos podem ver as empresas)
CREATE POLICY "Empresas são visíveis publicamente" ON companies
  FOR SELECT USING (true);

-- Política para inserção apenas por usuários autenticados (opcional)
CREATE POLICY "Usuários autenticados podem inserir empresas" ON companies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para atualização apenas por usuários autenticados (opcional)
CREATE POLICY "Usuários autenticados podem atualizar empresas" ON companies
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 5. Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Trigger para atualizar timestamp automaticamente
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_companies_updated_at();

-- 7. Inserir empresa padrão (Lubrax)
INSERT INTO companies (id, name, primary_color, logo, dark_logo, icon) VALUES (
  'c9551059-35fb-4c5e-bcb7-bc09ddc25f31',
  'Lubrax',
  '#144722',
  '/logo_lubrax_lightmode.png',
  '/logo_lubrax_darkmode.png',
  '/favicon_lubrax.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  primary_color = EXCLUDED.primary_color,
  logo = EXCLUDED.logo,
  dark_logo = EXCLUDED.dark_logo,
  icon = EXCLUDED.icon,
  updated_at = NOW();

-- 8. Verificar se a inserção foi bem-sucedida
SELECT 
  id,
  name,
  primary_color,
  logo,
  dark_logo,
  icon,
  created_at,
  updated_at
FROM companies
WHERE id = 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31';

-- 9. Comando para ver todas as empresas (opcional)
-- SELECT * FROM companies ORDER BY created_at;
