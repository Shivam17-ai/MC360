import mongoose from 'mongoose'

const dietPlanSchema = new mongoose.Schema({
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },

  input: { type: mongoose.Schema.Types.Mixed }, // patient profile used to generate

  plan: {
    totalCalories: Number,
    macros: {
      protein: String,
      carbs:   String,
      fats:    String,
      fiber:   String,
    },
    meals: {
      earlyMorning: mongoose.Schema.Types.Mixed,
      breakfast:    mongoose.Schema.Types.Mixed,
      midMorning:   mongoose.Schema.Types.Mixed,
      lunch:        mongoose.Schema.Types.Mixed,
      evening:      mongoose.Schema.Types.Mixed,
      dinner:       mongoose.Schema.Types.Mixed,
    },
    hydration:   String,
    avoidFoods:  [String],
    tips:        [String],
    disclaimer:  String,
  },

  isActive:   { type: Boolean, default: true },
  generatedBy:{ type: String, default: 'gemini-ai' },
}, { timestamps: true })

export default mongoose.model('DietPlan', dietPlanSchema)