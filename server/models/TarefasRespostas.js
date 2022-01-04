const db = require('../config/database');

const ProjetoColaboradores = require('./ProjetoColaboradores');
const Tarefa = require('../models/Tarefa.js');

const TarefasRespostas = db.sequelize.define('TarefasRespostas', {
  idTarefasResposta: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  idTarefa: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Tarefa,
      key: 'idTarefas'
    }
  }, 
  idColaborador: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: ProjetoColaboradores,
      key: 'idProjetoColaborador'
    }
  },
  statusAnterior: {
    type: db.Sequelize.INTEGER.UNSIGNED
  },
  statusNovo: {
    type: db.Sequelize.INTEGER.UNSIGNED
  },
  resposta: {
    type: db.Sequelize.TEXT
  },
  dataResposta: {
    type: db.Sequelize.DATE
  }
},{
  timestamps: false
});

TarefasRespostas.hasMany(ProjetoColaboradores, {
  foreignKey: 'idProjetoColaborador', sourceKey: 'idColaborador'
}); 

module.exports = TarefasRespostas;