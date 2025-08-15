const ServiceUsage = require("../models/ServiceUsage");
const { recognizeApi } = require("../utils/api");
const {
  ServiceUnavailableError,
  BadRequestError,
} = require("../utils/ErrorHandling");
const fs = require("fs");
const path = require("path");
const recognizeObjectsInImage = async (req, res, next) => {
  const startTime = Date.now();
  try {
    const image = req.file;

    if (!image) {
      throw new BadRequestError("Image is required").send(res);
    }

    const recognitionRes = await recognizeApi("/recognize", {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        image: fs.createReadStream(path.join(__dirname, "..", image.path)),
      },
    });

    const transformedObjects = recognitionRes.data.objects.map((obj) => ({
      ...obj,
      bounding_box: {
        x: obj.bounding_box.top,
        y: obj.bounding_box.left,
        width: obj.bounding_box.bottom,
        height: obj.bounding_box.right,
      },
    }));

    const durationMs = Date.now() - startTime;
    await ServiceUsage.create({
      duration_in_ms: durationMs,
      api_token_id: req.token_id,
      service_id: 3,
      usage_started_at: new Date(),
    });

    res.status(200).json({
      objects: transformedObjects,
    });
  } catch (error) {
    throw new ServiceUnavailableError(error.message);
  }
};

module.exports = recognizeObjectsInImage;
