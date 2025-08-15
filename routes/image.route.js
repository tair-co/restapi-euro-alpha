const express = require("express");
const middleware = require("../utils/authMiddleware");
const {
  generateImage,
  getImageStatus,
  getFinishedImage,
  upscaleImage,
  zoomInImage,
  zoomOutImage,
} = require("../controllers/imageGen");
const router = express.Router();

// image generation routes
router.post("/generate", middleware, generateImage);
router.get("/status/:id", middleware, getImageStatus);
router.get("/result/:id", middleware, getFinishedImage);
router.post("/upscale", middleware, upscaleImage);
router.post("/zoom/in", middleware, zoomInImage);
router.post("/zoom/out", middleware, zoomOutImage);

module.exports = router;
