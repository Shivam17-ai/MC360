const queueService = require("../services/queue.service");
const Patient = require("../models/Patient.model");
const Doctor = require("../models/Doctor.model");
const QueueToken = require("../models/QueueToken.model");
const { successResponse, errorResponse } = require("../utils/response");

const generateToken = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);

    const token = await queueService.generateToken({ patientId: patient._id, ...req.body });
    return successResponse(res, { token }, "Queue token generated.", 201);
  } catch (err) { next(err); }
};

const callNext = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return errorResponse(res, "Doctor not found.", 404);

    const token = await queueService.callNextToken(doctor._id, req.body.hospitalId);
    if (!token) return successResponse(res, { token: null }, "No more patients in queue.");
    return successResponse(res, { token }, "Next patient called.");
  } catch (err) { next(err); }
};

const getQueueStatus = async (req, res, next) => {
  try {
    const { doctorId, hospitalId } = req.query;
    if (!doctorId || !hospitalId) return errorResponse(res, "doctorId and hospitalId required.", 400);
    const queue = await queueService.getQueueStatus(doctorId, hospitalId);
    return successResponse(res, { queue, total: queue.length });
  } catch (err) { next(err); }
};

const getMyToken = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const token = await QueueToken.findOne({ patient: patient._id, date: { $gte: today }, status: { $nin: ["done", "cancelled"] } }).populate({ path: "doctor", populate: { path: "user", select: "name" } }).populate("hospital", "name");
    return successResponse(res, { token });
  } catch (err) { next(err); }
};

const updateTokenStatus = async (req, res, next) => {
  try {
    const token = await queueService.updateTokenStatus(req.params.id, req.body.status);
    if (!token) return errorResponse(res, "Token not found.", 404);
    return successResponse(res, { token }, "Status updated.");
  } catch (err) { next(err); }
};

module.exports = { generateToken, callNext, getQueueStatus, getMyToken, updateTokenStatus };