const express = require("express");
const router = express.Router();
const dietController = require("../controllers/diet.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { aiLimiter } = require("../middlewares/rateLimiter.middleware");

router.use(protect);

router.post("/generate", authorize("patient"), aiLimiter, dietController.generatePlan);
router.get("/active", authorize("patient"), dietController.getActivePlan);
router.get("/history", authorize("patient"), dietController.getPlanHistory);
router.get("/:id", dietController.getPlanById);
router.put("/:id/deactivate", authorize("patient"), dietController.deactivatePlan);

module.exports = router;