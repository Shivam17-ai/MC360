const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
  summary: String,
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
