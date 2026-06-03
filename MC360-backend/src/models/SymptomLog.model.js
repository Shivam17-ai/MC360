const mongoose = require('mongoose');

const SymptomLogSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  symptoms: Array,
}, { timestamps: true });

module.exports = mongoose.model('SymptomLog', SymptomLogSchema);
