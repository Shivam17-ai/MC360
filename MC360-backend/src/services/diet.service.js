import DietPlan from "../models/DietPlan.model.js";
import Patient from "../models/Patient.model.js";

/**
 * Calculate BMR using Mifflin-St Jeor equation
 */
const calculateBMR = (weight, height, age, gender) => {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
};

/**
 * Get activity multiplier
 */
const getActivityMultiplier = (activityLevel) => {
  const map = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return map[activityLevel] || 1.375;
};

/**
 * Generate meal plan based on calories and preferences
 */
const generateMeals = (dailyCalories, isVegetarian, goal) => {
  const mealSplit = { breakfast: 0.25, lunch: 0.35, dinner: 0.30, snack: 0.10 };

  const vegBreakfast  = ["Oatmeal with fruits", "Poha with vegetables", "Idli with sambar", "Whole wheat toast with peanut butter"];
  const vegLunch      = ["Dal rice with vegetables", "Rajma chawal", "Paneer sabzi with roti", "Mixed vegetable khichdi"];
  const vegDinner     = ["Moong dal with roti", "Vegetable soup with bread", "Palak paneer with rice", "Tofu stir fry"];
  const nonVegBreakfast = ["Egg omelette with toast", "Boiled eggs with fruit", "Chicken sandwich", "Greek yogurt with nuts"];
  const nonVegLunch   = ["Grilled chicken with salad", "Fish curry with rice", "Egg fried rice", "Chicken roti wrap"];
  const nonVegDinner  = ["Grilled fish with vegetables", "Chicken soup", "Baked chicken with salad", "Prawn curry with rice"];
  const snacks        = ["Handful of nuts", "Fruits", "Greek yogurt", "Protein bar", "Roasted chana"];

  const bf = isVegetarian ? vegBreakfast : nonVegBreakfast;
  const lu = isVegetarian ? vegLunch : nonVegLunch;
  const di = isVegetarian ? vegDinner : nonVegDinner;

  return [
    { time: "08:00 AM", label: "Breakfast", foods: [bf[Math.floor(Math.random() * bf.length)]], calories: Math.round(dailyCalories * mealSplit.breakfast) },
    { time: "01:00 PM", label: "Lunch",     foods: [lu[Math.floor(Math.random() * lu.length)]], calories: Math.round(dailyCalories * mealSplit.lunch) },
    { time: "07:00 PM", label: "Dinner",    foods: [di[Math.floor(Math.random() * di.length)]], calories: Math.round(dailyCalories * mealSplit.dinner) },
    { time: "04:00 PM", label: "Snack",     foods: [snacks[Math.floor(Math.random() * snacks.length)]], calories: Math.round(dailyCalories * mealSplit.snack) },
  ];
};

/**
 * Generate full diet plan for a patient
 */
export const generateDietPlan = async (patientId, { goal, activityLevel, isVegetarian, chronicConditions }) => {
  const patient = await Patient.findOne({ userId: patientId });
  if (!patient) throw new Error("Patient profile not found");

  const { weight, height, dob, gender } = patient;
  if (!weight || !height || !dob) throw new Error("Complete patient profile required (weight, height, DOB)");

  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  const bmr = calculateBMR(weight, height, age, gender || "male");
  const tdee = bmr * getActivityMultiplier(activityLevel);

  let dailyCalories = tdee;
  if (goal === "loss")   dailyCalories = tdee - 500;
  if (goal === "gain")   dailyCalories = tdee + 500;

  dailyCalories = Math.round(dailyCalories);

  // Macros
  const protein = Math.round((dailyCalories * 0.30) / 4);   // 30% protein
  const carbs   = Math.round((dailyCalories * 0.45) / 4);   // 45% carbs
  const fat     = Math.round((dailyCalories * 0.25) / 9);   // 25% fat

  const meals = generateMeals(dailyCalories, isVegetarian, goal);

  // Save or update
  const dietPlan = await DietPlan.findOneAndUpdate(
    { patientId },
    {
      patientId,
      goal,
      bmr: Math.round(bmr),
      dailyCalories,
      macros: { protein, carbs, fat },
      meals,
      isVegetarian,
      generatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return dietPlan;
};

/**
 * Get existing diet plan
 */
export const getDietPlan = async (patientId) => {
  const plan = await DietPlan.findOne({ patientId });
  if (!plan) throw new Error("No diet plan found. Please generate one first.");
  return plan;
};