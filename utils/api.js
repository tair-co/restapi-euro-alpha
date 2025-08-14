const axios = require("axios");

const chatApi = axios.create({
  baseURL: "http://localhost:9001/conversation",
});
const imageApi = axios.create({
  baseURL: "http://localhost:9002",
});
module.exports = {
  chatApi,
  imageApi,
};
