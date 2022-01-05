const db = require('../config/database');

const Projeto = require('../models/Projeto.js')

const Tags = db.sequelize.define('Tags', {
  idTags: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  descricao: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  cor: {
    type: db.Sequelize.STRING
  },
  cancelada: {
    type: db.Sequelize.TINYINT.UNSIGNED
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

module.exports = Tags;