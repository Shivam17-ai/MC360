const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.use(protect);

router.get("/me", authorize("patient"), patientController.getMyProfile);
router.put("/me", authorize("patient"), patientController.updateMyProfile);
router.post("/me/medical-history", authorize("patient"), patientController.addMedicalHistory);

// Doctors and hospitals can list/view patients
router.get("/", authorize("doctor", "hospital", "admin"), patientController.getAllPatients);
router.get("/:id", authorize("doctor", "hospital", "admin"), patientController.getPatientById);

module.exports = router;