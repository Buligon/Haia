const db = require('../config/database');

const Usuario = db.sequelize.define('Usuarios', {
  idUsuarios: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  nomeUsuario: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
   dataNascimento: {
    type: db.Sequelize.DATEONLY
  },
  email: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  senha: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
}, {
  timestamps: false
});

module.exports = Usuario;