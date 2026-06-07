import express from "express";
import authRoutes from "./auth.routes.js";
import patientRoutes from "./patient.routes.js";
import doctorRoutes from "./doctor.routes.js";
import hospitalRoutes from "./hospital.routes.js";
import appointmentRoutes from "./appointment.routes.js";
import testRoutes from "./test.routes.js";
import reportRoutes from "./report.routes.js";
import prescriptionRoutes from "./prescription.routes.js";
import medicineRoutes from "./medicine.routes.js";
import healthMetricRoutes from "./healthMetric.routes.js";
import aiRoutes from "./ai.routes.js";
import notificationRoutes from "./notification.routes.js";
import queueRoutes from "./queue.routes.js";
import dietRoutes from "./diet.routes.js";
import emergencyRoutes from "./emergency.routes.js";
import analyticsRoutes from "./analytics.routes.js";

const router = express.Router();

// ── Mount all routes ──────────────────────────────────────────────────────
router.use("/auth",         authRoutes);
router.use("/patients",     patientRoutes);
router.use("/doctors",      doctorRoutes);
router.use("/hospitals",    hospitalRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/tests",        testRoutes);
router.use("/reports",      reportRoutes);
router.use("/prescriptions",prescriptionRoutes);
router.use("/medicines",    medicineRoutes);
router.use("/health-metrics", healthMetricRoutes);
router.use("/ai",           aiRoutes);
router.use("/notifications",notificationRoutes);
router.use("/queue",        queueRoutes);
router.use("/diet",         dietRoutes);
router.use("/emergency",    emergencyRoutes);
router.use("/analytics",    analyticsRoutes);

export default router;