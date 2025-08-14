const sequelize = require("../config/db");

const Chat = sequelize.define("chats", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});
