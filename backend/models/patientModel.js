const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  token_number: {
    type: DataTypes.INTEGER,
    // unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  purpose: {
    type: DataTypes.STRING(255),
  },
  status: {
    type: DataTypes.ENUM('Waiting', 'In Consultation', 'Done'),
    allowNull: false,
    defaultValue: 'Waiting',
  },
}, {
  tableName: 'patient',
  timestamps: true,
});

module.exports = Patient;