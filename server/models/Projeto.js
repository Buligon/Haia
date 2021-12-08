const db = require('../config/database');

const Projeto = db.sequelize.define('Projetos', {
  nomeProjeto: {
    type: db.Sequelize.STRING
  },
  descricao: {
    type: db.Sequelize.TEXT
  }
  //foto
});

module.exports = Projeto;