const axios = require("axios");
const env = require("../config/env");
const logger = require("../utils/logger");

/**
 * riskPredictor.js
 * Interface to the Python ML model API (predict_api.py).
 *
 * Your predict_api.py runs on port 5001 and returns:
 *   Diabetes : { prediction: 0|1,        risk_score: 0-100 }
 *   Heart    : { prediction: 0|1,        risk_score: 0-100 }
 *   Obesity  : { prediction: "string",   risk_score: 0-100 }  (multiclass)
 */

// ── Exact feature keys your predict_api.py expects ───────────────────────────

const DIABETES_FEATURES = [
  "Pregnancies",
  "Glucose",
  "BloodPressure",
  "SkinThickness",
  "Insulin",
  "BMI",
  "DiabetesPedigreeFunction",
  "Age",
];

const HEART_FEATURES = [
  "age",
  "sex",
  "cp",
  "trestbps",
  "chol",
  "fbs",
  "restecg",
  "thalach",
  "exang",
  "oldpeak",
  "slope",
  "ca",
  "thal",
];

// Obesity features come from the model payload itself (OBESITY_FEATURES in predict_api.py).
// The frontend must send the correct keys. We validate only that the object is not empty.
const OBESITY_REQUIRED = [
  "Gender",
  "Age",
  "Height",
  "Weight",
  "family_history_with_overweight",
  "FAVC",
  "FCVC",
  "NCP",
  "CAEC",
  "SMOKE",
  "CH2O",
  "SCC",
  "FAF",
  "TUE",
  "CALC",
  "MTRANS",
];

// ── Obesity label → risk score mapping ───────────────────────────────────────
// Your obesity model returns a string label, not a probability.
// We map each label to a numeric risk score for storage and display.
const OBESITY_LABEL_TO_RISK = {
  Insufficient_Weight:     10,
  Normal_Weight:           15,
  Overweight_Level_I:      35,
  Overweight_Level_II:     50,
  Obesity_Type_I:          65,
  Obesity_Type_II:         80,
  Obesity_Type_III:        95,
};

// ── Required field validators per model ──────────────────────────────────────
const REQUIRED_FIELDS = {
  diabetes: DIABETES_FEATURES,
  heart:    HEART_FEATURES,
  obesity:  OBESITY_REQUIRED,
};

/**
 * Validate that inputData contains all required fields for the given model.
 * Throws 400 if any are missing.
 */
const validateModelInput = (modelType, inputData) => {
  const required = REQUIRED_FIELDS[modelType] || [];
  const missing = required.filter(
    (f) => inputData[f] === undefined || inputData[f] === null || inputData[f] === ""
  );
  if (missing.length > 0) {
    throw Object.assign(
      new Error(`Missing required fields for ${modelType} model: ${missing.join(", ")}`),
      { statusCode: 400 }
    );
  }
};

/**
 * Call the Python predict_api.py endpoint.
 * Handles connection errors with a clear message.
 */
