const mongoose = require("mongoose");

const symptomLogSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    symptoms: [
      {
        name: String,
        severity: { type: String, enum: ["mild", "moderate", "severe"], default: "mild" },
        duration: String,
        bodyPart: String,
      },
    ],
    additionalInfo: {
      temperature: Number,
      pain: Number, // 1-10
      notes: String,
    },
    aiAnalysis: {
      summary: String,
      riskLevel: String,
      possibleConditions: [
        {
          name: String,
          probability: String,
          description: String,
        },
      ],
      recommendations: [String],
      remedies: [String],
      medicinesToAvoid: [String],
      disclaimer: String,
    },
    analyzedAt: Date,
    followedUp: { type: Boolean, default: false },
    appointmentCreated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SymptomLog", symptomLogSchema);