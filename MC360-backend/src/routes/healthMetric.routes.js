import express from "express";
import {
  getHealthMetrics,
  addHealthMetric,
  getMetricsByType,
  deleteHealthMetric,
  getLatestMetrics,
} from "../controllers/healthMetric.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("patient", "doctor"));

router.get("/",         getHealthMetrics);
router.post("/",        addHealthMetric);
router.get("/latest",   getLatestMetrics);
router.get("/:type",    getMetricsByType);
router.delete("/:id",   deleteHealthMetric);

export default router;