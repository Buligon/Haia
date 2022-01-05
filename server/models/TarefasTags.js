const db = require('../config/database');

const Tarefa = require('../models/Tarefa.js');
const Tags = require('../models/Tags.js');

const TarefasTags = db.sequelize.define('TarefasTags', {
  idTarefasTags: {
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
  idTag: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Tags,
      key: 'idTags'
    }
  },
  cancelado: {
    type: db.Sequelize.TINYINT.UNSIGNED
  }
}, {
  timestamps: false
});

module.exports = TarefasTags;