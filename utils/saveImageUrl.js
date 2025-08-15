const axios = require("axios");
const fs = require("fs");
const path = require("path");

// image generation save func
async function saveImageFromUrl(imageUrl, saveFolder, fileName) {
  const response = await axios.get(imageUrl, { responseType: "stream" });
  const filePath = path.join(saveFolder, fileName);
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(fileName));
    writer.on("error", reject);
  });
}

module.exports = {
  saveImageFromUrl,
};
