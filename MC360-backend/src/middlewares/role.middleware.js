/**
 * role.middleware.js
 * Role-based access control — use AFTER protect middleware
 *
 * Usage:
 *   router.get("/admin-only", protect, authorize("hospital"), handler)
 *   router.get("/doctor-or-hospital", protect, authorize("doctor", "hospital"), handler)
 */

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}.`,
      });
    }

    next();
  };
};

/**
 * selfOrAdmin
 * Allows access if the user is accessing their OWN resource OR is a hospital admin
 * Usage: router.get("/:id", protect, selfOrAdmin, handler)
 */
const selfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated." });
  }

  const isOwner = req.user._id.toString() === req.params.id;
  const isAdmin = req.user.role === "hospital";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own resources.",
    });
  }

  next();
};

/**
 * doctorOrHospital
 * Shorthand for routes accessible by both doctor and hospital roles
 */
const doctorOrHospital = authorize("doctor", "hospital");

/**
 * patientOnly
 */
const patientOnly = authorize("patient");

/**
 * doctorOnly
 */
const doctorOnly = authorize("doctor");

/**
 * hospitalOnly
 */
const hospitalOnly = authorize("hospital");

module.exports = {
  authorize,
  selfOrAdmin,
  doctorOrHospital,
  patientOnly,
  doctorOnly,
  hospitalOnly,
};