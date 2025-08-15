const axios = require("axios");

//reqs for Api

const chatApi = axios.create({
  baseURL: "http://localhost:9001/conversation",
});
const imageApi = axios.create({
  baseURL: "http://localhost:9002",
});
const recognizeApi = axios.create({
  baseURL: "http://localhost:9003",
});

module.exports = {
  chatApi,
  imageApi,
  recognizeApi,
};
