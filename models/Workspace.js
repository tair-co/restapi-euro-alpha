const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Workspace = sequelize.define(
  "Workspace",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    billing_quota_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "workspaces",
    timestamps: false,
  }
);

module.exports = Workspace;
