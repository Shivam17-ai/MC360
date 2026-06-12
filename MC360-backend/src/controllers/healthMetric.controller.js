const HealthMetric = require("../models/HealthMetric.model");
const Patient = require("../models/Patient.model");
const paginate = require("../utils/paginate");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const NORMAL_RANGES = {
  blood_pressure: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } },
  blood_glucose: { min: 70, max: 100 },
  heart_rate: { min: 60, max: 100 },
  oxygen_saturation: { min: 95, max: 100 },
  temperature: { min: 36.1, max: 37.2 },
  bmi: { min: 18.5, max: 24.9 },
};

const isAbnormal = (type, value) => {
  const range = NORMAL_RANGES[type];
  if (!range) return false;
  if (type === "blood_pressure") return value.systolic > range.systolic.max || value.systolic < range.systolic.min || value.diastolic > range.diastolic.max || value.diastolic < range.diastolic.min;
  return typeof value === "number" && (value < range.min || value > range.max);
};

const addMetric = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);

    const abnormal = isAbnormal(req.body.type, req.body.value);
    const metric = await HealthMetric.create({ ...req.body, patient: patient._id, recordedBy: req.user._id, isAbnormal: abnormal });

    if (abnormal) {
      const notifService = require("../services/notification.service");
      await notifService.createNotification({ userId: req.user._id, title: "Abnormal Health Reading", message: `Your ${req.body.type.replace(/_/g, " ")} reading appears abnormal. Please consult your doctor.`, type: "health_alert", priority: "high" });
    }

    return successResponse(res, { metric }, "Metric recorded.", 201);
  } catch (err) { next(err); }
};

const getMyMetrics = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);

    const filter = { patient: patient._id };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.from) filter.recordedAt = { $gte: new Date(req.query.from) };
    if (req.query.to) filter.recordedAt = { ...filter.recordedAt, $lte: new Date(req.query.to) };

    const { data, pagination } = await paginate(HealthMetric, filter, {
      page: req.query.page, limit: req.query.limit, sort: { recordedAt: -1 },
    });
    return paginatedResponse(res, data, pagination);
  } catch (err) { next(err); }
};

const getMetricsByType = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);

    const limit = parseInt(req.query.limit) || 30;
    const metrics = await HealthMetric.find({ patient: patient._id, type: req.params.type }).sort({ recordedAt: -1 }).limit(limit);
    return successResponse(res, { metrics, type: req.params.type });
  } catch (err) { next(err); }
};

const getLatestMetrics = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);

    const types = ["blood_pressure", "blood_glucose", "weight", "heart_rate", "oxygen_saturation", "temperature"];
    const latestMetrics = await Promise.all(types.map((type) => HealthMetric.findOne({ patient: patient._id, type }).sort({ recordedAt: -1 })));
    const result = {};
    types.forEach((type, i) => { if (latestMetrics[i]) result[type] = latestMetrics[i]; });
    return successResponse(res, { metrics: result });
  } catch (err) { next(err); }
};

const deleteMetric = async (req, res, next) => {
  try {
    const metric = await HealthMetric.findByIdAndDelete(req.params.id);
    if (!metric) return errorResponse(res, "Metric not found.", 404);
    return successResponse(res, {}, "Metric deleted.");
  } catch (err) { next(err); }
};

module.exports = { addMetric, getMyMetrics, getMetricsByType, getLatestMetrics, deleteMetric };