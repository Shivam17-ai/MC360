import mongoose from 'mongoose'

const riskPredictionSchema = new mongoose.Schema({
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },

  disease: {
    type: String,
    enum: ['diabetes', 'heart', 'obesity'],
    required: true,
  },

  features: { type: mongoose.Schema.Types.Mixed },

  result: {
    prediction:  Number,   // 0 or 1
    probability: Number,   // 0.0 - 1.0
    riskLevel:   String,   // 'Low', 'Moderate', 'High'
    message:     String,
  },

  predictedAt: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.model('RiskPrediction', riskPredictionSchema)