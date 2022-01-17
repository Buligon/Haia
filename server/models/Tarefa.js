const db = require('../config/database');

const ProjetoColaboradores = require('./ProjetoColaboradores');
const Projeto = require('./Projeto');
const Status = require('../models/Status');
const Sprints = require('../models/Sprints');

const Tarefa = db.sequelize.define('Tarefas', {
  idTarefas: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  assunto: {
    type: db.Sequelize.STRING
  },
  dataCriacao: {
    type: db.Sequelize.DATE,
    defaultValue: db.Sequelize.fn('now')
  },
  dataAlteracao: {
    type: db.Sequelize.DATE,
    defaultValue: db.Sequelize.fn('now')
  },
  prioridade: {
    type: db.Sequelize.INTEGER.UNSIGNED
  },
  cancelada: {
    type: db.Sequelize.INTEGER
  },
  idAutor: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: ProjetoColaboradores,
      key: 'idProjetoColaborador'
    }
  },
  ultimaResposta: {
    type: db.Sequelize.DATE,
    defaultValue: db.Sequelize.fn('now')
  },
  idProjeto: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Projeto,
      key: 'idProjetos'
    }
  },
  idStatus: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Status,
      key: 'idStatus'
    }
  },
  idSprint: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Sprints,
      key: 'idSprints'
    }
  } 
}, {
  timestamps: false
});


Tarefa.hasOne(ProjetoColaboradores, {
  foreignKey: 'idProjetoColaborador',
  sourceKey: 'idAutor'
});
Tarefa.hasOne(Projeto, {
  foreignKey: 'idProjetos'
});

module.exports = Tarefa;