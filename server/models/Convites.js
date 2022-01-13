const db = require('../config/database');
const Projeto = require('../models/Projeto.js');

const Convites = db.sequelize.define('Convites', {
  idConvites: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  idProjeto: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Projeto,
      key: 'idProjetos'
    }
  },
  email: {
    type: db.Sequelize.STRING
  },
  aceito: {
    type: db.Sequelize.TINYINT
  }
}, {
  timestamps: false
});

Convites.hasMany(Projeto, {
  foreignKey: 'idProjetos'
});


module.exports = Convites;