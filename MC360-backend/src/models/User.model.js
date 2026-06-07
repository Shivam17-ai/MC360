import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: true,
    trim:     true,
  },
  email: {
    type:      String,
    required:  true,
    unique:    true,
    lowercase: true,
    trim:      true,
  },
  phone: {
    type:  String,
    trim:  true,
  },
  password: {
    type:   String,
    select: false,
  },
  role: {
    type:    String,
    enum:    ['patient', 'doctor', 'hospital', 'admin'],
    default: 'patient',
  },
  avatar:     { type: String, default: '' },
  googleId:   { type: String },
  isVerified: { type: Boolean, default: false },
  isActive:   { type: Boolean, default: true },

  // Auth
  refreshToken:         { type: String, select: false },
  otp:                  { type: String, select: false },
  otpExpiresAt:         { type: Date,   select: false },
  passwordResetToken:   { type: String, select: false },
  passwordResetExpires: { type: Date,   select: false },
  lastLogin:            { type: Date },
}, { timestamps: true })

export default mongoose.model('User', userSchema)