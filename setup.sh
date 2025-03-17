#!/bin/bash

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Node.js não está instalado. Por favor, instale o Node.js para continuar."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "npm não está instalado. Por favor, instale o npm para continuar."
    exit 1
fi

echo "=== Configurando o Gerenciador de Territórios ==="

# Criar diretórios necessários
echo "Criando diretórios..."
mkdir -p database
mkdir -p public/css
mkdir -p public/js
mkdir -p src/config
mkdir -p src/controllers
mkdir -p src/models
mkdir -p src/routes
mkdir -p src/middlewares
mkdir -p src/utils

# Copiar o esquema SQL para o diretório database
echo "Configurando banco de dados..."
cat <<EOF > database/schema.sql
-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user', -- 'admin' ou 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Territórios
CREATE TABLE IF NOT EXISTS territories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Ruas
CREATE TABLE IF NOT EXISTS streets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    territory_id INTEGER,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (territory_id) REFERENCES territories (id) ON DELETE CASCADE
);

-- Tabela de Residências
CREATE TABLE IF NOT EXISTS houses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    street_id INTEGER,
    number TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Residência', 'Prédio', 'Vila', 'Comércio'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (street_id) REFERENCES streets (id) ON DELETE CASCADE
);

-- Tabela de Interações com Residências
CREATE TABLE IF NOT EXISTS house_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    house_id INTEGER,
    user_id INTEGER,
    answer TEXT NOT NULL, -- 'sim' ou 'não'
    interaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (house_id) REFERENCES houses (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Tabela de Saídas de Campo
CREATE TABLE IF NOT EXISTS field_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Dirigentes de Saída de Campo
CREATE TABLE IF NOT EXISTS field_leaders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id INTEGER,
    name TEXT NOT NULL,
    FOREIGN KEY (field_id) REFERENCES field_groups (id) ON DELETE CASCADE
);

-- Tabela de Designações
CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    territory_id INTEGER,
    field_id INTEGER,
    user_id INTEGER,
    assignment_date DATE NOT NULL,
    return_date DATE,
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'overdue'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (territory_id) REFERENCES territories (id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES field_groups (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);
EOF

# Criar arquivo .env
echo "Configurando variáveis de ambiente..."
cat <<EOF > .env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Chave Secreta para JWT
JWT_SECRET=territorio_jwt_secret_key_change_me
JWT_EXPIRES_IN=24h

# Configuração do Banco de Dados
DB_PATH=./database/database.sqlite
EOF

# Instalar dependências
echo "Instalando dependências..."
npm install express cors sqlite3 bcryptjs jsonwebtoken dotenv morgan express-validator
npm install nodemon --save-dev

# Inicializar o banco de dados
echo "Inicializando banco de dados..."
node src/config/init-db.js

echo "=== Configuração concluída! ==="
echo "Para iniciar o servidor em modo de desenvolvimento, execute:"
echo "npm run dev"
echo "Para iniciar o servidor em modo de produção, execute:"
echo "npm start"