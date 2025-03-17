@echo off
echo === Configurando o Gerenciador de Territorios ===

:: Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js nao esta instalado. Por favor, instale o Node.js para continuar.
    exit /b
)

:: Verificar se npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm nao esta instalado. Por favor, instale o npm para continuar.
    exit /b
)

:: Criar diretórios necessários
echo Criando diretorios...
mkdir database 2>nul
mkdir public\css 2>nul
mkdir public\js 2>nul
mkdir src\config 2>nul
mkdir src\controllers 2>nul
mkdir src\models 2>nul
mkdir src\routes 2>nul
mkdir src\middlewares 2>nul
mkdir src\utils 2>nul

:: Copiar o esquema SQL para o diretório database
echo Configurando banco de dados...
(
echo -- Tabela de Usuarios
echo CREATE TABLE IF NOT EXISTS users (
echo     id INTEGER PRIMARY KEY AUTOINCREMENT,
echo     name TEXT NOT NULL,
echo     email TEXT UNIQUE NOT NULL,
echo     password TEXT NOT NULL,
echo     role TEXT DEFAULT 'user', -- 'admin' ou 'user'
echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
echo ^);
echo.
echo -- Tabela de Territorios
echo CREATE TABLE IF NOT EXISTS territories (
echo     id INTEGER PRIMARY KEY AUTOINCREMENT,
echo     name TEXT NOT NULL,
echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
echo ^);
echo.
echo -- Tabela de Ruas
echo CREATE TABLE IF NOT EXISTS streets (
echo     id INTEGER PRIMARY KEY AUTOINCREMENT,
echo     territory_id INTEGER,
echo     name TEXT NOT NULL,
echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo     FOREIGN KEY ^(territory_id^) REFERENCES territories ^(id^) ON DELETE CASCADE
echo ^);
echo.
echo -- Tabela de Residencias
echo CREATE TABLE IF NOT EXISTS houses (
echo     id INTEGER PRIMARY KEY AUTOINCREMENT,
echo     street_id INTEGER,
echo     number TEXT NOT NULL,
echo     type TEXT NOT NULL, -- 'Residencia', 'Predio', 'Vila', 'Comercio'
echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo     FOREIGN KEY ^(street_id^) REFERENCES streets ^(id^) ON DELETE CASCADE
echo ^);
echo.
echo -- Tabela de Interacoes com Residencias
echo CREATE TABLE IF NOT EXISTS house_interactions (
echo     id INTEGER PRIMARY KEY AUTOINCREMENT,
echo     house_id INTEGER,
echo     user_id INTEGER,
echo     answer TEXT NOT NULL, -- 'sim' ou 'nao'
echo     interaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo     notes TEXT,
echo     FOREIGN KEY ^(house_id^) REFERENCES houses ^(id^) ON DELETE CASCADE,
echo     FOREIGN KEY ^(user_id^) REFERENCES users ^(id^) ON DELETE SET NULL
echo ^);
echo.
echo -- Tabela de Saidas de Campo
echo CREATE TABLE IF NOT EXISTS field_groups (
echo     id INTEGER PRIMARY KEY AUTOINCREMENT,
echo     name TEXT NOT NULL,
echo     day_of_week TEXT NOT NULL,
echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
echo ^);
echo.
echo -- Tabela de Dirigentes de Saida de Campo
echo CREATE TABLE IF NOT EXISTS field_leaders (
echo     id INTEGER PRIMARY KEY AUTOINCREMENT,
echo     field_id INTEGER,
echo     name TEXT NOT NULL,
echo     FOREIGN KEY ^(field_id^) REFERENCES field_groups ^(id^) ON DELETE CASCADE
echo ^);
echo.
echo -- Tabela de Designacoes
echo CREATE TABLE IF NOT EXISTS assignments (
echo     id INTEGER PRIMARY KEY AUTOINCREMENT,
echo     territory_id INTEGER,
echo     field_id INTEGER,
echo     user_id INTEGER,
echo     assignment_date DATE NOT NULL,
echo     return_date DATE,
echo     status TEXT DEFAULT 'active', -- 'active', 'completed', 'overdue'
echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo     FOREIGN KEY ^(territory_id^) REFERENCES territories ^(id^) ON DELETE CASCADE,
echo     FOREIGN KEY ^(field_id^) REFERENCES field_groups ^(id^) ON DELETE CASCADE,
echo     FOREIGN KEY ^(user_id^) REFERENCES users ^(id^) ON DELETE SET NULL
echo ^);
) > database\schema.sql

:: Criar arquivo .env
echo Configurando variaveis de ambiente...
(
echo # Configuracoes do Servidor
echo PORT=3000
echo NODE_ENV=development
echo.
echo # Chave Secreta para JWT
echo JWT_SECRET=territorio_jwt_secret_key_change_me
echo JWT_EXPIRES_IN=24h
echo.
echo # Configuracao do Banco de Dados
echo DB_PATH=./database/database.sqlite
) > .env

:: Instalar dependências
echo Instalando dependencias...
call npm install express cors sqlite3 bcryptjs jsonwebtoken dotenv morgan express-validator
call npm install nodemon --save-dev

:: Inicializar o banco de dados
echo Inicializando banco de dados...
call node src\config\init-db.js

echo === Configuracao concluida! ===
echo Para iniciar o servidor em modo de desenvolvimento, execute:
echo npm run dev
echo Para iniciar o servidor em modo de producao, execute:
echo npm start