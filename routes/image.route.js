const express = require("express");
const {
  conversation,
  getConversation,
  continueConversation,
} = require("../controllers/chat");
const middleware = require("../utils/authMiddleware");
const {
  generateImage,
  getImageStatus,
  getFinishedImage,
} = require("../controllers/imageGen");
const router = express.Router();

router.post("/generate", middleware, generateImage);
router.get("/status/:id", middleware, getImageStatus);
router.get("/result/:id", middleware, getFinishedImage);
module.exports = router;
