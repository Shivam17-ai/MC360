import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },

  type: {
    type: String,
    enum: [
      'appointment_booked',
      'appointment_confirmed',
      'appointment_cancelled',
      'appointment_reminder',
      'medicine_reminder',
      'report_ready',
      'emergency_alert',
      'queue_called',
      'prescription_added',
      'general',
    ],
    default: 'general',
  },

  title:   { type: String, required: true },
  message: { type: String, required: true },
  isRead:  { type: Boolean, default: false },

  data: { type: mongoose.Schema.Types.Mixed }, // extra context (appointmentId, etc.)
}, { timestamps: true })

notificationSchema.index({ user: 1, isRead: 1 })

export default mongoose.model('Notification', notificationSchema)