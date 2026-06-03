const mongoose = require('mongoose');

const DrugInteractionSchema = new mongoose.Schema({
  medicines: Array,
  severity: String,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('DrugInteraction', DrugInteractionSchema);
