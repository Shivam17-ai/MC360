const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    resource: String,
    resourceId: String,
    method: String,
    url: String,
    ip: String,
    userAgent: String,
    statusCode: Number,
    duration: Number, // ms
    changes: { type: mongoose.Schema.Types.Mixed },
    error: String,
  },
  { timestamps: true }
);

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);