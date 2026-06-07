/**
 * auth.middleware.js
 * Verifies JWT token and attaches req.user
 * Works with Zustand authStore which sends: Authorization: Bearer <token>
 */

const jwt  = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated. Contact admin.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }
    return res.status(500).json({ success: false, message: "Authentication error." });
  }
};

/**
 * Optional auth — attaches user if token present, but doesn't block
 * Useful for public routes that show extra info when logged in
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token   = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user    = await User.findById(decoded.id).select("-password");
      if (user) req.user = user;
    }
  } catch (_) {
    // silently ignore — optional auth
  }
  next();
};

module.exports = { protect, optionalAuth };