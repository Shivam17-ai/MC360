/**
 * triageEngine.js
 * Rule-based triage engine that runs BEFORE the AI call.
 * Catches obvious emergency/urgent cases instantly without API cost.
 * The AI service is then called for nuanced analysis.
 */

// Red flag symptoms that always require emergency triage
const EMERGENCY_KEYWORDS = [
  "chest pain", "chest tightness", "heart attack", "cardiac arrest",
  "can't breathe", "difficulty breathing", "shortness of breath",
  "stroke", "facial drooping", "arm weakness", "speech difficulty",
  "unconscious", "not breathing", "no pulse",
  "severe bleeding", "uncontrolled bleeding",
  "anaphylaxis", "severe allergic reaction", "throat swelling",
  "seizure", "convulsion",
  "severe head injury", "head trauma",
  "poisoning", "overdose",
  "suicidal", "self harm",
];

const URGENT_KEYWORDS = [
  "high fever", "fever above 103", "fever above 39",
  "severe abdominal pain", "severe stomach pain",
  "blood in urine", "blood in stool", "coughing blood",
  "sudden severe headache", "worst headache",
  "confusion", "disorientation",
  "broken bone", "fracture",
  "deep cut", "deep wound",
  "high blood sugar", "diabetic",
  "severe vomiting", "can't keep water down",
  "chest discomfort", "palpitations",
];

/**
 * Run fast rule-based pre-triage before calling AI.
 * @param {Array} symptoms - Array of symptom objects or strings
 * @returns {{ triageLevel: string, redFlags: string[], skipAI: boolean }}
 */
const runPreTriage = (symptoms) => {
  const symptomText = symptoms
    .map((s) => (typeof s === "string" ? s : `${s.name || ""} ${s.severity || ""}`))
    .join(" ")
    .toLowerCase();

  const redFlags = [];

  for (const keyword of EMERGENCY_KEYWORDS) {
    if (symptomText.includes(keyword)) {
      redFlags.push(keyword);
    }
  }

  if (redFlags.length > 0) {
    return {
      triageLevel: "emergency",
      redFlags,
      skipAI: false, // still run AI for full analysis but we know it's emergency
      preTriageMessage: "⚠️ Emergency symptoms detected. Call emergency services immediately.",
    };
  }

  const urgentFlags = [];
  for (const keyword of URGENT_KEYWORDS) {
    if (symptomText.includes(keyword)) {
      urgentFlags.push(keyword);
    }
  }

  if (urgentFlags.length > 0) {
    return {
      triageLevel: "urgent",
      redFlags: urgentFlags,
      skipAI: false,
      preTriageMessage: "You should seek medical attention promptly.",
    };
  }

  return {
    triageLevel: null, // let AI decide
    redFlags: [],
    skipAI: false,
    preTriageMessage: null,
  };
};

/**
 * Calculate severity score from symptoms array (0-100).
 * Used for sorting and prioritization.
 */
const calculateSeverityScore = (symptoms) => {
  if (!symptoms || symptoms.length === 0) return 0;

  const severityWeights = { mild: 10, moderate: 40, severe: 80 };
  const count = symptoms.length;

  const total = symptoms.reduce((sum, s) => {
    const weight = severityWeights[s.severity?.toLowerCase()] || 10;
    return sum + weight;
  }, 0);

  // Cap at 100, factor in count
  const base = Math.min(total / count, 100);
  const countBonus = Math.min(count * 5, 20); // more symptoms = slightly higher score
  return Math.min(Math.round(base + countBonus), 100);
};

/**
 * Get recommended action string for a triage level.
 */
const getTriageAction = (triageLevel) => {
  const actions = {
    "self-care": "You can manage this at home. Rest, stay hydrated, and monitor your symptoms. See a doctor if symptoms worsen.",
    "see-doctor": "Schedule an appointment with your doctor within 1-2 days.",
    urgent: "Visit an urgent care clinic or doctor today. Do not delay.",
    emergency: "Call emergency services (112/911) or go to the nearest emergency room immediately.",
  };
  return actions[triageLevel] || actions["see-doctor"];
};

module.exports = {
  runPreTriage,
  calculateSeverityScore,
  getTriageAction,
  EMERGENCY_KEYWORDS,
  URGENT_KEYWORDS,
};