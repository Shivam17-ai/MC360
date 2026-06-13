const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.use(protect);

router.get("/patient", authorize("patient"), analyticsController.getPatientAnalytics);
router.get("/doctor", authorize("doctor"), analyticsController.getDoctorAnalytics);
router.get("/hospital", authorize("hospital"), analyticsController.getHospitalAnalytics);
router.get("/admin", authorize("admin"), analyticsController.getAdminAnalytics);

module.exports = router;