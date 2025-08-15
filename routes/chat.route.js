const express = require("express");
const {
  conversation,
  getConversation,
  continueConversation,
} = require("../controllers/chat");
const middleware = require("../utils/authMiddleware");
const router = express.Router();

// Chat routes
router
  .post("", middleware, conversation)
  .get("/:id", middleware, getConversation)
  .put("/:id", middleware, continueConversation);
module.exports = router;
