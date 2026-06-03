const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: String,
  interactions: Array,
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema);
