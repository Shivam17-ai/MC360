import express from "express";
import {
  getReports,
  uploadReport,
  getReportById,
  deleteReport,
  getReportSummary,
} from "../controllers/report.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/",               getReports);
router.post("/upload",        upload.single("report"), uploadReport);
router.get("/:id",            getReportById);
router.delete("/:id",         deleteReport);
router.get("/:id/summary",    authorizeRoles("patient", "doctor"), getReportSummary);

export default router;