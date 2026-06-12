const { body } = require("express-validator");

const bookAppointmentValidator = [
  body("doctorId").notEmpty().withMessage("Doctor ID is required").isMongoId().withMessage("Invalid Doctor ID"),
  body("date").notEmpty().withMessage("Date is required").isISO8601().withMessage("Invalid date format"),
  body("timeSlot").notEmpty().withMessage("Time slot is required"),
  body("type").optional().isIn(["in-person", "telemedicine", "home-visit"]).withMessage("Invalid appointment type"),
];

module.exports = { bookAppointmentValidator };