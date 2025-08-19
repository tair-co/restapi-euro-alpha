const { response } = require("express");
const { chatApi } = require("../utils/api");
const { BadRequestError, NotFoundError } = require("../utils/ErrorHandling");
const ServiceUsage = require("../models/ServiceUsage");
const Chat = require("../models/Chat");

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
      // make delay for wait req
      await delay(2000);

      const promptRes = await chatApi(`/${conversationId}`, {
        method: "get",
      });

      let responseData = "";
      let is_final = false;

      if (promptRes.data.includes("<EOF>")) {
        responseData = promptRes.data.split("<EOF>");
        is_final = true;
        await ServiceUsage.create({
          duration_in_ms: Number(
            responseData[1].replace("ms", "").replace("Took ", "")
          ),
          api_token_id: Number(req.token_id),
          service_id: 1,
          usage_started_at: new Date(),
        });
      } else {
        responseData = [promptRes.data];
        console.log(promptRes.data);
        const service_usage = await ServiceUsage.create({
          duration_in_ms: 0,
          api_token_id: Number(req.token_id),
          service_id: 1,
          usage_started_at: new Date(),
        });

        await Chat.create({
          conversation_id: conversationId.toString(),
          user_id: Number(req.user_id),
          prompt: prompt,
          response: promptRes.data,
          is_final: is_final,
          service_usage_id: service_usage.id,
          workspace_id: Number(req.workspace_id),
          status: "unfinished",
        });
      }

      // save service usage

      res.status(200).json({
        is_final,
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
      const conversationRes = await chatApi(`/${id}`, {
        method: "get",
      });
      if (!conversationRes.data) {
        throw new NotFoundError("Conversation not found").send(res);
      }
      if (!conversationRes.data.includes("<EOF>")) {
        // If the response does not include <EOF>, it means the conversation is still ongoing
        return res.status(200).json({
          is_final: false,
          conversation_id: id,
          response: conversationRes.data,
        });
      }
      if (conversationRes.data.includes("<EOF>")) {
        const chat = await Chat.findOne({
          where: { conversation_id: id },
        });

        if (!chat) {
          throw new NotFoundError("Chat not found").send(res);
        }
        await ServiceUsage.update(
          {
            duration_in_ms: Number(
              conversationRes.data
                .split("<EOF>")[1]
                .replace("ms", "")
                .replace("Took ", "")
            ),
          },
          { where: { id: chat.service_usage_id } }
        );
        chat.update({
          response: conversationRes.data.split("<EOF>")[0],
          is_final: true,
          status: "finished",
        });
      }
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
      // make request to chat API
      // make delay for wait req
      await delay(2000);

      const promptRes = await chatApi(`/${id}`, {
        method: "get",
      });
      let responseData = "";
      let is_final = false;
      if (promptRes.data.includes("<EOF>")) {
        is_final = true;
        responseData = promptRes.data.split("<EOF>");
        const chat = await Chat.findOne({ where: { conversation_id: id } });

        await ServiceUsage.update({
          duration_in_ms: Number(
            responseData[1].replace("ms", "").replace("Took ", "")
          ),
          where: {
            id: chat.service_usage_id,
          },
        });
        chat.update({
          response: responseData[0],
          is_final: true,
          status: "finished",
        });
      } else {
        responseData = [promptRes.data];
      }

      res.status(200).json({
        is_final: is_final,
        conversation_id: id,
        response: responseData[0],
      });
    } catch (error) {
      throw new NotFoundError(error.message).send(res);
    }
  },
};
