const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    patientId: { type: String, unique: true }, // MC360-P-XXXXX
    dateOfBirth: { type: Date },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
      default: "Unknown",
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    medicalHistory: [
      {
        condition: String,
        diagnosedAt: Date,
        notes: String,
      },
    ],
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    currentMedications: [{ type: String }],
    height: { type: Number }, // cm
    weight: { type: Number }, // kg
    bmi: { type: Number },
    smokingStatus: {
      type: String,
      enum: ["never", "former", "current"],
      default: "never",
    },
    alcoholConsumption: {
      type: String,
      enum: ["never", "occasional", "moderate", "heavy"],
      default: "never",
    },
    insuranceProvider: { type: String },
    insurancePolicyNumber: { type: String },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
  },
  { timestamps: true }
);

// Auto-generate patientId
patientSchema.pre("save", async function (next) {
  if (!this.patientId) {
    const count = await mongoose.model("Patient").countDocuments();
    this.patientId = `P-${String(count + 1).padStart(5, "0")}`;
  }
  if (this.dateOfBirth && !this.age) {
    this.age = Math.floor(
      (Date.now() - new Date(this.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)
    );
  }
  if (this.height && this.weight) {
    this.bmi = parseFloat((this.weight / Math.pow(this.height / 100, 2)).toFixed(1));
  }
  next();
});

module.exports = mongoose.model("Patient", patientSchema);