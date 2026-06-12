const mongoose = require("mongoose");

const healthMetricSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    type: {
      type: String,
      enum: [
        "blood_pressure",
        "blood_glucose",
        "weight",
        "height",
        "bmi",
        "heart_rate",
        "oxygen_saturation",
        "temperature",
        "cholesterol",
        "hemoglobin",
        "custom",
      ],
      required: true,
    },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    // For BP: { systolic: 120, diastolic: 80 }
    // For others: single number
    unit: { type: String },
    recordedAt: { type: Date, default: Date.now },
    notes: String,
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    source: {
      type: String,
      enum: ["manual", "device", "doctor", "lab"],
      default: "manual",
    },
    isAbnormal: { type: Boolean, default: false },
    abnormalityNote: String,
  },
  { timestamps: true }
);

healthMetricSchema.index({ patient: 1, type: 1, recordedAt: -1 });

module.exports = mongoose.model("HealthMetric", healthMetricSchema);