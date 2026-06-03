const mongoose = require('mongoose');

const RiskPredictionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  riskType: String,
  score: Number,
}, { timestamps: true });

module.exports = mongoose.model('RiskPrediction', RiskPredictionSchema);
