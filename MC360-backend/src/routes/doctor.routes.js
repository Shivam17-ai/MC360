const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.use(protect);

// Doctor-specific routes (must come before generic /:id)
router.get("/me", authorize("doctor"), doctorController.getMyProfile);
router.put("/me", authorize("doctor"), doctorController.updateMyProfile);
router.get("/me/stats", authorize("doctor"), doctorController.getDoctorStats);
router.get("/patients", authorize("doctor"), doctorController.getMyPatients);
router.get("/patients/:patientId", authorize("doctor"), doctorController.getPatientDetail);

// Generic routes
router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);
router.post("/:id/rate", authorize("patient"), doctorController.rateDoctor);

module.exports = router;