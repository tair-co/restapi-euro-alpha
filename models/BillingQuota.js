const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BillingQuota = sequelize.define(
  "billing_quotas",
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "billing_quotas",
  }
);

module.exports = BillingQuota;
