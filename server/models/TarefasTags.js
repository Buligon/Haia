const db = require('../config/database');

const Tarefa = require('../models/Tarefa.js');
const Tags = require('../models/Tags.js');
const Projeto = require('../models/Projeto.js');

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
    },
    allowNull: false
  },
  idTag: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Tags,
      key: 'idTags'
    },
    allowNull: false
  },
  idProjeto: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    references: {
      model: Projeto,
      key: 'idProjetos'
    },
    allowNull: false
  }
}, {
  timestamps: false
});

TarefasTags.hasOne(Tags, {
  foreignKey: 'idTags',
  sourceKey: 'idTag',
});

module.exports = TarefasTags;