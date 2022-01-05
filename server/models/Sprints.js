const db = require('../config/database');

const Projeto = require('../models/Projeto.js')

const Sprints = db.sequelize.define('Sprints', {
  idSprints: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  nome: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  descricao: {
    type: db.Sequelize.STRING
  },
  dataCriacao: {
    type: db.Sequelize.DATE,
    defaultValue: db.Sequelize.fn('now')
  },
  cancelada: {
    type: db.Sequelize.TINYINT.UNSIGNED
  },
  dataAlteracao: {
    type: db.Sequelize.DATE
  },
  idProjeto: {
    type: db.Sequelize.TINYINT.UNSIGNED,
    allowNull: false,
    references: {
      model: Projeto,
      key: 'idProjetos'
    }
  }
}, {
  timestamps: false
});

module.exports = Sprints;