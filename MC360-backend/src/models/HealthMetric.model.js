const mongoose = require('mongoose');

const HealthMetricSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  metrics: Object,
}, { timestamps: true });

module.exports = mongoose.model('HealthMetric', HealthMetricSchema);
