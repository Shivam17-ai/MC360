import express from "express";
import {
  bookTest,
  getTests,
  getTestById,
  cancelTest,
  updateTestStatus,
} from "../controllers/test.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/",         getTests);
router.post("/",        authorizeRoles("patient"), bookTest);
router.get("/:id",      getTestById);
router.delete("/:id",   authorizeRoles("patient"), cancelTest);
router.put("/:id/status", authorizeRoles("doctor", "hospital_admin"), updateTestStatus);

export default router;