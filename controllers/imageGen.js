const { imageApi } = require("../utils/api");
const {
  BadRequestError,
  ServiceUnavailableError,
  NotFoundError,
} = require("../utils/ErrorHandling");
const path = require("path");
const { saveImageFromUrl } = require("../utils/saveImageUrl");

module.exports = {
  generateImage: async (req, res, next) => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        throw new BadRequestError("Prompt is required").send(res);
      }

      const imageRes = await imageApi("/generate", {
        method: "post",
        data: {
          text_prompt: prompt,
        },
      });

      res.status(200).json({
        job_id: imageRes.data.job_id,
        status: "pending",
      });
    } catch (error) {
      next(new ServiceUnavailableError(error.message));
    }
  },
  getImageStatus: async (req, res, next) => {
    const { id } = req.params;

    try {
      if (!id) {
        throw new BadRequestError("Image ID is required").send(res);
      }

      const statusRes = await imageApi(`/status/${id}`, {
        method: "get",
      });
      const saveFolder = path.join(__dirname, "../images");
      const fileName = `${id}.png`;

      await saveImageFromUrl(statusRes.data.image_url, saveFolder, fileName);

      res.status(200).json({
        progress: statusRes.data.progress || null,
        status: statusRes.data.status,
        image_url: `http://localhost:3000/images/${fileName}`,
      });
    } catch (error) {
      throw new NotFoundError(error.message).send(res);
    }
  },
  getFinishedImage: async (req, res, next) => {
    const { id } = req.params;
    try {
      const imageRes = await imageApi(`/result/${id}`);

      res.status(200).json({
        resource_id: imageRes.data.resource_id,
        image_url: `http://localhost:3000/images/${imageRes.data.file_name}`,
      });
    } catch (error) {
      throw new NotFoundError(error.message).send(res);
    }
  },
};
