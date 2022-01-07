const db = require('../config/database');

const Projeto = require('../models/Projeto.js');

const Status = db.sequelize.define('Status', {
  idStatus: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  nome: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  cancelado: {
    type: db.Sequelize.TINYINT.UNSIGNED
  }, 
  idProjeto: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Projeto,
      key: 'idProjetos'
    }
  }
}, {
  timestamps: false,
  freezeTableName: true
});


module.exports = Status;