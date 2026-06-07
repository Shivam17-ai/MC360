import RiskPrediction from "../models/RiskPrediction.model.js";
import { predictDisease, SUPPORTED_DISEASES } from "./ai.service.js";

/**
 * Run prediction and save to DB
 */
export const runRiskPrediction = async (patientId, disease, inputParams) => {
  if (!SUPPORTED_DISEASES.includes(disease)) {
    throw new Error(`Disease must be one of: ${SUPPORTED_DISEASES.join(", ")}`);
  }

  // Call Flask ML
  const result = await predictDisease(disease, inputParams);

  // Save to DB
  const prediction = await RiskPrediction.create({
    patientId,
    predictionType: disease,
    inputParams,
    riskPercentage: result.riskPercentage,
    riskCategory: result.riskCategory,
    recommendations: result.recommendations,
    modelAccuracy: result.modelAccuracy || null,
  });

  return { prediction, mlResult: result };
};

/**
 * Get all predictions for a patient
 */
export const getPatientPredictions = async (patientId, disease = null) => {
  const query = { patientId };
  if (disease) query.predictionType = disease;

  return await RiskPrediction.find(query).sort({ createdAt: -1 });
};

/**
 * Get latest prediction per disease for a patient
 */
export const getLatestPredictions = async (patientId) => {
  const predictions = {};

  for (const disease of SUPPORTED_DISEASES) {
    const latest = await RiskPrediction.findOne({
      patientId,
      predictionType: disease,
    }).sort({ createdAt: -1 });

    if (latest) predictions[disease] = latest;
  }

  return predictions;
};