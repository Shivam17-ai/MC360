const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
}, { timestamps: true });

module.exports = mongoose.model('Hospital', HospitalSchema);
