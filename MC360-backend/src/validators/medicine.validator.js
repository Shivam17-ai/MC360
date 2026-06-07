/**
 * medicine.validator.js
 * Validation rules for medicine tracker routes
 *
 * Compatible with:
 *   - validate.middleware.js      → validate()
 *   - medicineService.js          → addMedicine, updateMedicine
 *   - MedicineForm.jsx (frontend) → name, dosage, frequency, timings, dates, notes
 *   - useMedicines.js hook        → addMedicine, updateMedicine
 *   - medicineReminder.job.js     → reads timings field
 *
 * Usage in routes/medicine.routes.js:
 *   const { addMedicineRules } = require("../validators/medicine.validator");
 *   const { validate } = require("../middlewares/validate.middleware");
 *   router.post("/", protect, addMedicineRules, validate, controller.add);
 */

const { body, param, query } = require("express-validator");

// ── Add Medicine ──────────────────────────────────────────────
const addMedicineRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Medicine name is required.")
    .isLength({ min: 1, max: 100 })
    .withMessage("Medicine name must be between 1 and 100 characters."),

  body("dosage")
    .trim()
    .notEmpty().withMessage("Dosage is required.")
    .isLength({ max: 50 })
    .withMessage("Dosage must not exceed 50 characters."),

  body("frequency")
    .notEmpty().withMessage("Frequency is required.")
    .isIn(["once", "twice", "thrice", "weekly", "custom"])
    .withMessage("Frequency must be: once, twice, thrice, weekly, or custom."),

  body("timings")
    .optional()
    .isArray()
    .withMessage("Timings must be an array.")
    .custom((timings) => {
      if (!Array.isArray(timings)) return true;
      const timeRegex = /^\d{2}:\d{2}$/;
      const invalid = timings.filter((t) => !timeRegex.test(t));
      if (invalid.length > 0) {
        throw new Error(`Invalid timing format: ${invalid.join(", ")}. Use HH:MM.`);
      }
      if (timings.length > 10) {
        throw new Error("Cannot set more than 10 daily timings.");
      }
      return true;
    }),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date (YYYY-MM-DD)."),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date (YYYY-MM-DD).")
    .custom((endDate, { req }) => {
      if (req.body.startDate && new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error("End date must be on or after the start date.");
      }
      return true;
    }),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Notes must not exceed 300 characters."),

  body("isTaken")
    .optional()
    .isBoolean()
    .withMessage("isTaken must be true or false."),
];

// ── Update Medicine ───────────────────────────────────────────
const updateMedicineRules = [
  param("id")
    .isMongoId().withMessage("Invalid medicine ID."),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Medicine name must be between 1 and 100 characters."),

  body("dosage")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Dosage must not exceed 50 characters."),

  body("frequency")
    .optional()
    .isIn(["once", "twice", "thrice", "weekly", "custom"])
    .withMessage("Frequency must be: once, twice, thrice, weekly, or custom."),

  body("timings")
    .optional()
    .isArray()
    .withMessage("Timings must be an array.")
    .custom((timings) => {
      if (!Array.isArray(timings)) return true;
      const timeRegex = /^\d{2}:\d{2}$/;
      const invalid = timings.filter((t) => !timeRegex.test(t));
      if (invalid.length > 0) {
        throw new Error(`Invalid timing format: ${invalid.join(", ")}. Use HH:MM.`);
      }
      return true;
    }),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date (YYYY-MM-DD)."),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date (YYYY-MM-DD).")
    .custom((endDate, { req }) => {
      if (req.body.startDate && new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error("End date must be on or after the start date.");
      }
      return true;
    }),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Notes must not exceed 300 characters."),
];

// ── Toggle Taken ──────────────────────────────────────────────
const toggleTakenRules = [
  param("id")
    .isMongoId().withMessage("Invalid medicine ID."),
];

// ── Delete Medicine ───────────────────────────────────────────
const deleteMedicineRules = [
  param("id")
    .isMongoId().withMessage("Invalid medicine ID."),
];

// ── Get Patient Medicines (doctor) ────────────────────────────
const getPatientMedicinesRules = [
  param("patientId")
    .isMongoId().withMessage("Invalid patient ID."),
];

// ── List / Filter Query ───────────────────────────────────────
const listMedicinesRules = [
  query("frequency")
    .optional()
    .isIn(["once", "twice", "thrice", "weekly", "custom"])
    .withMessage("Invalid frequency filter."),

  query("isTaken")
    .optional()
    .isBoolean()
    .withMessage("isTaken filter must be true or false."),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),
];

module.exports = {
  addMedicineRules,
  updateMedicineRules,
  toggleTakenRules,
  deleteMedicineRules,
  getPatientMedicinesRules,
  listMedicinesRules,
};