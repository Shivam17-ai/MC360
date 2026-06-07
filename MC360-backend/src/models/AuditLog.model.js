import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
  },

  action:   { type: String, required: true }, // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
  resource: { type: String },                 // 'Appointment', 'Report', etc.
  resourceId:{ type: mongoose.Schema.Types.ObjectId },

  description: { type: String },

  ip:        { type: String },
  userAgent: { type: String },

  status:    { type: String, enum: ['success', 'failure'], default: 'success' },
  metadata:  { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

auditLogSchema.index({ user: 1, createdAt: -1 })
auditLogSchema.index({ resource: 1, resourceId: 1 })

export default mongoose.model('AuditLog', auditLogSchema)