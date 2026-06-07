import mongoose from 'mongoose'

const drugInteractionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
  },

  checkedDrugs: [{ type: String }],

  result: {
    interactions: [
      {
        drug1:          String,
        drug2:          String,
        severity:       { type: String, enum: ['Major', 'Moderate', 'Minor', 'None'] },
        effect:         String,
        mechanism:      String,
        recommendation: String,
      }
    ],
    overallRisk: { type: String, enum: ['Safe', 'Caution', 'Avoid'] },
    summary:     String,
    disclaimer:  String,
  },

  checkedAt: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.model('DrugInteraction', drugInteractionSchema)