require("dotenv").config();
const express = require("express");
const { errorHandler } = require("./utils/ErrorHandling");
const sequelize = require("./config/db");
const app = express();
const cors = require("cors");

const routeConv = require("./routes/chat.route");

app.use(express.text());
app.use(express.json());
app.use(cors());

// handler errors
app.use(errorHandler);

// routes
app.use("/conversation", routeConv);

// db connection

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected success");
  })
  .catch((err) => {
    console.error("Error:", err);
  });

sequelize
  .sync()
  .then(() => {
    console.log("Database sync success");
  })
  .catch((err) => {
    console.error("Error:", err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
