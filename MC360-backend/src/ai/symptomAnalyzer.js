const { analyzeSymptoms } = require("../services/ai.service");

/**
 * symptomAnalyzer.js
 * Wrapper around the AI service for symptom analysis.
 * Can be imported directly anywhere in the app.
 */

/**
 * Analyze a list of symptoms and return AI triage result.
 * @param {Array} symptoms - Array of symptom objects { name, severity, duration }
 * @param {Object} patientInfo - { age, gender, additionalInfo }
 * @returns {Object} analysis result
 */
const analyzePatientSymptoms = async (symptoms, patientInfo = {}) => {
  if (!symptoms || symptoms.length === 0) {
    return {
      possibleConditions: [],
      triageLevel: "see-doctor",
      urgency: "Insufficient symptom data provided.",
      recommendations: ["Please describe your symptoms in more detail.", "Consult a healthcare professional."],
      redFlags: [],
      disclaimer: "This is not a medical diagnosis. Always consult a qualified doctor.",
    };
  }

  return analyzeSymptoms(symptoms, patientInfo);
};

/**
 * Map triage level to a numeric urgency score (useful for sorting/alerts).
 * self-care=1, see-doctor=2, urgent=3, emergency=4
 */
const triageLevelToScore = (level) => {
  const map = { "self-care": 1, "see-doctor": 2, urgent: 3, emergency: 4 };
  return map[level] || 2;
};

/**
 * Determine if a triage result should trigger an emergency alert.
 */
const isEmergency = (analysisResult) => {
  return analysisResult?.triageLevel === "emergency";
};

/**
 * Determine if a triage result should trigger an urgent notification.
 */
const isUrgent = (analysisResult) => {
  return ["urgent", "emergency"].includes(analysisResult?.triageLevel);
};

module.exports = {
  analyzePatientSymptoms,
  triageLevelToScore,
  isEmergency,
  isUrgent,
};