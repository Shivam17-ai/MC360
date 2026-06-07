import express from "express";
import {
  register,
  firebaseLogin,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────
router.post("/register",        authLimiter, register);
router.post("/firebase-login",  authLimiter, firebaseLogin);
router.post("/refresh-token",   authLimiter, refreshToken);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password",  authLimiter, resetPassword);

// ── Protected routes ──────────────────────────────────────────────────────
router.get("/me",     protect, getMe);
router.post("/logout",protect, logout);

export default router;