const User = require("../models/User.model");
const Patient = require("../models/Patient.model");
const Doctor = require("../models/Doctor.model");
const Hospital = require("../models/Hospital.model");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/generateToken");
const { generateOTP, generateResetToken, hashData } = require("../utils/encryption");
const { sendWelcomeEmail, sendOTPEmail, sendPasswordResetEmail } = require("../utils/sendEmail");
const { getFirebaseAuth } = require("../config/firebase");
const logger = require("../utils/logger");
// Helper function to create default availability (Mon-Fri, 9AM-5PM with 30min slots)
const createDefaultAvailability = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return days.map(day => ({
    day,
    isAvailable: true,
    slots: generateSlots("09:00", "17:00", 30) // 30-min slots from 9AM to 5PM
  }));
};

const generateSlots = (startTime, endTime, durationMins) => {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let current = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;
  
  while (current < end) {
    const currentHour = Math.floor(current / 60);
    const currentMin = current % 60;
    const nextMinutes = current + durationMins;
    const nextHour = Math.floor(nextMinutes / 60);
    const nextMin = nextMinutes % 60;
    
    slots.push({
      startTime: `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`,
      endTime: `${String(nextHour).padStart(2, '0')}:${String(nextMin).padStart(2, '0')}`
    });
    
    current = nextMinutes;
  }
  return slots;
};
const registerUser = async ({ name, email, password, phone, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw Object.assign(new Error("Email already registered."), { statusCode: 409 });

  const user = await User.create({ name, email, password, phone, role });

  // Create role-specific profile
  if (role === "patient") {
    await Patient.create({ user: user._id });
  } else if (role === "doctor") {
    await Doctor.create({ 
      user: user._id, 
      specialization: "General",
      availability: createDefaultAvailability()
    });
  } else if (role === "hospital") {
    await Hospital.create({ user: user._id, name });
  }

  sendWelcomeEmail(user).catch((err) => {
    logger.warn(`Welcome email failed: ${err.message}`);
  });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) throw Object.assign(new Error("Invalid credentials."), { statusCode: 401 });
  if (!user.password) throw Object.assign(new Error("Please sign in with Google/Firebase."), { statusCode: 400 });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw Object.assign(new Error("Invalid credentials."), { statusCode: 401 });
  if (!user.isActive) throw Object.assign(new Error("Account deactivated."), { statusCode: 403 });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

const loginWithFirebase = async (firebaseToken, role = 'patient', fromRegister = false) => {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) throw Object.assign(new Error("Firebase not configured."), { statusCode: 500 });

  const decoded = await firebaseAuth.verifyIdToken(firebaseToken);
  let user = await User.findOne({ $or: [{ firebaseUid: decoded.uid }, { email: decoded.email }] });

  const validRoles = ['patient', 'doctor', 'hospital'];
  const userRole = validRoles.includes(role) ? role : 'patient';

  if (!user) {
    // ── New user: create account + role-specific profile ──────────────────
    user = await User.create({
      name: decoded.name || decoded.email.split("@")[0],
      email: decoded.email,
      firebaseUid: decoded.uid,
      avatar: decoded.picture || "",
      isVerified: true,
      role: userRole,
    });

    if (userRole === 'patient') {
      await Patient.create({ user: user._id });
    } else if (userRole === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization: 'General',
        availability: createDefaultAvailability(),
      });
    } else if (userRole === 'hospital') {
      await Hospital.create({ user: user._id, name: decoded.name || 'My Hospital' });
    }

    try { await sendWelcomeEmail(user); } catch {}

  } else {
    // ── Existing user ─────────────────────────────────────────────────────
    let dirty = false;

    // Always link firebaseUid if missing
    if (!user.firebaseUid) {
      user.firebaseUid = decoded.uid;
      dirty = true;
    }

    // When called from the Register page, honour the selected role.
    // This lets a user who accidentally signed up as patient re-register as doctor/hospital.
    if (fromRegister && userRole !== user.role) {
      const prevRole = user.role;
      user.role = userRole;
      dirty = true;

      // Create the new role-specific profile if it doesn't already exist
      if (userRole === 'patient') {
        const exists = await Patient.findOne({ user: user._id });
        if (!exists) await Patient.create({ user: user._id });
      } else if (userRole === 'doctor') {
        const exists = await Doctor.findOne({ user: user._id });
        if (!exists) await Doctor.create({
          user: user._id,
          specialization: 'General',
          availability: createDefaultAvailability(),
        });
      } else if (userRole === 'hospital') {
        const exists = await Hospital.findOne({ user: user._id });
        if (!exists) await Hospital.create({ user: user._id, name: decoded.name || 'My Hospital' });
      }

      logger.info(`Firebase login: updated user ${user.email} role from ${prevRole} → ${userRole}`);
    }

    if (dirty) await user.save({ validateBeforeSave: false });
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

const refreshAccessToken = async (token) => {
  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    throw Object.assign(new Error("Invalid refresh token."), { statusCode: 401 });
  }
  const accessToken = generateAccessToken(user._id, user.role);
  return { accessToken };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error("No account with that email."), { statusCode: 404 });

  const { raw, hashed } = generateResetToken();
  user.passwordResetToken = hashed;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${raw}`;
  await sendPasswordResetEmail(user, resetUrl);
};

const resetPassword = async (rawToken, newPassword) => {
  const hashed = hashData(rawToken);
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw Object.assign(new Error("Token invalid or expired."), { statusCode: 400 });

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};

const sendOTP = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error("User not found."), { statusCode: 404 });

  const otp = generateOTP(6);
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  await sendOTPEmail(user, otp);
};

const verifyOTP = async (userId, otp) => {
  const user = await User.findById(userId);
  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    throw Object.assign(new Error("Invalid or expired OTP."), { statusCode: 400 });
  }
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });
};

const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

module.exports = {
  registerUser,
  loginUser,
  loginWithFirebase,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
  logoutUser,
};