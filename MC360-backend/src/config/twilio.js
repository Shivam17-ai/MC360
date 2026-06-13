const twilio = require("twilio");
const env = require("./env");
const logger = require("../utils/logger");

let client = null;

const initTwilio = () => {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) {
    logger.warn("Twilio credentials missing — SMS/WhatsApp disabled.");
    return null;
  }

  try {
    client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    logger.info("Twilio initialized.");
    return client;
  } catch (err) {
    logger.error(`Twilio init error: ${err.message}`);
    return null;
  }
};

const getTwilioClient = () => client;

module.exports = { initTwilio, getTwilioClient };