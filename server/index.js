const app = require('./config/express');
const main = require('./routes/main');
const usuarios = require('./routes/usuario');
const PORT = 8012;

// Rotas
app.use('/', main);
app.use('/usuarios', usuarios);

app.listen(PORT, function () {
  console.clear();
  console.log("Servidor rodando na url http://localhost:8012");
});