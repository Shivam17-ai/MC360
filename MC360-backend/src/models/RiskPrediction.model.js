const mongoose = require("mongoose");

const riskPredictionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    modelType: {
      type: String,
      enum: ["diabetes", "heart", "obesity"],
      required: true,
    },
    inputData: { type: mongoose.Schema.Types.Mixed },
    result: {
      riskScore: Number,        // 0-100
      riskLevel: {
        type: String,
        enum: ["low", "moderate", "high", "critical"],
      },
      probability: Number,      // 0-1
      recommendations: [String],
      factors: [
        {
          factor: String,
          impact: String,
          value: mongoose.Schema.Types.Mixed,
        },
      ],
    },
    predictedAt: { type: Date, default: Date.now },
    modelVersion: String,
    isAcknowledged: { type: Boolean, default: false },
    doctorReviewed: { type: Boolean, default: false },
    doctorNotes: String,
  },
  { timestamps: true }
);

riskPredictionSchema.index({ patient: 1, modelType: 1, predictedAt: -1 });

module.exports = mongoose.model("RiskPrediction", riskPredictionSchema);