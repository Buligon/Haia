const db = require('../config/database');

const ProjetoColaboradores = require('./ProjetoColaboradores');
const Tarefa = require('../models/Tarefa.js');
const Status = require('../models/Status.js');

const TarefasTempo = db.sequelize.define('TarefasTempo', {
  idTarefasTempo: {
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
  idStatus: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Status,
      key: 'idStatus'
    }
  },
  dataInicio: {
    type: db.Sequelize.DATE,
    defaultValue: db.Sequelize.fn('now'),
    allowNull: false
  },
  dataFinal: {
    type: db.Sequelize.DATE
  }
},{
  freezeTableName: true,
  timestamps: false
});

TarefasTempo.hasMany(ProjetoColaboradores, {
  foreignKey: 'idProjetoColaborador', sourceKey: 'idColaborador'
}); 

module.exports = TarefasTempo;