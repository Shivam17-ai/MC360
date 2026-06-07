import express from "express";
import {
  getDietPlan,
  generateDietPlan,
  updateDietPlan,
  deleteDietPlan,
} from "../controllers/diet.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("patient"));

router.get("/",     getDietPlan);
router.post("/",    generateDietPlan);
router.put("/",     updateDietPlan);
router.delete("/",  deleteDietPlan);

export default router;