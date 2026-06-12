const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    doctorId: { type: String, unique: true }, // MC360-D-XXXXX
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    specialization: { type: String, required: true },
    subSpecialization: { type: String },
    qualifications: [{ type: String }],
    experience: { type: Number, default: 0 }, // years
    registrationNumber: { type: String, unique: true, sparse: true },
    biography: { type: String },
    languages: [{ type: String }],
    consultationFee: { type: Number, default: 0 },
    telemedicineAvailable: { type: Boolean, default: true },
    telemedicineFee: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    totalPatients: { type: Number, default: 0 },

    // Weekly availability schedule
    availability: [
      {
        day: {
          type: String,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        },
        slots: [
          {
            startTime: String, // "09:00"
            endTime: String,   // "09:30"
            isBooked: { type: Boolean, default: false },
          },
        ],
        isAvailable: { type: Boolean, default: true },
      },
    ],

    // Leave / unavailable dates
    leaveDates: [{ type: Date }],

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doctorSchema.pre("save", async function (next) {
  if (!this.doctorId) {
    const count = await mongoose.model("Doctor").countDocuments();
    this.doctorId = `MC360-D-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Doctor", doctorSchema);