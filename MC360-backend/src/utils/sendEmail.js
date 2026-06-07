import nodemailer from 'nodemailer'
import logger from './logger.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
})

/**
 * Send a generic email
 */
export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"MC360 Health" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  }

  const info = await transporter.sendMail(mailOptions)
  logger.info(`Email sent to ${to} — ${info.messageId}`)
  return info
}

/**
 * Send OTP email
 */
export const sendOTPEmail = async (to, otp) => {
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0;">
      <h2 style="color: #0e8af5;">MC360 — OTP Verification</h2>
      <p style="color: #64748b;">Use the OTP below to verify your account. It expires in <strong>10 minutes</strong>.</p>
      <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
        <h1 style="letter-spacing: 12px; color: #0e8af5; margin: 0;">${otp}</h1>
      </div>
      <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, please ignore this email.</p>
    </div>
  `
  return sendEmail({ to, subject: 'MC360 — Your OTP Code', html })
}

/**
 * Send appointment confirmation email
 */
export const sendAppointmentEmail = async (to, appointment) => {
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0;">
      <h2 style="color: #0e8af5;">Appointment Confirmed ✅</h2>
      <p style="color: #64748b;">Your appointment has been successfully booked.</p>
      <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
        <p><strong>Date:</strong> ${appointment.date}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <p><strong>Type:</strong> ${appointment.type}</p>
      </div>
      <p style="color: #94a3b8; font-size: 12px;">Please arrive 10 minutes early for in-person visits.</p>
    </div>
  `
  return sendEmail({ to, subject: 'MC360 — Appointment Confirmed', html })
}

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (to, resetURL) => {
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0;">
      <h2 style="color: #0e8af5;">Reset Your Password</h2>
      <p style="color: #64748b;">Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
      <a href="${resetURL}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #0e8af5; color: white; border-radius: 10px; text-decoration: none; font-weight: 600;">
        Reset Password
      </a>
      <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, please ignore this email.</p>
    </div>
  `
  return sendEmail({ to, subject: 'MC360 — Password Reset Request', html })
}