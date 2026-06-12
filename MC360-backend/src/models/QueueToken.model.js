const mongoose = require("mongoose");

const queueTokenSchema = new mongoose.Schema(
  {
    tokenNumber: { type: Number, required: true },
    tokenDisplay: { type: String }, // "A-023"
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    type: {
      type: String,
      enum: ["appointment", "walk-in", "emergency"],
      default: "appointment",
    },
    status: {
      type: String,
      enum: ["waiting", "called", "in-progress", "done", "skipped", "cancelled"],
      default: "waiting",
    },
    estimatedWaitTime: Number, // minutes
    calledAt: Date,
    startedAt: Date,
    completedAt: Date,
    date: { type: Date, default: Date.now },
    position: { type: Number },
  },
  { timestamps: true }
);

queueTokenSchema.index({ hospital: 1, doctor: 1, date: 1, status: 1 });

module.exports = mongoose.model("QueueToken", queueTokenSchema);