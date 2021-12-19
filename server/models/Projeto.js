const db = require('../config/database');

const Projeto = db.sequelize.define('Projetos', {
  idProjetos: {
    type: db.Sequelize.INTEGER,
    primaryKey: true
  },
  nomeProjeto: {
    type: db.Sequelize.STRING
  },
  codigoCriador: {
    type: db.Sequelize.INTEGER,
  },
  descricao: {
    type: db.Sequelize.TEXT
  }
  //foto
});

module.exports = Projeto;