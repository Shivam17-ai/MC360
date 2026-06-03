const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: Object,
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
