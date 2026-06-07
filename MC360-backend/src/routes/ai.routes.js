import express from "express";
import {
  checkSymptoms,
  triageAssessment,
  predictRisk,
  ocrScan,
  summarizeReport,
  generateDietPlan,
  checkDrugInteraction,
} from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { aiLimiter } from "../middlewares/rateLimiter.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(protect);
router.use(aiLimiter);

// ── 3 ML models only ──────────────────────────────────────────────────────
router.post("/symptom-check",       checkSymptoms);
router.post("/triage",              triageAssessment);
router.post("/risk-predict/:disease", predictRisk);       // :disease = diabetes | heart | obesity
router.post("/ocr-scan",            upload.single("prescription"), ocrScan);
router.post("/report-summary",      upload.single("report"), summarizeReport);
router.post("/diet-plan",           generateDietPlan);
router.post("/drug-interaction",    checkDrugInteraction);

export default router;