import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  doctor: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Doctor',
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Hospital',
  },

  date:   { type: String, required: true }, // 'YYYY-MM-DD'
  time:   { type: String, required: true }, // '10:30 AM'
  type:   { type: String, enum: ['in-person', 'video', 'phone'], default: 'in-person' },
  reason: { type: String },

  status: {
    type:    String,
    enum:    ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending',
  },

  cancelReason: { type: String },

  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Prescription',
  },

  videoSessionId: { type: String },
  notes:          { type: String },
  fee:            { type: Number },
  isPaid:         { type: Boolean, default: false },
}, { timestamps: true })

// Index for slot conflict check
appointmentSchema.index({ doctor: 1, date: 1, time: 1 })

export default mongoose.model('Appointment', appointmentSchema)