const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const ServiceUsage = sequelize.define(
  "ServiceUsage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    api_token_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration_in_ms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usage_started_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "service_usages",
  }
);

module.exports = ServiceUsage;
