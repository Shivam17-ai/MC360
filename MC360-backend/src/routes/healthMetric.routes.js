const express = require("express");
const router = express.Router();
const healthMetricController = require("../controllers/healthMetric.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.use(protect);

router.post("/", healthMetricController.addMetric);
router.get("/", healthMetricController.getMyMetrics);
router.get("/latest", healthMetricController.getLatestMetrics);
router.get("/type/:type", healthMetricController.getMetricsByType);
router.delete("/:id", healthMetricController.deleteMetric);

module.exports = router;