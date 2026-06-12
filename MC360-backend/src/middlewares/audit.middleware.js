const AuditLog = require("../models/AuditLog.model");
const logger = require("../utils/logger");

const auditMiddleware = (action, resource) => async (req, res, next) => {
  const startTime = Date.now();
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    const duration = Date.now() - startTime;
    AuditLog.create({
      user: req.user?._id,
      action,
      resource,
      resourceId: req.params?.id,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      statusCode: res.statusCode,
      duration,
    }).catch((err) => logger.error(`Audit log error: ${err.message}`));

    return originalJson(body);
  };

  next();
};

module.exports = { auditMiddleware };