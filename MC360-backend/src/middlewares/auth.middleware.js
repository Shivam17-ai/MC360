const { verifyAccessToken } = require("../utils/generateToken");
const { getAdmin } = require("../config/firebase");
const User = require("../models/User.model");
const { errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return errorResponse(res, "Access denied. No token provided.", 401);
    }

    // Try JWT first
    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select("-password -refreshToken");

      if (!user) return errorResponse(res, "User not found.", 401);
      if (!user.isActive) return errorResponse(res, "Account deactivated.", 403);

      req.user = user;
      return next();
    } catch (jwtError) {
      // If JWT fails, try Firebase token
      try {
        const admin = getAdmin();
        if (!admin) throw new Error("Firebase not configured");

        const decoded = await admin.auth().verifyIdToken(token);
        const user = await User.findOne({ firebaseUid: decoded.uid }).select("-password -refreshToken");

        if (!user) return errorResponse(res, "User not found. Please register.", 401);
        if (!user.isActive) return errorResponse(res, "Account deactivated.", 403);

        req.user = user;
        return next();
      } catch (firebaseError) {
        logger.debug(`Auth failed - JWT: ${jwtError.message} | Firebase: ${firebaseError.message}`);
        return errorResponse(res, "Invalid or expired token.", 401);
      }
    }
  } catch (err) {
    logger.error(`Auth middleware error: ${err.message}`);
    return errorResponse(res, "Authentication error.", 500);
  }
};

// Optional auth — doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return next();

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (user) req.user = user;
  } catch {
    // silently continue
  }
  next();
};

module.exports = { protect, optionalAuth };