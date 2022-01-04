const { devNull } = require('os');
const { deflate } = require('zlib');
const db = require('../config/database');
const Usuario = require('./Usuario');

const Projeto = require('../models/Projeto.js')

const ProjetoColaboradores = db.sequelize.define('ProjetoColaboradores', {
  idProjetoColaborador: {
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
  cancelado: {
    type: db.Sequelize.INTEGER
  },
  idCargo: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    // todo: Criar model cargos
    /* references: {
      model: Cargos,
      key: 'idCargos'
    } */
  }
},{
  timestamps: false
});

ProjetoColaboradores.hasMany(Usuario, {
  foreignKey: 'idUsuarios',
  sourceKey: 'idUsuario'
});

module.exports = ProjetoColaboradores;