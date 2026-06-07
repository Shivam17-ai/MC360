import mongoose from 'mongoose'

const healthMetricSchema = new mongoose.Schema({
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },

  type: {
    type: String,
    enum: [
      'blood_pressure',
      'blood_sugar',
      'weight',
      'height',
      'heart_rate',
      'oxygen_saturation',
      'temperature',
      'cholesterol',
      'bmi',
      'steps',
    ],
    required: true,
  },

  value:      { type: mongoose.Schema.Types.Mixed, required: true },
  // For BP: { systolic: 120, diastolic: 80 }
  // For others: single number

  unit:       { type: String },
  notes:      { type: String },
  recordedAt: { type: Date, default: Date.now },
  source:     { type: String, enum: ['manual', 'device', 'lab'], default: 'manual' },
}, { timestamps: true })

healthMetricSchema.index({ patient: 1, type: 1, recordedAt: -1 })

export default mongoose.model('HealthMetric', healthMetricSchema)