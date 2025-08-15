const { response } = require("express");
const { chatApi } = require("../utils/api");
const { BadRequestError, NotFoundError } = require("../utils/ErrorHandling");
const ServiceUsage = require("../models/ServiceUsage");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  // Chat controllers
  conversation: async (req, res, next) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        throw new BadRequestError("Prompt is required").send(res);
      }
      const conversationId = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
      await chatApi("", {
        method: "post",
        data: {
          conversationId: conversationId.toString(),
        },
      });
      await chatApi(`/${conversationId}`, {
        method: "post",
        data: prompt,
        headers: { "Content-Type": "text/plain" },
      });

      await delay(2000);

      const promptRes = await chatApi(`/${conversationId}`, {
        method: "get",
      });
      const responseData = promptRes.data.split("<EOF>");

      // save service usage
      await ServiceUsage.create({
        duration_in_ms: Number(
          responseData[1].replace("ms", "").replace("Took ", "")
        ),
        api_token_id: Number(req.token_id),
        service_id: 1,
        usage_started_at: new Date(),
      });

      res.status(200).json({
        is_final: true,
        conversation_id: conversationId.toString(),
        response: responseData[0],
      });
    } catch (error) {
      throw new BadRequestError(error.message).send(res);
    }
  },

  getConversation: async (req, res, next) => {
    const { id } = req.params;
    try {
      console.log("w");
      const conversationRes = await chatApi(`/${id}`, {
        method: "get",
      });
      if (!conversationRes.data) {
        throw new NotFoundError("Conversation not found").send(res);
      }

      const responseData = conversationRes.data.split("<EOF>");
      await ServiceUsage.create({
        duration_in_ms: Number(
          responseData[1].replace("ms", "").replace("Took ", "")
        ),
        api_token_id: Number(req.token_id),
        service_id: 1,
        usage_started_at: new Date(),
      });
      res.status(200).json({
        is_final: true,
        conversation_id: id,
        response: responseData[0],
      });
    } catch (error) {
      throw new NotFoundError(error.message).send(res);
    }
  },
  continueConversation: async (req, res, next) => {
    const { id } = req.params;

    try {
      const { prompt } = req.body;
      if (!prompt) {
        throw new BadRequestError("Prompt is required").send(res);
      }

      await chatApi(`/${id}`, {
        method: "post",
        data: prompt,
        headers: { "Content-Type": "text/plain" },
      });
      // make request to chat API
      // make delay for wait req
      await delay(2000);

      const promptRes = await chatApi(`/${id}`, {
        method: "get",
      });

      const responseData = promptRes.data.split("<EOF>");
      await ServiceUsage.create({
        duration_in_ms: Number(
          responseData[1].replace("ms", "").replace("Took ", "")
        ),
        api_token_id: Number(req.token_id),
        service_id: 1,
        usage_started_at: new Date(),
      });

      res.status(200).json({
        is_final: true,
        conversation_id: id,
        response: responseData[0],
      });
    } catch (error) {
      throw new NotFoundError(error.message).send(res);
    }
  },
};
