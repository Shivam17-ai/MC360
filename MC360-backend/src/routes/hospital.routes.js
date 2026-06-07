import express from "express";
import {
  getHospitalProfile,
  updateHospitalProfile,
  getHospitalDashboard,
  getAllHospitals,
  getHospitalById,
  addDoctor,
  removeDoctor,
  getHospitalDoctors,
  getHospitalPatients,
} from "../controllers/hospital.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────
router.get("/",      getAllHospitals);
router.get("/:id",   getHospitalById);

// ── Protected ─────────────────────────────────────────────────────────────
router.use(protect);
router.use(authorizeRoles("hospital_admin"));

router.get("/profile",          getHospitalProfile);
router.put("/profile",          updateHospitalProfile);
router.get("/dashboard",        getHospitalDashboard);
router.get("/doctors",          getHospitalDoctors);
router.get("/patients",         getHospitalPatients);
router.post("/doctors/add",     addDoctor);
router.delete("/doctors/:id",   removeDoctor);

export default router;