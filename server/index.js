const app = require('./config/express');
const main = require('./routes/main');
const PORT = 8012;

// Rotas
app.use('/', main);

app.listen(PORT, function () {
  console.log("Servidor rodando na url http://localhost:8012");
});