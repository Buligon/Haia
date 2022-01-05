const db = require('../config/database');

const Status = db.sequelize.define('Status', {
  idStatus: {
    type: db.Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  nome: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  cancelado: {
    type: db.Sequelize.TINYINT.UNSIGNED
  }
}, {
  timestamps: false
});


module.exports = Status;