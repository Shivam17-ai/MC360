import bcrypt from 'bcryptjs'
import User from '../models/User.model.js'
import Patient from '../models/Patient.model.js'
import Doctor from '../models/Doctor.model.js'
import Hospital from '../models/Hospital.model.js'
import { generateAccessToken, generateRefreshToken, generateOTP, generateSecureToken, hashToken } from '../utils/generateToken.js'
import { sendOTPEmail, sendPasswordResetEmail } from '../utils/sendEmail.js'
import { sendSuccess, sendError, sendCreated, sendBadRequest, sendUnauthorized, sendNotFound } from '../utils/response.js'
import logger from '../utils/logger.js'

// ── Register ──────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body

    const existing = await User.findOne({ $or: [{ email }, { phone }] })
    if (existing) return sendBadRequest(res, 'Email or phone already registered')

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name, email, phone, role,
      password: hashedPassword,
    })

    // Create role-specific profile
    if (role === 'patient')  await Patient.create({ user: user._id })
    if (role === 'doctor')   await Doctor.create({ user: user._id })
    if (role === 'hospital') await Hospital.create({ user: user._id })

    const accessToken  = generateAccessToken({ id: user._id, role: user.role, email: user.email })
    const refreshToken = generateRefreshToken({ id: user._id })

    user.refreshToken = refreshToken
    await user.save()

    logger.info(`New user registered: ${email} (${role})`)

    return sendCreated(res, {
      user: { id: user._id, name, email, role },
      accessToken,
      refreshToken,
    }, 'Registration successful')

  } catch (err) {
    logger.error('Register error:', err)
    return sendError(res, err.message)
  }
}

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) return sendUnauthorized(res, 'Invalid email or password')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return sendUnauthorized(res, 'Invalid email or password')

    if (!user.isActive) return sendUnauthorized(res, 'Account is deactivated')

    const accessToken  = generateAccessToken({ id: user._id, role: user.role, email: user.email })
    const refreshToken = generateRefreshToken({ id: user._id })

    user.refreshToken = refreshToken
    user.lastLogin    = new Date()
    await user.save()

    logger.info(`User logged in: ${email}`)

    return sendSuccess(res, {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    }, 'Login successful')

  } catch (err) {
    logger.error('Login error:', err)
    return sendError(res, err.message)
  }
}

// ── Google OAuth Login ────────────────────────────────────────────────────────
export const googleLogin = async (req, res) => {
  try {
    const { firebaseToken, role } = req.body
    const admin  = (await import('../config/firebase.js')).default
    const decoded = await admin.auth().verifyIdToken(firebaseToken)

    let user = await User.findOne({ email: decoded.email })

    if (!user) {
      user = await User.create({
        name:       decoded.name,
        email:      decoded.email,
        phone:      '',
        role:       role || 'patient',
        password:   await bcrypt.hash(decoded.uid, 12),
        isVerified: true,
        googleId:   decoded.uid,
      })
      if (user.role === 'patient') await Patient.create({ user: user._id })
    }

    const accessToken  = generateAccessToken({ id: user._id, role: user.role, email: user.email })
    const refreshToken = generateRefreshToken({ id: user._id })

    user.refreshToken = refreshToken
    await user.save()

    return sendSuccess(res, {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    }, 'Google login successful')

  } catch (err) {
    logger.error('Google login error:', err)
    return sendError(res, err.message)
  }
}

// ── Refresh Token ─────────────────────────────────────────────────────────────
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return sendBadRequest(res, 'Refresh token required')

    const user = await User.findOne({ refreshToken })
    if (!user) return sendUnauthorized(res, 'Invalid refresh token')

    const newAccessToken = generateAccessToken({ id: user._id, role: user.role, email: user.email })

    return sendSuccess(res, { accessToken: newAccessToken }, 'Token refreshed')

  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null })
    return sendSuccess(res, null, 'Logged out successfully')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Send OTP ──────────────────────────────────────────────────────────────────
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return sendNotFound(res, 'User not found')

    const otp       = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    user.otp          = otp
    user.otpExpiresAt = expiresAt
    await user.save()

    await sendOTPEmail(email, otp)

    return sendSuccess(res, null, 'OTP sent to email')

  } catch (err) {
    logger.error('Send OTP error:', err)
    return sendError(res, err.message)
  }
}

// ── Verify OTP ────────────────────────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email })

    if (!user || user.otp !== otp) return sendBadRequest(res, 'Invalid OTP')
    if (user.otpExpiresAt < new Date()) return sendBadRequest(res, 'OTP expired')

    user.isVerified  = true
    user.otp         = undefined
    user.otpExpiresAt = undefined
    await user.save()

    return sendSuccess(res, null, 'Email verified successfully')

  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Forgot Password ───────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return sendNotFound(res, 'User not found')

    const resetToken   = generateSecureToken()
    const hashedToken  = hashToken(resetToken)

    user.passwordResetToken   = hashedToken
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000) // 15 mins
    await user.save()

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    await sendPasswordResetEmail(email, resetURL)

    return sendSuccess(res, null, 'Password reset link sent to email')

  } catch (err) {
    logger.error('Forgot password error:', err)
    return sendError(res, err.message)
  }
}

// ── Reset Password ────────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body
    const hashedToken = hashToken(token)

    const user = await User.findOne({
      passwordResetToken:   hashedToken,
      passwordResetExpires: { $gt: new Date() },
    })

    if (!user) return sendBadRequest(res, 'Invalid or expired reset token')

    user.password             = await bcrypt.hash(newPassword, 12)
    user.passwordResetToken   = undefined
    user.passwordResetExpires = undefined
    await user.save()

    return sendSuccess(res, null, 'Password reset successful')

  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Me ────────────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken -otp')
    return sendSuccess(res, user)
  } catch (err) {
    return sendError(res, err.message)
  }
}