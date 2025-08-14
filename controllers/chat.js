const { response } = require("express");
const { chatApi } = require("../utils/api");
const { BadRequestError, NotFoundError } = require("../utils/ErrorHandling");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
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

      res.status(200).json({
        is_final: true,
        conversation_id: conversationId.toString(),
        response: promptRes.data.split("<EOF>")[0],
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
      res.status(200).json({
        is_final: true,
        conversation_id: id,
        response: conversationRes.data.split("<EOF>")[0],
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

      await delay(2000);

      const promptRes = await chatApi(`/${id}`, {
        method: "get",
      });

      res.status(200).json({
        is_final: true,
        conversation_id: id,
        response: promptRes.data.split("<EOF>")[0],
      });
    } catch (error) {
      throw new NotFoundError(error.message).send(res);
    }
  },
};
