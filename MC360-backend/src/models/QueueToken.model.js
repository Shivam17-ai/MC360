const mongoose = require('mongoose');

const QueueTokenSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  tokenNumber: Number,
  status: String,
}, { timestamps: true });

module.exports = mongoose.model('QueueToken', QueueTokenSchema);
