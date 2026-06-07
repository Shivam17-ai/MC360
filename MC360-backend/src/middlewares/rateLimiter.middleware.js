/**
 * rateLimiter.middleware.js
 * Prevents brute-force and API abuse using express-rate-limit
 * Install: npm install express-rate-limit
 */

const rateLimit = require("express-rate-limit");

// ── General API limiter (all routes) ─────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 200,                    // max 200 requests per window per IP
  standardHeaders: true,
  legacyHeaders:  false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

// ── Auth routes limiter (login / register) ────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,                     // max 10 login attempts per window
  standardHeaders: true,
  legacyHeaders:  false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

// ── AI / ML routes limiter ────────────────────────────────────
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 30,                     // max 30 AI requests per hour
  standardHeaders: true,
  legacyHeaders:  false,
  message: {
    success: false,
    message: "AI request limit reached. Please try again after an hour.",
  },
});

// ── File upload limiter ───────────────────────────────────────
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 20,                     // max 20 uploads per hour
  standardHeaders: true,
  legacyHeaders:  false,
  message: {
    success: false,
    message: "Upload limit reached. Please try again after an hour.",
  },
});

module.exports = { apiLimiter, authLimiter, aiLimiter, uploadLimiter };