const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  specialization: String,
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
