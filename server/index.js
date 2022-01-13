const app = require('./config/express');

const main = require('./routes/main');
const usuarios = require('./routes/usuario');
const projeto = require('./routes/projeto');
const projetoConfig = require('./routes/projetoConfig');
const PORT = 8012;

// Rotas
app.use('/', main);
app.use('/usuarios', usuarios);
app.use('/projetos', projeto);
app.use('/projetoConfig', projetoConfig);

app.listen(PORT, function () {
  console.clear();
  console.log("Servidor rodando na url http://localhost:8012");
});