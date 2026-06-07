import mongoose from 'mongoose'

const symptomLogSchema = new mongoose.Schema({
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },

  symptoms: [{ type: String }],

  analysis: {
    possibleConditions:   [String],
    severity:             mongoose.Schema.Types.Mixed,
    recommendedSpecialist: String,
    action:               String,
    redFlags:             [String],
    disclaimer:           String,
  },

  notes:     { type: String },
  loggedAt:  { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.model('SymptomLog', symptomLogSchema)