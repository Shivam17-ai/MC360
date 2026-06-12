const RiskPrediction = require("../models/RiskPrediction.model");
const { predict, getRiskLevel, getDefaultRecommendations } = require("../ai/riskPredictor");
const logger = require("../utils/logger");

/**
 * riskPrediction.service.js
 *
 * Calls riskPredictor.js (which calls your predict_api.py),
 * then saves the result to MongoDB.
 *
 * predict_api.py response shapes:
 *   Diabetes : { prediction: 0|1,      risk_score: 0-100 }
 *   Heart    : { prediction: 0|1,      risk_score: 0-100 }
 *   Obesity  : { prediction: "label",  risk_score: 0-100 }
 */

const predictRisk = async (patientId, modelType, inputData) => {
  // calls predict_api.py and normalises the response
  const result = await predict(modelType, inputData);

  const prediction = await RiskPrediction.create({
    patient:      patientId,
    modelType,
    inputData,
    result: {
      riskScore:       result.riskScore,
      riskLevel:       result.riskLevel,
      probability:     result.probability,
      recommendations: result.recommendations,
      factors:         result.factors || [],
      // store the raw label for obesity ("Obesity_Type_II") or "Positive"/"Negative" for others
      predictionLabel: result.predictionLabel,
    },
    modelVersion: result.modelVersion,
  });

  return prediction;
};

const getPatientRiskHistory = async (patientId, modelType = null, limit = 10) => {
  const filter = { patient: patientId };
  if (modelType) filter.modelType = modelType;

  return RiskPrediction.find(filter)
    .sort({ predictedAt: -1 })
    .limit(limit);
};

module.exports = { predictRisk, getPatientRiskHistory };