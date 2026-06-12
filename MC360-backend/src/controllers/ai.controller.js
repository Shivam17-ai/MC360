const aiService = require("../services/ai.service");
const riskPredictionService = require("../services/riskPrediction.service");
const SymptomLog = require("../models/SymptomLog.model");
const Patient = require("../models/Patient.model");
const { successResponse, errorResponse } = require("../utils/response");

const analyzeSymptoms = async (req, res, next) => {
  try {
    const { symptoms, ...rest } = req.body;
    if (!symptoms || symptoms.length === 0) return errorResponse(res, "Symptoms are required.", 400);

    const patient = await Patient.findOne({ user: req.user._id });
    const patientInfo = {
      age: rest.age || patient?.age,
      gender: rest.gender || patient?.gender,
      ...rest
    };

    const analysis = await aiService.analyzeSymptoms(symptoms, patientInfo);

    if (patient) {
      await SymptomLog.create({
        patient: patient._id,
        symptoms: symptoms.map(s => (typeof s === 'string' ? { name: s } : s)),
        additionalInfo: rest,
        aiAnalysis: analysis,
        analyzedAt: new Date(),
      });
    }

    return successResponse(res, { analysis });
  } catch (err) { next(err); }
};

const getSymptomHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);
    const logs = await SymptomLog.find({ patient: patient._id }).sort({ createdAt: -1 }).limit(20);
    return successResponse(res, { logs });
  } catch (err) { next(err); }
};

const predictRisk = async (req, res, next) => {
  try {
    const { modelType, inputData } = req.body;
    if (!["diabetes", "heart", "obesity"].includes(modelType)) return errorResponse(res, "Invalid model type. Use: diabetes, heart, obesity.", 400);

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);

    const prediction = await riskPredictionService.predictRisk(patient._id, modelType, inputData);
    return successResponse(res, { prediction });
  } catch (err) { next(err); }
};

const getRiskHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);
    const history = await riskPredictionService.getPatientRiskHistory(patient._id, req.query.modelType, parseInt(req.query.limit) || 10);
    return successResponse(res, { history });
  } catch (err) { next(err); }
};

const summarizeReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const reportService = require("../services/report.service");
    const summary = await reportService.aiSummarizeReport(reportId);
    return successResponse(res, { summary });
  } catch (err) { next(err); }
};

const checkDrugInteractions = async (req, res, next) => {
  try {
    const { drugs } = req.body;
    if (!drugs || drugs.length < 2) return errorResponse(res, "At least 2 drugs required.", 400);
    const result = await aiService.checkDrugInteractions(drugs);
    return successResponse(res, { result });
  } catch (err) { next(err); }
};

const generateDietPlan = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);
    const dietService = require("../services/diet.service");
    const plan = await dietService.createDietPlan(patient._id, req.body);
    return successResponse(res, { plan });
  } catch (err) { next(err); }
};

const chatWithAI = async (req, res, next) => {
  try {
    const { messages, age, gender } = req.body;
    if (!messages || !Array.isArray(messages)) return errorResponse(res, "Messages array is required.", 400);

    const patient = await Patient.findOne({ user: req.user._id });
    const patientInfo = {
      age: age || patient?.age,
      gender: gender || patient?.gender,
      name: req.user.name,
    };

    const reply = await aiService.chatWithAI(messages, patientInfo);
    return successResponse(res, { reply });
  } catch (err) { next(err); }
};

module.exports = { analyzeSymptoms, getSymptomHistory, predictRisk, getRiskHistory, summarizeReport, checkDrugInteractions, generateDietPlan, chatWithAI };