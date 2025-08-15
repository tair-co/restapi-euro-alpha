const { Sequelize } = require("sequelize");

// connecting to db
const sequelize = new Sequelize("euroskills2023", "root", "", {
  host: "MySql-8.4",
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;

require("../models/index");
