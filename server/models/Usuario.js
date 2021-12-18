const db = require('../config/database');

const Usuario = db.sequelize.define('Usuarios', {
  idUsuarios: {
    type: db.Sequelize.INTEGER,
    primaryKey: true
  },
  nomeUsuario: {
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
}, {
  createdAt: false,
  updatedAt: false,
});

module.exports = Usuario;