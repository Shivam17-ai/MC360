import express from "express";
import {
  getPrescriptions,
  createPrescription,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  downloadPrescriptionPDF,
} from "../controllers/prescription.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/",           getPrescriptions);
router.post("/",          authorizeRoles("doctor"), createPrescription);
router.get("/:id",        getPrescriptionById);
router.put("/:id",        authorizeRoles("doctor"), updatePrescription);
router.delete("/:id",     authorizeRoles("doctor"), deletePrescription);
router.get("/:id/pdf",    downloadPrescriptionPDF);

export default router;