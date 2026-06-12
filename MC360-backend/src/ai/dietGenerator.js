const { generateDietPlan } = require("../services/ai.service");
const logger = require("../utils/logger");

/**
 * dietGenerator.js
 * Handles diet plan generation with pre-processing of patient data
 * and post-processing of the AI response.
 */

// Daily calorie targets by goal and gender (approximate)
const CALORIE_TARGETS = {
  "weight-loss":          { male: 1800, female: 1500 },
  "weight-gain":          { male: 3000, female: 2500 },
  "diabetes-management":  { male: 1800, female: 1600 },
  "heart-health":         { male: 2000, female: 1700 },
  "general-wellness":     { male: 2200, female: 1900 },
  "muscle-gain":          { male: 3200, female: 2600 },
};

// BMI-based calorie adjustments
const getBMIAdjustment = (bmi) => {
  if (!bmi) return 0;
  if (bmi > 35) return -300;
  if (bmi > 30) return -200;
  if (bmi < 18.5) return +300;
  return 0;
};

/**
 * Calculate BMR using Mifflin-St Jeor equation.
 */
const calculateBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age) return null;
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "female" ? base - 161 : base + 5;
};

/**
 * Estimate TDEE (Total Daily Energy Expenditure).
 * activity: sedentary | light | moderate | active | very-active
 */
const calculateTDEE = (bmr, activity = "moderate") => {
  if (!bmr) return null;
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very-active": 1.9,
  };
  return Math.round(bmr * (multipliers[activity] || 1.55));
};

/**
 * Build enriched patient data object for the AI diet prompt.
 */
const buildPatientDataForAI = (patient, options = {}) => {
  const bmi = patient.bmi || (patient.weight && patient.height
    ? parseFloat((patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1))
    : null);

  const bmr = calculateBMR(
    options.weight || patient.weight,
    options.height || patient.height,
    patient.age,
    patient.gender
  );

  const tdee = calculateTDEE(bmr, options.activityLevel);

  return {
    age: patient.age || 30,
    gender: patient.gender || "unknown",
    weight: options.weight || patient.weight || 70,
    height: options.height || patient.height || 170,
    bmi,
    bmr,
    tdee,
    goal: options.goal || "general-wellness",
    conditions: options.conditions || patient.chronicConditions || [],
    restrictions: options.restrictions || [],
    allergies: options.allergies || patient.allergies || [],
    activityLevel: options.activityLevel || "moderate",
    mealsPerDay: options.mealsPerDay || 3,
    cuisine: options.cuisine || "balanced",
    targetCalories: options.targetCalories || tdee || CALORIE_TARGETS[options.goal || "general-wellness"]?.male || 2000,
  };
};

/**
 * Validate that a generated diet plan has the expected structure.
 * Returns true if valid, false if malformed.
 */
const validateDietPlan = (plan) => {
  if (!plan) return false;
  if (!plan.weeklyPlan || !Array.isArray(plan.weeklyPlan)) return false;
  if (plan.weeklyPlan.length === 0) return false;
  if (!plan.dailyCalorieTarget) return false;
  return true;
};

/**
 * Full diet generation pipeline.
 * @param {Object} patient - Patient document from DB (with user populated)
 * @param {Object} options - User-provided options (goal, restrictions, etc.)
 * @returns {Object} Generated diet plan
 */
const generatePlanForPatient = async (patient, options = {}) => {
  const patientData = buildPatientDataForAI(patient, options);

  logger.info(`Generating ${patientData.goal} diet plan for patient ${patient._id}`);

  const plan = await generateDietPlan(patientData);

  if (!validateDietPlan(plan)) {
    logger.warn(`AI returned invalid diet plan structure for patient ${patient._id}`);
    throw Object.assign(new Error("Diet plan generation failed. Please try again."), { statusCode: 500 });
  }

  return {
    ...plan,
    metadata: {
      generatedAt: new Date(),
      patientBMI: patientData.bmi,
      patientBMR: patientData.bmr,
      estimatedTDEE: patientData.tdee,
      activityLevel: patientData.activityLevel,
    },
  };
};

/**
 * Get a simple nutritional summary string for a day's meal plan.
 */
const getDaySummary = (dayPlan) => {
  if (!dayPlan?.meals) return "";
  const totalCal = dayPlan.meals.reduce((sum, m) => sum + (m.totalCalories || 0), 0);
  const mealNames = dayPlan.meals.map((m) => m.name).join(", ");
  return `${dayPlan.day}: ${totalCal} kcal — ${mealNames}`;
};

module.exports = {
  generatePlanForPatient,
  buildPatientDataForAI,
  calculateBMR,
  calculateTDEE,
  getBMIAdjustment,
  validateDietPlan,
  getDaySummary,
  CALORIE_TARGETS,
};