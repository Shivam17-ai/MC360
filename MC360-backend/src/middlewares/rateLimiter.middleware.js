const rateLimit = require("express-rate-limit");

const createLimiter = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
  });

const globalLimiter = createLimiter(15, 200, "Too many requests. Please slow down.");

const authLimiter = createLimiter(15, 10, "Too many auth attempts. Try again in 15 minutes.");

const aiLimiter = createLimiter(60, 30, "AI request limit reached. Please wait an hour.");

const uploadLimiter = createLimiter(60, 20, "Upload limit reached. Please wait an hour.");

module.exports = { globalLimiter, authLimiter, aiLimiter, uploadLimiter };