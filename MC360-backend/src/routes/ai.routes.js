const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");
const { protect } = require("../middlewares/auth.middleware");
const { aiLimiter } = require("../middlewares/rateLimiter.middleware");

router.use(protect);
router.use(aiLimiter);

router.post("/analyze-symptoms", aiController.analyzeSymptoms);
router.get("/symptom-history", aiController.getSymptomHistory);
router.post("/predict-risk", aiController.predictRisk);
router.get("/risk-history", aiController.getRiskHistory);
router.post("/summarize-report/:id", aiController.summarizeReport);
router.post("/check-drug-interactions", aiController.checkDrugInteractions);
router.post("/generate-diet-plan", aiController.generateDietPlan);
router.post("/chat", aiController.chatWithAI);

module.exports = router;