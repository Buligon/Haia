const db = require('../config/database');

const Projeto = require('./Projeto');
const Usuario = require('./Usuario');

const ProjetoAcessos = db.sequelize.define('ProjetoAcessos', {
  idProjetoAcessos: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  idUsuario: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Usuario,
      key: 'idUsuarios'
    }
  },
  idProjeto: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Projeto,
      key: 'idProjetos'
    }
  },
  dataAcesso: {
    type: db.Sequelize.DATE,
    defaultValue: db.Sequelize.fn('now')
  }
}, {
  timestamps: false
});



module.exports = ProjetoAcessos;