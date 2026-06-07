import express from "express";
import {
  getProfile,
  updateProfile,
  getDashboard,
  getMedicalHistory,
  uploadProfilePicture,
} from "../controllers/patient.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// ── All routes protected + patient only ───────────────────────────────────
router.use(protect);
router.use(authorizeRoles("patient"));

router.get("/profile",            getProfile);
router.put("/profile",            updateProfile);
router.get("/dashboard",          getDashboard);
router.get("/history",            getMedicalHistory);
router.post("/profile/picture",   upload.single("picture"), uploadProfilePicture);

export default router;