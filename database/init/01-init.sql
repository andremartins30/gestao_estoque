-- Criar o usuário se não existir
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'gestao_user') THEN

      CREATE ROLE gestao_user LOGIN PASSWORD 'gestao123';
   END IF;
END
$do$;

-- Criar o banco se não existir
SELECT 'CREATE DATABASE gestao_estoque'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gestao_estoque')\gexec

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE gestao_estoque TO gestao_user;
