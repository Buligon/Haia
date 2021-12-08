const db = require('../config/database');

const Usuario = db.sequelize.define('Usuarios', {
  // I don't want createdAt
  createdAt: false,
  // I want updatedAt to actually be called updateTimestamp
  updatedAt: false,
  idUsuarios: {
    type: db.Sequelize.INTEGER,
    primaryKey: true
  },
  nome: {
    type: db.Sequelize.STRING
  },
  sobrenome: {
    type: db.Sequelize.STRING
  },
  dataNascimento: {
    type: db.Sequelize.DATEONLY
  },
  email: {
    type: db.Sequelize.STRING
  },
  senha: {
    type: db.Sequelize.STRING
  },
});

module.exports = Usuario;