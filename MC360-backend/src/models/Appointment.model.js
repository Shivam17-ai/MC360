const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // "10:00 - 10:30"
    type: {
      type: String,
      enum: ["in-person", "telemedicine", "home-visit"],
      default: "in-person",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "no-show", "rescheduled"],
      default: "pending",
    },
    reason: { type: String },
    notes: { type: String }, // doctor's notes after appointment
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
    symptoms: [String],
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date },
    cancelReason: { type: String },
    cancelledBy: { type: String, enum: ["patient", "doctor", "system"] },
    isFollowUp: { type: Boolean, default: false },
    originalAppointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    fee: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    paymentId: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    videoSessionId: { type: String },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

appointmentSchema.pre("save", async function (next) {
  if (!this.appointmentId) {
    const lastDoc = await mongoose.model("Appointment")
      .findOne({}, { appointmentId: 1 })
      .sort({ appointmentId: -1 });
    let nextNum = 1;
    if (lastDoc && lastDoc.appointmentId) {
      const match = lastDoc.appointmentId.match(/MC360-A-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    this.appointmentId = `MC360-A-${String(nextNum).padStart(7, "0")}`;
  }
  next();
});

appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: -1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);