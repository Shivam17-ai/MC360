const authService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const result = await authService.registerUser({ name, email, password, phone, role });
    return successResponse(res, result, "Registration successful", 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return successResponse(res, result, "Login successful");
  } catch (err) {
    next(err);
  }
};

const firebaseLogin = async (req, res, next) => {
  try {
    const { firebaseToken } = req.body;
    if (!firebaseToken) return errorResponse(res, "Firebase token required.", 400);
    const result = await authService.loginWithFirebase(firebaseToken);
    return successResponse(res, result, "Login successful");
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return errorResponse(res, "Refresh token required.", 400);
    const result = await authService.refreshAccessToken(refreshToken);
    return successResponse(res, result, "Token refreshed");
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);
    return successResponse(res, {}, "Logged out successfully");
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    return successResponse(res, {}, "Password reset email sent.");
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    return successResponse(res, {}, "Password reset successful.");
  } catch (err) {
    next(err);
  }
};

const sendOTP = async (req, res, next) => {
  try {
    await authService.sendOTP(req.user._id);
    return successResponse(res, {}, "OTP sent to your email.");
  } catch (err) {
    next(err);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    await authService.verifyOTP(req.user._id, req.body.otp);
    return successResponse(res, {}, "Email verified successfully.");
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  return successResponse(res, { user: req.user }, "User profile fetched.");
};

const updateProfile = async (req, res, next) => {
  try {
    const User = require("../models/User.model");
    const allowed = ["name", "phone", "notificationPreferences", "fcmToken"];
    const updates = {};
    allowed.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

    if (req.file) {
      const { uploadToCloudinary } = require("../middlewares/upload.middleware");
      const result = await uploadToCloudinary(req.file.buffer, "mc360/avatars", "image");
      updates.avatar = result.secure_url;
      updates.avatarPublicId = result.public_id;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    return successResponse(res, { user }, "Profile updated.");
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const User = require("../models/User.model");
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return errorResponse(res, "Current password is incorrect.", 400);
    user.password = newPassword;
    await user.save();
    return successResponse(res, {}, "Password changed successfully.");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register, login, firebaseLogin, refreshToken, logout,
  forgotPassword, resetPassword, sendOTP, verifyOTP,
  getMe, updateProfile, changePassword,
};