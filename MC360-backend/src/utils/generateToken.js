import jwt from 'jsonwebtoken'
import crypto from 'crypto'

/**
 * Generate JWT access token
 * @param {object} payload - { id, role, email }
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

/**
 * Generate JWT refresh token
 * @param {object} payload - { id }
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  })
}

/**
 * Verify JWT token
 * @param {string} token
 * @param {string} secret
 */
export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret)
}

/**
 * Generate a random secure token (for password reset, email verify, etc.)
 * @param {number} length - byte length (default 32)
 */
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Generate OTP (6-digit)
 */
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString()
}

/**
 * Hash a token (to store in DB without exposing raw value)
 * @param {string} token
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}