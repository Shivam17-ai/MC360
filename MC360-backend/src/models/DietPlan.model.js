const mongoose = require('mongoose');

const DietPlanSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  meals: Array,
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', DietPlanSchema);
