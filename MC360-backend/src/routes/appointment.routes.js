const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.use(protect);

router.post("/", authorize("patient"), appointmentController.bookAppointment);
router.get("/", appointmentController.getMyAppointments);
router.get("/doctor/:doctorId/availability", appointmentController.getDoctorAvailability);
router.get("/:id", appointmentController.getAppointmentById);
router.post("/:id/cancel", appointmentController.cancelAppointment);
router.put("/:id/reschedule", appointmentController.rescheduleAppointment);
router.put("/:id/status", authorize("doctor", "hospital", "admin"), appointmentController.updateAppointmentStatus);
router.post("/:id/rate", authorize("patient"), appointmentController.rateAppointment);

module.exports = router;