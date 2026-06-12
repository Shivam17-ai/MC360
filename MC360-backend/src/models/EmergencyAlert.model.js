const mongoose = require("mongoose");

const emergencyAlertSchema = new mongoose.Schema(
  {
    alertId: { type: String, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["sos", "fall", "critical-vitals", "medication-overdose", "manual"],
      default: "manual",
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "high",
    },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    message: String,
    status: {
      type: String,
      enum: ["triggered", "acknowledged", "dispatched", "resolved", "false-alarm"],
      default: "triggered",
    },
    acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    acknowledgedAt: Date,
    resolvedAt: Date,
    notifiedContacts: [String],
    hospitalNotified: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    notes: String,
  },
  { timestamps: true }
);

emergencyAlertSchema.pre("save", async function (next) {
  if (!this.alertId) {
    const count = await mongoose.model("EmergencyAlert").countDocuments();
    this.alertId = `MC360-E-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("EmergencyAlert", emergencyAlertSchema);