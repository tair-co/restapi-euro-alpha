require("dotenv").config();
const express = require("express");
const { errorHandler } = require("./utils/ErrorHandling");
const sequelize = require("./config/db");
const app = express();
const cors = require("cors");

const routeConv = require("./routes/chat.route");
const routeImage = require("./routes/image.route");
const multer = require("multer");
const middleware = require("./utils/authMiddleware");
const recognizeObjectsInImage = require("./controllers/recognize");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.text());
app.use(express.json());
app.use(cors());

// handler errors
app.use(errorHandler);

// images folder static
app.use("/images", express.static("images"));

// routes
app.use("/api/chat/conversation", routeConv);
app.use("/api/imagegeneration", routeImage);

app.use(
  "/api/imagerecognition/recognize",
  upload.single("image"),
  middleware,
  recognizeObjectsInImage
);

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
