const DietPlan = require("../models/DietPlan.model");
const Patient = require("../models/Patient.model");
const { generateDietPlan } = require("./ai.service");

const parseNumber = (val, defaultVal = 0) => {
  if (val === null || val === undefined) return defaultVal;
  if (typeof val === 'number') return isNaN(val) ? defaultVal : val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^\d\.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? defaultVal : parsed;
  }
  return defaultVal;
};

const normalizePlan = (plan, patientData) => {
  const normalized = {};

  normalized.title = plan.title || `${patientData.goal} Diet Plan`;
  normalized.totalCalories = parseNumber(plan.totalCalories || plan.totalCaloriesDaily || patientData.targetCalories || 2000);
  
  // Normalize macros
  const rawMacros = plan.macros || {};
  normalized.macros = {
    protein: parseNumber(rawMacros.protein, 60),
    carbs: parseNumber(rawMacros.carbs, 250),
    fat: parseNumber(rawMacros.fat, 50),
    fiber: parseNumber(rawMacros.fiber, 30),
  };

  // Normalize days
  const rawDays = Array.isArray(plan.days) ? plan.days : [];
  normalized.days = [];

  for (let i = 0; i < 7; i++) {
    const rawDay = rawDays[i] || {};
    const normalizedDay = {
      totalCalories: parseNumber(rawDay.totalCalories, normalized.totalCalories),
      breakfast: { name: "Healthy Breakfast", description: "Healthy Indian breakfast options", calories: 400 },
      lunch: { name: "Healthy Lunch", description: "Balanced Indian lunch with Dal, Sabzi & Roti", calories: 600 },
      snack: { name: "Healthy Evening Snack", description: "Roasted chana or green tea with nuts", calories: 200 },
      dinner: { name: "Healthy Dinner", description: "Light Indian dinner options", calories: 500 },
    };

    const mealKeys = ['breakfast', 'lunch', 'snack', 'dinner'];
    mealKeys.forEach(key => {
      if (rawDay[key]) {
        normalizedDay[key] = {
          name: rawDay[key].name || normalizedDay[key].name,
          description: rawDay[key].description || normalizedDay[key].description,
          calories: parseNumber(rawDay[key].calories, normalizedDay[key].calories),
        };
      }
    });

    normalized.days.push(normalizedDay);
  }

  normalized.notes = plan.notes || "";
  return normalized;
};

const createDietPlan = async (patientId, options = {}) => {
  const patient = await Patient.findById(patientId);
  if (!patient) throw Object.assign(new Error("Patient not found."), { statusCode: 404 });

  const patientData = {
    age: patient.age || 30,
    gender: patient.gender || "unknown",
    weight: options.weight || patient.weight || 70,
    height: options.height || patient.height || 170,
    goal: options.goal || "general-wellness",
    conditions: options.conditions || patient.chronicConditions || [],
    restrictions: options.restrictions || [],
    allergies: options.allergies || patient.allergies || [],
    dietType: options.dietType || "Vegetarian",
    targetCalories: options.targetCalories || 2000,
  };

  const rawPlan = await generateDietPlan(patientData);
  const plan = normalizePlan(rawPlan, patientData);

  // Deactivate previous plans
  await DietPlan.updateMany({ patient: patientId, isActive: true }, { isActive: false });

  const dietPlan = await DietPlan.create({
    patient: patientId,
    generatedBy: "ai",
    doctor: options.doctorId,
    title: plan.title,
    goal: patientData.goal,
    duration: options.duration || 7,
    totalCalories: plan.totalCalories,
    dailyCalorieTarget: plan.totalCalories,
    macros: plan.macros,
    restrictions: patientData.restrictions,
    days: plan.days,
    notes: plan.notes,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + (options.duration || 7) * 24 * 60 * 60 * 1000),
  });

  return dietPlan;
};

const getActiveDietPlan = async (patientId) => {
  return DietPlan.findOne({ patient: patientId, isActive: true }).sort({ createdAt: -1 });
};

const getDietHistory = async (patientId, limit = 10) => {
  return DietPlan.find({ patient: patientId }).sort({ createdAt: -1 }).limit(limit);
};

module.exports = { createDietPlan, getActiveDietPlan, getDietHistory };