const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    name: { type: String, required: true },
    genericName: String,
    dosage: String,
    frequency: {
      type: String,
      enum: ["once-daily", "twice-daily", "thrice-daily", "four-times-daily", "as-needed", "weekly", "custom"],
      default: "once-daily",
    },
    customFrequency: String,
    timings: [String], // ["08:00", "14:00", "20:00"]
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isOngoing: { type: Boolean, default: false },
    instructions: String,
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
    purpose: String,
    sideEffectsNoted: [String],
    isActive: { type: Boolean, default: true },
    reminderEnabled: { type: Boolean, default: true },
    adherenceLogs: [
      {
        date: { type: Date },
        taken: { type: Boolean, default: false },
        takenAt: Date,
        skippedReason: String,
      },
    ],
    totalDoses: { type: Number, default: 0 },
    takenDoses: { type: Number, default: 0 },
    adherencePercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

medicineSchema.methods.calculateAdherence = function () {
  if (this.totalDoses === 0) return 0;
  return Math.round((this.takenDoses / this.totalDoses) * 100);
};

module.exports = mongoose.model("Medicine", medicineSchema);