import express from "express";
import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  logDose,
  getAdherence,
} from "../controllers/medicine.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("patient"));

router.get("/",             getMedicines);
router.post("/",            addMedicine);
router.get("/adherence",    getAdherence);
router.put("/:id",          updateMedicine);
router.delete("/:id",       deleteMedicine);
router.post("/:id/log",     logDose);

export default router;