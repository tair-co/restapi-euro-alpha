const { DataTypes } = require("sequelize");
const { Workspace } = require("./Workspace"); // Adjust import as needed
const sequelize = require("../config/db");

const ApiToken = sequelize.define(
  "ApiToken",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    workspace_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "workspaces",
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    revoked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "api_tokens",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

// Associations

module.exports = ApiToken;
