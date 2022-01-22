const db = require('../config/database');
const Usuario = require('../models/Usuario.js');
const ProjetoColaboradores = require('./ProjetoColaboradores');

const Projeto = db.sequelize.define('Projetos', {
  idProjetos: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  nomeProjeto: {
    type: db.Sequelize.STRING
  },
  codigoCriador: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Usuario,
      key: 'idUsuarios'
    }
  },
  descricao: {
    type: db.Sequelize.TEXT
  },/* 
  banner: {
    type: db.Sequelize.BLOB
  } */
  cancelado: {
    type: db.Sequelize.TINYINT
  }
}, {
  timestamps: false
});

Projeto.hasMany(ProjetoColaboradores, {
  foreignKey: 'idProjeto'
});


module.exports = Projeto;