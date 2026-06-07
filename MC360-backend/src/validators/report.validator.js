/**
 * report.validator.js
 * Validation rules for medical report routes
 *
 * Compatible with:
 *   - validate.middleware.js       → validate()
 *   - upload.middleware.js         → uploadReport (multer)
 *   - reportService.js             → uploadReport, getMyReports
 *   - ReportUpload.jsx (frontend)  → title, category, description
 *   - ReportCard / ReportViewer    → reads category, title fields
 *   - aiService.js                 → summarizeReport (uses report._id)
 *
 * Usage in routes/report.routes.js:
 *   const { uploadReportRules } = require("../validators/report.validator");
 *   const { validate } = require("../middlewares/validate.middleware");
 *   const { uploadReport, handleUpload } = require("../middlewares/upload.middleware");
 *   router.post("/upload", protect, handleUpload(uploadReport), uploadReportRules, validate, controller.upload);
 */

const { body, param, query } = require("express-validator");

// ── Supported categories ──────────────────────────────────────
const REPORT_CATEGORIES = [
  "blood",
  "urine",
  "xray",
  "mri",
  "ct",
  "ecg",
  "ultrasound",
  "biopsy",
  "pathology",
  "other",
];

// ── Upload / Create Report ────────────────────────────────────
const uploadReportRules = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Title must be between 2 and 150 characters."),

  body("category")
    .optional()
    .isIn(REPORT_CATEGORIES)
    .withMessage(`Category must be one of: ${REPORT_CATEGORIES.join(", ")}.`),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters."),

  body("reportDate")
    .optional()
    .isISO8601()
    .withMessage("Report date must be a valid date (YYYY-MM-DD).")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("Report date cannot be in the future.");
      }
      return true;
    }),

  body("isSharedWithDoctor")
    .optional()
    .isBoolean()
    .withMessage("isSharedWithDoctor must be true or false."),

  body("doctorId")
    .optional()
    .isMongoId()
    .withMessage("Invalid doctor ID format."),

  body("labName")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Lab name must not exceed 150 characters."),

  body("referredBy")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Referred by must not exceed 100 characters."),

  // File presence check — file uploaded via multer (req.file)
  body().custom((_, { req }) => {
    // Only enforce if no file — multer populates req.file
    // Skip this check for pure metadata updates
    if (req.method === "POST" && !req.file) {
      throw new Error("Report file is required. Please upload a PDF or image.");
    }
    return true;
  }),
];

// ── Update Report Metadata ────────────────────────────────────
const updateReportRules = [
  param("id")
    .isMongoId().withMessage("Invalid report ID."),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Title must be between 2 and 150 characters."),

  body("category")
    .optional()
    .isIn(REPORT_CATEGORIES)
    .withMessage(`Category must be one of: ${REPORT_CATEGORIES.join(", ")}.`),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters."),

  body("isSharedWithDoctor")
    .optional()
    .isBoolean()
    .withMessage("isSharedWithDoctor must be true or false."),

  body("labName")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Lab name must not exceed 150 characters."),
];

// ── Delete Report ─────────────────────────────────────────────
const deleteReportRules = [
  param("id")
    .isMongoId().withMessage("Invalid report ID."),
];

// ── Get Report By ID ──────────────────────────────────────────
const getReportByIdRules = [
  param("id")
    .isMongoId().withMessage("Invalid report ID."),
];

// ── Get Patient Reports (doctor view) ─────────────────────────
const getPatientReportsRules = [
  param("patientId")
    .isMongoId().withMessage("Invalid patient ID."),

  query("category")
    .optional()
    .isIn(REPORT_CATEGORIES)
    .withMessage(`Category filter must be one of: ${REPORT_CATEGORIES.join(", ")}.`),
];

// ── Summarize Report (AI) ─────────────────────────────────────
const summarizeReportRules = [
  param("id")
    .isMongoId().withMessage("Invalid report ID."),
];

// ── List / Filter Reports ─────────────────────────────────────
const listReportsRules = [
  query("category")
    .optional()
    .isIn(REPORT_CATEGORIES)
    .withMessage(`Category filter must be one of: ${REPORT_CATEGORIES.join(", ")}.`),

  query("from")
    .optional()
    .isISO8601()
    .withMessage("From date must be a valid date."),

  query("to")
    .optional()
    .isISO8601()
    .withMessage("To date must be a valid date."),

  query("isSharedWithDoctor")
    .optional()
    .isBoolean()
    .withMessage("isSharedWithDoctor filter must be true or false."),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),

  query("sort")
    .optional()
    .isIn(["newest", "oldest", "category"])
    .withMessage("Sort must be: newest, oldest, or category."),
];

module.exports = {
  uploadReportRules,
  updateReportRules,
  deleteReportRules,
  getReportByIdRules,
  getPatientReportsRules,
  summarizeReportRules,
  listReportsRules,
  REPORT_CATEGORIES,
};