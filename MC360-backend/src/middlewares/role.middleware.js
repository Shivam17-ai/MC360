const { errorResponse } = require("../utils/response");

/**
 * Restrict access to specific roles
 * Usage: authorize("admin", "doctor")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Not authenticated.", 401);
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`,
        403
      );
    }
    next();
  };
};

module.exports = { authorize };