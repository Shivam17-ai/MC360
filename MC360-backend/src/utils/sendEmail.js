const nodemailer = require("nodemailer");
const env = require("../config/env");
const logger = require("./logger");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!env.SMTP_USER || !env.SMTP_PASS) {
    logger.warn("SMTP credentials missing — email sending disabled.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    family: 4, // Force IPv4 to prevent IPv6 ENETUNREACH failures in hosting environments (like Render)
    connectionTimeout: 5000, // 5 seconds connection timeout
    greetingTimeout: 5000,
  });

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const t = getTransporter();
  if (!t) {
    logger.warn(`Email not sent (no transporter). To: ${to}, Subject: ${subject}`);
    return;
  }

  try {
    const info = await t.sendMail({
      from: env.EMAIL_FROM || env.SMTP_USER,
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    logger.error(`Email send error: ${err.message}`);
    throw err;
  }
};

// ── Pre-built templates ──────────────────────────────────────────────────────

const sendWelcomeEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: "Welcome to MC360!",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">Welcome to MC360, ${user.name}!</h2>
        <p>Your account has been created successfully.</p>
        <p>You can now log in and start managing your health with MC360.</p>
        <hr/>
        <small style="color:#6b7280">MC360 — Your 360° Health Companion</small>
      </div>
    `,
  });

const sendOTPEmail = (user, otp) =>
  sendEmail({
    to: user.email,
    subject: "MC360 — Your OTP",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">Your One-Time Password</h2>
        <p>Hi ${user.name},</p>
        <p>Your OTP is: <strong style="font-size:24px;letter-spacing:4px">${otp}</strong></p>
        <p>It expires in 10 minutes.</p>
        <small style="color:#6b7280">If you didn't request this, ignore this email.</small>
      </div>
    `,
  });

const sendAppointmentConfirmation = (user, appointment) =>
  sendEmail({
    to: user.email,
    subject: "Appointment Confirmed — MC360",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">Appointment Confirmed</h2>
        <p>Hi ${user.name}, your appointment has been confirmed.</p>
        <ul>
          <li><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${appointment.timeSlot}</li>
          <li><strong>Type:</strong> ${appointment.type}</li>
        </ul>
        <small style="color:#6b7280">MC360 — Your 360° Health Companion</small>
      </div>
    `,
  });

const sendPasswordResetEmail = (user, resetUrl) =>
  sendEmail({
    to: user.email,
    subject: "MC360 — Reset Your Password",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">Password Reset Request</h2>
        <p>Hi ${user.name},</p>
        <p>Click the button below to reset your password (valid for 15 minutes):</p>
        <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:12px 0">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOTPEmail,
  sendAppointmentConfirmation,
  sendPasswordResetEmail,
};