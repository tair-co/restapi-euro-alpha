const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ImageGeneration = sequelize.define(
  "image_generations",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    job_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service_usage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "image_generations",
  }
);

module.exports = ImageGeneration;
