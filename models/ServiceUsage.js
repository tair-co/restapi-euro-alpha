const { DataTypes } = require('sequelize');

const sequelize = require('../config/db');

const ServiceUsage = sequelize.define('ServiceUsage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  durationInMs: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usageStartedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'service_usages',
});

module.exports = ServiceUsage;
