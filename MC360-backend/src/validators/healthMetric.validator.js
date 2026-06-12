const { body } = require("express-validator");

const addMetricValidator = [
  body("type").notEmpty().withMessage("Metric type is required").isIn(["blood_pressure", "blood_glucose", "weight", "height", "bmi", "heart_rate", "oxygen_saturation", "temperature", "cholesterol", "hemoglobin", "custom"]).withMessage("Invalid metric type"),
  body("value").notEmpty().withMessage("Value is required"),
  body("unit").optional().isString(),
  body("recordedAt").optional().isISO8601().withMessage("Invalid date format"),
];

module.exports = { addMetricValidator };