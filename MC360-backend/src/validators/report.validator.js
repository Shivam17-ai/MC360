const { body } = require("express-validator");

const uploadReportValidator = [
  body("title").optional().isLength({ max: 200 }).withMessage("Title too long"),
  body("type").optional().isIn(["lab-report", "prescription", "discharge-summary", "imaging", "vaccination", "insurance", "other"]),
];

module.exports = { uploadReportValidator };