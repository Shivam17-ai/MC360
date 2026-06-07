/**
 * auth.validator.js
 * Validation rules for all auth routes
 *
 * Compatible with:
 *   - validate.middleware.js  → validate()
 *   - authService.js          → login, register, forgotPassword, resetPassword
 *   - auth.middleware.js      → protect
 *
 * Usage in routes/auth.routes.js:
 *   const { loginRules, registerRules } = require("../validators/auth.validator");
 *   const { validate } = require("../middlewares/validate.middleware");
 *   router.post("/login",    loginRules,    validate, authController.login);
 *   router.post("/register", registerRules, validate, authController.register);
 */

const { body } = require("express-validator");

// ── Register ──────────────────────────────────────────────────
const registerRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required.")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters."),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required.")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters.")
    .matches(/[0-9]/).withMessage("Password must contain at least one number.")
    .matches(/[a-zA-Z]/).withMessage("Password must contain at least one letter."),

  body("confirmPassword")
    .notEmpty().withMessage("Please confirm your password.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),

  body("role")
    .optional()
    .isIn(["patient", "doctor", "hospital"])
    .withMessage("Role must be patient, doctor, or hospital."),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Please enter a valid phone number."),

  // Doctor-specific
  body("specialization")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Specialization must not exceed 100 characters."),

  body("qualification")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Qualification must not exceed 100 characters."),

  // Hospital-specific
  body("hospitalName")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Hospital name must not exceed 150 characters."),

  body("registrationNumber")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Registration number must not exceed 50 characters."),
];

// ── Login ─────────────────────────────────────────────────────
const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required."),
];

// ── Forgot Password ───────────────────────────────────────────
const forgotPasswordRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please enter a valid email address.")
    .normalizeEmail(),
];

// ── Reset Password ────────────────────────────────────────────
const resetPasswordRules = [
  body("password")
    .notEmpty().withMessage("New password is required.")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters.")
    .matches(/[0-9]/).withMessage("Password must contain at least one number.")
    .matches(/[a-zA-Z]/).withMessage("Password must contain at least one letter."),

  body("confirmPassword")
    .notEmpty().withMessage("Please confirm your new password.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
];

// ── Change Password (authenticated user) ─────────────────────
const changePasswordRules = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required."),

  body("newPassword")
    .notEmpty().withMessage("New password is required.")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters.")
    .matches(/[0-9]/).withMessage("Password must contain at least one number.")
    .matches(/[a-zA-Z]/).withMessage("Password must contain at least one letter.")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New password must be different from current password.");
      }
      return true;
    }),

  body("confirmNewPassword")
    .notEmpty().withMessage("Please confirm your new password.")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
];

// ── Update Profile ────────────────────────────────────────────
const updateProfileRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters."),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Please enter a valid phone number."),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other."),

  body("dob")
    .optional()
    .isISO8601().withMessage("Date of birth must be a valid date (YYYY-MM-DD).")
    .custom((value) => {
      if (new Date(value) >= new Date()) {
        throw new Error("Date of birth must be in the past.");
      }
      return true;
    }),

  body("bloodGroup")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
    .withMessage("Invalid blood group."),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Address must not exceed 300 characters."),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters."),

  // Doctor profile fields
  body("specialization")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Specialization must not exceed 100 characters."),

  body("experience")
    .optional()
    .isInt({ min: 0, max: 60 })
    .withMessage("Experience must be a number between 0 and 60 years."),

  body("consultationFee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Consultation fee must be a positive number."),
];

module.exports = {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  changePasswordRules,
  updateProfileRules,
};