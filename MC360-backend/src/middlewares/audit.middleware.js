/**
 * audit.middleware.js
 * Logs every API request: method, route, user, IP, response time
 * Attach after auth middleware so req.user is available
 */

const auditMiddleware = (req, res, next) => {
  const start = Date.now();

  // Capture response finish
  res.on("finish", () => {
    const duration = Date.now() - start;
    const userId   = req.user?._id || "guest";
    const role     = req.user?.role || "—";
    const method   = req.method;
    const url      = req.originalUrl;
    const status   = res.statusCode;
    const ip       = req.ip || req.headers["x-forwarded-for"] || "unknown";

    const color =
      status >= 500 ? "\x1b[31m" :   // red
      status >= 400 ? "\x1b[33m" :   // yellow
      status >= 300 ? "\x1b[36m" :   // cyan
                      "\x1b[32m";    // green

    console.log(
      `${color}[AUDIT]\x1b[0m ${method} ${url} | ${status} | ${duration}ms | user:${userId} role:${role} | ip:${ip}`
    );
  });

  next();
};

module.exports = auditMiddleware;