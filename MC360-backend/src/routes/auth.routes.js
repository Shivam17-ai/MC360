const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authLimiter } = require("../middlewares/rateLimiter.middleware");
const { uploadImage } = require("../middlewares/upload.middleware");

// Public
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/firebase-login", authLimiter, authController.firebaseLogin);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Protected
router.use(protect);
router.get("/me", authController.getMe);
router.put("/me", uploadImage.single("avatar"), authController.updateProfile);
router.put("/change-password", authController.changePassword);
router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/logout", authController.logout);

module.exports = router;