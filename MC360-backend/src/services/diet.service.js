const DietPlan = require("../models/DietPlan.model");
const Patient = require("../models/Patient.model");
const { generateDietPlan } = require("./ai.service");

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

  const plan = await generateDietPlan(patientData);

  // Deactivate previous plans
  await DietPlan.updateMany({ patient: patientId, isActive: true }, { isActive: false });

  const dietPlan = await DietPlan.create({
    patient: patientId,
    generatedBy: "ai",
    doctor: options.doctorId,
    title: plan.title || `${patientData.goal} Diet Plan`,
    goal: patientData.goal,
    duration: options.duration || 7,
    totalCalories: plan.totalCalories,
    dailyCalorieTarget: plan.dailyCalorieTarget || plan.totalCalories,
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