const callMLPredict = async (modelType, inputData) => {
  try {
    const response = await axios.post(
      `${env.ML_API_URL}/predict/${modelType}`,
      inputData,
      { timeout: 30000, headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      throw Object.assign(
        new Error("ML model server is not running. Start predict_api.py with: python predict_api.py"),
        { statusCode: 503 }
      );
    }
    logger.error(`ML API error (${modelType}): ${err.message}`);
    throw Object.assign(
      new Error(`ML prediction failed: ${err.response?.data?.error || err.message}`),
      { statusCode: 503 }
    );
  }
};

/**
 * Parse the raw response from predict_api.py into a standardised result object.
 *
 * Diabetes / Heart response : { prediction: 0|1,      risk_score: 0-100 }
 * Obesity response          : { prediction: "label",  risk_score: 0-100 }
 */
const buildPredictionResult = (mlResponse, modelType) => {
  let riskScore, probability, predictionLabel;

  if (modelType === "obesity") {
    // Multiclass — prediction is a string label like "Obesity_Type_II"
    predictionLabel = mlResponse.prediction;
    riskScore       = mlResponse.risk_score ?? OBESITY_LABEL_TO_RISK[predictionLabel] ?? 50;
    probability     = riskScore / 100;
  } else {
    // Binary — prediction is 0 or 1
    riskScore   = mlResponse.risk_score ?? 0;
    probability = riskScore / 100;
    predictionLabel = mlResponse.prediction === 1 ? "Positive" : "Negative";
  }

  const riskLevel = getRiskLevel(probability);
  const recommendations = getDefaultRecommendations(modelType, riskLevel);

  return {
    riskScore:       Math.round(riskScore),
    riskLevel,
    probability:     parseFloat(probability.toFixed(4)),
    predictionLabel,
    recommendations,
    factors:         [],
    modelVersion:    "1.0",
  };
};

/**
 * Convert probability (0-1) to a risk level string.
 */
const getRiskLevel = (probability) => {
  if (probability < 0.2)  return "low";
  if (probability < 0.5)  return "moderate";
  if (probability < 0.75) return "high";
  return "critical";
};

/**
 * Default recommendations per model type and risk level.
 */
const getDefaultRecommendations = (modelType, riskLevel) => {
  const base = {
    diabetes: {
      low:      ["Maintain healthy weight", "Exercise 30 min/day", "Limit sugar intake", "Annual blood glucose check"],
      moderate: ["Consult your doctor about blood sugar monitoring", "Adopt a low-glycemic diet", "Increase physical activity", "Reduce refined carbohydrates"],
      high:     ["See a doctor immediately for HbA1c test", "Strict dietary changes required", "Monitor blood glucose daily", "Consider diabetes prevention program"],
      critical: ["Urgent medical consultation required", "Immediate blood glucose testing", "Medical intervention likely needed"],
    },
    heart: {
      low:      ["Regular cardiovascular exercise", "Heart-healthy diet (less saturated fat)", "No smoking", "Annual blood pressure check"],
      moderate: ["Consult cardiologist", "Monitor blood pressure weekly", "Mediterranean diet recommended", "Limit salt and alcohol"],
      high:     ["Seek cardiology consultation soon", "ECG and lipid panel recommended", "Strict lifestyle changes needed", "Monitor symptoms closely"],
      critical: ["Seek immediate medical care", "Cardiology evaluation urgent", "Medication may be required"],
    },
    obesity: {
      low:      ["Maintain current healthy weight", "Stay physically active", "Balanced diet with whole foods", "Annual BMI check"],
      moderate: ["Aim to reduce weight by 5-10%", "Increase daily steps to 10,000", "Reduce caloric intake by 500 kcal/day", "Consult a nutritionist"],
      high:     ["Consult a doctor for a weight management plan", "Consider supervised diet program", "Regular exercise under guidance", "Screen for related conditions"],
      critical: ["Immediate medical consultation for obesity management", "Bariatric evaluation may be considered", "Supervised medical weight loss program required"],
    },
  };
  return base[modelType]?.[riskLevel] || ["Consult your healthcare provider for personalised advice."];
};

/**
 * Full prediction pipeline:
 *   1. Validate input fields
 *   2. Call Python predict_api.py
 *   3. Parse and return standardised result
 */
const predict = async (modelType, inputData) => {
  validateModelInput(modelType, inputData);
  const mlResponse = await callMLPredict(modelType, inputData);
  return buildPredictionResult(mlResponse, modelType);
};

module.exports = {
  predict,
  callMLPredict,
  buildPredictionResult,
  validateModelInput,
  getRiskLevel,
  getDefaultRecommendations,
  DIABETES_FEATURES,
  HEART_FEATURES,
  OBESITY_REQUIRED,
  OBESITY_LABEL_TO_RISK,
};