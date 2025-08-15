const { imageApi } = require("../utils/api");
const {
  BadRequestError,
  ServiceUnavailableError,
  NotFoundError,
} = require("../utils/ErrorHandling");
const path = require("path");
const { saveImageFromUrl } = require("../utils/saveImageUrl");

// second Ai functionality

module.exports = {
  generateImage: async (req, res, next) => {
    try {
      const { text_prompt } = req.body;

      if (!text_prompt) {
        throw new BadRequestError("Prompt is required").send(res);
      }
      const imageRes = await imageApi("/generate", {
        method: "post",
        data: {
          text_prompt: text_prompt,
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
      const saveFolder = path.join(__dirname, "../images");
      const fileName = `${id}.png`;

      await saveImageFromUrl(imageRes.data.image_url, saveFolder, fileName);

      res.status(200).json({
        resource_id: imageRes.data.resource_id,
        image_url: `http://localhost:3000/images/${fileName}`,
      });
    } catch (error) {
      throw new NotFoundError(error.message).send(res);
    }
  },
  upscaleImage: async (req, res) => {
    const { resource_id } = req.body;

    try {
      if (!resource_id) {
        throw new BadRequestError("Resource ID is required").send(res);
      }

      const upscaleRes = await imageApi(`/upscale/`, {
        method: "post",
        data: {
          resource_id: resource_id,
        },
      });

      res.status(200).json({
        job_id: upscaleRes.data.job_id,
      });
    } catch (error) {
      throw new ServiceUnavailableError(error.message).send(res);
    }
  },
  zoomInImage: async (req, res) => {
    const { resource_id } = req.body;

    try {
      if (!resource_id) {
        throw new BadRequestError("Resource ID is required").send(res);
      }

      const zoomInRes = await imageApi(`/zoom/in/`, {
        method: "post",
        data: {
          resource_id: resource_id,
        },
      });

      res.status(200).json({
        job_id: zoomInRes.data.job_id,
      });
    } catch (error) {
      throw new ServiceUnavailableError(error.message).send(res);
    }
  },
  zoomOutImage: async (req, res) => {
    const { resource_id } = req.body;

    try {
      if (!resource_id) {
        throw new BadRequestError("Resource ID is required").send(res);
      }

      const zoomOutRes = await imageApi(`/zoom/out/`, {
        method: "post",
        data: {
          resource_id: resource_id,
        },
      });

      res.status(200).json({
        job_id: zoomOutRes.data.job_id,
      });
    } catch (error) {
      throw new ServiceUnavailableError(error.message).send(res);
    }
  },
};
