import User from "../models/User.model.js";
import Patient from "../models/Patient.model.js";
import Doctor from "../models/Doctor.model.js";
import Hospital from "../models/Hospital.model.js";
import { verifyFirebaseToken } from "../config/firebase.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import env from "../config/env.js";
import jwt from "jsonwebtoken";

/**
 * Register new user after Firebase auth
 */
export const registerUser = async ({ uid, name, email, phone, role }) => {
  // Check if already exists
  const existing = await User.findOne({ $or: [{ uid }, { email }] });
  if (existing) throw new Error("User already exists");

  // Create base user
  const user = await User.create({ uid, email, role, isVerified: true });

  // Create role-specific profile
  if (role === "patient") {
    await Patient.create({ userId: user._id, name, phone, email });
  } else if (role === "doctor") {
    await Doctor.create({ userId: user._id, name, phone, email });
  } else if (role === "hospital_admin") {
    await Hospital.create({ userId: user._id, name, phone, email });
  }

  const accessToken  = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, token: accessToken, refreshToken };
};

/**
 * Firebase social login / Google login
 */
export const firebaseLoginUser = async ({ uid, email, name, role }) => {
  let user = await User.findOne({ uid });

  if (!user) {
    // Auto-register on first Google login
    user = await User.create({
      uid,
      email,
      role: role || "patient",
      isVerified: true,
    });

    const profileRole = user.role;
    if (profileRole === "patient") {
      await Patient.create({ userId: user._id, name: name || email, email });
    } else if (profileRole === "doctor") {
      await Doctor.create({ userId: user._id, name: name || email, email });
    } else if (profileRole === "hospital_admin") {
      await Hospital.create({ userId: user._id, name: name || email, email });
    }
  }

  const accessToken  = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, token: accessToken, refreshToken };
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (token) => {
  if (!token) throw new Error("Refresh token required");

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new Error("User not found");

  const accessToken = generateAccessToken(user);
  return { token: accessToken };
};

/**
 * Get full user profile with role-specific data
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-__v");
  if (!user) throw new Error("User not found");

  let profile = null;
  if (user.role === "patient") {
    profile = await Patient.findOne({ userId }).select("-__v");
  } else if (user.role === "doctor") {
    profile = await Doctor.findOne({ userId }).select("-__v");
  } else if (user.role === "hospital_admin") {
    profile = await Hospital.findOne({ userId }).select("-__v");
  }

  return { user, profile };
};