const dietService = require("../services/diet.service");
const DietPlan = require("../models/DietPlan.model");
const Patient = require("../models/Patient.model");
const { successResponse, errorResponse } = require("../utils/response");

const generatePlan = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);
    const plan = await dietService.createDietPlan(patient._id, req.body);
    return successResponse(res, { plan }, "Diet plan generated.", 201);
  } catch (err) { next(err); }
};

const getActivePlan = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);
    const plan = await dietService.getActiveDietPlan(patient._id);
    return successResponse(res, { plan });
  } catch (err) { next(err); }
};

const getPlanHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);
    const plans = await dietService.getDietHistory(patient._id, parseInt(req.query.limit) || 10);
    return successResponse(res, { plans });
  } catch (err) { next(err); }
};

const getPlanById = async (req, res, next) => {
  try {
    const plan = await DietPlan.findById(req.params.id).populate({ path: "doctor", populate: { path: "user", select: "name" } });
    if (!plan) return errorResponse(res, "Diet plan not found.", 404);
    return successResponse(res, { plan });
  } catch (err) { next(err); }
};

const deactivatePlan = async (req, res, next) => {
  try {
    const plan = await DietPlan.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!plan) return errorResponse(res, "Diet plan not found.", 404);
    return successResponse(res, {}, "Diet plan deactivated.");
  } catch (err) { next(err); }
};

module.exports = { generatePlan, getActivePlan, getPlanHistory, getPlanById, deactivatePlan };