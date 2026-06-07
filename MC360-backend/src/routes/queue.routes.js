import express from "express";
import {
  getLiveQueue,
  generateToken,
  updateTokenStatus,
  getMyToken,
} from "../controllers/queue.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/live/:doctorId",       getLiveQueue);
router.post("/token",               authorizeRoles("patient"), generateToken);
router.get("/my-token",             authorizeRoles("patient"), getMyToken);
router.put("/token/:id/status",     authorizeRoles("doctor", "hospital_admin"), updateTokenStatus);

export default router;