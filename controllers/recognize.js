const { recognizeApi } = require("../utils/api");
const {
  ServiceUnavailableError,
  BadRequestError,
} = require("../utils/ErrorHandling");
const fs = require("fs");
const path = require("path");
const recognizeObjectsInImage = async (req, res, next) => {
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

    res.status(200).json({
      objects: transformedObjects,
    });
  } catch (error) {
    throw new ServiceUnavailableError(error.message);
  }
};

module.exports = recognizeObjectsInImage;
