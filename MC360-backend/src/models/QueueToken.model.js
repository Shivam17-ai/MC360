import mongoose from 'mongoose'

const queueTokenSchema = new mongoose.Schema({
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

  department:  { type: String },
  tokenNumber: { type: Number, required: true },
  tokenCode:   { type: String, required: true }, // 'A-042'

  status: {
    type:    String,
    enum:    ['waiting', 'called', 'completed', 'skipped'],
    default: 'waiting',
  },

  calledAt:    { type: Date },
  completedAt: { type: Date },
  notes:       { type: String },
}, { timestamps: true })

queueTokenSchema.index({ doctor: 1, tokenNumber: 1, createdAt: -1 })

export default mongoose.model('QueueToken', queueTokenSchema)