const axios = require("axios");

const chatApi = axios.create({
  baseURL: "http://localhost:9001/conversation",
});

module.exports = {
  chatApi,
};
