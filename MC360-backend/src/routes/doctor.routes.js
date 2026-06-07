import express from "express";
import {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorDashboard,
  getAllDoctors,
  getDoctorById,
  getAvailableSlots,
  updateAvailability,
  uploadDoctorPicture,
} from "../controllers/doctor.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────
router.get("/",           getAllDoctors);
router.get("/:id",        getDoctorById);
router.get("/:id/slots",  getAvailableSlots);

// ── Protected ─────────────────────────────────────────────────────────────
router.use(protect);

router.get("/profile",          authorizeRoles("doctor"), getDoctorProfile);
router.put("/profile",          authorizeRoles("doctor"), updateDoctorProfile);
router.get("/dashboard",        authorizeRoles("doctor"), getDoctorDashboard);
router.put("/availability",     authorizeRoles("doctor"), updateAvailability);
router.post("/profile/picture", authorizeRoles("doctor"), upload.single("picture"), uploadDoctorPicture);

export default router;