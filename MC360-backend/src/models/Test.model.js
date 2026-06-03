const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  type: String,
  results: Object,
}, { timestamps: true });

module.exports = mongoose.model('Test', TestSchema);
