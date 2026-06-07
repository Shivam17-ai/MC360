import mongoose from 'mongoose'

const emergencyAlertSchema = new mongoose.Schema({
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Hospital',
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
  },

  type: {
    type: String,
    enum: ['cardiac', 'accident', 'fall', 'breathing', 'other'],
    default: 'other',
  },

  description: { type: String },

  location: {
    address:   String,
    latitude:  Number,
    longitude: Number,
  },

  status: {
    type:    String,
    enum:    ['active', 'acknowledged', 'resolved'],
    default: 'active',
  },

  triggeredAt: { type: Date, default: Date.now },
  resolvedAt:  { type: Date },
}, { timestamps: true })

export default mongoose.model('EmergencyAlert', emergencyAlertSchema)