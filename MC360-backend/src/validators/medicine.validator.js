const { body } = require("express-validator");

const addMedicineValidator = [
  body("name").notEmpty().withMessage("Medicine name is required"),
  body("startDate").notEmpty().withMessage("Start date is required").isISO8601().withMessage("Invalid date format"),
  body("frequency").optional().isIn(["once-daily", "twice-daily", "thrice-daily", "four-times-daily", "as-needed", "weekly", "custom"]),
];

module.exports = { addMedicineValidator };