import axios from "axios";
import env from "../config/env.js";

const ML_URL = env.ML_SERVICE_URL;

// ── Supported disease types ───────────────────────────────────────────────
export const SUPPORTED_DISEASES = ["diabetes", "heart", "obesity"];

/**
 * Call Flask ML microservice for risk prediction
 * @param {string} disease - "diabetes" | "heart" | "obesity"
 * @param {object} inputData - feature key-value pairs
 */
export const predictDisease = async (disease, inputData) => {
  if (!SUPPORTED_DISEASES.includes(disease)) {
    throw new Error(`Unsupported disease type. Supported: ${SUPPORTED_DISEASES.join(", ")}`);
  }

  try {
    const response = await axios.post(
      `${ML_URL}/predict/${disease}`,
      inputData,
      { timeout: 10000 }
    );
    return response.data;
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      throw new Error("ML service is unavailable. Please try again later.");
    }
    throw new Error(error.response?.data?.error || "Prediction failed");
  }
};

/**
 * Check Flask ML service health
 */
export const checkMLHealth = async () => {
  try {
    const response = await axios.get(`${ML_URL}/health`, { timeout: 5000 });
    return response.data;
  } catch {
    return { status: "unavailable", models: {} };
  }
};

/**
 * Get all available models and their features from Flask
 */
export const getMLModels = async () => {
  try {
    const response = await axios.get(`${ML_URL}/models`, { timeout: 5000 });
    return response.data;
  } catch {
    return { available: SUPPORTED_DISEASES, features: {} };
  }
};

/**
 * Symptom analysis — rule-based triage engine
 * @param {string[]} symptoms
 * @param {string} severity - "mild" | "moderate" | "severe"
 */
export const analyzeSymptoms = (symptoms, severity = "mild") => {
  const lowerSymptoms = symptoms.map((s) => s.toLowerCase());

  // ── Critical keywords ──────────────────────────────────────────────
  const critical = ["chest pain", "difficulty breathing", "unconscious", "seizure", "stroke", "heart attack"];
  const high     = ["severe headache", "high fever", "vomiting blood", "sudden vision loss", "severe pain"];
  const moderate = ["fever", "persistent cough", "dizziness", "fatigue", "nausea", "headache"];

  let triageLevel = "low";
  let specialization = "General Physician";
  let urgency = "Within a week";

  const hasCritical = lowerSymptoms.some((s) => critical.some((c) => s.includes(c)));
  const hasHigh     = lowerSymptoms.some((s) => high.some((h) => s.includes(h)));
  const hasModerate = lowerSymptoms.some((s) => moderate.some((m) => s.includes(m)));

  if (hasCritical || severity === "severe") {
    triageLevel    = "critical";
    urgency        = "Go to ER immediately";
    specialization = "Emergency Medicine";
  } else if (hasHigh || severity === "moderate") {
    triageLevel    = "high";
    urgency        = "See doctor today";
    specialization = getSpecialization(lowerSymptoms);
  } else if (hasModerate) {
    triageLevel    = "moderate";
    urgency        = "Within 24-48 hours";
    specialization = getSpecialization(lowerSymptoms);
  }

  return {
    triageLevel,
    specialization,
    urgency,
    analyzedSymptoms: symptoms,
    recommendation: getRecommendation(triageLevel),
  };
};

const getSpecialization = (symptoms) => {
  if (symptoms.some((s) => s.includes("chest") || s.includes("heart"))) return "Cardiologist";
  if (symptoms.some((s) => s.includes("breath") || s.includes("cough"))) return "Pulmonologist";
  if (symptoms.some((s) => s.includes("stomach") || s.includes("abdomen"))) return "Gastroenterologist";
  if (symptoms.some((s) => s.includes("head") || s.includes("neuro"))) return "Neurologist";
  if (symptoms.some((s) => s.includes("skin") || s.includes("rash"))) return "Dermatologist";
  if (symptoms.some((s) => s.includes("joint") || s.includes("bone"))) return "Orthopedist";
  return "General Physician";
};

const getRecommendation = (triageLevel) => {
  const map = {
    low:      "Monitor symptoms at home. Visit a doctor if symptoms worsen.",
    moderate: "Schedule an appointment within 24-48 hours.",
    high:     "See a doctor today. Do not delay.",
    critical: "Go to the emergency room immediately or call 112.",
  };
  return map[triageLevel] || map["low"];
};