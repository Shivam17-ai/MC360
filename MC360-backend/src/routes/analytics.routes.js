import express from "express";
import {
  getPatientAnalytics,
  getDoctorAnalytics,
  getHospitalAnalytics,
} from "../controllers/analytics.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/patient",  authorizeRoles("patient"),        getPatientAnalytics);
router.get("/doctor",   authorizeRoles("doctor"),         getDoctorAnalytics);
router.get("/hospital", authorizeRoles("hospital_admin"), getHospitalAnalytics);

export default router;