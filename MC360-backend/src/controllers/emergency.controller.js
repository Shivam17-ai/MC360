const EmergencyAlert = require("../models/EmergencyAlert.model");
const Patient = require("../models/Patient.model");
const { createNotification } = require("../services/notification.service");
const { sendSMS, sendWhatsApp } = require("../services/whatsapp.service");
const paginate = require("../utils/paginate");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");
const logger = require("../utils/logger");

const triggerAlert = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id }).populate("user");
    if (!patient) return errorResponse(res, "Patient not found.", 404);

    const alert = await EmergencyAlert.create({
      patient: patient._id,
      triggeredBy: req.user._id,
      type: req.body.type || "manual",
      severity: req.body.severity || "high",
      location: req.body.location,
      message: req.body.message || "Emergency SOS triggered",
      hospitalNotified: req.body.hospitalId,
    });

    // Broadcast via socket
    try {
      const io = require("../sockets").getIO();
      if (io) io.emit("emergency:new", { alert, patient: { name: patient.user.name, id: patient._id } });
    } catch {}

    // Notify emergency contacts
    if (patient.emergencyContact?.phone) {
      const msg = `🚨 EMERGENCY: ${patient.user.name} has triggered an SOS alert on MC360. Please check on them immediately.`;
      await sendSMS(patient.emergencyContact.phone, msg).catch((e) => logger.warn(e.message));
    }

    await createNotification({ userId: req.user._id, title: "Emergency Alert Triggered", message: "Your emergency alert has been sent. Help is on the way.", type: "emergency", priority: "critical" });

    return successResponse(res, { alert }, "Emergency alert triggered.", 201);
  } catch (err) { next(err); }
};

const getAlerts = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ user: req.user._id });
      filter.patient = patient?._id;
    }
    if (req.query.status) filter.status = req.query.status;
    const { data, pagination } = await paginate(EmergencyAlert, filter, {
      page: req.query.page, limit: req.query.limit,
      populate: [{ path: "patient", populate: { path: "user", select: "name phone" } }, { path: "hospitalNotified", select: "name phone" }],
      sort: { createdAt: -1 },
    });
    return paginatedResponse(res, data, pagination);
  } catch (err) { next(err); }
};

const acknowledgeAlert = async (req, res, next) => {
  try {
    const alert = await EmergencyAlert.findByIdAndUpdate(req.params.id, { status: "acknowledged", acknowledgedBy: req.user._id, acknowledgedAt: new Date() }, { new: true });
    if (!alert) return errorResponse(res, "Alert not found.", 404);
    return successResponse(res, { alert }, "Alert acknowledged.");
  } catch (err) { next(err); }
};

const resolveAlert = async (req, res, next) => {
  try {
    const alert = await EmergencyAlert.findByIdAndUpdate(req.params.id, { status: "resolved", resolvedAt: new Date(), notes: req.body.notes }, { new: true });
    if (!alert) return errorResponse(res, "Alert not found.", 404);
    return successResponse(res, { alert }, "Alert resolved.");
  } catch (err) { next(err); }
};

module.exports = { triggerAlert, getAlerts, acknowledgeAlert, resolveAlert };