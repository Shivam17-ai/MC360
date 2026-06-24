const express = require("express");
const router = express.Router();
const emergencyController = require("../controllers/emergency.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.use(protect);

router.post("/trigger", authorize("patient"), emergencyController.triggerAlert);
router.get("/", emergencyController.getAlerts);
router.put("/:id/acknowledge", authorize("doctor", "hospital", "admin"), emergencyController.acknowledgeAlert);
router.put("/:id/resolve", authorize("doctor", "hospital", "admin"), emergencyController.resolveAlert);

// ── Frontend aligned routes ───────────────────────────────────────────────────
router.get("/alerts", emergencyController.getAlerts);
router.patch("/alerts/:id/resolve", authorize("doctor", "hospital", "admin"), emergencyController.resolveAlert);
router.put("/alerts/:id/resolve", authorize("doctor", "hospital", "admin"), emergencyController.resolveAlert);

module.exports = router;