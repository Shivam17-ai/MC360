const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  time: String,
  name: String,
  items: [
    {
      food: String,
      quantity: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
  ],
  totalCalories: Number,
});

const dietPlanSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    generatedBy: { type: String, enum: ["ai", "doctor", "nutritionist"], default: "ai" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    title: String,
    goal: {
      type: String,
      enum: ["Weight Loss", "Weight Gain", "Muscle Building", "Diabetes Management", "Heart Health", "General Wellness", "muscle-gain", "weight-loss", "weight-gain", "diabetes-management", "heart-health", "general-wellness"],
      default: "General Wellness",
    },
    duration: Number, // days
    totalCalories: Number,
    dailyCalorieTarget: Number,
    macros: {
      protein: Number,  // grams
      carbs: Number,
      fat: Number,
      fiber: Number,
    },
    restrictions: [String], // ["gluten-free", "vegetarian"]
    days: [
      {
        totalCalories: Number,
        breakfast: { name: String, description: String, calories: Number },
        lunch: { name: String, description: String, calories: Number },
        snack: { name: String, description: String, calories: Number },
        dinner: { name: String, description: String, calories: Number },
      },
    ],
    notes: String,
    isActive: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DietPlan", dietPlanSchema);