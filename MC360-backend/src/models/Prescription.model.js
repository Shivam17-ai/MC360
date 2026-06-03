const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  medications: Array,
  instructions: String,
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
