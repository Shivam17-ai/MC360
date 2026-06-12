const mongoose = require("mongoose");

const drugInteractionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    drugs: [{ type: String, required: true }],
    interactions: [
      {
        drug1: String,
        drug2: String,
        severity: { type: String, enum: ["mild", "moderate", "severe", "contraindicated"] },
        description: String,
        clinicalEffect: String,
        recommendation: String,
      },
    ],
    hasInteractions: { type: Boolean, default: false },
    checkedAt: { type: Date, default: Date.now },
    checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    source: { type: String, default: "ai" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DrugInteraction", drugInteractionSchema);