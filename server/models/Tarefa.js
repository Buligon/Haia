const db = require('../config/database');

const Tarefa = db.sequelize.define('Tarefas', {
  assunto: {
    type: db.Sequelize.STRING
  },
  prioridade: {
    type: db.Sequelize.INTEGER
  },
  idStatus: {
    type: db.Sequelize.INTEGER
  },
  /* idSprint: {
    type: db.Sequelize.
  } */
});

module.exports = Tarefa;