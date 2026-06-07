/**
 * healthMetric.validator.js
 * Validation rules for health metrics routes
 *
 * Compatible with:
 *   - validate.middleware.js          → validate()
 *   - healthMetricsService.js         → addMetric, getMetricsByType
 *   - useHealthMetrics.js hook        → addMetric
 *   - HealthTrendsChart / BP / Glucose charts (frontend)
 *   - healthAlert.job.js              → reads type, value fields
 *
 * Supported metric types:
 *   bloodPressure | glucose | weight | heartRate | oxygenLevel | temperature
 *
 * Usage in routes/healthMetric.routes.js:
 *   const { addMetricRules } = require("../validators/healthMetric.validator");
 *   const { validate } = require("../middlewares/validate.middleware");
 *   router.post("/", protect, addMetricRules, validate, controller.add);
 */

const { body, param, query } = require("express-validator");

// ── Supported metric types ────────────────────────────────────
const METRIC_TYPES = [
  "bloodPressure",
  "glucose",
  "weight",
  "heartRate",
  "oxygenLevel",
  "temperature",
];

// ── Add Metric ────────────────────────────────────────────────
const addMetricRules = [
  body("type")
    .notEmpty().withMessage("Metric type is required.")
    .isIn(METRIC_TYPES)
    .withMessage(`Metric type must be one of: ${METRIC_TYPES.join(", ")}.`),

  // value: number OR object (for bloodPressure: { systolic, diastolic })
  body("value")
    .notEmpty().withMessage("Value is required.")
    .custom((value, { req }) => {
      const type = req.body.type;

      if (type === "bloodPressure") {
        if (typeof value !== "object" || value === null) {
          throw new Error("Blood pressure value must be an object: { systolic, diastolic }.");
        }
        const { systolic, diastolic } = value;
        if (!systolic || !diastolic) {
          throw new Error("Blood pressure requires both systolic and diastolic values.");
        }
        if (systolic < 50 || systolic > 300) {
          throw new Error("Systolic pressure must be between 50 and 300 mmHg.");
        }
        if (diastolic < 30 || diastolic > 200) {
          throw new Error("Diastolic pressure must be between 30 and 200 mmHg.");
        }
        if (systolic <= diastolic) {
          throw new Error("Systolic pressure must be greater than diastolic.");
        }
        return true;
      }

      const numVal = Number(value);
      if (isNaN(numVal)) {
        throw new Error("Value must be a valid number.");
      }

      // Per-type range checks
      if (type === "glucose" && (numVal < 20 || numVal > 600)) {
        throw new Error("Glucose must be between 20 and 600 mg/dL.");
      }
      if (type === "weight" && (numVal < 1 || numVal > 500)) {
        throw new Error("Weight must be between 1 and 500 kg.");
      }
      if (type === "heartRate" && (numVal < 20 || numVal > 300)) {
        throw new Error("Heart rate must be between 20 and 300 bpm.");
      }
      if (type === "oxygenLevel" && (numVal < 50 || numVal > 100)) {
        throw new Error("Oxygen level (SpO2) must be between 50% and 100%.");
      }
      if (type === "temperature" && (numVal < 30 || numVal > 45)) {
        throw new Error("Temperature must be between 30°C and 45°C.");
      }

      return true;
    }),

  body("recordedAt")
    .optional()
    .isISO8601()
    .withMessage("Recorded date must be a valid ISO date.")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("Recorded date cannot be in the future.");
      }
      return true;
    }),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Notes must not exceed 300 characters."),

  body("unit")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Unit must not exceed 20 characters."),
];

// ── Update Metric ─────────────────────────────────────────────
const updateMetricRules = [
  param("id")
    .isMongoId().withMessage("Invalid metric ID."),

  body("value")
    .optional()
    .custom((value) => {
      if (typeof value === "object" && value !== null) return true; // bloodPressure object
      if (!isNaN(Number(value))) return true;
      throw new Error("Value must be a valid number or blood pressure object.");
    }),

  body("recordedAt")
    .optional()
    .isISO8601()
    .withMessage("Recorded date must be a valid ISO date.")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("Recorded date cannot be in the future.");
      }
      return true;
    }),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Notes must not exceed 300 characters."),
];

// ── Delete Metric ─────────────────────────────────────────────
const deleteMetricRules = [
  param("id")
    .isMongoId().withMessage("Invalid metric ID."),
];

// ── Get By Type ───────────────────────────────────────────────
const getByTypeRules = [
  param("type")
    .isIn(METRIC_TYPES)
    .withMessage(`Type must be one of: ${METRIC_TYPES.join(", ")}.`),
];

// ── Trends Query ──────────────────────────────────────────────
const metricTrendsRules = [
  param("type")
    .isIn(METRIC_TYPES)
    .withMessage(`Type must be one of: ${METRIC_TYPES.join(", ")}.`),

  query("range")
    .optional()
    .isIn(["7d", "30d", "90d", "1y"])
    .withMessage("Range must be one of: 7d, 30d, 90d, 1y."),
];

// ── List / Filter Query ───────────────────────────────────────
const listMetricsRules = [
  query("type")
    .optional()
    .isIn(METRIC_TYPES)
    .withMessage(`Type filter must be one of: ${METRIC_TYPES.join(", ")}.`),

  query("from")
    .optional()
    .isISO8601()
    .withMessage("From date must be a valid date."),

  query("to")
    .optional()
    .isISO8601()
    .withMessage("To date must be a valid date."),

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
  addMetricRules,
  updateMetricRules,
  deleteMetricRules,
  getByTypeRules,
  metricTrendsRules,
  listMetricsRules,
  METRIC_TYPES,
};