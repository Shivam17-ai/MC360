const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescription.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.use(protect);

router.post("/", authorize("doctor"), prescriptionController.createPrescription);
router.get("/", prescriptionController.getMyPrescriptions);
router.get("/:id", prescriptionController.getPrescriptionById);
router.put("/:id", authorize("doctor"), prescriptionController.updatePrescription);

module.exports = router;