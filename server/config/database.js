const Sequelize = require('sequelize');

const banco = 'mydb', usuario = 'root', pwd = 'G1WgiJk5cVv&';
const ip = "127.0.0.1", porta = "3308";

// Conexão com o banco de dados MySQL
const sequelize = new Sequelize(banco, usuario, pwd, {
  host: ip,
  port: porta,
  dialect: 'mariadb',
  define: {
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  }
});

// Verifica se a conexão ocorreu corretamente
sequelize.authenticate().then(function () {
  console.log("\tConectado ao banco de dados com sucesso!\nBanco: " + banco + "\tUsuário: " + usuario + "\tServidor: " + ip + ":" + porta);
}).catch(function (erro) {
  console.log("Erro ao se conectar com o banco de dados!\n\n" + erro)
});

// Exporta o módulo
module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize
}