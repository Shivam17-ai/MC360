const mongoose = require('mongoose');

const EmergencyAlertSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  alertType: String,
  status: String,
}, { timestamps: true });

module.exports = mongoose.model('EmergencyAlert', EmergencyAlertSchema);
