const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  medicalHistory: Array,
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
