const db = require('../config/database');

const Tarefa = db.sequelize.define('Tarefas', {
  assunto: {
    type: db.Sequelize.STRING
  },
  prioridade: {
    type: db.Sequelize.INTEGER.UNSIGNED
  },
  idStatus: {
    // todo: Criar model status
    /* type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Status,
      key: 'idStatus'
    } */
  },
  /* idSprint: {
    type: db.Sequelize.
  } */
}, {
  timestamps: false
});

module.exports = Tarefa;