import dotenv from "dotenv";
dotenv.config();

const env = {
  // ── Server ───────────────────────────────────────────────────────────
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_DEV: process.env.NODE_ENV !== "production",
  IS_PROD: process.env.NODE_ENV === "production",

  // ── MongoDB ──────────────────────────────────────────────────────────
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/mc360",

  // ── JWT ──────────────────────────────────────────────────────────────
  JWT_SECRET: process.env.JWT_SECRET || "mc360_dev_secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "mc360_dev_refresh_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // ── Firebase ─────────────────────────────────────────────────────────
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || "",

  // ── Cloudinary ───────────────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  // ── Twilio WhatsApp ──────────────────────────────────────────────────
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886",

  // ── Gemini AI ────────────────────────────────────────────────────────
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",

  // ── ML Flask Service ─────────────────────────────────────────────────
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || "http://localhost:5001",

  // ── Frontend ─────────────────────────────────────────────────────────
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  // ── WebRTC ───────────────────────────────────────────────────────────
  STUN_SERVER: process.env.STUN_SERVER || "stun:stun.l.google.com:19302",
};

// ── Validation in production ──────────────────────────────────────────────
if (env.IS_PROD) {
  const required = [
    "MONGODB_URI",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_CLIENT_EMAIL",
  ];
  required.forEach((key) => {
    if (!env[key]) {
      console.warn(`[MC360] ⚠️  Missing env variable: ${key}`);
    }
  });
}

export default env;