const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Importação das rotas
const authRoutes = require('./src/routes/auth');
const territoriesRoutes = require('./src/routes/territories');
const fieldsRoutes = require('./src/routes/fields');
const assignmentsRoutes = require('./src/routes/assignments');

// Criar a aplicação Express
const app = express();
// No seu app.js
const PORT = process.env.PORT || 3001; // Altere para 3001 ou outra porta disponível
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/territories', territoriesRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/assignments', assignmentsRoutes);

// Rota para a aplicação frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Ocorreu um erro no servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});