const { imageApi } = require("../utils/api");
const {
  BadRequestError,
  ServiceUnavailableError,
  NotFoundError,
} = require("../utils/ErrorHandling");
const path = require("path");
const { saveImageFromUrl } = require("../utils/saveImageUrl");
const ServiceUsage = require("../models/ServiceUsage");
const ImageGeneration = require("../models/ImageGen");

// second Ai functionality

module.exports = {
  // Image controllers
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
      const serviceUsage = await ServiceUsage.create({
        duration_in_ms: 0,
        api_token_id: req.token_id,
        service_id: 2,
        usage_started_at: imageRes.data.started_at,
      });

      await ImageGeneration.create({
        job_id: imageRes.data.job_id,
        service_usage_id: serviceUsage.id,
      });

      res.status(200).json({
        job_id: imageRes.data.job_id,
        status: "pending",
      });
    } catch (error) {
      next(new ServiceUnavailableError(error.message));
    }
  },
  // Get image status
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
  // Get finished image
  getFinishedImage: async (req, res, next) => {
    const { id } = req.params;
    try {
      const imageRes = await imageApi(`/result/${id}`);
      const saveFolder = path.join(__dirname, "../images");
      const fileName = `${id}.png`;

      await saveImageFromUrl(imageRes.data.image_url, saveFolder, fileName);

      const image_generations = await ImageGeneration.findOne({
        where: {
          job_id: id,
        },
      });

      const serviceUsage = await ServiceUsage.findOne({
        where: {
          id: image_generations.service_usage_id,
        },
      });

      serviceUsage.update({
        duration_in_ms: Math.round(
          (new Date(imageRes.data.finished_at) -
            new Date(serviceUsage.usage_started_at)) /
            1000
        ),
      });
      await serviceUsage.save();

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
