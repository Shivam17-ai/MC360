/**
 * error.middleware.js
 * Global error handler — must be registered LAST in app.js
 * Returns consistent JSON error responses to the frontend
 */

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message   || "Internal Server Error";

  // ── Mongoose: CastError (invalid ObjectId) ────────────────
  if (err.name === "CastError") {
    statusCode = 400;
    message    = `Invalid ${err.path}: ${err.value}`;
  }

  // ── Mongoose: Duplicate key ───────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // ── Mongoose: Validation error ────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // ── JWT errors ────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message    = "Invalid token.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message    = "Token expired. Please login again.";
  }

  // ── Multer errors ─────────────────────────────────────────
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    message    = "File too large. Maximum allowed size exceeded.";
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message    = "Unexpected file field.";
  }

  // ── Log to console (not in test env) ─────────────────────
  if (process.env.NODE_ENV !== "test") {
    console.error(
      `\x1b[31m[ERROR]\x1b[0m ${statusCode} — ${message}`,
      process.env.NODE_ENV === "development" ? err.stack : ""
    );
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * 404 handler — attach BEFORE errorMiddleware
 * Catches any unmatched route
 */
const notFoundMiddleware = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorMiddleware, notFoundMiddleware };