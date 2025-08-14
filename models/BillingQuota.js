const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BillingQuota = sequelize.define(
  "BillingQuota",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    limit: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "billing_quotas",
    timestamps: true,
  }
);

module.exports = BillingQuota;
