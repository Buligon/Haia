const Sequelize = require('sequelize');

// Conexão com o banco de dados MySQL
const sequelize = new Sequelize('mydb', 'root', '@ifpr#r4f43l', {
  host: "127.0.0.1",
  port: "3308",
  dialect: 'mysql',
  define: {
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  }
});

// Verifica se a conexão ocorreu corretamente
sequelize.authenticate().then(function () {
  console.log("Conectado com sucesso!");
}).catch(function (erro) {
  console.log("Erro ao se conectar com o banco de dados!\n\n" + erro)
});

// Exporta o módulo
module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize
}