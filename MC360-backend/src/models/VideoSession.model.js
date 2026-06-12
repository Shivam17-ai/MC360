const mongoose = require("mongoose");

const videoSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, unique: true, required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    status: {
      type: String,
      enum: ["waiting", "active", "ended", "cancelled", "no-show"],
      default: "waiting",
    },
    startedAt: Date,
    endedAt: Date,
    duration: Number, // seconds
    patientJoined: { type: Boolean, default: false },
    doctorJoined: { type: Boolean, default: false },
    notes: String,
    recordingUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("VideoSession", videoSessionSchema);