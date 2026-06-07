/**
 * appointment.validator.js
 * Validation rules for all appointment routes
 *
 * Compatible with:
 *   - validate.middleware.js        → validate()
 *   - appointmentService.js         → bookAppointment, reschedule, updateStatus
 *   - BookAppointment.jsx (frontend) → sends doctorId, date, timeSlot, type, reason
 *
 * Usage in routes/appointment.routes.js:
 *   const { bookAppointmentRules } = require("../validators/appointment.validator");
 *   const { validate } = require("../middlewares/validate.middleware");
 *   router.post("/", protect, bookAppointmentRules, validate, controller.book);
 */

const { body, param, query } = require("express-validator");

// ── Book Appointment ──────────────────────────────────────────
const bookAppointmentRules = [
  body("doctorId")
    .notEmpty().withMessage("Doctor ID is required.")
    .isMongoId().withMessage("Invalid doctor ID format."),

  body("date")
    .notEmpty().withMessage("Appointment date is required.")
    .isISO8601().withMessage("Date must be a valid format (YYYY-MM-DD).")
    .custom((value) => {
      const selected = new Date(value);
      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        throw new Error("Appointment date must be today or in the future.");
      }
      return true;
    }),

  body("timeSlot")
    .notEmpty().withMessage("Time slot is required.")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Time slot must be in HH:MM format (e.g. 09:30)."),

  body("type")
    .optional()
    .isIn(["in-person", "telemedicine"])
    .withMessage("Appointment type must be in-person or telemedicine."),

  body("reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Reason must not exceed 500 characters."),

  body("symptoms")
    .optional()
    .isArray()
    .withMessage("Symptoms must be an array."),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters."),
];

// ── Reschedule Appointment ────────────────────────────────────
const rescheduleAppointmentRules = [
  param("id")
    .isMongoId().withMessage("Invalid appointment ID."),

  body("date")
    .notEmpty().withMessage("New date is required.")
    .isISO8601().withMessage("Date must be a valid format (YYYY-MM-DD).")
    .custom((value) => {
      const selected = new Date(value);
      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        throw new Error("Rescheduled date must be today or in the future.");
      }
      return true;
    }),

  body("timeSlot")
    .notEmpty().withMessage("New time slot is required.")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Time slot must be in HH:MM format."),

  body("reason")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Reason must not exceed 300 characters."),
];

// ── Update Appointment Status (doctor / hospital) ─────────────
const updateAppointmentStatusRules = [
  param("id")
    .isMongoId().withMessage("Invalid appointment ID."),

  body("status")
    .notEmpty().withMessage("Status is required.")
    .isIn(["pending", "confirmed", "completed", "cancelled", "no-show"])
    .withMessage("Status must be: pending, confirmed, completed, cancelled, or no-show."),

  body("cancelReason")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Cancel reason must not exceed 300 characters."),
];

// ── Add Consultation Notes (doctor) ──────────────────────────
const consultationNotesRules = [
  param("id")
    .isMongoId().withMessage("Invalid appointment ID."),

  body("notes")
    .notEmpty().withMessage("Consultation notes are required.")
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage("Notes must be between 5 and 2000 characters."),

  body("diagnosis")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Diagnosis must not exceed 500 characters."),

  body("followUpDate")
    .optional()
    .isISO8601().withMessage("Follow-up date must be a valid date.")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Follow-up date must be in the future.");
      }
      return true;
    }),
];

// ── Get Doctor Slots Query ────────────────────────────────────
const getDoctorSlotsRules = [
  param("doctorId")
    .isMongoId().withMessage("Invalid doctor ID."),

  query("date")
    .notEmpty().withMessage("Date is required to fetch slots.")
    .isISO8601().withMessage("Date must be a valid format (YYYY-MM-DD)."),
];

// ── List / Filter Appointments ────────────────────────────────
const listAppointmentsRules = [
  query("status")
    .optional()
    .isIn(["pending", "confirmed", "completed", "cancelled", "no-show"])
    .withMessage("Invalid status filter."),

  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive integer."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100."),

  query("from")
    .optional()
    .isISO8601().withMessage("From date must be a valid date."),

  query("to")
    .optional()
    .isISO8601().withMessage("To date must be a valid date."),
];

module.exports = {
  bookAppointmentRules,
  rescheduleAppointmentRules,
  updateAppointmentStatusRules,
  consultationNotesRules,
  getDoctorSlotsRules,
  listAppointmentsRules,
};