# Aplicação de Gerenciamento de Territórios

Esta é uma aplicação web para gerenciamento de territórios, saídas de campo e designações, ideal para organizações que realizam trabalho de campo por territórios. A aplicação permite o cadastro de territórios, ruas, residências, interações com moradores, saídas de campo e controle de designações.

## Recursos Principais

- 🔐 Sistema de autenticação completo com JWT
- 🗺️ Gerenciamento de territórios, ruas e residências
- 👨‍👩‍👧‍👦 Organização de saídas de campo e dirigentes
- 📋 Controle de designações de territórios
- 📊 Dashboard com estatísticas e informações importantes
- 📱 Interface responsiva para uso em desktop e dispositivos móveis
- 🔄 Histórico de visitas e interações com residências
- 👤 Controle de usuários e permissões

## Requisitos

- Node.js (v14 ou superior)
- NPM (v6 ou superior)
- SQLite3

## Instalação

### Utilizando os scripts de configuração automática

#### Linux/Mac:
```bash
# Tornar o script executável
chmod +x setup.sh

# Executar o script
./setup.sh
```

#### Windows:
```bash
setup.bat
```

### Instalação manual

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/territorios-app.git
cd territorios-app
```

2. Instale as dependências
```bash
npm install
```

3. Configure o arquivo .env
```bash
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

4. Inicialize o banco de dados
```bash
npm run init-db
```

## Execução

### Modo de desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Modo de produção
```bash
npm start
```

## Estrutura do Projeto

```
territorios-app/
├── public/              # Arquivos estáticos (HTML, CSS, JS)
│   ├── css/
│   ├── js/
│   └── views/           # Páginas HTML
├── src/                 # Código fonte do backend
│   ├── config/          # Configurações do app e banco de dados
│   ├── controllers/     # Controladores
│   ├── models/          # Modelos para interagir com o banco
│   ├── routes/          # Rotas da API
│   ├── middlewares/     # Middlewares Express
│   └── utils/           # Utilitários
├── database/            # Banco de dados SQLite
│   └── database.sqlite  # Arquivo do banco de dados
├── app.js               # Arquivo principal da aplicação
├── package.json         # Dependências e scripts
└── .env                 # Variáveis de ambiente
```

## Usuário Padrão

Após a instalação, um usuário administrador padrão é criado:

- **E-mail**: admin@example.com
- **Senha**: admin123

**Importante:** Altere a senha deste usuário após o primeiro login.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Banco de Dados**: SQLite3
- **Autenticação**: JWT (JSON Web Tokens)
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Validação**: express-validator

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## Contribuições

Contribuições são bem-vindas! Abra uma issue ou envie um pull request.

## Segurança

Se você encontrar alguma vulnerabilidade de segurança neste projeto, por favor, envie um e-mail para [seu-email@exemplo.com](mailto:seu-email@exemplo.com) em vez de abrir uma issue pública.