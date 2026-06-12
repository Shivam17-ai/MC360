const crypto = require("crypto");
const env = require("../config/env");

const ALGORITHM = "aes-256-cbc";
const KEY = Buffer.from(env.ENCRYPTION_KEY.substring(0, 32).padEnd(32, "0"));
const IV_LENGTH = 16;

const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(String(text), "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

const decrypt = (encryptedText) => {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const hashData = (data) => {
  return crypto.createHash("sha256").update(String(data)).digest("hex");
};

const generateOTP = (length = 6) => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  ).toString();
};

const generateResetToken = () => {
  const raw = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hashed };
};

module.exports = { encrypt, decrypt, hashData, generateOTP, generateResetToken };