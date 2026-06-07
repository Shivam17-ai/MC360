import express from "express";
import {
  getAppointments,
  bookAppointment,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots,
  getAppointmentById,
  getAppointmentHistory,
} from "../controllers/appointment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

// ── Patient ───────────────────────────────────────────────────────────────
router.get("/",           getAppointments);
router.post("/",          authorizeRoles("patient"), bookAppointment);
router.get("/history",    getAppointmentHistory);
router.get("/slots",      getAvailableSlots);
router.get("/:id",        getAppointmentById);
router.put("/:id",        updateAppointment);
router.delete("/:id",     authorizeRoles("patient"), cancelAppointment);

export default router;