const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    prescriptionId: { type: String, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    diagnosis: { type: String },
    medicines: [
      {
        name: { type: String, required: true },
        genericName: String,
        dosage: String,        // "500mg"
        frequency: String,     // "1-0-1"
        duration: String,      // "7 days"
        instructions: String,  // "after meals"
        quantity: Number,
      },
    ],
    tests: [String],
    advice: { type: String },
    followUpDate: { type: Date },
    isDigital: { type: Boolean, default: true },
    fileUrl: { type: String },
    filePublicId: String,
    isActive: { type: Boolean, default: true },
    validUntil: { type: Date },
  },
  { timestamps: true }
);

prescriptionSchema.pre("save", async function (next) {
  if (!this.prescriptionId) {
    const count = await mongoose.model("Prescription").countDocuments();
    this.prescriptionId = `MC360-RX-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Prescription", prescriptionSchema);