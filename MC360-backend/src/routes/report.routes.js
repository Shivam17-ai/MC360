const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { upload } = require("../middlewares/upload.middleware");
const { uploadLimiter } = require("../middlewares/rateLimiter.middleware");

router.use(protect);

// POST / and POST /upload both handle report uploads (patient self-uploads)
router.post("/", uploadLimiter, upload.single("file"), reportController.uploadReport);
router.post("/upload", uploadLimiter, upload.single("file"), reportController.uploadReport);
// Doctor uploads a report for a patient (linked to an appointment)
router.post("/for-patient", authorize("doctor"), uploadLimiter, upload.single("file"), reportController.uploadReportForPatient);
router.get("/", reportController.getMyReports);
router.get("/patient/:patientId", authorize("doctor", "hospital", "admin"), reportController.getPatientReports);
router.get("/:id", reportController.getReportById);
router.delete("/:id", reportController.deleteReport);
router.post("/:id/summarize", reportController.summarizeReport);
router.post("/:id/share", authorize("patient"), reportController.shareReport);

module.exports = router;