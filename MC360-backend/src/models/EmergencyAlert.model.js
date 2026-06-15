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
    const lastDoc = await mongoose.model("EmergencyAlert")
      .findOne({}, { alertId: 1 })
      .sort({ alertId: -1 });
    let nextNum = 1;
    if (lastDoc && lastDoc.alertId) {
      const match = lastDoc.alertId.match(/MC360-E-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    this.alertId = `MC360-E-${String(nextNum).padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("EmergencyAlert", emergencyAlertSchema);