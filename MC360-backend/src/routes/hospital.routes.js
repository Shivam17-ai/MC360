const express = require("express");
const router = express.Router();
const hospitalController = require("../controllers/hospital.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { uploadImage } = require("../middlewares/upload.middleware");

router.use(protect);

router.get("/me", authorize("hospital"), hospitalController.getMyProfile);
router.put("/me", authorize("hospital"), uploadImage.single("logo"), hospitalController.updateMyProfile);
router.get("/me/stats", authorize("hospital"), hospitalController.getHospitalStats);
router.post("/me/doctors/:doctorId", authorize("hospital"), hospitalController.addDoctor);
router.delete("/me/doctors/:doctorId", authorize("hospital"), hospitalController.removeDoctor);

// ── Hospital Management Routes (mapped via /hospital) ────────────────────────
router.get("/doctors", authorize("hospital"), hospitalController.getHospitalDoctors);
router.post("/doctors", authorize("hospital"), hospitalController.createAndAddDoctor);
router.delete("/doctors/:id", authorize("hospital"), hospitalController.removeHospitalDoctor);

router.get("/patients", authorize("hospital"), hospitalController.getHospitalPatients);
router.get("/analytics", authorize("hospital"), hospitalController.getHospitalAnalyticsPage);

router.get("/", hospitalController.getAllHospitals);
router.get("/:id", hospitalController.getHospitalById);

module.exports = router;