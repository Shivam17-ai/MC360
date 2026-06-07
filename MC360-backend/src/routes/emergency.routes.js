import express from "express";
import {
  triggerEmergency,
  getEmergencyAlerts,
  acknowledgeAlert,
  resolveAlert,
} from "../controllers/emergency.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/trigger",         triggerEmergency);
router.get("/alerts",           authorizeRoles("doctor", "hospital_admin"), getEmergencyAlerts);
router.put("/:id/acknowledge",  authorizeRoles("doctor", "hospital_admin"), acknowledgeAlert);
router.put("/:id/resolve",      authorizeRoles("doctor", "hospital_admin"), resolveAlert);

export default router;