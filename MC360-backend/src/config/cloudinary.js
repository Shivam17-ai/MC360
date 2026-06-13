const cloudinary = require("cloudinary").v2;
const env = require("./env");
const logger = require("../utils/logger");

const initCloudinary = () => {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    logger.warn("Cloudinary credentials missing — file uploads disabled.");
    return;
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  logger.info("Cloudinary configured.");
};

module.exports = { initCloudinary, cloudinary };